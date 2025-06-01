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
    <div className="h-full relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Map Background with visible pattern */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-accent-green/10 via-accent-blue/5 to-accent-purple/10"></div>
        {/* Street-like pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* City landmarks representation */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/3 w-2 h-8 bg-white/20 rounded"></div>
          <div className="absolute top-1/3 left-1/2 w-3 h-12 bg-white/15 rounded"></div>
          <div className="absolute bottom-1/3 right-1/4 w-2 h-6 bg-white/20 rounded"></div>
          <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-accent-blue/30 rounded-full"></div>
          <div className="absolute bottom-1/4 left-2/3 w-6 h-6 bg-accent-green/20 rounded-full"></div>
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
            className={`absolute cursor-pointer transition-all duration-300 hover:scale-110 ${
              selectedStream?.id === stream.id ? 'scale-125' : ''
            }`}
            style={{
              left: `${25 + (index * 18)}%`,
              top: `${25 + (index * 20)}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => handleStreamSelect(stream)}
          >
            {/* Pulse Animation */}
            <div className={`absolute w-16 h-16 ${getSportColor(stream.sport)} rounded-full animate-ping opacity-20 -inset-2`}></div>
            
            {/* Main Marker */}
            <div className={`relative w-14 h-14 ${getSportColor(stream.sport)} rounded-full shadow-2xl border-3 border-white/50 flex items-center justify-center`}>
              <Play className="w-6 h-6 text-white fill-white drop-shadow-lg" />
            </div>
            
            {/* Viewer Count Badge */}
            <div className="absolute -top-3 -right-3 bg-white text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg border-2 border-gray-900">
              {stream.viewerCount}
            </div>
            
            {/* Location Label */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
              {stream.location.name}
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