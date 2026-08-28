import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('agrishield_location');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      state: 'Tamil Nadu',
      district: 'Salem',
      village: 'Attur',
      lat: 11.5977,
      lng: 78.5986,
      isLiveGPS: false,
      formatted: 'Salem, Tamil Nadu, India'
    };
  });

  const [mode, setMode] = useState('live'); // 'live' or 'manual'
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [availableStates, setAvailableStates] = useState([]);

  // Fetch available Indian states on mount
  useEffect(() => {
    fetch('/api/location/states')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.states) {
          setAvailableStates(data.states);
        }
      })
      .catch(err => console.warn('Failed to load state list:', err));
  }, []);

  // Save location updates to localStorage
  useEffect(() => {
    localStorage.setItem('agrishield_location', JSON.stringify(location));
  }, [location]);

  /**
   * Request live location using browser navigator.geolocation
   */
  const requestLiveLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Call backend reverse geocode API
          const res = await fetch('/api/location/reverse-geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: latitude, lng: longitude })
          });
          const data = await res.json();

          if (data.success && data.location) {
            setLocation({
              state: data.location.state || 'Tamil Nadu',
              district: data.location.district || 'Salem',
              village: data.location.village || '',
              lat: latitude,
              lng: longitude,
              isLiveGPS: true,
              formatted: data.location.formatted || `${data.location.district}, ${data.location.state}`
            });
            setMode('live');
          } else {
            setLocation({
              state: 'Tamil Nadu',
              district: 'Salem',
              village: '',
              lat: latitude,
              lng: longitude,
              isLiveGPS: true,
              formatted: `Lat: ${latitude.toFixed(3)}, Lng: ${longitude.toFixed(3)}`
            });
            setMode('live');
          }
        } catch (err) {
          console.warn('Reverse geocoding error:', err);
          setLocation({
            state: 'Tamil Nadu',
            district: 'Salem',
            village: '',
            lat: latitude,
            lng: longitude,
            isLiveGPS: true,
            formatted: `GPS (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`
          });
          setMode('live');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Unable to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. You can select your state & district manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is unavailable on this device.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please try again or enter location manually.';
        }
        setLocationError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  /**
   * Set manual location from State and District picker
   */
  const setManualLocation = ({ state, district, village = '', lat, lng }) => {
    let finalLat = lat;
    let finalLng = lng;

    // Lookup centroid if coordinates not provided
    if (!finalLat || !finalLng) {
      const stateObj = availableStates.find(s => s.name === state);
      const districtObj = stateObj?.districts.find(d => d.name === district);
      if (districtObj) {
        finalLat = districtObj.lat;
        finalLng = districtObj.lng;
      } else {
        finalLat = 11.6643;
        finalLng = 78.1460;
      }
    }

    setLocation({
      state,
      district,
      village,
      lat: finalLat,
      lng: finalLng,
      isLiveGPS: false,
      formatted: [village, district, state, 'India'].filter(Boolean).join(', ')
    });
    setMode('manual');
    setLocationError(null);
  };

  return (
    <LocationContext.Provider value={{
      location,
      mode,
      setMode,
      isLocating,
      locationError,
      availableStates,
      requestLiveLocation,
      setManualLocation
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within a LocationProvider');
  return context;
};
