import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import RiskGauge from './RiskGauge';
import { getLocalizedCropName, getLocalizedGrowthStage, getLocalizedDiseaseName, validateLanguageOutput } from '../utils/localizationUtils';
import { Sprout, Trash2, ArrowRight } from 'lucide-react';

export const CropMonitoringCard = ({ plot, onInspect, onDelete }) => {
  const { t, language } = useLanguage();

  if (!plot) return null;

  const score = plot.currentRiskScore || 25;
  const level = plot.currentRiskLevel || 'LOW';

  const localizedCrop = getLocalizedCropName(plot.cropId || plot.cropName, language);
  const localizedStage = getLocalizedGrowthStage(plot.growthStage || 'Vegetative', language);
  const localizedThreat = validateLanguageOutput(
    getLocalizedDiseaseName(plot.latestThreat || 'routine_monitoring', language),
    language,
    'CropMonitoringCard'
  );

  const daysSinceSowing = plot.sowingDate 
    ? Math.max(1, Math.round((Date.now() - new Date(plot.sowingDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 30;

  return (
    <div className="glass-card glass-card-interactive" style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 14
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: '#DCFCE7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sprout size={20} color="#16A34A" />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', color: '#17211B' }}>
              {plot.plotName || 'Field Plot'}
            </h4>
            <div style={{ fontSize: '0.78rem', color: '#647067', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🌾 <strong>{localizedCrop}</strong></span>
              <span>•</span>
              <span>{plot.acres || 1.5} {t('common.acres')}</span>
            </div>
          </div>
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(plot._id || plot.id)}
            title={t('monitoring.removePlot')}
            style={{
              padding: 6,
              borderRadius: 6,
              background: '#FEE2E2',
              color: '#DC2626',
              border: '1px solid #FCA5A5',
              cursor: 'pointer'
            }}
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 14,
        alignItems: 'center',
        background: '#F7F9F7',
        border: '1px solid #E5EAE6',
        borderRadius: 12,
        padding: '12px 14px',
        marginBottom: 16
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem', color: '#17211B' }}>
          <div>
            <span style={{ color: '#647067' }}>{t('crop.growthStage')}: </span>
            <strong style={{ color: '#17211B' }}>🌱 {localizedStage}</strong>
          </div>
          <div>
            <span style={{ color: '#647067' }}>{t('common.cropAge')}: </span>
            <strong style={{ color: '#17211B' }}>{daysSinceSowing} {t('common.days')}</strong>
          </div>
          <div>
            <span style={{ color: '#647067' }}>{t('common.latestStatus')}: </span>
            <strong style={{ color: score > 60 ? '#DC2626' : '#15803D' }}>{localizedThreat}</strong>
          </div>
        </div>

        <RiskGauge score={score} level={level} size={88} />
      </div>

      <button
        type="button"
        onClick={() => onInspect(plot)}
        className="btn-secondary"
        style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem', padding: '9px', minHeight: 38 }}
      >
        <span>{t('hero.ctaScan')}</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default CropMonitoringCard;
