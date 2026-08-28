import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const RiskGauge = ({ score = 75, level = 'HIGH', size = 90 }) => {
  const { t } = useLanguage();

  // Normalize score
  const safeScore = Math.min(100, Math.max(0, Math.round(score)));

  // Gauge calculations
  const strokeWidth = 9;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  // Use a 240 degree arc gauge
  const arcLength = circumference * (240 / 360);
  const strokeDashoffset = arcLength - (safeScore / 100) * arcLength;

  // Determine color and status
  let strokeColor = '#16A34A';
  let levelText = t('risk.low');
  let badgeClass = 'badge-low';

  if (safeScore > 80 || level === 'CRITICAL') {
    strokeColor = '#DC2626';
    levelText = t('risk.critical');
    badgeClass = 'badge-critical';
  } else if (safeScore > 60 || level === 'HIGH') {
    strokeColor = '#EA580C';
    levelText = t('risk.high');
    badgeClass = 'badge-high';
  } else if (safeScore > 30 || level === 'MEDIUM') {
    strokeColor = '#F59E0B';
    levelText = t('risk.medium');
    badgeClass = 'badge-medium';
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      width: size,
      flexShrink: 0
    }}>
      <div style={{ position: 'relative', width: size, height: size * 0.72 }}>
        <svg
          width={size}
          height={size * 0.72}
          viewBox={`0 0 ${size} ${size * 0.72}`}
          style={{ overflow: 'visible' }}
        >
          {/* Background Track Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5EAE6"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            transform={`rotate(150 ${size / 2} ${size / 2})`}
          />

          {/* Active Value Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(150 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.8s ease-out, stroke 0.4s ease' }}
          />
        </svg>

        {/* Value Overlay inside Arc */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          width: '100%',
          pointerEvents: 'none'
        }}>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#17211B',
            lineHeight: 1,
            fontFamily: 'Outfit, sans-serif'
          }}>
            {safeScore}<span style={{ fontSize: '0.75rem', color: strokeColor, fontWeight: 700 }}>%</span>
          </div>
        </div>
      </div>

      {/* Categorical Badge below Arc */}
      <div style={{ marginTop: 2 }}>
        <span className={`badge ${badgeClass}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
          {levelText}
        </span>
      </div>
    </div>
  );
};

export default RiskGauge;
