import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from './LocationContext';

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const { location } = useLocation();
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  const fetchWeather = useCallback(async (lat, lng) => {
    if (!lat || !lng) return;
    setLoadingWeather(true);
    setWeatherError(null);

    try {
      const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      if (data.success && data.weather) {
        setWeather(data.weather);
      } else {
        throw new Error(data.message || 'Weather fetch failed');
      }
    } catch (err) {
      console.warn('Failed to fetch real-time weather:', err.message);
      setWeatherError('Weather data temporarily unavailable.');
      // Keep previous or generate graceful fallback
      if (!weather) {
        setWeather({
          temperature: 28,
          humidity: 78,
          rainfall: 4.2,
          windSpeed: 7.0,
          condition: 'Partly Cloudy',
          conditionCode: 'partly-cloudy',
          icon: 'cloud-sun',
          forecast: [
            { day: 'Today', tempMax: 31, tempMin: 22, rainProb: 40, rainfall: 4.2, condition: 'Partly Cloudy' },
            { day: 'Tomorrow', tempMax: 30, tempMin: 21, rainProb: 60, rainfall: 12.0, condition: 'Showers' },
            { day: 'Day 3', tempMax: 29, tempMin: 20, rainProb: 30, rainfall: 0.0, condition: 'Clear' }
          ]
        });
      }
    } finally {
      setLoadingWeather(false);
    }
  }, [weather]);

  useEffect(() => {
    if (location?.lat && location?.lng) {
      fetchWeather(location.lat, location.lng);
    }
  }, [location?.lat, location?.lng, fetchWeather]);

  const refreshWeather = () => {
    if (location?.lat && location?.lng) {
      fetchWeather(location.lat, location.lng);
    }
  };

  return (
    <WeatherContext.Provider value={{
      weather,
      loadingWeather,
      weatherError,
      refreshWeather
    }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used within a WeatherProvider');
  return context;
};
