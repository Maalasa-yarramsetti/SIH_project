import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt, FaRoute, FaClock, FaRuler, FaSearch } from "react-icons/fa";
import PaymentModal from '../../components/PaymentModal';
import { monasteries } from '../../data/monasteries';
import './MonasteryMap.css';
import './Events.css';

// Helper function to calculate distance between two points
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
};

// Function to calculate route between two points and get duration
const calculateRouteBetweenPoints = async (startCoords, endCoords) => {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=false&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        distance: (route.distance / 1000).toFixed(2),
        duration: Math.round(route.duration / 60)
      };
    }
    return null;
  } catch (error) {
    console.error("Error calculating route:", error);
    return null;
  }
};

// Distance and Duration Panel Component
const DistancePanel = ({ selectedMonastery, userCoords, distance, duration, isCalculating }) => {
  const hasSelection = Boolean(selectedMonastery && userCoords);
  const monasteryName = selectedMonastery?.name || '—';
  const displayDistance = isCalculating ? null : (distance || 0);
  const displayDuration = isCalculating ? null : (duration || 0);

  return (
    <div className="distance-panel">
      <div className="distance-header">
        <FaMapMarkerAlt className="icon" />
        <h3>Route Information</h3>
      </div>
      <div className="distance-content">
        <div className="monastery-info">
          <h4>{hasSelection ? monasteryName : 'Select a monastery to begin'}</h4>
          {!hasSelection && <p>Tap a monastery marker to calculate distance and duration.</p>}
          {hasSelection && <p>{selectedMonastery.desc}</p>}
        </div>
        <div className="route-stats">
          <div className="stat-item">
            <FaRuler className="stat-icon" />
            <div className="stat-content">
              <span className="stat-label">Distance</span>
              <span className="stat-value">
                {isCalculating ? (
                  <span className="inline-loading"><span className="loading-spinner small"></span> Calculating...</span>
                ) : (
                  `${displayDistance} km`
                )}
              </span>
            </div>
          </div>
          <div className="stat-item">
            <FaClock className="stat-icon" />
            <div className="stat-content">
              <span className="stat-label">Duration</span>
              <span className="stat-value">
                {isCalculating ? (
                  <span className="inline-loading"><span className="loading-spinner small"></span> Calculating...</span>
                ) : (
                  `${displayDuration} min`
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="route-description">
          <FaRoute className="icon" />
          <span>{hasSelection ? `Route from your location to ${monasteryName}` : 'Route will appear here once a monastery is selected'}</span>
        </div>
      </div>
    </div>
  );
};

// Nearby Place Card Component with Distance Calculation
const NearbyPlaceCard = ({ place, userCoords, monasteryCoords, onBook }) => {
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculatePlaceRoute = async () => {
      if (userCoords && place.coords) {
        setLoading(true);
        const route = await calculateRouteBetweenPoints(userCoords, place.coords);
        setRouteInfo(route);
        setLoading(false);
      }
    };

    calculatePlaceRoute();
  }, [userCoords, place.coords]);

  const directDistance = userCoords ? getDistance(userCoords[0], userCoords[1], place.coords[0], place.coords[1]) : null;

  return (
    <div className="place-card">
      <div className="place-info">
        <div className="place-info-left">
          <h5>{place.name}</h5>
          <p className="place-type">{place.type}</p>
          <p className="place-price">₹{place.price}/{place.type === 'Hotel' || place.type === 'Resort' || place.type === 'Lodge' || place.type === 'Guest House' ? 'night' : 'visit'}</p>
          <div className="place-distance-info">
            {loading ? (
              <div className="distance-loading">
                <div className="loading-spinner"></div>
                <span>Calculating route...</span>
              </div>
            ) : (
              <>
                <div className="distance-item">
                  <FaRuler className="distance-icon" />
                  <span>
                    {routeInfo ? `${routeInfo.distance} km` : directDistance ? `${directDistance} km (direct)` : 'N/A'}
                  </span>
                </div>
                {routeInfo && (
                  <div className="distance-item">
                    <FaClock className="distance-icon" />
                    <span>{routeInfo.duration} min</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="place-info-right">
          <button className="book-now-btn small" onClick={onBook}>Book Now</button>
        </div>
      </div>
    </div>
  );
};

const Maps = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [userCoords, setUserCoords] = useState(null);
  const [selectedMonastery, setSelectedMonastery] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [selectedMonasteryId, setSelectedMonasteryId] = useState('');
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [sourceLabel, setSourceLabel] = useState('Current Location');
  const [destinationLabel, setDestinationLabel] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!mapRef.current) return;

      let map;
      let userMarker;

      try {
        setMapError(null);
        setMapLoaded(false);
        
        // Initialize map
        map = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          touchZoom: true
        }).setView([27.3, 88.5], 9);

        // Store map instance reference
        mapInstanceRef.current = map;

        // Wait for map to be ready
        map.whenReady(() => {
          setMapLoaded(true);
        });

        // Add tile layer
        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          attribution: "© OpenStreetMap © Carto",
          subdomains: "abcd",
          maxZoom: 19,
        }).addTo(map);

        // Add danger zones (terrestrial high-risk regions)
        const dangerZones = [
          // Sample polygons around Sikkim region (approximate, illustrative only)
          [[27.35, 88.35], [27.40, 88.45], [27.32, 88.52], [27.28, 88.42]],
          [[27.20, 88.55], [27.24, 88.66], [27.16, 88.70], [27.12, 88.60]]
        ];
        dangerZones.forEach(coords => {
          const poly = L.polygon(coords, {
            color: '#dc3545',
            fillColor: '#dc3545',
            fillOpacity: 0.2,
            weight: 2
          }).addTo(map);
          poly.bindTooltip('Danger area — be careful');
          poly.on('mouseover', () => poly.setStyle({ fillOpacity: 0.35 }));
          poly.on('mouseout', () => poly.setStyle({ fillOpacity: 0.2 }));
        });

        // Create custom monastery icon function
        const createMonasteryIcon = () => {
          return L.divIcon({
            className: 'custom-monastery-marker',
            html: `
              <div class="monastery-marker-container">
                <img src="https://www.shutterstock.com/image-vector/vector-silhouette-buddha-statue-line-600nw-2317962237.jpg" alt="Monastery" class="monastery-marker-image" />
                <div class="monastery-marker-shadow"></div>
              </div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 20],
            popupAnchor: [0, -20],
          });
        };

        // Create user icon
        const userIcon = L.divIcon({ 
          className: "user-marker", 
          iconSize: [20, 20],
          html: '<div style="background: #ff4757; border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 8px rgba(255, 71, 87, 0.4);"></div>'
        });

        // Add monastery markers
        monasteries.forEach((m) => {
          const customIcon = createMonasteryIcon();
          const marker = L.marker(m.coords, { icon: customIcon }).addTo(map);
          
          // Enhanced popup content
          const popupContent = `
            <div class="monastery-popup">
              <div class="popup-image-container">
                <img src="${m.img}" alt="${m.name}" class="popup-image" />
              </div>
              <div class="popup-content">
                <h3 class="popup-title">${m.name}</h3>
                <p class="popup-description">${m.desc}</p>
                <div class="popup-actions">
                  <button class="popup-select-btn" onclick="window.selectMonastery('${m.name}')">
                    Select & Get Directions
                  </button>
                </div>
              </div>
            </div>
          `;
          
          marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'monastery-popup-container'
          });

          // Hover effects
          marker.on('mouseover', function() {
            this.openPopup();
          });

          marker.on('mouseout', function() {
            setTimeout(() => {
              if (!this.isPopupOpen() || !this.getPopup().getElement().matches(':hover')) {
                this.closePopup();
              }
            }, 200);
          });

          marker.on("click", async () => {
            setSelectedMonastery(m);
            setSelectedMonasteryId(m.name);
            await calculateRoute(m);
          });
        });

        // Make selectMonastery function available globally
        window.selectMonastery = (monasteryName) => {
          const monastery = monasteries.find(m => m.name === monasteryName);
          if (monastery) {
            setSelectedMonastery(monastery);
            setSelectedMonasteryId(monasteryName);
            calculateRoute(monastery);
          }
        };

        // Get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const coords = [pos.coords.latitude, pos.coords.longitude];
              setUserCoords(coords);
              userMarker = L.marker(coords, { icon: userIcon }).addTo(map).bindPopup("📍 You are here");
            },
            (err) => {
              console.warn("Geolocation error:", err);
              // Set default location if geolocation fails
              setUserCoords([27.3, 88.5]);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
          );

          // Watch position for updates
          navigator.geolocation.watchPosition(
            (pos) => {
              const coords = [pos.coords.latitude, pos.coords.longitude];
              setUserCoords(coords);
              if (userMarker) {
                userMarker.setLatLng(coords);
              } else {
                userMarker = L.marker(coords, { icon: userIcon }).addTo(map).bindPopup("📍 You are here");
              }
            },
            (err) => console.warn("Geolocation watch error:", err),
            { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 }
          );
        }

      } catch (error) {
        console.error("Map initialization error:", error);
        setMapError("Failed to initialize map. Please refresh the page.");
        setMapLoaded(false);
      }

    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Function to calculate route and display line
  const calculateRoute = async (monastery) => {
    if (!userCoords || !mapInstanceRef.current) return;
    
    const map = mapInstanceRef.current;
    
    // Remove existing route
    if (currentRoute && map.hasLayer(currentRoute)) {
      map.removeLayer(currentRoute);
    }

    try {
      setIsCalculating(true);
      const url = `https://router.project-osrm.org/route/v1/driving/${userCoords[1]},${userCoords[0]};${monastery.coords[1]},${monastery.coords[0]}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coords = route.geometry.coordinates.map((c) => [c[1], c[0]]);
        
        const routeLine = L.polyline(coords, { 
          color: '#007bff', 
          weight: 5, 
          opacity: 0.9
        }).addTo(map);
        
        setCurrentRoute(routeLine);
        setDistance((route.distance / 1000).toFixed(2));
        setDuration(Math.round(route.duration / 60));
        map.fitBounds(routeLine.getBounds());
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
    finally {
      setIsCalculating(false);
    }
  };

  // Handle monastery selection from search results
  const handleSelectFromSearch = (monasteryName) => {
    if (!monasteryName) return;
    const monastery = monasteries.find(m => m.name.toLowerCase() === monasteryName.toLowerCase());
    if (!monastery) return;
    setSelectedMonastery(monastery);
    setSelectedMonasteryId(monastery.name);
    setSearchQuery(monastery.name);
    setDestinationLabel(monastery.name);
    if (userCoords) {
      calculateRoute(monastery);
    }
  };

  const filteredMonasteries = searchQuery
    ? monasteries.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : monasteries;

  const openBooking = (details) => {
    setSelectedBooking(details);
    setIsPaymentModalOpen(true);
  };

  const onPaymentSuccess = () => {
    alert(`Payment successful for ${selectedBooking?.name}. Ticket booked!`);
    setIsPaymentModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <div className="monastery-map-container">
      <h2>Sikkim Monasteries Navigation Map</h2>
      
      
      <div className="map-controls">
        <div className="monastery-search-container">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              id="monastery-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="monastery-search-input"
              placeholder="Search destination by name..."
              autoComplete="off"
            />
          </div>
          {searchQuery && (
            <ul className="monastery-search-results">
              {filteredMonasteries.map((m, idx) => (
                <li key={idx} onClick={() => handleSelectFromSearch(m.name)} className="monastery-search-item">
                  <FaMapMarkerAlt className="result-icon" />
                  <span className="result-name">{m.name}</span>
                </li>
              ))}
              {filteredMonasteries.length === 0 && (
                <li className="monastery-search-item empty">No results</li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="map-layout">
        <div className="map-section">
          {mapError ? (
            <div className="map-error">
              <p>{mapError}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : (
            <div id="map" ref={mapRef} style={{ position: 'relative' }}>
              {!mapLoaded && (
                <div className="map-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading map...</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="info-section">
          <DistancePanel 
            selectedMonastery={selectedMonastery}
            userCoords={userCoords}
            distance={distance}
            duration={duration}
            isCalculating={isCalculating}
          />
          {selectedMonastery && (
            <div className="booking-actions">
              <button className="book-now-btn" onClick={() => openBooking({
                name: selectedMonastery.name,
                type: 'Monastery Visit',
                price: distance ? Math.max(100, Math.round(Number(distance) * 20)) : 100,
                date: new Date().toISOString().slice(0,10),
                duration: 'Half Day',
                location: 'Sikkim',
                description: selectedMonastery.desc
              })}>Book Now</button>
            </div>
          )}
        </div>
      </div>

      {selectedMonastery && (
        <div className="nearby-places-container">
          <h3>Nearby & Travel</h3>
          <div className="places-grid row-3">
            <div className="places-category">
              <h4>🚕 Transportation</h4>
              <div className="places-list">
                <div className="place-card">
                  <div className="place-info">
                    <h5>Local Taxi</h5>
                    <p className="place-type">Taxi</p>
                    <p className="place-price">₹{distance ? (Math.max(150, Math.round(Number(distance) * 35))) : '—'} / trip</p>
                    <div className="place-distance-info">
                      {isCalculating ? (
                        <div className="distance-loading"><div className="loading-spinner small"></div><span>Fetching estimate...</span></div>
                      ) : (
                        <>
                        <div className="distance-item"><FaRuler className="distance-icon" /><span>{distance ? `${distance} km` : '—'}</span></div>
                        <div className="distance-item"><FaClock className="distance-icon" /><span>{duration ? `${duration} min` : '—'}</span></div>
                        </>
                      )}
                    </div>
                    <div className="place-actions">
                      <button className="book-now-btn small" onClick={() => openBooking({
                        name: `Taxi to ${selectedMonastery?.name || ''}`,
                        type: 'Transportation',
                        price: distance ? Math.max(150, Math.round(Number(distance) * 35)) : 200,
                        date: new Date().toISOString().slice(0,10),
                        duration: 'Trip',
                        location: selectedMonastery?.name || 'Destination',
                        description: 'Point-to-point taxi service.'
                      })}>Book Now</button>
                    </div>
                  </div>
                </div>
                <div className="place-card">
                  <div className="place-info">
                    <h5>Shared Jeep</h5>
                    <p className="place-type">Bus/Jeep</p>
                    <p className="place-price">₹{distance ? (Math.max(50, Math.round(Number(distance) * 8))) : '—'} / seat</p>
                    <div className="place-distance-info">
                      {isCalculating ? (
                        <div className="distance-loading"><div className="loading-spinner small"></div><span>Fetching estimate...</span></div>
                      ) : (
                        <>
                        <div className="distance-item"><FaRuler className="distance-icon" /><span>{distance ? `${distance} km` : '—'}</span></div>
                        <div className="distance-item"><FaClock className="distance-icon" /><span>{duration ? `${duration} min` : '—'}</span></div>
                        </>
                      )}
                    </div>
                    <div className="place-actions">
                      <button className="book-now-btn small" onClick={() => openBooking({
                        name: `Shared Jeep to ${selectedMonastery?.name || ''}`,
                        type: 'Transportation',
                        price: distance ? Math.max(50, Math.round(Number(distance) * 8)) : 100,
                        date: new Date().toISOString().slice(0,10),
                        duration: 'Trip',
                        location: selectedMonastery?.name || 'Destination',
                        description: 'Shared jeep seat booking.'
                      })}>Book Now</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="places-category">
              <h4>🏨 Hotels & Accommodations</h4>
              <div className="places-list">
                {selectedMonastery.nearby?.hotels?.map((hotel, idx) => (
                  <NearbyPlaceCard 
                    key={idx} 
                    place={hotel} 
                    userCoords={userCoords}
                    monasteryCoords={selectedMonastery.coords}
                    onBook={() => openBooking({
                      name: hotel.name,
                      type: 'Hotel',
                      price: hotel.price || 1200,
                      date: new Date().toISOString().slice(0,10),
                      duration: '1 Night',
                      location: selectedMonastery?.name,
                      description: `${hotel.type} near ${selectedMonastery?.name}`
                    })}
                  />
                ))}
              </div>
            </div>
            
            <div className="places-category">
              <h4>🛕 Devotional Places</h4>
              <div className="places-list">
                {selectedMonastery.nearby?.devotional?.map((place, idx) => (
                  <NearbyPlaceCard 
                    key={idx} 
                    place={place} 
                    userCoords={userCoords}
                    monasteryCoords={selectedMonastery.coords}
                    onBook={() => openBooking({
                      name: place.name,
                      type: 'Devotional Visit',
                      price: place.price || 200,
                      date: new Date().toISOString().slice(0,10),
                      duration: 'Visit',
                      location: selectedMonastery?.name,
                      description: `${place.type} near ${selectedMonastery?.name}`
                    })}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => { setIsPaymentModalOpen(false); setSelectedBooking(null); }}
        bookingDetails={selectedBooking}
        onPaymentSuccess={onPaymentSuccess}
      />
    </div>
  );
};

export default Maps;