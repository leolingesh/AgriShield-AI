import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import RiskGauge from './RiskGauge';
import ExplainableWhy from './ExplainableWhy';
import RecommendationCard from './RecommendationCard';
import ReadAloudButton from './ReadAloudButton';
import {
  getLocalizedCropName,
  getLocalizedDiseaseName,
  getLocalizedGrowthStage,
  getLocalizedSeverity,
  localizeSymptoms,
  localizeCauses,
  validateLanguageOutput
} from '../utils/localizationUtils';
import { 
  AlertTriangle, 
  Sparkles, 
  FileText, 
  Droplets,
  Cpu,
  Info,
  HelpCircle
} from 'lucide-react';

export const AnalysisResult = ({ analysis, onNewScan }) => {
  const { t, language } = useLanguage();

  if (!analysis) return null;

  const ai = analysis.aiAnalysis || {};
  const risk = analysis.riskAssessment || {};
  const recs = analysis.recommendations || {};
  const location = analysis.location || {};

  const localizedCrop = getLocalizedCropName(analysis.cropName || ai.crop, language);
  const localizedCondition = validateLanguageOutput(
    getLocalizedDiseaseName(ai.condition, language),
    language,
    'AnalysisResult.condition'
  );
  const localizedStage = getLocalizedGrowthStage(analysis.growthStage || 'Vegetative', language);
  const localizedThreat = validateLanguageOutput(
    getLocalizedDiseaseName(risk.predictedThreat || ai.condition, language),
    language,
    'AnalysisResult.threat'
  );

  // 1. Non-Plant Image Card
  if (ai.image_type === 'non_plant' || ai.condition === 'Non-Plant Image' || ai.diseaseCode === 'non_plant') {
    return (
      <div className="glass-card" style={{ padding: '36px 24px', textAlign: 'center', border: '1.5px solid #F59E0B' }}>
        <div style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#FEF3C7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <HelpCircle size={32} color="#D97706" aria-hidden="true" />
        </div>
        <h3 style={{ fontSize: '1.3rem', color: '#92400E', marginBottom: 10, fontWeight: 700 }}>
          {t('audio.uncertainCrop')}
        </h3>
        <p style={{ color: '#4B5563', maxWidth: 540, margin: '0 auto 24px', lineHeight: 1.6, fontSize: '0.95rem' }}>
          {ai.message || t('audio.uncertainCrop')}
        </p>
        <button className="btn-primary" onClick={onNewScan} style={{ margin: '0 auto' }}>
          <Sparkles size={18} aria-hidden="true" /> {t('hero.ctaScan')}
        </button>
      </div>
    );
  }

  // 2. Crop Mismatch / Low Confidence / Unsupported Image Alert
  if (ai.supported === false || ai.condition === 'unsupported_or_low_confidence' || ai.image_type === 'low_quality') {
    return (
      <div className="glass-card" style={{ padding: '36px 24px', textAlign: 'center', border: '1.5px solid #F59E0B' }}>
        <div style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#FEF3C7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <AlertTriangle size={32} color="#D97706" aria-hidden="true" />
        </div>
        <h3 style={{ fontSize: '1.3rem', color: '#92400E', marginBottom: 10, fontWeight: 700 }}>
          {t('audio.uncertainCrop')}
        </h3>
        <p style={{ color: '#4B5563', maxWidth: 540, margin: '0 auto 24px', lineHeight: 1.6, fontSize: '0.95rem' }}>
          {ai.message || t('audio.uncertainCrop')}
        </p>
        <button className="btn-primary" onClick={onNewScan} style={{ margin: '0 auto' }}>
          <Sparkles size={18} aria-hidden="true" /> {t('hero.ctaScan')}
        </button>
      </div>
    );
  }

  const getSeverityBadge = (sev = '') => {
    const s = String(sev).toLowerCase();
    const localizedText = getLocalizedSeverity(sev, language);
    if (s === 'severe' || s === 'critical') return <span className="badge badge-critical">{localizedText}</span>;
    if (s === 'high') return <span className="badge badge-high">{localizedText}</span>;
    if (s === 'moderate' || s === 'medium') return <span className="badge badge-medium">{localizedText}</span>;
    return <span className="badge badge-low">{localizedText}</span>;
  };

  const getConfidenceBadge = (conf = 0.85) => {
    if (conf >= 0.88) return <span className="badge badge-low">{t('result.confidence')} ({Math.round(conf * 100)}%)</span>;
    if (conf >= 0.65) return <span className="badge badge-medium">{t('result.confidence')} ({Math.round(conf * 100)}%)</span>;
    return <span className="badge badge-critical">{t('result.expertNotice')} ({Math.round(conf * 100)}%)</span>;
  };

  const symptomsList = localizeSymptoms(ai.visualSymptoms, language);
  const causesList = localizeCauses(ai.possibleCauses, language);

  const engineLabel = ai.source && ai.source.includes('Ollama')
    ? '🟢 Ollama qwen3-vl:8b Vision AI'
    : '🟡 Cloud Dual-Engine Knowledge Base';

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
                🌾 {localizedCrop}
              </span>
              {/* Engine Status Badge */}
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 6,
                background: ai.source?.includes('Ollama') ? '#DCFCE7' : '#FEF3C7',
                color: ai.source?.includes('Ollama') ? '#15803D' : '#B45309',
                border: ai.source?.includes('Ollama') ? '1px solid #86EFAC' : '1px solid #FDE68A'
              }}>
                <Cpu size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} aria-hidden="true" />
                {engineLabel}
              </span>

              {analysis.isDemoMode && (
                <span className="badge badge-medium">
                  {t('nav.demo')}
                </span>
              )}
              <span style={{ fontSize: '0.8rem', color: '#647067' }}>
                📍 {location.formatted || (location.district ? `${location.district}, ${location.state || ''}` : t('location.title'))}
              </span>
            </div>
            <h2 style={{ fontSize: '1.7rem', color: '#17211B', letterSpacing: '-0.02em' }}>
              {localizedCondition}
            </h2>
            {ai.pathogen && ai.pathogen !== 'none' && (
              <p style={{ fontSize: '0.9rem', color: '#0284C7', fontStyle: 'italic', marginTop: 2 }}>
                {t('result.pathogen')}: {ai.pathogen}
              </p>
            )}
          </div>

          {/* Read Aloud Accessible Button */}
          <ReadAloudButton
            analysisRecord={analysis}
            cropName={localizedCrop}
            condition={localizedCondition}
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
                  alt={localizedCrop}
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
                  🌱 {localizedStage}
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
                {localizedThreat}
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
            <AlertTriangle size={20} color="#D97706" style={{ flexShrink: 0 }} aria-hidden="true" />
            <span>{t('result.expertNotice')}</span>
          </div>
        )}
      </div>

      {/* Visual Symptoms & Causes Section */}
      <div className="grid-2">
        {/* Symptoms */}
        <div className="glass-card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1rem', color: '#15803D', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={18} aria-hidden="true" /> {t('result.symptoms')}
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {symptomsList.map((sym, i) => (
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
            <Droplets size={18} aria-hidden="true" /> {t('result.causes')}
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {causesList.map((cause, i) => (
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
          <Sparkles size={18} aria-hidden="true" /> {t('hero.ctaScan')}
        </button>

        <div style={{ fontSize: '0.78rem', color: '#647067' }}>
          {t('common.savedToHistory')} • {t('common.id')}: {analysis._id || analysis.id || 'record-active'}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
