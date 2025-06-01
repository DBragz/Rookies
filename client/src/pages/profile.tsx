import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Camera, Settings, Trophy, TrendingUp, Calendar, MapPin, Edit3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";

export default function Profile() {
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock current user - in real app this would come from auth context
  const currentUser = {
    id: 1,
    username: "Jake_Dunks",
    email: "jake@example.com",
    balance: "2847.50",
    avatar: "JD",
    totalWinnings: "1247.80",
    totalBets: 42,
    winRate: "64%",
    favoritesSport: "Basketball",
    memberSince: "January 2024",
    location: "Los Angeles, CA",
    bio: "Sports enthusiast and betting strategist. Love watching live games and making smart bets with friends!"
  };

  const { data: userBets } = useQuery({
    queryKey: [`/api/users/${currentUser.id}/bets`],
  });

  const { data: friends } = useQuery({
    queryKey: [`/api/users/${currentUser.id}/friends`],
  });

  const recentBets = userBets?.slice(0, 10) || [];
  const wonBets = userBets?.filter((bet: any) => bet.status === 'won') || [];
  const lostBets = userBets?.filter((bet: any) => bet.status === 'lost') || [];

  const stats = [
    { label: "Total Winnings", value: `$${currentUser.totalWinnings}`, icon: Trophy, color: "text-accent-green" },
    { label: "Total Bets", value: currentUser.totalBets, icon: TrendingUp, color: "text-accent-blue" },
    { label: "Win Rate", value: currentUser.winRate, icon: TrendingUp, color: "text-accent-orange" },
    { label: "Friends", value: friends?.length || 4, icon: Calendar, color: "text-accent-purple" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-glass backdrop-blur-xl border-b border-border/50 px-4 py-4">
        <div className="flex items-center space-x-4 max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setLocation('/')}
            className="hover:bg-accent-green/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-accent-green to-accent-blue bg-clip-text">
            Profile
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Profile Header */}
        <Card className="bg-glass backdrop-blur-xl border-accent-green/20 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar Section */}
              <div className="relative">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-accent-green shadow-glow-green">
                  <AvatarFallback className="bg-gradient-green text-white text-2xl md:text-3xl font-black">
                    {currentUser.avatar}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent-blue hover:bg-accent-blue/80 rounded-full shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white">{currentUser.username}</h2>
                    <p className="text-secondary flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{currentUser.location}</span>
                    </p>
                  </div>
                  <div className="flex space-x-2 mt-4 md:mt-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="border-accent-green/30 hover:bg-accent-green/10"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="sm" className="border-accent-blue/30 hover:bg-accent-blue/10">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-accent-green/20 text-accent-green border-accent-green/30">
                    {currentUser.favoritesSport}
                  </Badge>
                  <Badge className="bg-accent-blue/20 text-accent-blue border-accent-blue/30">
                    Member since {currentUser.memberSince}
                  </Badge>
                </div>

                <p className="text-sm text-secondary max-w-2xl">
                  {currentUser.bio}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-glass backdrop-blur-sm border-white/10 shadow-lg hover:shadow-glow-green transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className={`p-2 w-fit mx-auto mb-3 rounded-lg bg-gradient-to-r from-accent-green/20 to-accent-blue/20`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs text-secondary font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Betting History */}
          <Card className="bg-glass backdrop-blur-sm border-accent-blue/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-accent-blue">Recent Bets</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentBets.length > 0 ? (
                recentBets.map((bet: any) => (
                  <div key={bet.id} className="bg-glass border border-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-sm">{bet.description}</span>
                      <Badge className={`${
                        bet.status === 'won' ? 'bg-accent-green/20 text-accent-green' :
                        bet.status === 'lost' ? 'bg-red-500/20 text-red-400' :
                        'bg-accent-orange/20 text-accent-orange'
                      }`}>
                        {bet.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary">Amount: ${bet.amount}</span>
                      <span className={bet.status === 'won' ? 'text-accent-green font-semibold' : 'text-secondary'}>
                        {bet.status === 'won' ? `+$${bet.potentialWin}` : 
                         bet.status === 'lost' ? `-$${bet.amount}` : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-secondary py-8">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <span>No betting history</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Balance & Actions */}
          <Card className="bg-glass backdrop-blur-sm border-accent-green/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center space-x-3">
                <div className="p-2 bg-gradient-green rounded-lg shadow-glow-green">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="text-accent-green">Account</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-accent-green/10 to-accent-blue/10 rounded-xl p-4 border border-accent-green/30">
                <div className="text-center">
                  <div className="text-sm text-secondary mb-1">Current Balance</div>
                  <div className="text-3xl font-black text-accent-green">${currentUser.balance}</div>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-gradient-green hover:shadow-glow-green text-white font-semibold py-3">
                  Add Funds
                </Button>
                <Button variant="outline" className="w-full border-accent-blue/30 hover:bg-accent-blue/10">
                  Withdraw Funds
                </Button>
                <Button variant="outline" className="w-full border-accent-orange/30 hover:bg-accent-orange/10">
                  Transaction History
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
                <div className="text-center">
                  <div className="text-lg font-bold text-accent-green">{wonBets.length}</div>
                  <div className="text-xs text-secondary">Wins</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-400">{lostBets.length}</div>
                  <div className="text-xs text-secondary">Losses</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}