import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { insertBetSchema, insertChatMessageSchema, insertGameStatsSchema, loginSchema, signupSchema } from "@shared/schema";
import { z } from "zod";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Session middleware
  const pgStore = connectPg(session);
  app.use(session({
    store: new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: false,
    }),
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if ((req.session as any)?.userId) {
      next();
    } else {
      res.status(401).json({ message: "Authentication required" });
    }
  };

  // Authentication routes
  app.post('/api/signup', async (req, res) => {
    try {
      const data = signupSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(data);
      (req.session as any).userId = user.id;
      
      res.json({ 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName,
        lastName: user.lastName,
        balance: user.balance 
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(400).json({ message: "Invalid signup data" });
    }
  });

  app.post('/api/login', async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      
      const user = await storage.verifyUserPassword(data.email, data.password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      (req.session as any).userId = user.id;
      
      res.json({ 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName,
        lastName: user.lastName,
        balance: user.balance 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Invalid login data" });
    }
  });

  app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get('/api/auth/user', requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser((req.session as any).userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName,
        lastName: user.lastName,
        balance: user.balance 
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // WebSocket server setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const connections = new Map<WebSocket, { userId?: number; streamId?: number }>();

  wss.on('connection', (ws) => {
    connections.set(ws, {});
    
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        const connInfo = connections.get(ws);
        
        if (message.type === 'auth') {
          connInfo!.userId = message.userId;
          connInfo!.streamId = message.streamId;
          await storage.updateUserOnlineStatus(message.userId, true);
        } else if (message.type === 'chat' && connInfo?.userId) {
          const chatMessage = await storage.createMessage({
            streamId: connInfo.streamId!,
            userId: connInfo.userId,
            message: message.content,
            type: 'message'
          });
          
          // Broadcast to all clients watching this stream
          const user = await storage.getUser(connInfo.userId);
          connections.forEach((info, client) => {
            if (client.readyState === WebSocket.OPEN && info.streamId === connInfo.streamId) {
              client.send(JSON.stringify({
                type: 'chat',
                data: { ...chatMessage, user }
              }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      const connInfo = connections.get(ws);
      if (connInfo?.userId) {
        storage.updateUserOnlineStatus(connInfo.userId, false);
      }
      connections.delete(ws);
    });
  });

  // Broadcast function for real-time updates
  const broadcast = (streamId: number, message: any) => {
    connections.forEach((info, client) => {
      if (client.readyState === WebSocket.OPEN && info.streamId === streamId) {
        client.send(JSON.stringify(message));
      }
    });
  };

  // Protected API routes (require authentication)

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/users/:id/friends", async (req, res) => {
    try {
      const friends = await storage.getUserFriends(parseInt(req.params.id));
      res.json(friends.map(friend => ({ ...friend, password: undefined })));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch friends" });
    }
  });

  app.get("/api/users/:id/bets", async (req, res) => {
    try {
      const bets = await storage.getUserBets(parseInt(req.params.id));
      res.json(bets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bets" });
    }
  });

  // Stream routes
  app.get("/api/streams", async (req, res) => {
    try {
      const streams = await storage.getActiveStreams();
      res.json(streams);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch streams" });
    }
  });

  app.get("/api/streams/:id", async (req, res) => {
    try {
      const stream = await storage.getStream(parseInt(req.params.id));
      if (!stream) {
        return res.status(404).json({ message: "Stream not found" });
      }
      res.json(stream);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stream" });
    }
  });

  app.get("/api/streams/:id/stats", async (req, res) => {
    try {
      const stats = await storage.getStreamStats(parseInt(req.params.id));
      res.json(stats || {});
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stream stats" });
    }
  });

  app.put("/api/streams/:id/stats", async (req, res) => {
    try {
      const streamId = parseInt(req.params.id);
      const statsData = insertGameStatsSchema.parse(req.body);
      const stats = await storage.updateStreamStats(streamId, statsData);
      
      // Broadcast stats update
      broadcast(streamId, { type: 'stats_update', data: stats });
      
      res.json(stats);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid stats data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update stats" });
    }
  });

  // Betting routes
  app.post("/api/bets", async (req, res) => {
    try {
      const betData = insertBetSchema.parse(req.body);
      
      // Validate user has sufficient balance
      const user = await storage.getUser(betData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const currentBalance = parseFloat(user.balance);
      const betAmount = parseFloat(betData.amount);
      
      if (currentBalance < betAmount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      
      // Create bet and update user balance
      const bet = await storage.createBet(betData);
      const newBalance = (currentBalance - betAmount).toFixed(2);
      await storage.updateUserBalance(betData.userId, newBalance);
      
      // Broadcast bet placement
      broadcast(betData.streamId, { 
        type: 'bet_placed', 
        data: { bet, user: { ...user, password: undefined } } 
      });
      
      res.json(bet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid bet data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to place bet" });
    }
  });

  app.put("/api/bets/:id/settle", async (req, res) => {
    try {
      const betId = parseInt(req.params.id);
      const { status, outcome } = req.body;
      
      const bet = await storage.getBet(betId);
      if (!bet) {
        return res.status(404).json({ message: "Bet not found" });
      }
      
      await storage.updateBetStatus(betId, status, outcome);
      
      // Update user balance if bet won
      if (status === "won") {
        const user = await storage.getUser(bet.userId);
        if (user) {
          const currentBalance = parseFloat(user.balance);
          const winAmount = parseFloat(bet.potentialWin) + parseFloat(bet.amount);
          const newBalance = (currentBalance + winAmount).toFixed(2);
          await storage.updateUserBalance(bet.userId, newBalance);
          
          // Broadcast win notification
          broadcast(bet.streamId, {
            type: 'bet_result',
            data: { bet: { ...bet, status, outcome }, user: { ...user, password: undefined }, result: 'won' }
          });
        }
      } else if (status === "lost") {
        const user = await storage.getUser(bet.userId);
        if (user) {
          broadcast(bet.streamId, {
            type: 'bet_result',
            data: { bet: { ...bet, status, outcome }, user: { ...user, password: undefined }, result: 'lost' }
          });
        }
      }
      
      res.json({ message: "Bet settled successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to settle bet" });
    }
  });

  // Chat routes
  app.get("/api/streams/:id/messages", async (req, res) => {
    try {
      const streamId = parseInt(req.params.id);
      const messages = await storage.getStreamMessages(streamId);
      
      // Enrich messages with user data
      const enrichedMessages = await Promise.all(
        messages.map(async (message) => {
          const user = await storage.getUser(message.userId);
          return { ...message, user: user ? { ...user, password: undefined } : null };
        })
      );
      
      res.json(enrichedMessages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getDailyLeaderboard();
      res.json(leaderboard.map(user => ({ ...user, password: undefined })));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Available bet options for a stream
  app.get("/api/streams/:id/bet-options", async (req, res) => {
    try {
      const streamId = parseInt(req.params.id);
      const stream = await storage.getStream(streamId);
      
      if (!stream) {
        return res.status(404).json({ message: "Stream not found" });
      }
      
      // Mock bet options based on stream type
      const betOptions = [
        {
          type: "next_shot",
          description: "Next Shot Made",
          odds: 180,
          details: "Player makes their next shot attempt"
        },
        {
          type: "game_winner", 
          description: "Game Winner",
          odds: -110,
          details: "Team/Player wins the current game"
        },
        {
          type: "score_over",
          description: "Scores 30+ Points",
          odds: 140,
          details: "Player reaches 30 or more points this game"
        },
        {
          type: "next_basket",
          description: "Next 2 Points",
          odds: 250,
          details: "Player scores the next 2 points"
        },
        {
          type: "duration_over",
          description: "Game Over 25 Minutes",
          odds: 120,
          details: "Game duration exceeds 25 minutes"
        }
      ];
      
      res.json(betOptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bet options" });
    }
  });

  return httpServer;
}
