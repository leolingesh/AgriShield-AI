import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from './LocationContext';

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const { location, isLocating } = useLocation();
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  const fetchWeather = useCallback(async (lat, lng) => {
    if (lat === undefined || lng === undefined || lat === null || lng === null) return;
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
      // Graceful fallback for offline / disconnected states
      if (!weather) {
        setWeather({
          temperature: 28,
          humidity: 65,
          rainfall: 0.0,
          windSpeed: 8.0,
          condition: 'Partly Cloudy',
          conditionCode: 'partly-cloudy',
          icon: 'cloud-sun',
          forecast: [
            { day: 'Today', tempMax: 30, tempMin: 22, rainProb: 20, rainfall: 0.0, condition: 'Partly Cloudy', category: 'partly-cloudy' },
            { day: 'Tomorrow', tempMax: 31, tempMin: 23, rainProb: 30, rainfall: 2.0, condition: 'Showers', category: 'rain' },
            { day: 'Day 3', tempMax: 29, tempMin: 21, rainProb: 15, rainfall: 0.0, condition: 'Clear', category: 'clear' },
            { day: 'Day 4', tempMax: 30, tempMin: 22, rainProb: 10, rainfall: 0.0, condition: 'Sunny', category: 'clear' },
            { day: 'Day 5', tempMax: 28, tempMin: 20, rainProb: 40, rainfall: 4.0, condition: 'Cloudy', category: 'cloudy' }
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
      loadingWeather: loadingWeather || isLocating,
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

export default WeatherContext;
