import { Bell, Plus, Wallet } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  user: {
    username: string;
    balance: string;
    avatar: string;
  };
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="bg-glass backdrop-blur-xl border-b border-border/50 px-4 py-3 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-green/5 via-transparent to-accent-blue/5"></div>
      <div className="flex items-center justify-between max-w-7xl mx-auto relative z-10">
        <div className="flex items-center space-x-6">
          <h1 className="text-3xl font-black text-transparent bg-gradient-to-r from-accent-green to-accent-blue bg-clip-text flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-green rounded-xl flex items-center justify-center shadow-glow-green transform hover:scale-110 transition-all duration-300">
              <span className="text-white text-lg font-black">R</span>
            </div>
            <span className="tracking-tight">Rookies</span>
          </h1>
          <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse-slow">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <span>LIVE</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Balance Display */}
          <div className="flex items-center space-x-4">
            <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl px-6 py-3 backdrop-blur-sm shadow-glow-green">
              <div className="text-xs text-secondary font-medium">Balance</div>
              <div className="text-xl font-black text-accent-green">${user.balance}</div>
            </div>
            <Button className="bg-gradient-green hover:shadow-glow-green text-white font-semibold px-6 py-3 rounded-xl transform hover:scale-105 transition-all duration-300">
              <Plus className="w-5 h-5 mr-2" />
              Add Funds
            </Button>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="absolute -top-1 -right-1 bg-accent-orange w-3 h-3 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarFallback className="bg-accent-blue text-white">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{user.username}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
