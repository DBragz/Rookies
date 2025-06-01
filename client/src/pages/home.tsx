import Header from "@/components/Header";
import FullScreenMap from "@/components/FullScreenMap";

export default function Home() {
  // Mock current user - in real app this would come from auth context
  const currentUser = {
    id: 1,
    username: "Jake_Dunks",
    balance: "2847.50",
    avatar: "JD"
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header user={currentUser} />
      
      {/* Full screen map */}
      <div className="h-[calc(100vh-4rem)]">
        <FullScreenMap />
      </div>
    </div>
  );
}
