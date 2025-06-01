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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40">
          {/* Top Overlay */}
          <div className="absolute top-3 md:top-6 left-3 md:left-6 right-3 md:right-6 flex justify-between items-start">
            <Card className="bg-glass backdrop-blur-xl border border-white/10 p-3 md:p-4 shadow-2xl max-w-xs md:max-w-none">
              <div className="flex items-center space-x-2 md:space-x-3 text-xs md:text-sm mb-1 md:mb-2">
                <div className="flex items-center space-x-1 md:space-x-2 bg-gradient-to-r from-red-500 to-red-600 px-2 md:px-3 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-ping"></div>
                  <span className="font-bold text-white text-xs md:text-sm">LIVE</span>
                </div>
                <div className="flex items-center space-x-1 md:space-x-2 text-white/80">
                  <Eye className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="font-medium text-xs md:text-sm">{stream?.viewerCount || 1247}</span>
                </div>
              </div>
              <div>
                <div className="font-bold text-sm md:text-lg text-white line-clamp-1">{stream?.title || "Basketball at Downtown Court"}</div>
                <div className="text-xs md:text-sm text-white/70 line-clamp-1">{stream?.location?.name || "Manhattan, NYC"}</div>
              </div>
            </Card>
            
            <div className="flex space-x-1 md:space-x-2">
              <Button size="icon" className="bg-black/70 backdrop-blur-sm hover:bg-black/80 border-0 w-8 h-8 md:w-10 md:h-10">
                <Expand className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
              <Button size="icon" className="bg-black/70 backdrop-blur-sm hover:bg-black/80 border-0 w-8 h-8 md:w-10 md:h-10 hidden md:flex">
                <Settings className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
          </div>
          
          {/* Bottom Overlay - Stats */}
          <div className="absolute bottom-3 md:bottom-6 left-3 md:left-6 right-3 md:right-6">
            <Card className="bg-glass backdrop-blur-xl border border-white/10 p-4 md:p-6 shadow-2xl">
              <div className="flex items-center justify-between flex-col md:flex-row space-y-4 md:space-y-0">
                <div className="flex items-center justify-center space-x-4 md:space-x-8 w-full md:w-auto">
                  <div className="text-center transform hover:scale-110 transition-all duration-300">
                    <div className="text-xl md:text-3xl font-black text-accent-green mb-0.5 md:mb-1">{stats.points}</div>
                    <div className="text-xs text-white/70 font-medium uppercase tracking-wider">Points</div>
                  </div>
                  <div className="text-center transform hover:scale-110 transition-all duration-300">
                    <div className="text-xl md:text-3xl font-black text-accent-blue mb-0.5 md:mb-1">{stats.time}</div>
                    <div className="text-xs text-white/70 font-medium uppercase tracking-wider">Duration</div>
                  </div>
                  <div className="text-center transform hover:scale-110 transition-all duration-300">
                    <div className="text-xl md:text-3xl font-black text-accent-orange mb-0.5 md:mb-1">{stats.distance}</div>
                    <div className="text-xs text-white/70 font-medium uppercase tracking-wider">Miles</div>
                  </div>
                </div>
                
                <div className="flex space-x-2 md:space-x-3 w-full md:w-auto">
                  <Button className="bg-gradient-green hover:shadow-glow-green text-white font-semibold px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl transform hover:scale-105 transition-all duration-300 flex-1 md:flex-none">
                    <DollarSign className="w-4 h-4 md:w-5 md:h-5 md:mr-2" />
                    <span className="hidden md:inline">Quick Bet</span>
                  </Button>
                  <Button className="bg-gradient-to-r from-accent-blue to-accent-purple hover:shadow-glow-blue text-white font-semibold px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl transform hover:scale-105 transition-all duration-300 flex-1 md:flex-none">
                    <Share2 className="w-4 h-4 md:w-5 md:h-5 md:mr-2" />
                    <span className="hidden md:inline">Share</span>
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
