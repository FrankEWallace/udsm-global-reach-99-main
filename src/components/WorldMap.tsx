/**
 * Interactive World Map using Leaflet
 * Shows real-time visitor locations from Matomo Analytics
 */
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMatomoCountries } from '@/hooks/useMatomoData';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Country coordinates (capital cities for markers)
const countryCoordinates: Record<string, { lat: number; lng: number }> = {
  us: { lat: 38.9072, lng: -77.0369 },
  gb: { lat: 51.5074, lng: -0.1278 },
  de: { lat: 52.5200, lng: 13.4050 },
  fr: { lat: 48.8566, lng: 2.3522 },
  ca: { lat: 45.4215, lng: -75.6972 },
  au: { lat: -35.2809, lng: 149.1300 },
  jp: { lat: 35.6762, lng: 139.6503 },
  cn: { lat: 39.9042, lng: 116.4074 },
  in: { lat: 28.6139, lng: 77.2090 },
  br: { lat: -15.8267, lng: -47.9218 },
  mx: { lat: 19.4326, lng: -99.1332 },
  za: { lat: -25.7479, lng: 28.2293 },
  ng: { lat: 9.0765, lng: 7.3986 },
  ke: { lat: -1.2921, lng: 36.8219 },
  tz: { lat: -6.7924, lng: 39.2083 },
  ug: { lat: 0.3476, lng: 32.5825 },
  gh: { lat: 5.6037, lng: -0.1870 },
  eg: { lat: 30.0444, lng: 31.2357 },
  sa: { lat: 24.7136, lng: 46.6753 },
  ru: { lat: 55.7558, lng: 37.6173 },
  it: { lat: 41.9028, lng: 12.4964 },
  es: { lat: 40.4168, lng: -3.7038 },
  nl: { lat: 52.3676, lng: 4.9041 },
  se: { lat: 59.3293, lng: 18.0686 },
  no: { lat: 59.9139, lng: 10.7522 },
  pl: { lat: 52.2297, lng: 21.0122 },
  ch: { lat: 46.9480, lng: 7.4474 },
  be: { lat: 50.8503, lng: 4.3517 },
  at: { lat: 48.2082, lng: 16.3738 },
  dk: { lat: 55.6761, lng: 12.5683 },
  sg: { lat: 1.3521, lng: 103.8198 },
  my: { lat: 3.1390, lng: 101.6869 },
  th: { lat: 13.7563, lng: 100.5018 },
  ph: { lat: 14.5995, lng: 120.9842 },
  id: { lat: -6.2088, lng: 106.8456 },
  vn: { lat: 21.0285, lng: 105.8542 },
  pk: { lat: 33.6844, lng: 73.0479 },
  bd: { lat: 23.8103, lng: 90.4125 },
  nz: { lat: -41.2865, lng: 174.7762 },
  ar: { lat: -34.6037, lng: -58.3816 },
  cl: { lat: -33.4489, lng: -70.6693 },
  co: { lat: 4.7110, lng: -74.0721 },
  pe: { lat: -12.0464, lng: -77.0428 },
  il: { lat: 31.7683, lng: 35.2137 },
  tr: { lat: 39.9334, lng: 32.8597 },
  ua: { lat: 50.4501, lng: 30.5234 },
  ro: { lat: 44.4268, lng: 26.1025 },
  cz: { lat: 50.0755, lng: 14.4378 },
  gr: { lat: 37.9838, lng: 23.7275 },
  pt: { lat: 38.7223, lng: -9.1393 },
  hu: { lat: 47.4979, lng: 19.0402 },
  ie: { lat: 53.3498, lng: -6.2603 },
  fi: { lat: 60.1699, lng: 24.9384 },
};

const WorldMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  
  const { data: countries } = useMatomoCountries('day', 'today');

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 6,
      zoomControl: true,
      attributionControl: false,
    });

    // Add tile layer (CartoDB Positron - clean and modern)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !countries || countries.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Get max visits for scaling
    const maxVisits = Math.max(...countries.map(c => c.nb_visits));

    // Add markers for each country with visitors
    countries.forEach(country => {
      const countryCode = country.code?.toLowerCase();
      const coords = countryCode ? countryCoordinates[countryCode] : null;
      
      if (!coords) return;

      // Calculate radius based on visitor count
      const radius = Math.max(5, Math.min(30, (country.nb_visits / maxVisits) * 30));
      
      // Calculate color intensity based on visitor count
      const intensity = country.nb_visits / maxVisits;
      const color = intensity > 0.7 ? '#dc2626' : intensity > 0.4 ? '#f59e0b' : '#3b82f6';
      
      // Create circle marker
      const marker = L.circleMarker([coords.lat, coords.lng], {
        radius: radius,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.6,
      }).addTo(mapInstanceRef.current!);

      // Add popup
      marker.bindPopup(`
        <div style="padding: 8px; min-width: 150px;">
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${country.label}</div>
          <div style="font-size: 12px; color: #666;">
            <strong>${country.nb_visits.toLocaleString()}</strong> visits<br/>
            <strong>${country.nb_actions.toLocaleString()}</strong> actions<br/>
            <strong>${country.nb_uniq_visitors.toLocaleString()}</strong> unique visitors
          </div>
        </div>
      `);

      // Hover effect
      marker.on('mouseover', function() {
        this.setStyle({
          fillOpacity: 0.9,
          weight: 3,
        });
      });

      marker.on('mouseout', function() {
        this.setStyle({
          fillOpacity: 0.6,
          weight: 2,
        });
      });

      markersRef.current.push(marker);
    });
  }, [countries]);

  return (
    <div className="glass-card p-0 overflow-hidden rounded-xl">
      <div 
        ref={mapRef} 
        style={{ 
          height: '500px', 
          width: '100%',
          borderRadius: '0.75rem',
        }} 
      />
      <style>{`
        .leaflet-container {
          border-radius: 0.75rem;
          background: linear-gradient(to bottom, #e0f2fe, #f0f9ff);
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  );
};

export default WorldMap;
