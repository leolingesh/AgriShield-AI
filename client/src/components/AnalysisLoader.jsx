import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Cpu, CloudSun, Leaf, Check } from 'lucide-react';

export const AnalysisLoader = () => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: t('upload.step1'), icon: Leaf },
    { label: t('upload.step2'), icon: CloudSun },
    { label: t('upload.step3'), icon: Cpu }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 1200);
    const timer2 = setTimeout(() => setCurrentStep(2), 2400);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="glass-card" style={{
      padding: '40px 24px',
      textAlign: 'center',
      maxWidth: 580,
      margin: '0 auto',
      background: '#FFFFFF',
      border: '1px solid #DCFCE7'
    }}>
      {/* Central Animated Pulse Shield */}
      <div style={{
        width: 84,
        height: 84,
        borderRadius: '50%',
        background: '#DCFCE7',
        border: '2px solid #16A34A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px auto',
        position: 'relative'
      }}>
        <Shield size={44} color="#16A34A" />
        <div style={{
          position: 'absolute',
          inset: -8,
          borderRadius: '50%',
          border: '2px dashed #86EFAC',
          animation: 'spin 8s linear infinite'
        }} />
      </div>

      <h3 style={{ fontSize: '1.25rem', color: '#17211B', marginBottom: 8 }}>
        {t('upload.analyzing')}
      </h3>
      <p style={{ fontSize: '0.88rem', color: '#647067', marginBottom: 28 }}>
        {t('upload.analyzing')}
      </p>

      {/* Stepper Progress */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 16px',
                borderRadius: 12,
                background: isCurrent 
                  ? '#DCFCE7' 
                  : isDone 
                    ? '#F0FDF4' 
                    : '#F7F9F7',
                border: isCurrent 
                  ? '1px solid #16A34A' 
                  : isDone 
                    ? '1px solid #86EFAC' 
                    : '1px solid #E5EAE6',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: isDone ? '#16A34A' : isCurrent ? '#4ADE80' : '#E5EAE6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDone || isCurrent ? '#FFFFFF' : '#647067'
              }}>
                {isDone ? <Check size={16} strokeWidth={3} /> : <Icon size={16} className={isCurrent ? 'spin' : ''} />}
              </div>

              <span style={{
                fontSize: '0.9rem',
                fontWeight: isCurrent ? 700 : 500,
                color: isCurrent ? '#15803D' : isDone ? '#17211B' : '#647067'
              }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalysisLoader;
