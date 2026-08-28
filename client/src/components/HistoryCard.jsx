import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Trash2, ArrowRight } from 'lucide-react';

export const HistoryCard = ({ analysis, onView, onDelete }) => {
  const { t } = useLanguage();

  if (!analysis) return null;

  const ai = analysis.aiAnalysis || {};
  const risk = analysis.riskAssessment || {};
  const location = analysis.location || {};

  const getLevelBadge = (lvl = 'LOW') => {
    if (lvl === 'CRITICAL') return <span className="badge badge-critical">{t('risk.critical')}</span>;
    if (lvl === 'HIGH') return <span className="badge badge-high">{t('risk.high')}</span>;
    if (lvl === 'MEDIUM') return <span className="badge badge-medium">{t('risk.medium')}</span>;
    return <span className="badge badge-low">{t('risk.low')}</span>;
  };

  return (
    <div className="glass-card glass-card-interactive" style={{ padding: '18px' }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
        {analysis.imageUrl && (
          <div style={{
            width: 70,
            height: 70,
            borderRadius: 10,
            overflow: 'hidden',
            flexShrink: 0,
            border: '1px solid #E5EAE6',
            background: '#F7F9F7'
          }}>
            <img
              src={analysis.imageUrl}
              alt={analysis.cropName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 700 }}>
              🌾 {analysis.cropName}
            </span>
            {analysis.isDemoMode && (
              <span className="badge badge-medium" style={{ fontSize: '0.65rem' }}>
                {t('nav.demo')}
              </span>
            )}
          </div>
          <h4 style={{
            fontSize: '0.98rem',
            color: '#17211B',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {ai.condition || 'Leaf Analysis'}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.74rem', color: '#647067', marginTop: 2 }}>
            <span>📍 {location.district || 'Salem'}</span>
            <span>•</span>
            <span>📅 {new Date(analysis.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#17211B' }}>
            {risk.riskScore || 50}%
          </div>
          {getLevelBadge(risk.riskLevel)}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <button
          type="button"
          onClick={() => onView(analysis)}
          className="btn-secondary"
          style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px', minHeight: 36 }}
        >
          <span>{t('result.title')}</span>
          <ArrowRight size={14} />
        </button>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(analysis._id || analysis.id)}
            title="Delete Record"
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              background: '#FEE2E2',
              border: '1px solid #FCA5A5',
              color: '#DC2626',
              cursor: 'pointer',
              minHeight: 36
            }}
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
};

export default HistoryCard;
