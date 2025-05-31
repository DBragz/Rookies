import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Expand, Settings, Share2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface LiveStreamProps {
  streamId: number;
}

export default function LiveStream({ streamId }: LiveStreamProps) {
  const [stats, setStats] = useState({
    score: "21-18",
    time: "18:42",
    points: 24,
    distance: "2.3"
  });

  const { data: stream } = useQuery({
    queryKey: [`/api/streams/${streamId}`],
  });

  const { data: streamStats } = useQuery({
    queryKey: [`/api/streams/${streamId}/stats`],
    refetchInterval: 5000, // Update every 5 seconds
  });

  useEffect(() => {
    if (streamStats) {
      setStats({
        score: streamStats.score || "21-18",
        time: formatDuration(streamStats.duration || 1122),
        points: streamStats.points || 24,
        distance: streamStats.distance || "2.3"
      });
    }
  }, [streamStats]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full relative">
      {/* Mock Video Player */}
      <div className="h-full bg-black flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675" 
          alt="Live basketball game on outdoor court" 
          className="w-full h-full object-cover"
        />
        
        {/* Stream Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30">
          {/* Top Overlay */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <Card className="bg-black/70 backdrop-blur-sm border-0 p-3">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-medium">LIVE</span>
                <span className="text-secondary">•</span>
                <Eye className="w-4 h-4" />
                <span className="text-secondary">{stream?.viewerCount || 1247} viewers</span>
              </div>
              <div className="mt-1">
                <div className="font-semibold">{stream?.title || "Basketball at Downtown Court"}</div>
                <div className="text-sm text-secondary">{stream?.location?.name || "Manhattan, NYC"}</div>
              </div>
            </Card>
            
            <div className="flex space-x-2">
              <Button size="icon" className="bg-black/70 backdrop-blur-sm hover:bg-black/80 border-0">
                <Expand className="w-5 h-5" />
              </Button>
              <Button size="icon" className="bg-black/70 backdrop-blur-sm hover:bg-black/80 border-0">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Bottom Overlay - Stats */}
          <div className="absolute bottom-4 left-4 right-4">
            <Card className="bg-black/70 backdrop-blur-sm border-0 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-green">{stats.points}</div>
                    <div className="text-xs text-secondary">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-blue">{stats.time}</div>
                    <div className="text-xs text-secondary">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-orange">{stats.distance}</div>
                    <div className="text-xs text-secondary">Miles</div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button className="bg-accent-green hover:bg-accent-green/80 text-white">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Quick Bet
                  </Button>
                  <Button className="bg-accent-blue hover:bg-accent-blue/80 text-white">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
