import Header from "@/components/Header";
import LiveStream from "@/components/LiveStream";
import FriendsPanel from "@/components/FriendsPanel";

export default function Home() {
  // Mock current user - in real app this would come from auth context
  const currentUser = {
    id: 1,
    username: "Jake_Dunks",
    balance: "2847.50",
    avatar: "JD"
  };

  // Mock current stream
  const currentStreamId = 6; // From our seeded data

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header user={currentUser} />
      
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Friends Panel */}
          <div className="lg:col-span-1">
            <FriendsPanel />
          </div>
          
          {/* Main Stream Area - Takes up most space */}
          <div className="lg:col-span-3">
            <LiveStream streamId={currentStreamId} />
          </div>
        </div>
      </main>
    </div>
  );
}
