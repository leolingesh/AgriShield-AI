import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';
import { useWeather } from '../context/WeatherContext';
import RiskGauge from '../components/RiskGauge';
import ExplainableWhy from '../components/ExplainableWhy';
import AlertCard from '../components/AlertCard';
import {
  getLocalizedCropName,
  getLocalizedDiseaseName,
  getLocalizedGrowthStage,
  validateLanguageOutput
} from '../utils/localizationUtils';
import { 
  AlertTriangle, 
  Sliders, 
  Thermometer, 
  Droplets, 
  CloudRain
} from 'lucide-react';

export const EarlyWarningPage = ({ onStartScanWithCrop }) => {
  const { t, language } = useLanguage();
  const { location } = useLocation();
  const { weather } = useWeather();

  // Interactive Outbreak Simulator State (for judge & farmer demonstration)
  const [simCropId, setSimCropId] = useState('tomato');
  const [simTemp, setSimTemp] = useState(weather?.temperature || 28);
  const [simHumidity, setSimHumidity] = useState(weather?.humidity || 84);
  const [simRain, setSimRain] = useState(weather?.rainfall || 14);
  const [simulatedRisk, setSimulatedRisk] = useState(null);

  const [regionalAlerts, setRegionalAlerts] = useState([]);

  useEffect(() => {
    // Fetch active advisories
    fetch('/api/alerts')
      .then(r => r.json())
      .then(d => {
        if (d.success) setRegionalAlerts(d.alerts || []);
      })
      .catch(() => {});
  }, []);

  // Recalculate simulated risk whenever sliders change
  useEffect(() => {
    async function runSimulation() {
      try {
        const res = await fetch('/api/risk/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cropId: simCropId,
            location,
            weather: {
              temperature: Number(simTemp),
              humidity: Number(simHumidity),
              rainfall: Number(simRain),
              windSpeed: 6.5
            },
            growthStage: 'Flowering'
          })
        });
        const data = await res.json();
        if (data.success && data.riskAssessment) {
          setSimulatedRisk(data.riskAssessment);
        }
      } catch (err) {
        console.warn('Simulation error:', err);
      }
    }

    runSimulation();
  }, [simCropId, simTemp, simHumidity, simRain, location]);

  const simCropLocalized = getLocalizedCropName(simCropId, language);
  const simStageLocalized = getLocalizedGrowthStage('Flowering', language);

  return (
    <div className="app-container">
      {/* Title */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#D97706', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
          <AlertTriangle size={18} />
          <span>{t('earlyWarning.predictiveTitle')}</span>
        </div>
        <h1 style={{ fontSize: '1.9rem', color: '#17211B', letterSpacing: '-0.02em', marginBottom: 6 }}>
          {t('nav.earlyWarning')} & {t('earlyWarning.simulatorTitle')}
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#647067', maxWidth: 700 }}>
          {t('earlyWarning.simulatorDescription')}
        </p>
      </div>

      {/* Outbreak Risk Interactive Simulator */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: 30, border: '1px solid #FDE68A', background: '#FFFFFF' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sliders size={20} color="#D97706" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#17211B' }}>
                {t('earlyWarning.simulatorTitle')}
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#B45309', fontWeight: 600 }}>
                {t('earlyWarning.adjustWeatherNotice')}
              </span>
            </div>
          </div>

          {/* Crop Selector for Simulation */}
          <select
            value={simCropId}
            onChange={(e) => setSimCropId(e.target.value)}
            className="input-field"
            style={{ width: 'auto', minWidth: 160, padding: '8px 12px', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            <option value="tomato">🍅 {getLocalizedCropName('tomato', language)}</option>
            <option value="rice">🌾 {getLocalizedCropName('rice', language)}</option>
            <option value="cotton">🌱 {getLocalizedCropName('cotton', language)}</option>
            <option value="wheat">🌾 {getLocalizedCropName('wheat', language)}</option>
            <option value="potato">🥔 {getLocalizedCropName('potato', language)}</option>
            <option value="chilli">🌶️ {getLocalizedCropName('chilli', language)}</option>
          </select>
        </div>

        {/* Sliders & Dynamic Risk Output */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          alignItems: 'center'
        }}>
          {/* Sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Humidity Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                <span style={{ color: '#17211B', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                  <Droplets size={16} color="#0284C7" /> {t('weather.humidity')}
                </span>
                <strong style={{ color: simHumidity >= 80 ? '#DC2626' : '#15803D' }}>{simHumidity}%</strong>
              </div>
              <input
                type="range"
                min="30"
                max="98"
                value={simHumidity}
                onChange={(e) => setSimHumidity(e.target.value)}
                style={{ width: '100%', accentColor: '#16A34A' }}
              />
            </div>

            {/* Temperature Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                <span style={{ color: '#17211B', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                  <Thermometer size={16} color="#D97706" /> {t('weather.temp')}
                </span>
                <strong style={{ color: '#17211B' }}>{simTemp}°C</strong>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                value={simTemp}
                onChange={(e) => setSimTemp(e.target.value)}
                style={{ width: '100%', accentColor: '#F59E0B' }}
              />
            </div>

            {/* Rainfall Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                <span style={{ color: '#17211B', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                  <CloudRain size={16} color="#2563EB" /> {t('weather.rainfall')}
                </span>
                <strong style={{ color: '#17211B' }}>{simRain} mm</strong>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={simRain}
                onChange={(e) => setSimRain(e.target.value)}
                style={{ width: '100%', accentColor: '#2563EB' }}
              />
            </div>
          </div>

          {/* Dynamic Result Gauge */}
          {simulatedRisk && (
            <div style={{
              background: '#F7F9F7',
              border: '1px solid #E5EAE6',
              borderRadius: 16,
              padding: '20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <RiskGauge
                score={simulatedRisk.riskScore}
                level={simulatedRisk.riskLevel}
                size={105}
              />
              <h4 style={{ fontSize: '1.05rem', color: '#17211B', marginTop: 10 }}>
                {validateLanguageOutput(
                  getLocalizedDiseaseName(simulatedRisk.predictedThreat, language),
                  language,
                  'EarlyWarningPage.simThreat'
                )}
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#647067', marginTop: 4 }}>
                {t('earlyWarning.simulatedFor', { crop: simCropLocalized, stage: simStageLocalized })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Explainable Factor Breakdown for Current Simulation */}
      {simulatedRisk && (
        <div style={{ marginBottom: 30 }}>
          <ExplainableWhy riskAssessment={simulatedRisk} />
        </div>
      )}

      {/* Active Regional High-Risk Advisories */}
      <div>
        <h2 style={{ fontSize: '1.3rem', color: '#17211B', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={20} color="#DC2626" /> {t('alerts.title')} ({regionalAlerts.length})
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {regionalAlerts.map(alert => (
            <AlertCard key={alert._id || alert.id} alert={alert} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EarlyWarningPage;
