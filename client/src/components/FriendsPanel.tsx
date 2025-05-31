import { useQuery } from "@tanstack/react-query";
import { Users, Trophy, History, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function FriendsPanel() {
  const { data: friends } = useQuery({
    queryKey: ['/api/users/1/friends'], // Using mock user ID 1
  });

  const { data: leaderboard } = useQuery({
    queryKey: ['/api/leaderboard'],
  });

  const onlineFriends = friends?.filter((friend: any) => friend.isOnline) || [];

  // Mock recent activity data
  const recentActivity = [
    { user: "Mike_Soccer", description: "Won $25 on distance bet", time: "2m ago" },
    { user: "Sarah_Bball", description: "Started streaming at Downtown Court", time: "5m ago" },
    { user: "Jake_Runs", description: "Completed 5K in 22:30", time: "8m ago" },
  ];

  return (
    <div className="h-full bg-card border-r border-border p-4 overflow-y-auto custom-scrollbar">
      <div className="space-y-6">
        {/* Friends Online */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Users className="w-5 h-5 text-accent-blue" />
              <span>Friends Online</span>
              <span className="bg-accent-green text-xs px-2 py-1 rounded-full font-semibold text-white">
                {onlineFriends.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {onlineFriends.length > 0 ? (
              onlineFriends.map((friend: any) => (
                <div key={friend.id} className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-accent-orange text-white text-sm">
                          {friend.avatar || friend.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent-green rounded-full border-2 border-card"></div>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{friend.username}</div>
                      <div className="text-xs text-secondary">Playing Tennis</div>
                    </div>
                  </div>
                  <div className="text-xs text-accent-green">+${friend.totalWinnings}</div>
                </div>
              ))
            ) : (
              <div className="text-center text-secondary py-4">
                No friends online
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <History className="w-5 h-5 text-accent-orange" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentActivity.map((activity, index) => (
              <div key={index} className="p-3 bg-background rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{activity.user}</span>
                  <span className="text-xs text-secondary">{activity.time}</span>
                </div>
                <div className="text-xs text-secondary">{activity.description}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span>Today's Leaders</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {leaderboard?.slice(0, 4).map((user: any, index: number) => (
              <div 
                key={user.id} 
                className={`flex items-center justify-between p-2 rounded-lg ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20' : 'bg-muted/30'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`${
                    index === 0 ? 'text-yellow-400' : 'text-muted-foreground'
                  } font-bold`}>
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
                <div className="text-accent-green font-semibold">+${user.dailyWinnings}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
