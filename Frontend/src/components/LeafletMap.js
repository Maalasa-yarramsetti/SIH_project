import React, { useEffect, useRef, useState } from 'react';
import './LeafletMap.css';

// Dynamically load Leaflet only in browser (avoids SSR issues)
const ensureLeaflet = async () => {
  if (!window.L) {
    await new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
      document.head.appendChild(link);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
      script.onload = resolve;
      document.body.appendChild(script);
    });
  }
  return window.L;
};

const monasteries = [
  { name: 'Rumtek Monastery', coords: [27.3173, 88.6115], img: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Rumtek_Monastery%2C_Sikkim.jpg', desc: 'One of the largest and most famous monasteries in Sikkim.' },
  { name: 'Pemayangtse Monastery', coords: [27.2934, 88.2396], img: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Pemayangtse_Monastery.jpg', desc: 'A historic monastery near Pelling, known for its wooden sculptures.' },
  { name: 'Tashiding Monastery', coords: [27.2722, 88.2654], img: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Tashiding_Monastery.jpg', desc: 'One of the holiest monasteries, situated on a hilltop.' },
  { name: 'Phodong Monastery', coords: [27.4081, 88.6064], img: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Phodong_monastery.jpg', desc: 'Built in the 18th century, known for its annual dance festival.' },
  { name: 'Ralang Monastery', coords: [27.2555, 88.3633], img: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Ralang_Monastery.jpg', desc: 'A major monastery in South Sikkim, famous for colorful festivals.' }
];

export default function LeafletMap({ onRouteChange, target }) {
  const mapRef = useRef(null);
  const mapElRef = useRef(null);
  const [info, setInfo] = useState('Waiting for your location...');
  const userCoordsRef = useRef(null);

  useEffect(() => {
    let map, userMarker, currentRoute;
    let watchId;
    let userCoords = null;
    let L;

    ensureLeaflet().then((_L) => {
      L = _L;
      map = L.map(mapElRef.current).setView([27.3, 88.5], 9);
      mapRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © Carto',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      const monasteryIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448609.png',
        iconSize: [35, 35],
        iconAnchor: [17, 34],
        popupAnchor: [0, -28]
      });

      const userIcon = L.divIcon({ className: 'user-marker', iconSize: [20, 20] });

      // Watch user location
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition((pos) => {
          userCoords = [pos.coords.latitude, pos.coords.longitude];
          userCoordsRef.current = userCoords;
          if (!userMarker) {
            userMarker = L.marker(userCoords, { icon: userIcon }).addTo(map).bindPopup('You are here');
          } else {
            userMarker.setLatLng(userCoords);
          }
          setInfo('Location detected. Click on a monastery to navigate.');
        }, (err) => {
          setInfo(`Location error: ${err.message}`);
        }, { enableHighAccuracy: true });
      } else {
        setInfo('Geolocation not supported.');
      }

      const drawRoute = async (start, end, monasteryName) => {
        if (currentRoute) map.removeLayer(currentRoute);
        const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coords = route.geometry.coordinates.map((c) => [c[1], c[0]]);
          currentRoute = L.polyline(coords, { color: 'blue', weight: 5 }).addTo(map);
          map.fitBounds(currentRoute.getBounds());
          setInfo(`Navigation: You → ${monasteryName} • ${(route.distance/1000).toFixed(2)} km • ${(route.duration/60).toFixed(0)} mins`);
          if (onRouteChange) onRouteChange({ end, distanceKm: route.distance/1000, durationMin: route.duration/60 });
        }
      };

      monasteries.forEach((m) => {
        const marker = L.marker(m.coords, { icon: monasteryIcon }).addTo(map);
        const popupContent = `\
          <div class="popup-content">\
            <img src="${m.img}" alt="${m.name}"/>\
            <h4>${m.name}</h4>\
            <p>${m.desc}</p>\
          </div>`;
        marker.bindPopup(popupContent);
        marker.on('click', () => {
          if (!userCoords) {
            setInfo('Waiting for your location...');
            return;
          }
          drawRoute(userCoords, m.coords, m.name);
        });
      });
      mapRef.current.__drawRoute = drawRoute;
    });

    return () => {
      if (watchId && navigator.geolocation) navigator.geolocation.clearWatch(watchId);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onRouteChange]);

  // React to target changes once map and user location are available
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !target || !userCoordsRef.current) return;
    if (typeof map.__drawRoute === 'function') {
      map.__drawRoute(userCoordsRef.current, target.coords, target.name || 'Destination');
    }
  }, [target]);

  return (
    <div className="leaflet-wrapper">
      <div className="leaflet-info" id="leaflet-info">{info}</div>
      <div ref={mapElRef} id="leaflet-map" style={{ height: 400, borderRadius: 15, boxShadow: '0 4px 10px rgba(0,0,0,0.2)', marginBottom: 10 }} />
    </div>
  );
}


