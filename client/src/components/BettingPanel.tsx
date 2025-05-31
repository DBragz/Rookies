import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { TrendingUp, History, X, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BettingPanelProps {
  streamId: number;
  userId: number;
  onPlaceBet: (bet: any) => void;
}

export default function BettingPanel({ streamId, userId, onPlaceBet }: BettingPanelProps) {
  const [betAmount, setBetAmount] = useState("25");
  const [activeBets, setActiveBets] = useState<any[]>([]);
  const { toast } = useToast();

  const { data: betOptions } = useQuery({
    queryKey: [`/api/streams/${streamId}/bet-options`],
  });

  const { data: userBets } = useQuery({
    queryKey: [`/api/users/${userId}/bets`],
  });

  const placeBetMutation = useMutation({
    mutationFn: async (betData: any) => {
      return apiRequest('POST', '/api/bets', betData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/bets`] });
      toast({
        title: "Bet Placed!",
        description: `Your $${betAmount} bet has been placed successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Bet Failed",
        description: error.message || "Failed to place bet",
        variant: "destructive",
      });
    },
  });

  const handlePlaceBet = (option: any) => {
    const amount = parseFloat(betAmount);
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid bet amount",
        variant: "destructive",
      });
      return;
    }

    const odds = option.odds;
    const isPositive = odds > 0;
    const potentialWin = isPositive ? 
      (amount * odds / 100).toFixed(2) : 
      (amount * 100 / Math.abs(odds)).toFixed(2);

    const betData = {
      userId,
      streamId,
      betType: option.type,
      description: option.description,
      amount: amount.toFixed(2),
      odds,
      potentialWin,
    };

    placeBetMutation.mutate(betData);
  };

  const recentBets = userBets?.slice(0, 5) || [];
  const pendingBets = userBets?.filter((bet: any) => bet.status === 'pending') || [];

  return (
    <div className="h-full bg-card p-4 overflow-y-auto custom-scrollbar">
      <div className="space-y-4">
        {/* Active Bets */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-accent-green" />
              <span>Live Bets</span>
              <span className="text-sm text-secondary">({pendingBets.length} active)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingBets.length > 0 ? (
              pendingBets.map((bet: any) => (
                <div key={bet.id} className="bg-secondary rounded-lg p-3 border border-accent-green/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{bet.description}</span>
                    <span className="text-accent-green font-semibold">
                      {bet.odds > 0 ? '+' : ''}{bet.odds}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary">Bet: ${bet.amount}</span>
                    <span className="text-accent-green">Win: ${bet.potentialWin}</span>
                  </div>
                  <div className="mt-2 bg-muted rounded-full h-1">
                    <div className="bg-accent-green h-1 rounded-full w-4/5"></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-secondary py-4">
                No active bets
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Available Bets */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-accent-orange" />
              <span>Hot Bets</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {betOptions?.map((option: any, index: number) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full bg-secondary hover:bg-muted/50 rounded-lg p-3 h-auto border border-border hover:border-accent-green/50 transition-colors"
                onClick={() => handlePlaceBet(option)}
                disabled={placeBetMutation.isPending}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="text-left">
                    <div className="font-medium">{option.description}</div>
                    <div className="text-sm text-secondary">{option.details}</div>
                  </div>
                  <div className={`font-bold ${
                    option.odds > 0 ? 'text-accent-green' : 'text-accent-blue'
                  }`}>
                    {option.odds > 0 ? '+' : ''}{option.odds}
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Bet Slip */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Bet Amount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="$25"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="flex-1"
                min="1"
                max="500"
              />
              <Button 
                className="bg-accent-green hover:bg-accent-green/80 text-white px-6"
                disabled={placeBetMutation.isPending}
              >
                {placeBetMutation.isPending ? "Placing..." : "Set"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Bets */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <History className="w-5 h-5 text-accent-blue" />
              <span>Recent Bets</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentBets.length > 0 ? (
              recentBets.map((bet: any) => (
                <div key={bet.id} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                  <div>
                    <div className="font-medium text-sm">{bet.description}</div>
                    <div className="text-xs text-secondary">${bet.amount} bet</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold text-sm ${
                      bet.status === 'won' ? 'text-accent-green' : 
                      bet.status === 'lost' ? 'text-red-400' : 
                      'text-accent-orange'
                    }`}>
                      {bet.status === 'won' ? `+$${bet.potentialWin}` : 
                       bet.status === 'lost' ? `-$${bet.amount}` : 
                       'Pending'}
                    </div>
                    <div className="text-xs text-secondary capitalize">{bet.status}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-secondary py-4">
                No recent bets
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
