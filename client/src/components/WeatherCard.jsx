import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { useLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  CloudRain, 
  Sun, 
  Cloud, 
  CloudLightning, 
  RefreshCw,
  AlertTriangle,
  Calendar
} from 'lucide-react';

export const WeatherCard = () => {
  const { weather, loadingWeather, refreshWeather } = useWeather();
  const { location } = useLocation();
  const { t } = useLanguage();

  if (!weather) {
    return (
      <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
        <RefreshCw size={24} className="spin" style={{ color: '#16A34A', margin: '0 auto 12px auto' }} />
        <p style={{ color: '#647067' }}>{t('weather.title')}...</p>
      </div>
    );
  }

  const isFungalHighRisk = weather.humidity >= 80 || weather.rainfall > 8;

  // Icon mapping
  const renderWeatherIcon = (code, size = 36) => {
    switch (code) {
      case 'clear':
        return <Sun size={size} color="#D97706" />;
      case 'rain':
      case 'heavy-rain':
      case 'drizzle':
        return <CloudRain size={size} color="#2563EB" />;
      case 'thunderstorm':
        return <CloudLightning size={size} color="#DC2626" />;
      case 'partly-cloudy':
        return <CloudSun size={size} color="#0284C7" />;
      default:
        return <Cloud size={size} color="#647067" />;
    }
  };

  return (
    <div className="glass-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: '#E0F2FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {renderWeatherIcon(weather.conditionCode, 20)}
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#17211B' }}>{t('weather.title')}</h3>
            <span style={{ fontSize: '0.78rem', color: '#647067' }}>
              📍 {location?.formatted || 'Salem, Tamil Nadu'}
            </span>
          </div>
        </div>

        <button
          onClick={refreshWeather}
          disabled={loadingWeather}
          title="Refresh Live Weather"
          style={{
            padding: 7,
            borderRadius: 8,
            background: '#F1F5F2',
            border: '1px solid #E5EAE6',
            color: '#16A34A',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={15} className={loadingWeather ? 'spin' : ''} />
        </button>
      </div>

      {/* Primary Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 10,
        marginBottom: 16
      }}>
        {/* Temperature Card */}
        <div style={{
          background: '#F7F9F7',
          border: '1px solid #E5EAE6',
          borderRadius: 10,
          padding: '12px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: '#FEF3C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sun size={16} color="#D97706" />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#647067', textTransform: 'uppercase', fontWeight: 600 }}>
              {t('weather.temp')}
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#17211B' }}>
              {weather.temperature}°C
            </div>
            <div style={{ fontSize: '0.68rem', color: '#647067' }}>
              {t('weather.temp')} {weather.feelsLike || weather.temperature}°C
            </div>
          </div>
        </div>

        {/* Humidity Card */}
        <div style={{
          background: weather.humidity >= 80 ? '#FEE2E2' : '#F7F9F7',
          border: weather.humidity >= 80 ? '1px solid #FCA5A5' : '1px solid #E5EAE6',
          borderRadius: 10,
          padding: '12px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: weather.humidity >= 80 ? '#FCA5A5' : '#E0F2FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Droplets size={16} color={weather.humidity >= 80 ? '#991B1B' : '#0284C7'} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#647067', textTransform: 'uppercase', fontWeight: 600 }}>
              {t('weather.humidity')}
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: weather.humidity >= 80 ? '#991B1B' : '#17211B' }}>
              {weather.humidity}%
            </div>
            <div style={{ fontSize: '0.68rem', color: weather.humidity >= 80 ? '#DC2626' : '#15803D', fontWeight: 600 }}>
              {weather.humidity >= 80 ? t('risk.high') : t('risk.low')}
            </div>
          </div>
        </div>

        {/* Rainfall Card */}
        <div style={{
          background: '#F7F9F7',
          border: '1px solid #E5EAE6',
          borderRadius: 10,
          padding: '12px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: '#DBEAFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <CloudRain size={16} color="#2563EB" />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#647067', textTransform: 'uppercase', fontWeight: 600 }}>
              {t('weather.rainfall')}
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#17211B' }}>
              {weather.rainfall} <span style={{ fontSize: '0.8rem' }}>mm</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#647067' }}>
              {weather.condition || t('weather.title')}
            </div>
          </div>
        </div>

        {/* Wind Speed Card */}
        <div style={{
          background: '#F7F9F7',
          border: '1px solid #E5EAE6',
          borderRadius: 10,
          padding: '12px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: '#F3E8FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Wind size={16} color="#9333EA" />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#647067', textTransform: 'uppercase', fontWeight: 600 }}>
              {t('weather.wind')}
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#17211B' }}>
              {weather.windSpeed} <span style={{ fontSize: '0.8rem' }}>km/h</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#647067' }}>
              {t('weather.pressure')}
            </div>
          </div>
        </div>
      </div>

      {/* High Moisture Fungal Outbreak Alert */}
      {isFungalHighRisk && (
        <div style={{
          background: '#FEE2E2',
          border: '1px solid #FCA5A5',
          borderRadius: 8,
          padding: '9px 12px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: '0.8rem',
          color: '#991B1B'
        }}>
          <AlertTriangle size={16} color="#DC2626" style={{ flexShrink: 0 }} />
          <span>{t('weather.highRiskAlert')}</span>
        </div>
      )}

      {/* 5-Day Agricultural Forecast Bar */}
      {weather.forecast && weather.forecast.length > 0 && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#15803D',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            marginBottom: 8
          }}>
            <Calendar size={13} />
            {t('weather.forecast')}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(58px, 1fr))',
            gap: 6,
            overflowX: 'auto'
          }}>
            {weather.forecast.map((f, i) => (
              <div
                key={i}
                style={{
                  background: i === 0 ? '#DCFCE7' : '#F7F9F7',
                  border: i === 0 ? '1px solid #86EFAC' : '1px solid #E5EAE6',
                  borderRadius: 8,
                  padding: '8px 4px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: i === 0 ? '#15803D' : '#647067', marginBottom: 2 }}>
                  {f.day}
                </div>
                <div style={{ margin: '2px 0' }}>
                  {renderWeatherIcon(f.category || 'clear', 16)}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#17211B' }}>
                  {f.tempMax}°
                </div>
                <div style={{ fontSize: '0.68rem', color: '#647067' }}>
                  {f.tempMin}°
                </div>
                {f.rainProb > 20 && (
                  <div style={{ fontSize: '0.62rem', color: '#2563EB', fontWeight: 600, marginTop: 2 }}>
                    💧{f.rainProb}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
