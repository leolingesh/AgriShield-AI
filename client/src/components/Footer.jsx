import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PhoneCall, Cpu } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer style={{
      marginTop: 'auto',
      background: '#FFFFFF',
      borderTop: '1px solid #E5EAE6',
      padding: '36px 20px 24px 20px',
      color: '#647067',
      fontSize: '0.85rem'
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 28,
        marginBottom: 28
      }}>
        {/* Project Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <img 
              src="/logo.png" 
              alt="AgriShield AI Logo" 
              style={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }} 
            />
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#17211B' }}>
              {t('appName')}
            </span>
          </div>
          <p style={{ lineHeight: 1.6, color: '#647067', marginBottom: 14 }}>
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Farmer Support & Helpline */}
        <div>
          <h4 style={{ color: '#17211B', fontSize: '0.95rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <PhoneCall size={16} color="#16A34A" /> {t('footer.helplineTitle')}
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <li>
              <span style={{ color: '#17211B', fontWeight: 600 }}>{t('footer.kisanCallCenter')}:</span>
              <div style={{ color: '#15803D', fontWeight: 700, fontSize: '0.95rem', marginTop: 2 }}>
                📞 1800-180-1551 (6 AM - 10 PM)
              </div>
            </li>
            <li>
              <span style={{ color: '#17211B', fontWeight: 600 }}>ICAR / Krishi Vigyan Kendra:</span>
              <div style={{ color: '#647067' }}>{t('result.expertNotice')}</div>
            </li>
          </ul>
        </div>

        {/* Tech Stack & Verification */}
        <div>
          <h4 style={{ color: '#17211B', fontSize: '0.95rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Cpu size={16} color="#16A34A" /> {t('footer.techTitle')}
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, color: '#647067' }}>
            <li>⚡ <strong>{t('appName')}:</strong> Visual Diagnosis + Agronomic Scoring</li>
            <li>🌦 <strong>Micrometeorology:</strong> Live Open-Meteo & OpenWeather Sync</li>
            <li>🌐 <strong>Localization:</strong> 13 Official Indian Languages + TTS Audio</li>
            <li>📍 <strong>Geolocation:</strong> Browser GPS + Reverse Geocoding</li>
            <li>🛡 <strong>Integrations:</strong> {t('ipm.title')}</li>
          </ul>
        </div>
      </div>

      {/* Bottom Disclaimer */}
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        paddingTop: 20,
        borderTop: '1px solid #E5EAE6',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        fontSize: '0.78rem',
        color: '#8E9A91'
      }}>
        <div>
          © 2026 {t('appName')}. {t('footer.allRights')}
        </div>
        <div style={{ maxWidth: 650, textAlign: 'right' }}>
          <strong>{t('footer.disclaimerTitle')}:</strong> {t('risk.estimateNotice')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
