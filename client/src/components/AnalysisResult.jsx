import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import RiskGauge from './RiskGauge';
import ExplainableWhy from './ExplainableWhy';
import RecommendationCard from './RecommendationCard';
import ReadAloudButton from './ReadAloudButton';
import { 
  AlertTriangle, 
  Sparkles, 
  FileText, 
  Droplets
} from 'lucide-react';

export const AnalysisResult = ({ analysis, onNewScan }) => {
  const { t } = useLanguage();

  if (!analysis) return null;

  const ai = analysis.aiAnalysis || {};
  const risk = analysis.riskAssessment || {};
  const recs = analysis.recommendations || {};
  const location = analysis.location || {};

  // Render Low Confidence / Unsupported Image Alert
  if (ai.supported === false || ai.condition === 'unsupported_or_low_confidence') {
    return (
      <div className="glass-card" style={{ padding: '32px', textAlign: 'center', border: '1.5px solid #F59E0B' }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#FEF3C7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <AlertTriangle size={28} color="#D97706" />
        </div>
        <h3 style={{ fontSize: '1.25rem', color: '#92400E', marginBottom: 8, fontWeight: 700 }}>
          Unsupported Image or Low Confidence Prediction
        </h3>
        <p style={{ color: '#4B5563', maxWidth: 520, margin: '0 auto 20px', lineHeight: 1.6, fontSize: '0.92rem' }}>
          {ai.message || 'Unable to confidently identify the crop condition. AgriShield PyTorch AI is trained specifically on authentic leaf images of Tomato, Rice, and Wheat.'}
        </p>
        <div style={{ background: '#FFFBEB', padding: '14px 18px', borderRadius: 10, maxWidth: 500, margin: '0 auto 24px', textAlign: 'left' }}>
          <p style={{ fontSize: '0.82rem', color: '#92400E', fontWeight: 600, marginBottom: 6 }}>
            Recommended Steps:
          </p>
          <ul style={{ fontSize: '0.82rem', color: '#78350F', paddingLeft: 18, margin: 0 }}>
            <li>Ensure the image is a close-up, clear photo of a Tomato 🍅, Rice 🌾, or Wheat 🌾 leaf.</li>
            <li>Avoid uploading non-crop photos (car, face, animal, general scenery).</li>
            <li>Provide adequate lighting and avoid extreme blur or shadowing.</li>
          </ul>
        </div>
        <button className="btn-primary" onClick={onNewScan}>
          {t('analyze.startNew')}
        </button>
      </div>
    );
  }

  const getSeverityBadge = (sev = '') => {
    const s = sev.toLowerCase();
    if (s === 'severe' || s === 'critical') return <span className="badge badge-critical">{t('risk.critical')}</span>;
    if (s === 'high') return <span className="badge badge-high">{t('risk.high')}</span>;
    if (s === 'moderate' || s === 'medium') return <span className="badge badge-medium">{t('risk.medium')}</span>;
    return <span className="badge badge-low">{t('risk.low')}</span>;
  };

  const getConfidenceBadge = (conf = 0.85) => {
    if (conf >= 0.88) return <span className="badge badge-low">{t('result.confidence')} ({Math.round(conf * 100)}%)</span>;
    if (conf >= 0.65) return <span className="badge badge-medium">{t('result.confidence')} ({Math.round(conf * 100)}%)</span>;
    return <span className="badge badge-critical">{t('result.expertNotice')} ({Math.round(conf * 100)}%)</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Banner with Diagnosis & Read Aloud Header */}
      <div className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 20
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <span className="badge badge-low">
                🌾 {analysis.cropName || 'Crop'}
              </span>
              {analysis.isDemoMode && (
                <span className="badge badge-medium">
                  {t('nav.demo')}
                </span>
              )}
              <span style={{ fontSize: '0.8rem', color: '#647067' }}>
                📍 {location.district || 'Salem'}, {location.state || 'Tamil Nadu'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.7rem', color: '#17211B', letterSpacing: '-0.02em' }}>
              {ai.condition || 'General Leaf Discoloration'}
            </h2>
            {ai.pathogen && (
              <p style={{ fontSize: '0.9rem', color: '#0284C7', fontStyle: 'italic', marginTop: 2 }}>
                {t('result.pathogen')}: {ai.pathogen}
              </p>
            )}
          </div>

          {/* Read Aloud Accessible Button */}
          <ReadAloudButton
            analysisRecord={analysis}
            cropName={analysis.cropName}
            condition={ai.condition}
            riskLevel={risk.riskLevel}
            riskScore={risk.riskScore}
            whyText={risk.whyRiskExists}
            recommendations={recs.immediateActions}
          />
        </div>

        {/* 2-Column Overview (Image & Diagnostics + Risk Gauge) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
          alignItems: 'center'
        }}>
          {/* Left Column: Image Snapshot & Severity */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {analysis.imageUrl && (
              <div style={{
                width: 140,
                height: 140,
                borderRadius: 14,
                overflow: 'hidden',
                border: '1px solid #E5EAE6',
                flexShrink: 0,
                background: '#F7F9F7'
              }}>
                <img
                  src={analysis.imageUrl}
                  alt={analysis.cropName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#647067', display: 'block', fontWeight: 600 }}>{t('result.confidence')}</span>
                {getConfidenceBadge(ai.confidence)}
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#647067', display: 'block', fontWeight: 600 }}>{t('result.severity')}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  {getSeverityBadge(ai.severity)}
                  {ai.affectedArea && (
                    <span style={{ fontSize: '0.75rem', color: '#647067' }}>
                      ({ai.affectedArea} {t('result.affectedArea')})
                    </span>
                  )}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#647067', display: 'block', fontWeight: 600 }}>{t('crop.growthStage')}</span>
                <span style={{ fontSize: '0.85rem', color: '#17211B', fontWeight: 600 }}>
                  🌱 {analysis.growthStage || 'Vegetative'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Agronomic Risk Gauge */}
          <div style={{
            background: '#F7F9F7',
            border: '1px solid #E5EAE6',
            borderRadius: 16,
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around'
          }}>
            <RiskGauge score={risk.riskScore || 70} level={risk.riskLevel || 'HIGH'} size={150} />

            <div style={{ maxWidth: 160 }}>
              <div style={{ fontSize: '0.75rem', color: '#647067', textTransform: 'uppercase', fontWeight: 600 }}>
                {t('risk.title')}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#17211B', marginTop: 2 }}>
                {risk.predictedThreat || ai.condition}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#15803D', marginTop: 4, fontWeight: 600 }}>
                {t('risk.estimateNotice')}
              </div>
            </div>
          </div>
        </div>

        {/* Low Confidence Warning Notice */}
        {ai.confidence < 0.75 && (
          <div style={{
            marginTop: 18,
            padding: '12px 16px',
            background: '#FEF3C7',
            border: '1px solid #FDE68A',
            borderRadius: 10,
            color: '#B45309',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <AlertTriangle size={20} color="#D97706" style={{ flexShrink: 0 }} />
            <span>{t('result.expertNotice')}</span>
          </div>
        )}
      </div>

      {/* Visual Symptoms & Causes Section */}
      <div className="grid-2">
        {/* Symptoms */}
        <div className="glass-card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1rem', color: '#15803D', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={18} /> {t('result.symptoms')}
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(ai.visualSymptoms || ['Necrotic spots observed on foliage']).map((sym, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.88rem', color: '#17211B' }}>
                <span style={{ color: '#16A34A' }}>•</span>
                <span>{sym}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Environmental Causes */}
        <div className="glass-card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1rem', color: '#0284C7', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Droplets size={18} /> {t('result.causes')}
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(ai.possibleCauses || ['High humidity and temperature']).map((cause, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.88rem', color: '#17211B' }}>
                <span style={{ color: '#0284C7' }}>•</span>
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Explainable Why Component */}
      <ExplainableWhy riskAssessment={risk} />

      {/* Integrated Pest Management Guidance */}
      <RecommendationCard recommendations={recs} />

      {/* Action Footer */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        paddingTop: 8
      }}>
        <button
          onClick={onNewScan}
          className="btn-primary"
          style={{ padding: '12px 28px' }}
        >
          <Sparkles size={18} /> {t('hero.ctaScan')}
        </button>

        <div style={{ fontSize: '0.78rem', color: '#647067' }}>
          Saved to MongoDB Analysis History • ID: {analysis._id || analysis.id || 'record-active'}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
