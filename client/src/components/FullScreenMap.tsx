import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function FullScreenMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize the map
    const map = L.map(mapRef.current, {
      center: [34.0522, -118.2437], // Los Angeles coordinates
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      dragging: true,
      touchZoom: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add some sample markers for sports venues in LA
    const venues = [
      { lat: 34.0522, lng: -118.2437, name: "Downtown LA", type: "Basketball Court" },
      { lat: 34.0430, lng: -118.2673, name: "USC Campus", type: "Football Field" },
      { lat: 34.0689, lng: -118.4452, name: "UCLA Campus", type: "Soccer Field" },
      { lat: 34.0166, lng: -118.2920, name: "Exposition Park", type: "Tennis Courts" },
      { lat: 34.0736, lng: -118.2400, name: "Griffith Park", type: "Baseball Diamond" },
    ];

    venues.forEach(venue => {
      const marker = L.marker([venue.lat, venue.lng])
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-sm">${venue.name}</h3>
            <p class="text-xs text-gray-600">${venue.type}</p>
            <button class="mt-1 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">
              View Streams
            </button>
          </div>
        `)
        .addTo(map);
    });

    mapInstanceRef.current = map;

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full"
      style={{ minHeight: '100%' }}
    />
  );
}