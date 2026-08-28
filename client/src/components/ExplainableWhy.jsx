import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HelpCircle } from 'lucide-react';
import { localizeFactor, getXAIString } from '../utils/localizationUtils';

export const ExplainableWhy = ({ riskAssessment }) => {
  const { t, language } = useLanguage();

  if (!riskAssessment) return null;

  const rawFactors = riskAssessment.contributingFactors || [];
  const whyNarrative = riskAssessment.whyRiskExists || '';

  // Localize factors based on currently active language code
  const factors = rawFactors.map(f => localizeFactor(f, language));

  const getImpactBadge = (impact = '') => {
    const imp = impact.toLowerCase();
    if (imp === 'critical') return <span className="badge badge-critical">{t('risk.critical')}</span>;
    if (imp === 'high') return <span className="badge badge-high">{t('risk.high')}</span>;
    if (imp === 'moderate') return <span className="badge badge-medium">{t('risk.medium')}</span>;
    return <span className="badge badge-low">{t('risk.low')}</span>;
  };

  const subtitleText = getXAIString('subtitle', language, 'Explainable AI (XAI) Agronomic Factor Decomposition');
  const weightLabel = getXAIString('weight', language, 'Weight');

  return (
    <div className="glass-card" style={{ padding: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: '#FEF3C7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <HelpCircle size={20} color="#D97706" />
        </div>
        <div>
          <h3 style={{ fontSize: '1.05rem', color: '#17211B' }}>{t('risk.whyTitle')}</h3>
          <span style={{ fontSize: '0.78rem', color: '#647067' }}>
            {subtitleText}
          </span>
        </div>
      </div>

      {/* Narrative Box */}
      {whyNarrative && (
        <div style={{
          background: '#F0FDF4',
          borderLeft: '4px solid #16A34A',
          padding: '14px 16px',
          borderRadius: '0 12px 12px 0',
          marginBottom: 18,
          fontSize: '0.9rem',
          lineHeight: 1.6,
          color: '#17211B'
        }}>
          {whyNarrative}
        </div>
      )}

      {/* Contributing Factors Breakdown Table */}
      {factors.length > 0 && (
        <div>
          <h4 style={{ fontSize: '0.85rem', color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10, fontWeight: 700 }}>
            {t('risk.factorsTitle')}
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {factors.map((f, i) => (
              <div
                key={i}
                style={{
                  background: '#F7F9F7',
                  border: '1px solid #E5EAE6',
                  borderRadius: 10,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 12
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#17211B' }}>
                      {f.factor}
                    </span>
                    {f.weight && (
                      <span style={{ fontSize: '0.72rem', color: '#15803D', background: '#DCFCE7', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                        {weightLabel}: {f.weight}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#647067', margin: 0 }}>
                    {f.detail}
                  </p>
                </div>

                <div style={{ flexShrink: 0 }}>
                  {getImpactBadge(f.impact)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scientific Estimate Notice */}
      <div style={{
        marginTop: 16,
        paddingTop: 12,
        borderTop: '1px solid #E5EAE6',
        fontSize: '0.75rem',
        color: '#647067',
        fontStyle: 'italic'
      }}>
        * {t('risk.estimateNotice')}
      </div>
    </div>
  );
};

export default ExplainableWhy;

