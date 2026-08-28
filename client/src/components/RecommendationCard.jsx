import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, CheckCircle2, Calendar, AlertOctagon, Info } from 'lucide-react';

export const RecommendationCard = ({ recommendations }) => {
  const { t } = useLanguage();

  if (!recommendations) return null;

  const immediate = recommendations.immediateActions || [];
  const prevention = recommendations.prevention || [];
  const monitoring = recommendations.monitoringPlan || [];
  const chemicalWarning = recommendations.chemicalWarning || '';

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: '#DCFCE7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ShieldCheck size={22} color="#16A34A" />
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', color: '#17211B' }}>{t('ipm.title')}</h3>
          <span style={{ fontSize: '0.78rem', color: '#647067' }}>
            {t('ipm.subtitle', 'Multi-Tiered Biological, Cultural, and Chemical Controls')}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Immediate Action Steps */}
        {immediate.length > 0 && (
          <div>
            <h4 style={{
              fontSize: '0.9rem',
              color: '#15803D',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
              fontWeight: 700
            }}>
              <CheckCircle2 size={16} color="#16A34A" />
              {t('ipm.immediate')}
            </h4>
            <ul style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              paddingLeft: 4
            }}>
              {immediate.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    fontSize: '0.88rem',
                    color: '#17211B',
                    lineHeight: 1.5
                  }}
                >
                  <span style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#DCFCE7',
                    color: '#15803D',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2
                  }}>
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Preventive Measures */}
        {prevention.length > 0 && (
          <div style={{
            paddingTop: 16,
            borderTop: '1px solid #E5EAE6'
          }}>
            <h4 style={{
              fontSize: '0.9rem',
              color: '#0284C7',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
              fontWeight: 700
            }}>
              <Info size={16} color="#0284C7" />
              {t('ipm.prevention')}
            </h4>
            <ul style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              paddingLeft: 4
            }}>
              {prevention.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    fontSize: '0.86rem',
                    color: '#17211B'
                  }}
                >
                  <span style={{ color: '#0284C7', fontSize: '1rem', lineHeight: 1 }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Field Monitoring Plan */}
        {monitoring.length > 0 && (
          <div style={{
            paddingTop: 16,
            borderTop: '1px solid #E5EAE6'
          }}>
            <h4 style={{
              fontSize: '0.9rem',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
              fontWeight: 700
            }}>
              <Calendar size={16} color="#D97706" />
              {t('ipm.monitoring')}
            </h4>
            <ul style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              paddingLeft: 4
            }}>
              {monitoring.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    fontSize: '0.86rem',
                    color: '#17211B'
                  }}
                >
                  <span style={{ color: '#D97706', fontSize: '1rem', lineHeight: 1 }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Chemical Safety Advisory Warning Box */}
        {chemicalWarning && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: 12,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12
          }}>
            <AlertOctagon size={22} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#991B1B', marginBottom: 4 }}>
                {t('ipm.chemicalWarningTitle')}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#B91C1C', margin: 0, lineHeight: 1.5 }}>
                {chemicalWarning}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
