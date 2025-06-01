import { useState } from "react";
import Header from "@/components/Header";
import StreamsMap from "@/components/StreamsMap";
import BettingPanel from "@/components/BettingPanel";
import FriendsPanel from "@/components/FriendsPanel";
import ChatPanel from "@/components/ChatPanel";
import BetSlipModal from "@/components/BetSlipModal";
import NotificationToast from "@/components/NotificationToast";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function Home() {
  const [selectedBet, setSelectedBet] = useState<any>(null);
  const [showBetSlip, setShowBetSlip] = useState(false);
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Mock current user - in real app this would come from auth context
  const currentUser = {
    id: 1,
    username: "Jake_Dunks",
    balance: "2847.50",
    avatar: "JD"
  };

  // Mock current stream
  const currentStreamId = 6; // From our seeded data

  const { isConnected, sendMessage } = useWebSocket(currentUser.id, currentStreamId);

  const handlePlaceBet = (bet: any) => {
    setSelectedBet(bet);
    setShowBetSlip(true);
  };

  const handleBetPlaced = () => {
    setShowBetSlip(false);
    setNotification({
      title: "Bet Placed!",
      message: `$${selectedBet?.amount || 25} bet placed successfully`,
      type: 'success'
    });
  };

  const handleSendMessage = (message: string) => {
    sendMessage('chat', { content: message });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header user={currentUser} />
      
      {/* Desktop Layout */}
      <div className="hidden md:flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Friends Panel - Hidden on mobile/tablet */}
        <div className="hidden lg:block w-80">
          <FriendsPanel />
        </div>

        {/* Main Content */}
        <main className="flex-1 flex overflow-hidden">
          {/* Main Map View */}
          <div className="flex-1 bg-black relative">
            <StreamsMap />
          </div>
          
          {/* Betting Panel */}
          <div className="w-96 border-l border-border">
            <BettingPanel 
              streamId={currentStreamId} 
              userId={currentUser.id}
              onPlaceBet={handlePlaceBet}
            />
          </div>
        </main>

        {/* Chat Panel - Hidden on mobile */}
        <div className="hidden xl:block w-80">
          <ChatPanel 
            streamId={currentStreamId}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            isConnected={isConnected}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-[calc(100vh-4rem)] flex flex-col">
        {/* Map - Takes most of the screen on mobile */}
        <div className="flex-1 bg-black relative min-h-[60vh]">
          <StreamsMap />
        </div>
        
        {/* Mobile Bottom Panel with Tabs */}
        <div className="h-[30vh] bg-card border-t border-border flex flex-col">
          {/* Tab Navigation */}
          <div className="flex bg-muted border-b border-border">
            <button className="flex-1 px-4 py-3 text-sm font-semibold bg-accent-green text-white">
              Bets
            </button>
            <button className="flex-1 px-4 py-3 text-sm font-semibold text-secondary hover:text-foreground">
              Chat
            </button>
            <button className="flex-1 px-4 py-3 text-sm font-semibold text-secondary hover:text-foreground">
              Friends
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            <BettingPanel 
              streamId={currentStreamId} 
              userId={currentUser.id}
              onPlaceBet={handlePlaceBet}
            />
          </div>
        </div>
      </div>

      {/* Modals and Notifications */}
      <BetSlipModal
        bet={selectedBet}
        open={showBetSlip}
        onClose={() => setShowBetSlip(false)}
        onConfirm={handleBetPlaced}
        userId={currentUser.id}
      />

      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}
