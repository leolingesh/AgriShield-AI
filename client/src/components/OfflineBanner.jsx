import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { WifiOff, Database } from 'lucide-react';

export const OfflineBanner = () => {
  const { t } = useLanguage();
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div style={{
      background: '#FEF3C7',
      borderBottom: '1px solid #FDE68A',
      color: '#B45309',
      padding: '8px 16px',
      fontSize: '0.85rem',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10
    }}>
      <WifiOff size={18} color="#D97706" />
      <span>{t('offline.banner')}</span>
      <span style={{
        background: '#FDE68A',
        padding: '2px 8px',
        borderRadius: 6,
        fontSize: '0.75rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        color: '#92400E'
      }}>
        <Database size={12} /> {t('offline.syncNotice')}
      </span>
    </div>
  );
};

export default OfflineBanner;
