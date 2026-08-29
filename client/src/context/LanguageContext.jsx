import React, { createContext, useContext, useState, useEffect } from 'react';

// Import all 13 Indian language JSON files
import en from '../locales/en.json';
import ta from '../locales/ta.json';
import hi from '../locales/hi.json';
import te from '../locales/te.json';
import kn from '../locales/kn.json';
import ml from '../locales/ml.json';
import mr from '../locales/mr.json';
import bn from '../locales/bn.json';
import gu from '../locales/gu.json';
import pa from '../locales/pa.json';
import or from '../locales/or.json';
import as from '../locales/as.json';
import ur from '../locales/ur.json';

const translations = {
  en, ta, hi, te, kn, ml, mr, bn, gu, pa, or, as, ur
};

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', speechCode: 'en-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechCode: 'ta-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechCode: 'hi-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechCode: 'te-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechCode: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speechCode: 'ml-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechCode: 'mr-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechCode: 'bn-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechCode: 'gu-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', speechCode: 'pa-IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', speechCode: 'or-IN' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', speechCode: 'as-IN' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', speechCode: 'ur-IN' }
];

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('agrishield_lang') || 'en';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isRTL = language === 'ur';
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
      if (isRTL) {
        document.body.classList.add('rtl-mode');
      } else {
        document.body.classList.remove('rtl-mode');
      }
    }
  }, [language]);

  const setLanguage = (langCode) => {
    if (translations[langCode]) {
      setLanguageState(langCode);
      localStorage.setItem('agrishield_lang', langCode);
    }
  };

  /**
   * Safe nested key lookup with parameter interpolation and fallback
   * Usage:
   *   t('nav.dashboard')
   *   t('alerts.highestRiskTitle', { crop: 'Tomato', disease: 'Septoria Leaf Spot' })
   */
  const t = (path, paramsOrFallback = {}, fallbackText = '') => {
    if (!path || typeof path !== 'string') return '';

    let params = {};
    let defaultText = '';

    if (typeof paramsOrFallback === 'string') {
      defaultText = paramsOrFallback;
    } else if (paramsOrFallback && typeof paramsOrFallback === 'object') {
      params = paramsOrFallback;
      defaultText = fallbackText;
    }

    const keys = path.split('.');
    let current = translations[language];
    let fallback = translations['en'];

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        current = undefined;
        break;
      }
    }

    let result = current;

    if (result === undefined) {
      // Dev mode missing key detection
      if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production' && language !== 'en') {
        console.warn(`[MISSING TRANSLATION] language: ${language}, key: ${path}`);
      }

      // Fallback lookup to English
      for (const key of keys) {
        if (fallback && fallback[key] !== undefined) {
          fallback = fallback[key];
        } else {
          fallback = undefined;
          break;
        }
      }
      
      // If still undefined, use defaultText or empty string (NEVER render raw key string in production!)
      if (fallback !== undefined) {
        result = fallback;
      } else if (defaultText) {
        result = defaultText;
      } else {
        result = '';
      }
    }

    // If result is a string and params are provided, interpolate {param}
    if (typeof result === 'string' && Object.keys(params).length > 0) {
      return result.replace(/\{(\w+)\}/g, (match, key) => {
        return params[key] !== undefined ? params[key] : match;
      });
    }

    return result !== undefined ? result : (defaultText || '');
  };

  const currentLanguageObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      languages: LANGUAGES,
      currentLanguage: currentLanguageObj,
      isRTL: language === 'ur'
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

export default LanguageContext;
