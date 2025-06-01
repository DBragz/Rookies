import { Bell, Plus, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Header() {
  const { user } = useAuth();
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/logout", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.reload();
    },
    onError: () => {
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  if (!user) return null;
  return (
    <header className="bg-glass backdrop-blur-xl border-b border-border/50 px-4 py-3 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-green/5 via-transparent to-accent-blue/5"></div>
      <div className="flex items-center justify-between max-w-7xl mx-auto relative z-10">
        <div className="flex items-center space-x-3 md:space-x-6">
          <h1 className="text-xl md:text-3xl font-black text-transparent bg-gradient-to-r from-accent-green to-accent-blue bg-clip-text flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-green rounded-xl flex items-center justify-center shadow-glow-green transform hover:scale-110 transition-all duration-300">
              <span className="text-white text-sm md:text-lg font-black">R</span>
            </div>
            <span className="tracking-tight">Rookies</span>
          </h1>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-lg animate-pulse-slow">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-ping"></div>
            <span>LIVE</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-6">
          {/* Balance Display - Responsive */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="bg-accent-green/10 border border-accent-green/30 rounded-lg md:rounded-xl px-3 md:px-6 py-2 md:py-3 backdrop-blur-sm shadow-glow-green">
              <div className="text-xs text-secondary font-medium hidden md:block">Balance</div>
              <div className="text-sm md:text-xl font-black text-accent-green">${(user as any)?.balance || '0.00'}</div>
            </div>
            <Button className="bg-gradient-green hover:shadow-glow-green text-white font-semibold px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl transform hover:scale-105 transition-all duration-300">
              <Plus className="w-4 h-4 md:w-5 md:h-5 md:mr-2" />
              <span className="hidden md:inline">Add Funds</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 md:w-10 md:h-10 text-slate-400 hover:text-white"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
          
          {/* User Profile - Mobile Optimized */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="relative md:block">
              <Button variant="ghost" size="icon" className="w-8 h-8 md:w-10 md:h-10">
                <Bell className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
              <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 bg-accent-orange w-2 h-2 md:w-3 md:h-3 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <Avatar className="w-8 h-8 md:w-10 md:h-10">
                <AvatarFallback className="bg-accent-blue text-white text-xs md:text-sm">
                  {(user as any)?.firstName?.[0] || (user as any)?.email?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm md:text-base hidden sm:inline">
                {(user as any)?.firstName || (user as any)?.email?.split('@')[0] || 'User'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
