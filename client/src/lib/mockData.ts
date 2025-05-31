// This file contains mock data for development and testing
// In production, all data would come from real APIs

export const mockUser = {
  id: 1,
  username: "Jake_Dunks",
  email: "jake@example.com",
  balance: "2847.50",
  avatar: "JD",
  isOnline: true,
  totalWinnings: "1247.80",
  totalBets: 42
};

export const mockStream = {
  id: 6,
  userId: 2,
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
  }
};

export const mockBetOptions = [
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
  }
];

export const mockFriends = [
  { id: 2, username: "Mike_Hoops", avatar: "MH", isOnline: true, totalWinnings: "890.50" },
  { id: 3, username: "Sarah_B", avatar: "SB", isOnline: true, totalWinnings: "1650.30" },
  { id: 4, username: "TylerDunks", avatar: "TD", isOnline: true, totalWinnings: "720.90" },
  { id: 5, username: "Alex_Ball", avatar: "AB", isOnline: true, totalWinnings: "1100.40" },
];

export const mockLeaderboard = [
  { id: 1, username: "SportsBeast", dailyWinnings: "1247", totalBets: 18, totalWinnings: "4156.80" },
  { id: 2, username: "QuickBets", dailyWinnings: "892", totalBets: 12, totalWinnings: "2970.33" },
  { id: 3, username: "Jake_Dunks", dailyWinnings: "634", totalBets: 8, totalWinnings: "2112.67" },
  { id: 4, username: "CourtKing", dailyWinnings: "421", totalBets: 9, totalWinnings: "1403.22" },
];

export const mockChatMessages = [
  {
    id: 1,
    streamId: 6,
    userId: 1,
    message: "Nice shot! 🔥",
    type: "message",
    createdAt: new Date(Date.now() - 300000).toISOString(),
    user: { username: "Jake_Dunks", avatar: "JD" }
  },
  {
    id: 2,
    streamId: 6,
    userId: 3,
    message: "Going for the 25+ points!",
    type: "message", 
    createdAt: new Date(Date.now() - 240000).toISOString(),
    user: { username: "Sarah_B", avatar: "SB" }
  },
  {
    id: 3,
    streamId: 6,
    userId: 4,
    message: "This stream is amazing 🔥",
    type: "message",
    createdAt: new Date(Date.now() - 180000).toISOString(),
    user: { username: "TylerDunks", avatar: "TD" }
  }
];
