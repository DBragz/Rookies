import { useQuery } from "@tanstack/react-query";
import { MapPin, Plus, Minus, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface InteractiveMapProps {
  streamId: number;
}

export default function InteractiveMap({ streamId }: InteractiveMapProps) {
  const { data: stream } = useQuery({
    queryKey: [`/api/streams/${streamId}`],
  });

  return (
    <div className="h-full relative">
      {/* Mock Map with satellite view */}
      <img 
        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=320" 
        alt="Satellite view of basketball court location" 
        className="w-full h-full object-cover"
      />
      
      {/* Map Overlay */}
      <div className="absolute inset-0 bg-black/30">
        {/* Location Marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-6 h-6 bg-accent-green rounded-full border-4 border-white shadow-lg animate-pulse"></div>
            <div className="absolute -top-12 -left-16 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
              <div className="font-medium">Alex_Runner</div>
              <div className="text-xs text-secondary">Downtown Court</div>
            </div>
          </div>
        </div>
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button size="icon" className="bg-black/70 backdrop-blur-sm hover:bg-black/80 border-0">
            <Plus className="w-4 h-4" />
          </Button>
          <Button size="icon" className="bg-black/70 backdrop-blur-sm hover:bg-black/80 border-0">
            <Minus className="w-4 h-4" />
          </Button>
          <Button size="icon" className="bg-black/70 backdrop-blur-sm hover:bg-black/80 border-0">
            <Navigation className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Map Info */}
        <div className="absolute bottom-4 left-4">
          <Card className="bg-black/70 backdrop-blur-sm border-0 p-3">
            <div className="text-sm">
              <div className="font-medium flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-accent-orange" />
                <span>Current Location</span>
              </div>
              <div className="text-secondary">{stream?.location?.name || "Central Park Basketball Court"}</div>
              <div className="text-xs text-secondary mt-1">
                {stream?.location?.lat ? 
                  `${stream.location.lat.toFixed(4)}° N, ${stream.location.lng.toFixed(4)}° W` :
                  "40.7829° N, 73.9654° W"
                }
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
