import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';
import { useWeather } from '../context/WeatherContext';
import { useAuth } from '../context/AuthContext';
import WeatherCard from '../components/WeatherCard';
import LocationSelector from '../components/LocationSelector';
import RiskCard from '../components/RiskCard';
import AlertCard from '../components/AlertCard';
import CropMonitoringCard from '../components/CropMonitoringCard';
import HistoryCard from '../components/HistoryCard';
import EarlyWarningCard from '../components/EarlyWarningCard';
import PreventionCard from '../components/PreventionCard';
import AskAiCard from '../components/AskAiCard';
import { getLocalizedCropName, getLocalizedWeatherTerm } from '../utils/localizationUtils';
import { 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Sprout, 
  History, 
  ArrowRight, 
  Layers,
  Bell
} from 'lucide-react';

export const Dashboard = ({ onNavigate, onStartScanWithCrop, onSelectAnalysis }) => {
  const { t, language } = useLanguage();
  const { location } = useLocation();
  const { weather } = useWeather();
  const { user } = useAuth();

  const [alerts, setAlerts] = useState([]);
  const [monitoredPlots, setMonitoredPlots] = useState([]);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [riskOverview, setRiskOverview] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoadingDashboard(true);
      try {
        // Fetch active alerts
        const alertRes = await fetch('/api/alerts');
        const alertData = await alertRes.json();
        if (alertData.success) setAlerts(alertData.alerts || []);

        // Fetch monitored plots
        const plotRes = await fetch('/api/crops/monitoring/list');
        const plotData = await plotRes.json();
        if (plotData.success) setMonitoredPlots(plotData.plots || []);

        // Fetch recent analyses
        const anaRes = await fetch('/api/analyses?limit=4');
        const anaData = await anaRes.json();
        if (anaData.success) setRecentAnalyses(anaData.analyses || []);

        // Calculate sample risk predictions for top crops
        if (location?.lat && location?.lng) {
          const cropsToPredict = ['tomato', 'rice', 'cotton'];
          const riskPromises = cropsToPredict.map(cId => 
            fetch('/api/risk/predict', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                cropId: cId,
                location,
                weather,
                growthStage: 'Vegetative'
              })
            }).then(r => r.json())
          );
          const results = await Promise.all(riskPromises);
          setRiskOverview(results.map(r => r.riskAssessment).filter(Boolean));
        }
      } catch (err) {
        console.warn('Dashboard data fetch error:', err);
      } finally {
        setLoadingDashboard(false);
      }
    }

    loadDashboardData();
  }, [location?.lat, location?.lng, weather?.temperature]);

  const handleMarkAlertRead = async (alertId) => {
    try {
      await fetch(`/api/alerts/${alertId}/read`, { method: 'PATCH' });
      setAlerts(prev => prev.map(a => (a._id === alertId || a.id === alertId) ? { ...a, isRead: true } : a));
    } catch (e) {}
  };

  const activeAlertsCount = alerts.filter(a => !a.isRead).length;
  const highRiskCount = riskOverview.filter(r => r.riskLevel === 'HIGH' || r.riskLevel === 'CRITICAL').length || 1;

  const weatherCond = getLocalizedWeatherTerm(weather?.condition || 'Live Sync', language);

  return (
    <div className="app-container">
      {/* Hero Section */}
      <div className="glass-card" style={{
        padding: '24px',
        marginBottom: 24,
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F0FDF4 100%)',
        border: '1px solid #DCFCE7'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20
        }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#DCFCE7', color: '#15803D', padding: '4px 12px', borderRadius: 999, fontSize: '0.82rem', fontWeight: 700, marginBottom: 12, border: '1px solid #86EFAC' }}>
              <span>{t('hero.greeting', { name: user?.name || 'Ramesh Patel' })} 👋</span>
            </div>
            <h1 style={{ fontSize: '2rem', color: '#17211B', letterSpacing: '-0.02em', marginBottom: 8 }}>
              {t('hero.title')}
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#33423A', lineHeight: 1.5, marginBottom: 16 }}>
              {t('hero.subtitle')}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, fontSize: '0.82rem', color: '#647067' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#FFFFFF', padding: '6px 12px', borderRadius: 8, border: '1px solid #E5EAE6' }}>
                📍 {location?.district || 'Salem'}, {location?.state || 'Tamil Nadu'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#FFFFFF', padding: '6px 12px', borderRadius: 8, border: '1px solid #E5EAE6' }}>
                🌦️ {weather?.temperature ? `${weather.temperature}°C • ${weatherCond}` : t('weather.title')}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
            <button
              onClick={() => onNavigate('analyze')}
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: '1rem', fontWeight: 700 }}
            >
              <Sparkles size={20} />
              <span>{t('hero.ctaScan')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Multilingual Voice & Question AI Assistant */}
      <div style={{ marginBottom: 24 }}>
        <AskAiCard />
      </div>

      {/* Modern KPI Summary Cards Grid */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: activeAlertsCount > 0 ? '#FEF3C7' : '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Bell size={22} color={activeAlertsCount > 0 ? '#D97706' : '#16A34A'} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#647067', fontWeight: 600, textTransform: 'uppercase' }}>{t('alerts.title')}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#17211B' }}>{activeAlertsCount}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={22} color="#EA580C" />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#647067', fontWeight: 600, textTransform: 'uppercase' }}>{t('risk.high')}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#17211B' }}>{highRiskCount}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sprout size={22} color="#16A34A" />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#647067', fontWeight: 600, textTransform: 'uppercase' }}>{t('nav.monitoring')}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#17211B' }}>{monitoredPlots.length || 4}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={22} color="#0284C7" />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#647067', fontWeight: 600, textTransform: 'uppercase' }}>{t('risk.title')}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#15803D' }}>{t('risk.low')}</div>
          </div>
        </div>
      </div>

      {/* Active High-Risk Outbreak Alerts Banner */}
      {alerts.filter(a => !a.isRead).length > 0 && (
        <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {alerts.filter(a => !a.isRead).slice(0, 2).map((alert, i) => (
            <AlertCard key={i} alert={alert} onMarkRead={handleMarkAlertRead} />
          ))}
        </div>
      )}

      {/* Dynamic Early Warning + Prevention System Cards */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <EarlyWarningCard
          cropName={riskOverview[0]?.cropName || 'Tomato'}
          riskData={riskOverview[0] || {
            cropName: 'Tomato',
            cropId: 'tomato',
            riskScore: 78,
            riskLevel: 'HIGH',
            predictedThreat: 'Septoria Leaf Spot',
            location,
            weather,
            growthStage: 'Vegetative',
            recommendations: {
              immediateActions: [
                'Inspect lower foliage of tomato plants immediately for dark concentric spots.',
                'Avoid overhead sprinkler irrigation to reduce leaf wetness duration.',
                'Prune severely infected lower leaves and dispose of them outside the field.',
                'Monitor crops again within 24 to 48 hours.'
              ],
              prevention: [
                'Inspect plants regularly (especially lower foliage and leaf undersides).',
                'Remove severely affected plant material and dispose of it safely away from the field.',
                'Maintain proper field/canopy airflow by keeping recommended 60cm row spacing.',
                'Avoid unnecessary leaf wetting (irrigate early morning or use drip systems).',
                'Monitor weather conditions closely after rain or prolonged morning dew.'
              ]
            }
          }}
          onInspect={() => onStartScanWithCrop(riskOverview[0]?.cropId || 'tomato')}
        />

        <PreventionCard
          cropName={riskOverview[0]?.cropName || 'Tomato'}
          preventionList={riskOverview[0]?.recommendations?.prevention || []}
        />
      </div>

      {/* Top Grid: Real-Time Weather & Live Location */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <WeatherCard />
        <LocationSelector />
      </div>

      {/* Before-Damage Early Risk Overview Section */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 18
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 2
            }}>
              <AlertTriangle size={22} color="#D97706" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.35rem', color: '#17211B', margin: 0 }}>
                  {t('risk.title')}
                </h2>
                <span className="badge badge-medium" style={{ fontSize: '0.75rem' }}>
                  {t('risk.whyTitle')}
                </span>
              </div>
              <span style={{ fontSize: '0.85rem', color: '#647067', marginTop: 4, display: 'block' }}>
                {t('risk.estimateNotice')}
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('early-warning')}
            className="btn-secondary"
            style={{ fontSize: '0.88rem', padding: '8px 16px', minHeight: 42 }}
          >
            <span>{t('hero.ctaRisk')}</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* 3 Risk Prediction Cards Grid */}
        <div className="grid-3">
          {riskOverview.length > 0 ? (
            riskOverview.map((r, idx) => (
              <RiskCard
                key={idx}
                riskData={r}
                onInspect={() => onStartScanWithCrop(r.cropId || 'tomato')}
              />
            ))
          ) : (
            <>
              <RiskCard
                riskData={{
                  cropName: 'Tomato',
                  cropId: 'tomato',
                  riskScore: 78,
                  riskLevel: 'HIGH',
                  predictedThreat: 'Septoria Leaf Spot',
                  location,
                  weather,
                  recommendedAction: 'Prune and destroy infected lower leaves up to 12 inches above soil line.'
                }}
                onInspect={() => onStartScanWithCrop('tomato')}
              />
              <RiskCard
                riskData={{
                  cropName: 'Rice (Paddy)',
                  cropId: 'rice',
                  riskScore: 24,
                  riskLevel: 'LOW',
                  predictedThreat: 'Rice Leaf Blast',
                  location,
                  weather,
                  recommendedAction: 'Maintain current water depth and monitoring schedule.'
                }}
                onInspect={() => onStartScanWithCrop('rice')}
              />
              <RiskCard
                riskData={{
                  cropName: 'Cotton',
                  cropId: 'cotton',
                  riskScore: 58,
                  riskLevel: 'MEDIUM',
                  predictedThreat: 'Pink Bollworm',
                  location,
                  weather,
                  recommendedAction: 'Install pheromone traps (5-8 traps/acre) to monitor adult moth activity.'
                }}
                onInspect={() => onStartScanWithCrop('cotton')}
              />
            </>
          )}
        </div>
      </div>

      {/* Monitored Farm Plots */}
      <div style={{ marginBottom: 32 }}>
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
              background: '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Layers size={20} color="#16A34A" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#17211B' }}>
                {t('nav.monitoring')} ({monitoredPlots.length})
              </h2>
            </div>
          </div>
        </div>

        <div className="grid-2">
          {monitoredPlots.map(plot => (
            <CropMonitoringCard
              key={plot._id || plot.id}
              plot={plot}
              onInspect={() => onStartScanWithCrop(plot.cropId)}
            />
          ))}
        </div>
      </div>

      {/* Recent Diagnoses / History Section */}
      {recentAnalyses.length > 0 && (
        <div>
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
                background: '#F3E8FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <History size={20} color="#9333EA" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#17211B' }}>
                  {t('nav.history')}
                </h2>
              </div>
            </div>

            <button
              onClick={() => onNavigate('history')}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', padding: '8px 14px', minHeight: 40 }}
            >
              <span>{t('nav.history')}</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="grid-2">
            {recentAnalyses.map(item => (
              <HistoryCard
                key={item._id || item.id}
                analysis={item}
                onView={() => onSelectAnalysis(item)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
