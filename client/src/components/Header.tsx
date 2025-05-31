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
    <header className="bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-accent-blue flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent-green rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">▶</span>
            </div>
            <span>SportStream</span>
          </h1>
          <div className="hidden md:flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full text-sm">
            <div className="w-2 h-2 bg-white rounded-full live-indicator"></div>
            <span>LIVE</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Balance Display */}
          <div className="flex items-center space-x-4">
            <div className="bg-accent-green/10 border border-accent-green/30 rounded-lg px-4 py-2">
              <div className="text-xs text-secondary">Balance</div>
              <div className="text-lg font-bold text-accent-green">${user.balance}</div>
            </div>
            <Button className="bg-accent-green hover:bg-accent-green/80 text-white">
              <Plus className="w-4 h-4 mr-2" />
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
