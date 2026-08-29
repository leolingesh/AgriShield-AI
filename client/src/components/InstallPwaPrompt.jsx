import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Download, X, ShieldCheck, Sparkles } from 'lucide-react';

export default function InstallPwaPrompt() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user previously dismissed prompt
      const dismissed = localStorage.getItem('agrishield_pwa_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
      console.log('[AgriShield PWA] App was successfully installed!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('To install AgriShield App:\n\n1. Tap Share icon in browser\n2. Select "Add to Home Screen"');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('agrishield_pwa_dismissed', 'true');
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 text-white p-4 rounded-2xl shadow-2xl shadow-emerald-950/40 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-semibold text-white text-base leading-tight">{t('pwa.installTitle')}</h4>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> PWA
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-normal">
                {t('pwa.installDescription')}
              </p>
            </div>
          </div>
          <button 
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            title={t('common.close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <Download className="w-4 h-4" />
            {t('pwa.installBtn')}
          </button>
          <button
            onClick={handleDismiss}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium py-2.5 px-3 rounded-xl border border-slate-700 transition-colors"
          >
            {t('pwa.later')}
          </button>
        </div>
      </div>
    </div>
  );
}
