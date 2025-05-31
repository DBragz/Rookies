import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BetSlipModalProps {
  bet: any;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userId: number;
}

export default function BetSlipModal({ bet, open, onClose, onConfirm, userId }: BetSlipModalProps) {
  const [amount, setAmount] = useState("25");
  const { toast } = useToast();

  const placeBetMutation = useMutation({
    mutationFn: async (betData: any) => {
      return apiRequest('POST', '/api/bets', betData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/bets`] });
      toast({
        title: "Bet Placed!",
        description: `Your $${amount} bet has been placed successfully.`,
      });
      onConfirm();
    },
    onError: (error: any) => {
      toast({
        title: "Bet Failed",
        description: error.message || "Failed to place bet",
        variant: "destructive",
      });
    },
  });

  const handleConfirm = () => {
    if (!bet) return;

    const betAmount = parseFloat(amount);
    if (betAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid bet amount",
        variant: "destructive",
      });
      return;
    }

    const odds = bet.odds;
    const isPositive = odds > 0;
    const potentialWin = isPositive ? 
      (betAmount * odds / 100).toFixed(2) : 
      (betAmount * 100 / Math.abs(odds)).toFixed(2);

    const betData = {
      userId,
      streamId: bet.streamId || 6, // Default to seeded stream
      betType: bet.type,
      description: bet.description,
      amount: betAmount.toFixed(2),
      odds,
      potentialWin,
    };

    placeBetMutation.mutate(betData);
  };

  if (!bet) return null;

  const betAmount = parseFloat(amount) || 0;
  const odds = bet.odds || 0;
  const isPositive = odds > 0;
  const potentialWin = isPositive ? 
    (betAmount * odds / 100) : 
    (betAmount * 100 / Math.abs(odds));
  const totalReturn = betAmount + potentialWin;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md bet-slip-enter">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            Place Bet
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="bg-background p-4">
            <div className="text-sm text-secondary mb-1">Betting on</div>
            <div className="font-medium">{bet.description}</div>
            <div className="text-accent-green font-bold text-lg">
              {odds > 0 ? '+' : ''}{odds}
            </div>
          </Card>
          
          <div>
            <Label htmlFor="amount" className="text-sm font-medium mb-2 block">
              Bet Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max="500"
              className="w-full"
            />
          </div>
          
          <Card className="bg-muted/50 p-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Potential Win:</span>
              <span className="text-accent-green font-semibold">
                ${potentialWin.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Return:</span>
              <span className="font-semibold">${totalReturn.toFixed(2)}</span>
            </div>
          </Card>
          
          <Button 
            onClick={handleConfirm}
            className="w-full bg-accent-green hover:bg-accent-green/80 text-white py-3 font-semibold"
            disabled={placeBetMutation.isPending || betAmount <= 0}
          >
            {placeBetMutation.isPending ? "Placing Bet..." : `Place Bet - $${betAmount.toFixed(2)}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
