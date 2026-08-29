import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  getLocalizedCropName,
  getLocalizedDiseaseName,
  getLocalizedRiskLevel,
  getLocalizedAction,
  getLocalizedWhyNarrative,
  localizeFactor,
  validateLanguageOutput
} from '../utils/localizationUtils';
import { 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export const EarlyWarningCard = ({ riskData, cropName = 'Tomato', onInspect }) => {
  const { t, language } = useLanguage();

  if (!riskData) return null;

  const {
    riskScore = 75,
    riskLevel = 'HIGH',
    predictedThreat = 'Septoria Leaf Spot',
    whyRiskExists = '',
    contributingFactors = [],
    recommendations = {}
  } = riskData;

  const localizedCrop = getLocalizedCropName(riskData.cropId || cropName, language);
  const localizedThreat = getLocalizedDiseaseName(predictedThreat, language);
  const localizedRisk = getLocalizedRiskLevel(riskLevel, language);

  const rawActions = recommendations.immediateActions || [
    'Inspect the affected plants today.',
    'Check nearby plants for similar symptoms.',
    'Avoid practices that increase leaf wetness (e.g., overhead watering).',
    'Remove severely affected plant material where appropriate.',
    'Monitor the field again within 24 to 48 hours.'
  ];

  const localizedActions = rawActions.map(act =>
    validateLanguageOutput(getLocalizedAction(act, language), language, 'EarlyWarningCard.action')
  );

  const getRiskBadgeStyles = (level) => {
    switch (level) {
      case 'CRITICAL':
        return { bg: '#FEF2F2', border: '#FCA5A5', color: '#991B1B', text: `🔴 ${localizedRisk}`, icon: ShieldAlert };
      case 'HIGH':
        return { bg: '#FEF2F2', border: '#FCA5A5', color: '#DC2626', text: `🔴 ${localizedRisk}`, icon: AlertTriangle };
      case 'MEDIUM':
        return { bg: '#FEF3C7', border: '#FDE68A', color: '#D97706', text: `🟠 ${localizedRisk}`, icon: AlertTriangle };
      default:
        return { bg: '#F0FDF4', border: '#86EFAC', color: '#15803D', text: `🟢 ${localizedRisk}`, icon: CheckCircle2 };
    }
  };

  const badgeStyle = getRiskBadgeStyles(riskLevel);
  const BadgeIcon = badgeStyle.icon;

  const getActionPriorityHeader = (level) => {
    if (level === 'HIGH' || level === 'CRITICAL') {
      return { label: `🔴 ${t('earlyWarning.actNow')}`, color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5' };
    }
    if (level === 'MEDIUM') {
      return { label: `🟠 ${t('earlyWarning.monitorClosely')}`, color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' };
    }
    return { label: `🟢 ${t('earlyWarning.continueMonitoring')}`, color: '#15803D', bg: '#F0FDF4', border: '#86EFAC' };
  };

  const actionPriority = getActionPriorityHeader(riskLevel);

  // Localized narrative
  const localizedWhy = validateLanguageOutput(
    getLocalizedWhyNarrative(whyRiskExists, {
      cropName: localizedCrop,
      diseaseName: localizedThreat,
      riskLevel,
      riskScore,
      location: riskData.location,
      weather: riskData.weather,
      growthStage: riskData.growthStage
    }, language),
    language,
    'EarlyWarningCard.why'
  );

  return (
    <div className="glass-card" style={{
      padding: '24px',
      border: `1.5px solid ${badgeStyle.border}`,
      background: '#FFFFFF',
      boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: badgeStyle.bg,
            border: `1px solid ${badgeStyle.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BadgeIcon size={24} color={badgeStyle.color} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#17211B', margin: 0 }}>
                ⚠ {t('nav.earlyWarning')}
              </h3>
              <span style={{
                background: badgeStyle.bg,
                border: `1px solid ${badgeStyle.border}`,
                color: badgeStyle.color,
                padding: '2px 10px',
                borderRadius: 999,
                fontSize: '0.75rem',
                fontWeight: 800
              }}>
                {badgeStyle.text}
              </span>
            </div>
            <span style={{ fontSize: '0.82rem', color: '#647067' }}>
              {t('earlyWarning.modelingFor', { crop: localizedCrop })}
            </span>
          </div>
        </div>

        {onInspect && (
          <button
            onClick={onInspect}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 700 }}
          >
            <span>{t('hero.ctaScan')}</span>
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Warning Description Box */}
      <div style={{
        background: badgeStyle.bg,
        border: `1px solid ${badgeStyle.border}`,
        borderRadius: 14,
        padding: '16px 18px',
        marginBottom: 20
      }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: badgeStyle.color, marginBottom: 6 }}>
          {localizedWhy || `${localizedCrop} - ${localizedThreat} (${badgeStyle.text})`}
        </h4>

        {/* Risk Score Progress Bar */}
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 700, color: '#17211B', marginBottom: 6 }}>
            <span>{t('earlyWarning.diseaseRiskScore')}</span>
            <span style={{ color: badgeStyle.color }}>{riskScore}% ({localizedRisk})</span>
          </div>
          <div style={{
            width: '100%',
            height: '10px',
            borderRadius: 999,
            background: 'rgba(0,0,0,0.06)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.min(100, Math.max(5, riskScore))}%`,
              height: '100%',
              borderRadius: 999,
              background: riskScore >= 75 ? 'linear-gradient(90deg, #F59E0B, #DC2626)' : riskScore >= 50 ? '#F59E0B' : '#16A34A',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </div>

      {/* WHY AM I RECEIVING THIS WARNING? */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{
          fontSize: '0.88rem',
          fontWeight: 800,
          color: '#15803D',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <HelpCircle size={16} color="#15803D" />
          {t('earlyWarning.whyWarning')}
        </h4>

        {localizedWhy ? (
          <p style={{
            fontSize: '0.88rem',
            lineHeight: 1.6,
            color: '#17211B',
            background: '#F7F9F7',
            padding: '12px 14px',
            borderRadius: 10,
            border: '1px solid #E5EAE6',
            margin: 0
          }}>
            {localizedWhy}
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {contributingFactors.length > 0 ? (
              contributingFactors.map((f, idx) => {
                const locF = localizeFactor(f, language);
                return (
                  <div key={idx} style={{
                    fontSize: '0.86rem',
                    color: '#17211B',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8
                  }}>
                    <span style={{ color: '#16A34A', fontWeight: 800 }}>•</span>
                    <span><strong>{locF.factor}:</strong> {locF.detail}</span>
                  </div>
                );
              })
            ) : (
              <>
                <div style={{ fontSize: '0.86rem', color: '#17211B', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#DC2626', fontWeight: 800 }}>•</span>
                  <span>{t('earlyWarning.humidityHighFungal')}</span>
                </div>
                <div style={{ fontSize: '0.86rem', color: '#17211B', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#DC2626', fontWeight: 800 }}>•</span>
                  <span>{t('earlyWarning.rainIncreasedWetness')}</span>
                </div>
                <div style={{ fontSize: '0.86rem', color: '#17211B', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#D97706', fontWeight: 800 }}>•</span>
                  <span>{t('earlyWarning.microclimateFungalSpore')}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* WHAT SHOULD I DO NOW? */}
      <div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: actionPriority.bg,
          border: `1px solid ${actionPriority.border}`,
          color: actionPriority.color,
          padding: '4px 12px',
          borderRadius: 8,
          fontSize: '0.8rem',
          fontWeight: 800,
          marginBottom: 12
        }}>
          <span>{actionPriority.label}</span>
        </div>

        <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#17211B', marginBottom: 10 }}>
          {t('earlyWarning.whatToDoNow')}
        </h4>

        <ol style={{
          margin: 0,
          paddingLeft: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          fontSize: '0.88rem',
          color: '#17211B',
          lineHeight: 1.5
        }}>
          {localizedActions.map((action, idx) => (
            <li key={idx} style={{ paddingLeft: 4 }}>
              {action}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default EarlyWarningCard;
