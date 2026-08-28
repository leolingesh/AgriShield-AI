import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import voiceController from '../services/voiceController';

export const RECOGNITION_LOCALE_MAP = {
  en: 'en-IN',
  ta: 'ta-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  or: 'or-IN',
  as: 'as-IN',
  ur: 'ur-IN'
};

export function useVoiceInput() {
  const { language, t, currentLanguage } = useLanguage();

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const callbackRef = useRef(null);

  const targetLocale = currentLanguage?.speechCode || RECOGNITION_LOCALE_MAP[language] || 'en-IN';

  const isSupported = typeof window !== 'undefined' && Boolean(
    window.SpeechRecognition || window.webkitSpeechRecognition
  );

  // Stop active recognition if website language changes
  useEffect(() => {
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, [language]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
        voiceController.unregisterRecognition(recognitionRef.current);
      }
    };
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        try {
          recognitionRef.current.abort();
        } catch (err) {}
      }
    }
    setIsListening(false);
    setIsProcessing(false);
    voiceController.notifyMicrophoneStop();
  }, []);

  const startListening = useCallback((options = {}) => {
    if (!isSupported) {
      const errMsg = t('voice.notSupported', 'Voice input is not supported in this browser. You can type your question instead.');
      setError(errMsg);
      if (options.onError) options.onError(errMsg);
      return false;
    }

    // 1. MUTUAL EXCLUSION: Stop any playing speech synthesis first!
    voiceController.notifyMicrophoneStart();

    // Reset previous transcript & state
    setTranscript('');
    setInterimTranscript('');
    setError(null);
    setIsProcessing(false);
    callbackRef.current = options;

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();

      rec.lang = targetLocale;
      rec.continuous = false;
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setIsListening(true);
        setIsProcessing(false);
        voiceController.registerRecognition(rec);
        if (options.onStart) options.onStart();
      };

      rec.onresult = (event) => {
        let finalStr = '';
        let interimStr = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          const text = res[0].transcript;
          if (res.isFinal) {
            finalStr += text;
          } else {
            interimStr += text;
          }
        }

        if (interimStr) {
          setInterimTranscript(interimStr);
          if (options.onInterim) options.onInterim(interimStr);
        }

        if (finalStr) {
          const cleanFinal = finalStr.trim();
          setTranscript(cleanFinal);
          setInterimTranscript('');
          setIsProcessing(true);

          if (callbackRef.current?.onFinal) {
            callbackRef.current.onFinal(cleanFinal);
          }
          if (callbackRef.current?.onResult) {
            callbackRef.current.onResult(cleanFinal);
          }
        }
      };

      rec.onerror = (event) => {
        console.warn('SpeechRecognition error:', event.error);
        setIsListening(false);
        setIsProcessing(false);
        voiceController.notifyMicrophoneStop();

        let friendlyMsg = t('voice.tryAgain', 'Speech recognition error. Please try again.');
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          friendlyMsg = t('voice.microphoneDenied', 'Microphone permission was denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          friendlyMsg = t('voice.noSpeech', 'No speech detected. Please tap Speak and try again.');
        }

        setError(friendlyMsg);
        if (callbackRef.current?.onError) {
          callbackRef.current.onError(friendlyMsg);
        }
      };

      rec.onend = () => {
        setIsListening(false);
        setIsProcessing(false);
        voiceController.notifyMicrophoneStop();
        if (callbackRef.current?.onEnd) {
          callbackRef.current.onEnd();
        }
      };

      recognitionRef.current = rec;
      rec.start();
      return true;
    } catch (err) {
      console.warn('Failed to start SpeechRecognition:', err);
      setIsListening(false);
      setIsProcessing(false);
      voiceController.notifyMicrophoneStop();
      const errMsg = t('voice.tryAgain', 'Speech recognition error. Please try again.');
      setError(errMsg);
      return false;
    }
  }, [isSupported, targetLocale, t]);

  return {
    startListening,
    stopListening,
    isListening,
    isProcessing,
    transcript,
    interimTranscript,
    isSupported,
    error,
    locale: targetLocale,
    language
  };
}

export default useVoiceInput;
