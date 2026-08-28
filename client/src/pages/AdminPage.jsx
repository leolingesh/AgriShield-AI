import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Activity, Cpu, Database, CloudSun, CheckCircle2, RefreshCw } from 'lucide-react';

export const AdminPage = () => {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/metrics');
      const data = await res.json();
      if (data.success && data.metrics) {
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.warn('Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="app-container">
      {/* Title */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 24
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16A34A', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
            <Shield size={18} />
            <span>Smart India Hackathon Administration</span>
          </div>
          <h1 style={{ fontSize: '1.9rem', color: '#17211B', letterSpacing: '-0.02em', marginBottom: 4 }}>
            System Health & Outbreak Analytics
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#647067' }}>
            System-wide telemetry, crop risk aggregations, and real-time backend API service health.
          </p>
        </div>

        <button
          onClick={fetchMetrics}
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh Metrics
        </button>
      </div>

      {metrics && (
        <>
          {/* Top 4 Metrics Tiles */}
          <div className="grid-4" style={{ marginBottom: 24 }}>
            <div className="glass-card" style={{ padding: '18px' }}>
              <span style={{ fontSize: '0.78rem', color: '#647067', textTransform: 'uppercase', fontWeight: 600 }}>Total Analyses</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#17211B', marginTop: 4 }}>
                {metrics.totalAnalyses}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 600 }}>Dual-engine evaluations</span>
            </div>

            <div className="glass-card" style={{ padding: '18px' }}>
              <span style={{ fontSize: '0.78rem', color: '#647067', textTransform: 'uppercase', fontWeight: 600 }}>Active Network Farmers</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#17211B', marginTop: 4 }}>
                {metrics.activeFarmers}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#0284C7', fontWeight: 600 }}>Pilot agricultural blocks</span>
            </div>

            <div className="glass-card" style={{ padding: '18px' }}>
              <span style={{ fontSize: '0.78rem', color: '#647067', textTransform: 'uppercase', fontWeight: 600 }}>Monitored Farm Plots</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#17211B', marginTop: 4 }}>
                {metrics.activePlotsTracked}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 600 }}>Real-time phenology tracking</span>
            </div>

            <div className="glass-card" style={{ padding: '18px' }}>
              <span style={{ fontSize: '0.78rem', color: '#647067', textTransform: 'uppercase', fontWeight: 600 }}>Active Outbreak Advisories</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#DC2626', marginTop: 4 }}>
                {metrics.activeAlerts}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 600 }}>Early warning triggers</span>
            </div>
          </div>

          {/* 2-Column: Risk Distribution & Top Issues */}
          <div className="grid-2" style={{ marginBottom: 24 }}>
            {/* Risk Distribution Card */}
            <div className="glass-card" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#17211B', marginBottom: 16 }}>
                Risk Severity Breakdown
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                    <span style={{ color: '#15803D', fontWeight: 600 }}>🟢 {t('risk.low')} (0-30%)</span>
                    <strong style={{ color: '#17211B' }}>{metrics.riskDistribution.LOW}</strong>
                  </div>
                  <div style={{ width: '100%', height: 8, background: '#E5EAE6', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${(metrics.riskDistribution.LOW / (metrics.totalAnalyses || 1)) * 100}%`, height: '100%', background: '#16A34A' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                    <span style={{ color: '#B45309', fontWeight: 600 }}>🟡 {t('risk.medium')} (31-60%)</span>
                    <strong style={{ color: '#17211B' }}>{metrics.riskDistribution.MEDIUM}</strong>
                  </div>
                  <div style={{ width: '100%', height: 8, background: '#E5EAE6', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${(metrics.riskDistribution.MEDIUM / (metrics.totalAnalyses || 1)) * 100}%`, height: '100%', background: '#F59E0B' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                    <span style={{ color: '#C2410C', fontWeight: 600 }}>🟠 {t('risk.high')} (61-80%)</span>
                    <strong style={{ color: '#17211B' }}>{metrics.riskDistribution.HIGH}</strong>
                  </div>
                  <div style={{ width: '100%', height: 8, background: '#E5EAE6', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${(metrics.riskDistribution.HIGH / (metrics.totalAnalyses || 1)) * 100}%`, height: '100%', background: '#EA580C' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                    <span style={{ color: '#B91C1C', fontWeight: 600 }}>🔴 {t('risk.critical')} (81-100%)</span>
                    <strong style={{ color: '#17211B' }}>{metrics.riskDistribution.CRITICAL}</strong>
                  </div>
                  <div style={{ width: '100%', height: 8, background: '#E5EAE6', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${(metrics.riskDistribution.CRITICAL / (metrics.totalAnalyses || 1)) * 100}%`, height: '100%', background: '#DC2626' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Detected Issues */}
            <div className="glass-card" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#17211B', marginBottom: 16 }}>
                Commonly Identified Conditions & Pests
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {metrics.topIssues.map((issue, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: '#F7F9F7',
                      border: '1px solid #E5EAE6',
                      borderRadius: 10,
                      fontSize: '0.85rem'
                    }}
                  >
                    <span style={{ color: '#17211B', fontWeight: 600 }}>{issue.name}</span>
                    <span style={{ background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                      {issue.count} cases
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PyTorch Model Telemetry */}
          {metrics.modelStatus && (
            <div className="glass-card" style={{ padding: '22px', marginBottom: 24, border: '1px solid #BBF7D0' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#17211B', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Cpu size={18} color="#16A34A" /> Dedicated PyTorch Vision Model Telemetry
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', padding: '14px', borderRadius: 10 }}>
                  <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>Architecture</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#15803D', marginTop: 2 }}>
                    {metrics.modelStatus.architecture || 'MobileNetV3'}
                  </div>
                </div>

                <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', padding: '14px', borderRadius: 10 }}>
                  <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>Test Accuracy</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803D', marginTop: 2 }}>
                    {Math.round((metrics.modelStatus.testAccuracy || 0.8333) * 10000) / 100}%
                  </div>
                </div>

                <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', padding: '14px', borderRadius: 10 }}>
                  <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>Macro Precision</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803D', marginTop: 2 }}>
                    {Math.round((metrics.modelStatus.macroPrecision || 0.75) * 10000) / 100}%
                  </div>
                </div>

                <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', padding: '14px', borderRadius: 10 }}>
                  <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>Macro F1 Score</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803D', marginTop: 2 }}>
                    {Math.round((metrics.modelStatus.macroF1 || 0.7778) * 10000) / 100}%
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 14, fontSize: '0.8rem', color: '#4B5563', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span><strong>Supported Crops:</strong> 🍅 Tomato, 🌾 Rice, 🌾 Wheat</span>
                <span><strong>Verified Class Taxonomies:</strong> {metrics.modelStatus.numClasses || 6} classes</span>
                <span><strong>Confidence Threshold:</strong> {metrics.modelStatus.confidenceThreshold || 0.60}</span>
              </div>
            </div>
          )}

          {/* Backend API Service Health Status */}
          <div className="glass-card" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#17211B', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={18} color="#16A34A" /> Real-Time Backend API Health Checks
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 14
            }}>
              <div style={{ background: '#F7F9F7', border: '1px solid #E5EAE6', padding: '12px 14px', borderRadius: 10 }}>
                <div style={{ fontSize: '0.75rem', color: '#647067', marginBottom: 4, fontWeight: 600 }}>Database Engine</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803D', fontSize: '0.88rem', fontWeight: 700 }}>
                  <CheckCircle2 size={16} /> {metrics.systemHealth.database}
                </div>
              </div>

              <div style={{ background: '#F7F9F7', border: '1px solid #E5EAE6', padding: '12px 14px', borderRadius: 10 }}>
                <div style={{ fontSize: '0.75rem', color: '#647067', marginBottom: 4, fontWeight: 600 }}>Weather Provider</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0284C7', fontSize: '0.88rem', fontWeight: 700 }}>
                  <CloudSun size={16} /> {metrics.systemHealth.weatherProvider}
                </div>
              </div>

              <div style={{ background: '#F7F9F7', border: '1px solid #E5EAE6', padding: '12px 14px', borderRadius: 10 }}>
                <div style={{ fontSize: '0.75rem', color: '#647067', marginBottom: 4, fontWeight: 600 }}>AI Multimodal Service</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#B45309', fontSize: '0.88rem', fontWeight: 700 }}>
                  <Cpu size={16} /> {metrics.systemHealth.aiProvider}
                </div>
              </div>

              <div style={{ background: '#F7F9F7', border: '1px solid #E5EAE6', padding: '12px 14px', borderRadius: 10 }}>
                <div style={{ fontSize: '0.75rem', color: '#647067', marginBottom: 4, fontWeight: 600 }}>Backend Service</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803D', fontSize: '0.88rem', fontWeight: 700 }}>
                  <CheckCircle2 size={16} color="#16A34A" /> Online (Uptime {metrics.systemHealth.serverUptime}s)
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPage;
