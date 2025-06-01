import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Create custom modern marker icons
const createCustomIcon = (color: string, sport: string) => {
  const svgIcon = `
    <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${color}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color === '#10B981' ? '#059669' : color === '#3B82F6' ? '#1D4ED8' : color === '#F59E0B' ? '#D97706' : color === '#EF4444' ? '#DC2626' : '#8B5CF6'};stop-opacity:1" />
        </linearGradient>
        <filter id="shadow-${color}" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M16 0C7.163 0 0 7.163 0 16c0 16 16 24 16 24s16-8 16-24C32 7.163 24.837 0 16 0z" 
            fill="url(#grad-${color})" 
            filter="url(#shadow-${color})" 
            stroke="white" 
            stroke-width="2"/>
      <circle cx="16" cy="16" r="8" fill="white" opacity="0.9"/>
      <text x="16" y="20" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="${color}">
        ${sport}
      </text>
    </svg>
  `;
  
  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40]
  });
};

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

    // Define multiple map layers
    const baseLayers = {
      "Street Map": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }),
      "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18,
      }),
      "Dark Mode": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }),
      "Terrain": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramias.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        maxZoom: 17,
      }),
      "Watercolor": L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 1,
        maxZoom: 16,
      }),
    };

    // Add default layer
    baseLayers["Street Map"].addTo(map);

    // Add layer control
    L.control.layers(baseLayers).addTo(map);

    // Define venues with colors and sport icons
    const venues = [
      { lat: 34.0522, lng: -118.2437, name: "Downtown LA", type: "Basketball Court", color: "#10B981", sport: "🏀" },
      { lat: 34.0430, lng: -118.2673, name: "USC Campus", type: "Football Field", color: "#EF4444", sport: "🏈" },
      { lat: 34.0689, lng: -118.4452, name: "UCLA Campus", type: "Soccer Field", color: "#3B82F6", sport: "⚽" },
      { lat: 34.0166, lng: -118.2920, name: "Exposition Park", type: "Tennis Courts", color: "#F59E0B", sport: "🎾" },
      { lat: 34.0736, lng: -118.2400, name: "Griffith Park", type: "Baseball Diamond", color: "#8B5CF6", sport: "⚾" },
    ];

    venues.forEach(venue => {
      const customIcon = createCustomIcon(venue.color, venue.sport);
      const marker = L.marker([venue.lat, venue.lng], { icon: customIcon })
        .bindPopup(`
          <div class="p-3 min-w-[200px]">
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-lg">${venue.sport}</span>
              <h3 class="font-bold text-sm text-gray-800">${venue.name}</h3>
            </div>
            <p class="text-xs text-gray-600 mb-3">${venue.type}</p>
            <div class="flex space-x-1">
              <button class="flex-1 px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded hover:from-green-600 hover:to-green-700 transition-all">
                📺 View Streams
              </button>
              <button class="flex-1 px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded hover:from-blue-600 hover:to-blue-700 transition-all">
                🎯 Place Bet
              </button>
            </div>
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