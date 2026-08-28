import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, X, ArrowRight } from 'lucide-react';

export const DEMO_CASES = [
  {
    id: 'demo-tomato-septoria',
    title: 'Septoria Leaf Spot on Tomato',
    crop: 'Tomato',
    cropId: 'tomato',
    state: 'Tamil Nadu',
    district: 'Salem',
    image: '/sample_crops/septoria_tomato.jpg',
    weatherDesc: '27.5°C • 84% Humidity • 14.2mm Rain',
    threat: 'Fungal Leaf Spot (Septoria lycopersici)',
    riskLevel: 'HIGH',
    riskScore: 78
  },
  {
    id: 'demo-rice-blast',
    title: 'Diamond Eye Lesions of Rice Blast',
    crop: 'Rice (Paddy)',
    cropId: 'rice',
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    image: '/sample_crops/rice_blast.jpg',
    weatherDesc: '24.2°C • 91% Humidity • 22mm Rain',
    threat: 'Rice Blast (Magnaporthe oryzae)',
    riskLevel: 'CRITICAL',
    riskScore: 89
  },
  {
    id: 'demo-cotton-bollworm',
    title: 'Pink Bollworm Internal Infestation',
    crop: 'Cotton',
    cropId: 'cotton',
    state: 'Maharashtra',
    district: 'Nagpur',
    image: '/sample_crops/cotton_bollworm.jpg',
    weatherDesc: '32.0°C • 68% Humidity • Warm & Dry',
    threat: 'Pink Bollworm (Pectinophora gossypiella)',
    riskLevel: 'CRITICAL',
    riskScore: 82
  },
  {
    id: 'demo-tomato-blossom-rot',
    title: 'Blossom End Rot & Calcium Stress',
    crop: 'Tomato',
    cropId: 'tomato',
    state: 'Karnataka',
    district: 'Bengaluru Rural',
    image: '/sample_crops/blossom_rot_tomato.jpg',
    weatherDesc: '31.0°C • 48% Humidity • Water Stress',
    threat: 'Physiological Calcium Deficiency',
    riskLevel: 'MEDIUM',
    riskScore: 48
  }
];

export const SihDemoModal = ({ isOpen, onClose, onSelectDemoCase }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(23, 33, 27, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div className="glass-card" style={{
        maxWidth: 780,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        position: 'relative',
        background: '#FFFFFF',
        border: '1px solid #FDE68A'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={22} color="#D97706" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#17211B' }}>{t('demo.modalTitle')}</h3>
              <span style={{ fontSize: '0.8rem', color: '#B45309', fontWeight: 600 }}>
                Instant One-Click Demonstration for Hackathon Judges
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: 6,
              borderRadius: '50%',
              background: '#F1F5F2',
              color: '#17211B',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.86rem', color: '#647067', lineHeight: 1.5, marginBottom: 20 }}>
          {t('demo.description')}
        </p>

        {/* Demo Cases List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DEMO_CASES.map(demo => (
            <div
              key={demo.id}
              onClick={() => {
                onSelectDemoCase(demo);
                onClose();
              }}
              className="glass-card glass-card-interactive"
              style={{
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                cursor: 'pointer',
                background: '#F7F9F7'
              }}
            >
              {/* Thumbnail */}
              <div style={{
                width: 76,
                height: 76,
                borderRadius: 10,
                overflow: 'hidden',
                flexShrink: 0,
                border: '1px solid #E5EAE6',
                background: '#FFFFFF'
              }}>
                <img
                  src={demo.image}
                  alt={demo.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Information */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 700 }}>
                    🌾 {demo.crop}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#647067' }}>
                    📍 {demo.district}, {demo.state}
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', color: '#17211B', marginBottom: 4 }}>
                  {demo.title}
                </h4>

                <div style={{ fontSize: '0.75rem', color: '#647067' }}>
                  🌦 {demo.weatherDesc}
                </div>
              </div>

              {/* Risk Level Badge & Action */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: demo.riskScore > 60 ? '#DC2626' : '#B45309' }}>
                  {demo.riskScore}%
                </div>
                <span className={demo.riskLevel === 'CRITICAL' ? 'badge badge-critical' : demo.riskLevel === 'HIGH' ? 'badge badge-high' : 'badge badge-medium'}>
                  {demo.riskLevel === 'CRITICAL' ? t('risk.critical') : demo.riskLevel === 'HIGH' ? t('risk.high') : t('risk.medium')}
                </span>
                <div style={{
                  marginTop: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  color: '#16A34A',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  <span>{t('demo.runTest')}</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SihDemoModal;
