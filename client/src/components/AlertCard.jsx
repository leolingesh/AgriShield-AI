import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AlertTriangle, AlertOctagon, CheckCircle2, MapPin, Calendar, Sprout } from 'lucide-react';

export const AlertCard = ({ alert, onMarkRead }) => {
  const { t } = useLanguage();

  if (!alert) return null;

  const isCritical = alert.severity === 'CRITICAL';
  const isHigh = alert.severity === 'HIGH' || !isCritical;
  
  const borderAccent = isCritical ? '#DC2626' : '#F59E0B';
  const badgeClass = isCritical ? 'badge badge-critical' : 'badge badge-high';

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E5EAE6',
      borderLeft: `5px solid ${borderAccent}`,
      borderRadius: '14px',
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      transition: 'box-shadow 0.2s ease'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: isCritical ? '#FEE2E2' : '#FEF3C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {isCritical ? (
              <AlertOctagon size={20} color="#DC2626" />
            ) : (
              <AlertTriangle size={20} color="#D97706" />
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#17211B' }}>
                {alert.title}
              </h4>
              {alert.riskScore && (
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: isCritical ? '#DC2626' : '#D97706',
                  background: isCritical ? '#FEE2E2' : '#FEF3C7',
                  padding: '2px 8px',
                  borderRadius: 999
                }}>
                  {alert.riskScore}% Risk
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.78rem', color: '#647067', marginTop: 4, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={13} color="#16A34A" /> {alert.location?.district || 'Salem'}, {alert.location?.state || 'TN'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Sprout size={13} color="#16A34A" /> {alert.cropName || 'Crop'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={13} color="#647067" /> {new Date(alert.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <span className={badgeClass}>
          {alert.severity === 'CRITICAL' ? t('risk.critical') : t('risk.high')}
        </span>
      </div>

      {alert.triggerReason && (
        <p style={{ fontSize: '0.88rem', color: '#17211B', lineHeight: 1.5, margin: 0 }}>
          <strong style={{ color: '#647067' }}>{t('risk.whyTitle')} </strong> {alert.triggerReason}
        </p>
      )}

      {alert.recommendedAction && (
        <div style={{
          background: '#F0FDF4',
          border: '1px solid #86EFAC',
          padding: '10px 14px',
          borderRadius: 10,
          fontSize: '0.85rem',
          color: '#15803D'
        }}>
          <strong>{t('ipm.immediate')}: </strong> {alert.recommendedAction}
        </div>
      )}

      {!alert.isRead && onMarkRead && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
          <button
            type="button"
            onClick={() => onMarkRead(alert._id || alert.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#647067',
              background: '#F7F9F7',
              border: '1px solid #E5EAE6',
              padding: '6px 12px',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <CheckCircle2 size={14} color="#16A34A" /> {t('alerts.markRead')}
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertCard;
