import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Circle } from 'lucide-react';

export const PreventionCard = ({ cropName = 'Tomato', preventionList = [] }) => {
  const defaultList = [
    'Inspect plants regularly (especially lower foliage and leaf undersides).',
    'Remove severely affected plant material and dispose of it safely away from the field.',
    'Maintain proper field/canopy airflow by keeping recommended row spacing.',
    'Avoid unnecessary leaf wetting (irrigate early morning or use drip systems).',
    'Monitor weather conditions closely after rain or prolonged morning dew.'
  ];

  const itemsToDisplay = preventionList.length > 0 ? preventionList : defaultList;
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (idx) => {
    setCheckedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="glass-card" style={{
      padding: '24px',
      border: '1.5px solid #86EFAC',
      background: '#FFFFFF',
      boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: '#DCFCE7',
            border: '1px solid #86EFAC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={22} color="#16A34A" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#17211B', margin: 0 }}>
              🛡️ Prevention Checklist
            </h3>
            <span style={{ fontSize: '0.82rem', color: '#647067' }}>
              Protect your {cropName} crop before the problem spreads.
            </span>
          </div>
        </div>

        {itemsToDisplay.length > 0 && (
          <span style={{
            background: '#DCFCE7',
            color: '#15803D',
            padding: '4px 10px',
            borderRadius: 999,
            fontSize: '0.78rem',
            fontWeight: 800
          }}>
            {completedCount} / {itemsToDisplay.length} Completed
          </span>
        )}
      </div>

      {/* Checklist Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {itemsToDisplay.map((item, idx) => {
          const isDone = Boolean(checkedItems[idx]);
          return (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 10,
                background: isDone ? '#F0FDF4' : '#F9FAF9',
                border: isDone ? '1px solid #86EFAC' : '1px solid #E2E8E4',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                userSelect: 'none'
              }}
            >
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                {isDone ? (
                  <CheckCircle2 size={18} color="#16A34A" />
                ) : (
                  <Circle size={18} color="#9CA3AF" />
                )}
              </div>
              <span style={{
                fontSize: '0.88rem',
                color: isDone ? '#15803D' : '#17211B',
                fontWeight: isDone ? 600 : 500,
                textDecoration: isDone ? 'line-through' : 'none',
                lineHeight: 1.5
              }}>
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PreventionCard;
