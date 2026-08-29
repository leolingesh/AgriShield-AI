import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import RiskGauge from './RiskGauge';
import {
  getLocalizedCropName,
  getLocalizedDiseaseName,
  getLocalizedWhyNarrative,
  getLocalizedAction,
  validateLanguageOutput
} from '../utils/localizationUtils';
import { AlertTriangle, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const RiskCard = ({ riskData, onInspect }) => {
  const { t, language } = useLanguage();

  if (!riskData) return null;

  const score = riskData.riskScore || 25;
  const level = riskData.riskLevel || 'LOW';

  const localizedCrop = getLocalizedCropName(riskData.cropId || riskData.cropName || 'Tomato', language);
  const localizedThreat = validateLanguageOutput(
    getLocalizedDiseaseName(riskData.predictedThreat || 'Septoria Leaf Spot', language),
    language,
    'RiskCard.threat'
  );

  const rawWhy = riskData.whyRiskExists || '';
  const localizedWhy = rawWhy
    ? validateLanguageOutput(getLocalizedWhyNarrative(rawWhy, {
        cropName: localizedCrop,
        diseaseName: localizedThreat,
        riskLevel: level,
        riskScore: score,
        location: riskData.location,
        weather: riskData.weather
      }, language), language, 'RiskCard.why')
    : '';

  const rawAction = riskData.recommendedAction || riskData.recommendations?.immediateActions?.[0] || 'Inspect lower leaf canopy for early lesion flecks.';
  const localizedAction = validateLanguageOutput(
    getLocalizedAction(rawAction, language),
    language,
    'RiskCard.action'
  );

  const isCritical = level === 'CRITICAL';
  const isHigh = level === 'HIGH';
  const isMedium = level === 'MEDIUM';

  const leftBorderColor = isCritical ? '#DC2626' : isHigh ? '#EA580C' : isMedium ? '#F59E0B' : '#16A34A';
  const iconBg = isCritical ? '#FEE2E2' : isHigh ? '#FFEDD5' : isMedium ? '#FEF3C7' : '#DCFCE7';
  const iconColor = isCritical ? '#DC2626' : isHigh ? '#EA580C' : isMedium ? '#D97706' : '#16A34A';

  return (
    <div
      className="glass-card glass-card-interactive"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5EAE6',
        borderLeft: `4px solid ${leftBorderColor}`,
        borderRadius: '16px',
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        height: 'auto',
        minHeight: 'auto',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* Header: Crop + Threat on left, Compact Gauge on right */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
        maxWidth: '100%'
      }}>
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {isCritical || isHigh ? (
                <AlertTriangle size={18} color={iconColor} />
              ) : (
                <ShieldCheck size={18} color={iconColor} />
              )}
            </div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              color: '#17211B',
              margin: 0,
              lineHeight: 1.2,
              wordBreak: 'break-word'
            }}>
              {localizedCrop}
            </h4>
          </div>

          <div style={{ fontSize: '0.83rem', color: '#647067', lineHeight: 1.4, wordBreak: 'break-word' }}>
            <strong style={{ color: '#17211B', fontWeight: 700 }}>{localizedThreat}</strong>
          </div>
        </div>

        {/* Compact Risk Gauge */}
        <RiskGauge score={score} level={level} size={84} />
      </div>

      {/* Environmental Why Explanation */}
      {localizedWhy && (
        <div style={{
          fontSize: '0.85rem',
          lineHeight: 1.5,
          color: '#33423A',
          background: '#F7F9F7',
          padding: '10px 12px',
          borderRadius: '10px',
          border: '1px solid #E5EAE6',
          wordBreak: 'break-word',
          overflowWrap: 'anywhere'
        }}>
          <strong style={{ color: '#17211B', fontWeight: 700 }}>{t('risk.whyTitle')} </strong>
          <span>{localizedWhy}</span>
        </div>
      )}

      {/* Recommended Action Block */}
      {localizedAction && (
        <div style={{
          background: '#F0FDF4',
          border: '1px solid #86EFAC',
          borderRadius: '10px',
          padding: '10px 12px',
          fontSize: '0.83rem',
          color: '#15803D',
          lineHeight: 1.5,
          wordBreak: 'break-word',
          overflowWrap: 'anywhere'
        }}>
          <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#166534', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
            <CheckCircle2 size={14} color="#16A34A" /> {t('ipm.immediate')}
          </div>
          <span>{localizedAction}</span>
        </div>
      )}

      {/* Action Button */}
      <button
        type="button"
        onClick={onInspect}
        className="btn-secondary"
        style={{
          width: '100%',
          justifyContent: 'center',
          fontSize: '0.88rem',
          padding: '10px 14px',
          minHeight: '42px',
          marginTop: 'auto'
        }}
      >
        <span>{t('hero.ctaRisk')}</span>
        <ArrowRight size={15} />
      </button>
    </div>
  );
};

export default RiskCard;
