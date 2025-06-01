import { 
  users, streams, bets, friendships, chatMessages, gameStats,
  type User, type InsertUser, type Stream, type InsertStream, 
  type Bet, type InsertBet, type ChatMessage, type InsertChatMessage,
  type GameStats, type InsertGameStats
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(id: number, balance: string): Promise<User | undefined>;
  updateUserOnlineStatus(id: number, isOnline: boolean): Promise<void>;
  
  // Streams
  getStream(id: number): Promise<Stream | undefined>;
  getActiveStreams(): Promise<Stream[]>;
  getUserStreams(userId: number): Promise<Stream[]>;
  createStream(stream: InsertStream): Promise<Stream>;
  updateStreamStatus(id: number, isLive: boolean): Promise<void>;
  updateStreamViewers(id: number, viewerCount: number): Promise<void>;
  
  // Bets
  getBet(id: number): Promise<Bet | undefined>;
  getUserBets(userId: number): Promise<Bet[]>;
  getStreamBets(streamId: number): Promise<Bet[]>;
  createBet(bet: InsertBet): Promise<Bet>;
  updateBetStatus(id: number, status: string, outcome?: string): Promise<void>;
  
  // Friends
  getUserFriends(userId: number): Promise<User[]>;
  addFriend(userId: number, friendId: number): Promise<void>;
  
  // Chat
  getStreamMessages(streamId: number, limit?: number): Promise<ChatMessage[]>;
  createMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Game Stats
  getStreamStats(streamId: number): Promise<GameStats | undefined>;
  updateStreamStats(streamId: number, stats: InsertGameStats): Promise<GameStats>;
  
  // Leaderboard
  getDailyLeaderboard(): Promise<Array<User & { dailyWinnings: string }>>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private streams: Map<number, Stream> = new Map();
  private bets: Map<number, Bet> = new Map();
  private friendships: Map<number, Array<{ userId: number; friendId: number; status: string }>> = new Map();
  private chatMessages: Map<number, ChatMessage[]> = new Map();
  private gameStats: Map<number, GameStats> = new Map();
  private currentId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create sample users
    const sampleUsers = [
      { username: "Jake_Dunks", email: "jake@example.com", password: "password", balance: "2847.50", avatar: "JD", isOnline: true, totalWinnings: "1247.80", totalBets: 42 },
      { username: "Mike_Hoops", email: "mike@example.com", password: "password", balance: "1950.25", avatar: "MH", isOnline: true, totalWinnings: "890.50", totalBets: 38 },
      { username: "Sarah_B", email: "sarah@example.com", password: "password", balance: "3200.75", avatar: "SB", isOnline: true, totalWinnings: "1650.30", totalBets: 55 },
      { username: "TylerDunks", email: "tyler@example.com", password: "password", balance: "1450.00", avatar: "TD", isOnline: true, totalWinnings: "720.90", totalBets: 28 },
      { username: "Alex_Ball", email: "alex@example.com", password: "password", balance: "2100.60", avatar: "AB", isOnline: true, totalWinnings: "1100.40", totalBets: 35 },
    ];

    sampleUsers.forEach(userData => {
      const user: User = {
        id: this.currentId++,
        ...userData,
        lastSeen: new Date(),
        createdAt: new Date(),
      };
      this.users.set(user.id, user);
    });

    // Create sample stream
    const stream: Stream = {
      id: this.currentId++,
      userId: 2, // Mike_Hoops
      title: "Basketball Street Court",
      description: "Live basketball game at Venice Beach",
      isLive: true,
      viewerCount: 1247,
      sport: "basketball",
      location: {
        lat: 33.9850,
        lng: -118.4695,
        name: "Venice Beach Courts",
        address: "1800 Ocean Front Walk, CA"
      },
      streamKey: "live_stream_key_123",
      createdAt: new Date(),
      endedAt: null,
    };
    this.streams.set(stream.id, stream);

    // Create sample game stats
    const stats: GameStats = {
      id: this.currentId++,
      streamId: stream.id,
      score: "21-18",
      duration: 1122, // 18:42
      points: 24,
      distance: "2.3",
      lastUpdated: new Date(),
    };
    this.gameStats.set(stream.id, stats);

    // Create sample friendships
    this.friendships.set(1, [
      { userId: 1, friendId: 2, status: "accepted" },
      { userId: 1, friendId: 3, status: "accepted" },
      { userId: 1, friendId: 4, status: "accepted" },
      { userId: 1, friendId: 5, status: "accepted" },
    ]);

    // Create sample chat messages
    this.chatMessages.set(stream.id, [
      {
        id: this.currentId++,
        streamId: stream.id,
        userId: 1,
        message: "Nice shot! 🔥",
        type: "message",
        createdAt: new Date(Date.now() - 300000)
      },
      {
        id: this.currentId++,
        streamId: stream.id,
        userId: 3,
        message: "Going for the 25+ points!",
        type: "message",
        createdAt: new Date(Date.now() - 240000)
      },
      {
        id: this.currentId++,
        streamId: stream.id,
        userId: 4,
        message: "This stream is amazing 🔥",
        type: "message",
        createdAt: new Date(Date.now() - 180000)
      }
    ]);

    // Create sample bets
    const sampleBets = [
      {
        userId: 1,
        streamId: stream.id,
        betType: "next_shot",
        description: "Next Shot Made",
        amount: "50.00",
        odds: 180,
        potentialWin: "140.00",
        status: "pending"
      },
      {
        userId: 1,
        streamId: stream.id,
        betType: "game_winner",
        description: "Game Winner",
        amount: "25.00",
        odds: -110,
        potentialWin: "45.00",
        status: "won",
        outcome: "Team Blue won",
        settledAt: new Date(Date.now() - 600000)
      }
    ];

    sampleBets.forEach(betData => {
      const bet: Bet = {
        id: this.currentId++,
        ...betData,
        placedAt: new Date(),
        settledAt: betData.settledAt || null,
      };
      this.bets.set(bet.id, bet);
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.currentId++,
      ...insertUser,
      lastSeen: new Date(),
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUserBalance(id: number, balance: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      user.balance = balance;
      this.users.set(id, user);
      return user;
    }
    return undefined;
  }

  async updateUserOnlineStatus(id: number, isOnline: boolean): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.isOnline = isOnline;
      user.lastSeen = new Date();
      this.users.set(id, user);
    }
  }

  // Streams
  async getStream(id: number): Promise<Stream | undefined> {
    return this.streams.get(id);
  }

  async getActiveStreams(): Promise<Stream[]> {
    return Array.from(this.streams.values()).filter(stream => stream.isLive);
  }

  async getUserStreams(userId: number): Promise<Stream[]> {
    return Array.from(this.streams.values()).filter(stream => stream.userId === userId);
  }

  async createStream(insertStream: InsertStream): Promise<Stream> {
    const stream: Stream = {
      id: this.currentId++,
      ...insertStream,
      createdAt: new Date(),
      endedAt: null,
    };
    this.streams.set(stream.id, stream);
    return stream;
  }

  async updateStreamStatus(id: number, isLive: boolean): Promise<void> {
    const stream = this.streams.get(id);
    if (stream) {
      stream.isLive = isLive;
      if (!isLive) {
        stream.endedAt = new Date();
      }
      this.streams.set(id, stream);
    }
  }

  async updateStreamViewers(id: number, viewerCount: number): Promise<void> {
    const stream = this.streams.get(id);
    if (stream) {
      stream.viewerCount = viewerCount;
      this.streams.set(id, stream);
    }
  }

  // Bets
  async getBet(id: number): Promise<Bet | undefined> {
    return this.bets.get(id);
  }

  async getUserBets(userId: number): Promise<Bet[]> {
    return Array.from(this.bets.values()).filter(bet => bet.userId === userId);
  }

  async getStreamBets(streamId: number): Promise<Bet[]> {
    return Array.from(this.bets.values()).filter(bet => bet.streamId === streamId);
  }

  async createBet(insertBet: InsertBet): Promise<Bet> {
    const bet: Bet = {
      id: this.currentId++,
      ...insertBet,
      placedAt: new Date(),
      settledAt: null,
    };
    this.bets.set(bet.id, bet);
    return bet;
  }

  async updateBetStatus(id: number, status: string, outcome?: string): Promise<void> {
    const bet = this.bets.get(id);
    if (bet) {
      bet.status = status;
      if (outcome) bet.outcome = outcome;
      if (status === "won" || status === "lost") {
        bet.settledAt = new Date();
      }
      this.bets.set(id, bet);
    }
  }

  // Friends
  async getUserFriends(userId: number): Promise<User[]> {
    const userFriendships = this.friendships.get(userId) || [];
    const friendIds = userFriendships
      .filter(f => f.status === "accepted")
      .map(f => f.friendId);
    
    return Array.from(this.users.values()).filter(user => friendIds.includes(user.id));
  }

  async addFriend(userId: number, friendId: number): Promise<void> {
    if (!this.friendships.has(userId)) {
      this.friendships.set(userId, []);
    }
    this.friendships.get(userId)!.push({ userId, friendId, status: "accepted" });
  }

  // Chat
  async getStreamMessages(streamId: number, limit = 50): Promise<ChatMessage[]> {
    const messages = this.chatMessages.get(streamId) || [];
    return messages.slice(-limit);
  }

  async createMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: this.currentId++,
      ...insertMessage,
      createdAt: new Date(),
    };
    
    if (!this.chatMessages.has(message.streamId)) {
      this.chatMessages.set(message.streamId, []);
    }
    this.chatMessages.get(message.streamId)!.push(message);
    return message;
  }

  // Game Stats
  async getStreamStats(streamId: number): Promise<GameStats | undefined> {
    return this.gameStats.get(streamId);
  }

  async updateStreamStats(streamId: number, stats: InsertGameStats): Promise<GameStats> {
    const gameStats: GameStats = {
      id: this.gameStats.get(streamId)?.id || this.currentId++,
      streamId,
      ...stats,
      lastUpdated: new Date(),
    };
    this.gameStats.set(streamId, gameStats);
    return gameStats;
  }

  // Leaderboard
  async getDailyLeaderboard(): Promise<Array<User & { dailyWinnings: string }>> {
    const users = Array.from(this.users.values())
      .filter(user => user.isOnline)
      .map(user => ({
        ...user,
        dailyWinnings: (parseFloat(user.totalWinnings) * 0.3).toFixed(2) // Mock daily winnings as 30% of total
      }))
      .sort((a, b) => parseFloat(b.dailyWinnings) - parseFloat(a.dailyWinnings))
      .slice(0, 10);
    
    return users;
  }
}

export const storage = new MemStorage();
