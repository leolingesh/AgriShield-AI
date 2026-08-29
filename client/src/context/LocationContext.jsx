import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('agrishield_location');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
          return parsed;
        }
      } catch (e) {}
    }
    return null;
  });

  const [mode, setMode] = useState(() => {
    return localStorage.getItem('agrishield_location_mode') || 'live';
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('prompt'); // 'prompt' | 'granted' | 'denied' | 'unavailable'
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
    if (location) {
      localStorage.setItem('agrishield_location', JSON.stringify(location));
    }
  }, [location]);

  useEffect(() => {
    localStorage.setItem('agrishield_location_mode', mode);
  }, [mode]);

  /**
   * Request live location using browser navigator.geolocation
   */
  const requestLiveLocation = useCallback(() => {
    setIsLocating(true);
    setLocationError(null);

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setPermissionStatus('unavailable');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setPermissionStatus('granted');

        try {
          // Reverse geocode via backend API
          const res = await fetch('/api/location/reverse-geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: latitude, lng: longitude })
          });
          const data = await res.json();

          if (data.success && data.location) {
            const loc = data.location;
            const newLoc = {
              state: loc.state || '',
              district: loc.district || `GPS (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`,
              village: loc.village || '',
              country: loc.country || 'India',
              lat: latitude,
              lng: longitude,
              accuracy: accuracy || null,
              isLiveGPS: true,
              source: 'gps',
              formatted: loc.formatted || `${loc.district || ''}, ${loc.state || ''}`.trim().replace(/^,|,$/g, '') || `GPS (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`
            };
            setLocation(newLoc);
            setMode('live');
          } else {
            setLocation({
              state: '',
              district: `GPS (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`,
              village: '',
              country: 'India',
              lat: latitude,
              lng: longitude,
              accuracy: accuracy || null,
              isLiveGPS: true,
              source: 'gps',
              formatted: `GPS (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`
            });
            setMode('live');
          }
        } catch (err) {
          console.warn('Reverse geocoding error:', err);
          setLocation({
            state: '',
            district: `GPS (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`,
            village: '',
            country: 'India',
            lat: latitude,
            lng: longitude,
            accuracy: accuracy || null,
            isLiveGPS: true,
            source: 'gps',
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
          setPermissionStatus('denied');
          msg = 'Location permission was denied. Please select your state & district manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setPermissionStatus('unavailable');
          msg = 'Location information is unavailable on this device.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please click below to retry or select manually.';
        }
        setLocationError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, []);

  // Request browser geolocation automatically on initial mount if in live mode
  useEffect(() => {
    if (mode === 'live') {
      requestLiveLocation();
    }
  }, [mode, requestLiveLocation]);

  /**
   * Set manual location from State and District picker
   */
  const setManualLocation = ({ state, district, village = '', lat, lng }) => {
    let finalLat = lat;
    let finalLng = lng;

    if (!finalLat || !finalLng) {
      const stateObj = availableStates.find(s => s.name === state);
      const districtObj = stateObj?.districts.find(d => d.name === district);
      if (districtObj) {
        finalLat = districtObj.lat;
        finalLng = districtObj.lng;
      } else {
        finalLat = 20.5937; // Center of India
        finalLng = 78.9629;
      }
    }

    const newLoc = {
      state: state || '',
      district: district || '',
      village: village || '',
      country: 'India',
      lat: finalLat,
      lng: finalLng,
      isLiveGPS: false,
      source: 'manual',
      formatted: [village, district, state, 'India'].filter(Boolean).join(', ')
    };

    setLocation(newLoc);
    setMode('manual');
    setLocationError(null);
  };

  /**
   * Set explicit Demo location (isolated to demo mode)
   */
  const setDemoLocation = ({ state, district, village = '', lat, lng, formatted }) => {
    setLocation({
      state,
      district,
      village,
      country: 'India',
      lat,
      lng,
      isLiveGPS: false,
      source: 'demo',
      formatted: formatted || [village, district, state, 'India'].filter(Boolean).join(', ')
    });
  };

  return (
    <LocationContext.Provider value={{
      location,
      mode,
      setMode,
      isLocating,
      locationError,
      permissionStatus,
      availableStates,
      requestLiveLocation,
      setManualLocation,
      setDemoLocation
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

export default LocationContext;
