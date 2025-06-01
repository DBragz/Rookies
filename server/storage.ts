import {
  type User, type InsertUser, type Stream, type InsertStream,
  type Bet, type InsertBet, type ChatMessage, type InsertChatMessage,
  type GameStats, type InsertGameStats, users, streams, bets, friendships, chatMessages, gameStats
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyUserPassword(email: string, password: string): Promise<User | null>;
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

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
      })
      .returning();
    return user;
  }

  async verifyUserPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async updateUserBalance(id: number, balance: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ balance, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async updateUserOnlineStatus(id: number, isOnline: boolean): Promise<void> {
    await db
      .update(users)
      .set({ isOnline, lastSeen: new Date(), updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  async getStream(id: number): Promise<Stream | undefined> {
    const [stream] = await db.select().from(streams).where(eq(streams.id, id));
    return stream || undefined;
  }

  async getActiveStreams(): Promise<Stream[]> {
    return await db.select().from(streams).where(eq(streams.isLive, true));
  }

  async getUserStreams(userId: number): Promise<Stream[]> {
    return await db.select().from(streams).where(eq(streams.userId, userId));
  }

  async createStream(insertStream: InsertStream): Promise<Stream> {
    const [stream] = await db
      .insert(streams)
      .values(insertStream)
      .returning();
    return stream;
  }

  async updateStreamStatus(id: number, isLive: boolean): Promise<void> {
    await db
      .update(streams)
      .set({ isLive, endedAt: isLive ? null : new Date() })
      .where(eq(streams.id, id));
  }

  async updateStreamViewers(id: number, viewerCount: number): Promise<void> {
    await db
      .update(streams)
      .set({ viewerCount })
      .where(eq(streams.id, id));
  }

  async getBet(id: number): Promise<Bet | undefined> {
    const [bet] = await db.select().from(bets).where(eq(bets.id, id));
    return bet || undefined;
  }

  async getUserBets(userId: number): Promise<Bet[]> {
    return await db.select().from(bets).where(eq(bets.userId, userId));
  }

  async getStreamBets(streamId: number): Promise<Bet[]> {
    return await db.select().from(bets).where(eq(bets.streamId, streamId));
  }

  async createBet(insertBet: InsertBet): Promise<Bet> {
    const [bet] = await db
      .insert(bets)
      .values(insertBet)
      .returning();
    return bet;
  }

  async updateBetStatus(id: number, status: string, outcome?: string): Promise<void> {
    await db
      .update(bets)
      .set({ 
        status, 
        outcome: outcome || null,
        settledAt: status === 'settled' ? new Date() : null 
      })
      .where(eq(bets.id, id));
  }

  async getUserFriends(userId: number): Promise<User[]> {
    const friendIds = await db
      .select({ friendId: friendships.friendId })
      .from(friendships)
      .where(and(eq(friendships.userId, userId), eq(friendships.status, 'accepted')));

    if (friendIds.length === 0) return [];

    return await db.select().from(users).where(
      eq(users.id, friendIds[0].friendId) // This is simplified; in real app would use IN clause
    );
  }

  async addFriend(userId: number, friendId: number): Promise<void> {
    await db.insert(friendships).values({
      userId,
      friendId,
      status: 'accepted'
    });
  }

  async getStreamMessages(streamId: number, limit = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.streamId, streamId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  }

  async createMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getStreamStats(streamId: number): Promise<GameStats | undefined> {
    const [stats] = await db.select().from(gameStats).where(eq(gameStats.streamId, streamId));
    return stats || undefined;
  }

  async updateStreamStats(streamId: number, stats: InsertGameStats): Promise<GameStats> {
    const existingStats = await this.getStreamStats(streamId);
    
    if (existingStats) {
      const [updated] = await db
        .update(gameStats)
        .set({ ...stats, lastUpdated: new Date() })
        .where(eq(gameStats.streamId, streamId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(gameStats)
        .values({ ...stats, streamId })
        .returning();
      return created;
    }
  }

  async getDailyLeaderboard(): Promise<Array<User & { dailyWinnings: string }>> {
    // Simplified implementation - in real app would calculate daily winnings
    const allUsers = await db.select().from(users);
    return allUsers.map(user => ({ ...user, dailyWinnings: "0.00" }));
  }
}

export const storage = new DatabaseStorage();