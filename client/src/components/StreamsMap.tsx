import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Users, Play, DollarSign, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StreamMarker {
  id: number;
  title: string;
  location: {
    lat: number;
    lng: number;
    name: string;
    address: string;
  };
  viewerCount: number;
  sport: string;
  streamer: string;
  isLive: boolean;
  duration: string;
  activeBets: number;
}

export default function StreamsMap() {
  const [selectedStream, setSelectedStream] = useState<StreamMarker | null>(null);
  
  const { data: streams } = useQuery({
    queryKey: ['/api/streams'],
    select: (data: any[]) => data?.filter(stream => stream.isLive && stream.location) || []
  });

  // Mock map data - in real app this would be integrated with a maps service
  const mapStreams: StreamMarker[] = [
    {
      id: 6,
      title: "Basketball Street Game",
      location: {
        lat: 34.0522,
        lng: -118.2437,
        name: "Venice Beach Courts",
        address: "1800 Ocean Front Walk, Venice, CA"
      },
      viewerCount: 247,
      sport: "Basketball",
      streamer: "Mike_Hoops",
      isLive: true,
      duration: "23:45",
      activeBets: 12
    },
    {
      id: 7,
      title: "Soccer Practice Match",
      location: {
        lat: 34.0689,
        lng: -118.4452,
        name: "Santa Monica Park",
        address: "1450 Ocean Ave, Santa Monica, CA"
      },
      viewerCount: 89,
      sport: "Soccer",
      streamer: "FootballFan22",
      isLive: true,
      duration: "45:12",
      activeBets: 7
    },
    {
      id: 8,
      title: "Tennis Tournament",
      location: {
        lat: 34.0736,
        lng: -118.4004,
        name: "UCLA Tennis Center",
        address: "325 Westwood Plaza, Los Angeles, CA"
      },
      viewerCount: 156,
      sport: "Tennis",
      streamer: "TennisAce_Pro",
      isLive: true,
      duration: "1:12:30",
      activeBets: 23
    },
    {
      id: 9,
      title: "Beach Volleyball",
      location: {
        lat: 33.9978,
        lng: -118.4695,
        name: "Manhattan Beach Pier",
        address: "Manhattan Beach Blvd, Manhattan Beach, CA"
      },
      viewerCount: 134,
      sport: "Volleyball",
      streamer: "BeachPlayer_Sarah",
      isLive: true,
      duration: "34:22",
      activeBets: 8
    }
  ];

  const handleStreamSelect = (stream: StreamMarker) => {
    setSelectedStream(stream);
  };

  const getSportColor = (sport: string) => {
    switch (sport.toLowerCase()) {
      case 'basketball': return 'bg-accent-orange';
      case 'soccer': return 'bg-accent-green';
      case 'tennis': return 'bg-accent-blue';
      case 'volleyball': return 'bg-accent-purple';
      default: return 'bg-accent-green';
    }
  };

  return (
    <div className="h-full relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-green/5 via-transparent to-accent-blue/5"></div>
      
      {/* Map Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border border-white/10"></div>
          ))}
        </div>
      </div>

      {/* Map Header */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <Card className="bg-glass backdrop-blur-xl border-accent-green/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-green rounded-lg shadow-glow-green">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Live Sports Map</h2>
                  <p className="text-sm text-secondary">Los Angeles Area • {mapStreams.length} active streams</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                  LIVE
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stream Markers */}
      <div className="absolute inset-0 z-10">
        {mapStreams.map((stream, index) => (
          <div
            key={stream.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
              selectedStream?.id === stream.id ? 'scale-125' : ''
            }`}
            style={{
              left: `${20 + (index * 20)}%`,
              top: `${30 + (index * 15)}%`
            }}
            onClick={() => handleStreamSelect(stream)}
          >
            {/* Pulse Animation */}
            <div className={`absolute inset-0 ${getSportColor(stream.sport)} rounded-full animate-ping opacity-30`}></div>
            
            {/* Main Marker */}
            <div className={`relative w-12 h-12 ${getSportColor(stream.sport)} rounded-full shadow-lg border-2 border-white/30 flex items-center justify-center backdrop-blur-sm`}>
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
            
            {/* Viewer Count Badge */}
            <div className="absolute -top-2 -right-2 bg-accent-green text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              {stream.viewerCount}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Stream Info Panel */}
      {selectedStream && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <Card className="bg-glass backdrop-blur-xl border-accent-green/20 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 ${getSportColor(selectedStream.sport)} rounded-lg shadow-lg`}>
                      <Play className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">{selectedStream.title}</h3>
                      <p className="text-sm text-secondary">by {selectedStream.streamer}</p>
                    </div>
                    <Badge className={`${getSportColor(selectedStream.sport)}/20 text-white border-white/30`}>
                      {selectedStream.sport}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-accent-blue" />
                      <span className="text-secondary">{selectedStream.location.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-accent-green" />
                      <span className="text-white font-semibold">{selectedStream.viewerCount}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-accent-orange" />
                      <span className="text-white font-semibold">{selectedStream.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-accent-purple" />
                      <span className="text-white font-semibold">{selectedStream.activeBets} bets</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    className="bg-gradient-green hover:shadow-glow-green text-white font-semibold px-6 py-3 rounded-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Stream
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-accent-blue to-accent-purple hover:shadow-glow-blue text-white font-semibold px-6 py-3 rounded-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    Place Bet
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute top-20 right-4 z-20">
        <Card className="bg-glass backdrop-blur-xl border-white/10 shadow-lg">
          <CardContent className="p-4">
            <h4 className="text-sm font-bold text-white mb-3">Sports</h4>
            <div className="space-y-2">
              {['Basketball', 'Soccer', 'Tennis', 'Volleyball'].map((sport) => (
                <div key={sport} className="flex items-center space-x-2 text-xs">
                  <div className={`w-3 h-3 ${getSportColor(sport)} rounded-full`}></div>
                  <span className="text-secondary">{sport}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}