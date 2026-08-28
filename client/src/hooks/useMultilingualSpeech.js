import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import tts from '../services/ttsService';
import voiceController from '../services/voiceController';

export const SPEECH_LOCALE_MAP = {
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

/**
 * Generates natural spoken script in the current active website language
 * strictly from the final AI diagnosis response object or text response.
 */
export function generateSpeechText(analysisResult, language, t) {
  if (!analysisResult) return '';

  // Handle direct string passed to speak (e.g. AI chatbot text answer)
  if (typeof analysisResult === 'string') {
    return analysisResult
      .replace(/[*_~`#\[\]]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();
  }

  const ai = analysisResult.aiAnalysis || {};
  const risk = analysisResult.riskAssessment || {};
  const recs = analysisResult.recommendations || {};

  // 1. Check for Low Confidence / Unsupported Image
  if (ai.supported === false || ai.condition === 'unsupported_or_low_confidence' || analysisResult.requiresReview) {
    return t(
      'audio.uncertainCrop',
      'The image could not be classified with enough confidence. Please upload a clearer image showing the affected leaf or fruit.'
    );
  }

  const cropId = (analysisResult.cropId || ai.crop || 'crop').toLowerCase();
  const expectedCropId = (analysisResult.expectedCrop || '').toLowerCase();
  const isMismatch = Boolean(
    analysisResult.cropMismatch || 
    (expectedCropId && cropId !== expectedCropId)
  );

  const cropTranslated = t(`crop.${cropId}`, analysisResult.cropName || ai.crop || cropId);
  const expectedCropTranslated = expectedCropId ? t(`crop.${expectedCropId}`, expectedCropId) : '';
  const conditionTranslated = ai.condition || 'General Leaf Discoloration';
  const isHealthy = Boolean(
    ai.condition?.toLowerCase().includes('healthy') ||
    ai.condition === 'Healthy'
  );

  const parts = [];

  // 2. Crop Mismatch Spoken Notice
  if (isMismatch && expectedCropTranslated) {
    const mismatchTemplate = t(
      'audio.cropMismatchSpoken',
      'You selected {expectedCrop}, but the uploaded image appears to be {detectedCrop}. The diagnosis has been corrected based on image analysis.'
    );
    const spokenMismatch = mismatchTemplate
      .replace('{expectedCrop}', expectedCropTranslated)
      .replace('{detectedCrop}', cropTranslated);
    parts.push(spokenMismatch);
  }

  // 3. Healthy Crop Spoken Notice
  if (isHealthy) {
    const healthyTemplate = t(
      'audio.healthyCrop',
      'Your {crop} crop appears healthy with no visible signs of major disease or pest damage.'
    );
    parts.push(healthyTemplate.replace('{crop}', cropTranslated));
    return parts.join(' ');
  }

  // 4. Diseased Crop Intro
  const introTemplate = t(
    'audio.speechReportIntro',
    'Your crop is {crop}. The detected condition is {condition}.'
  );
  const spokenIntro = introTemplate
    .replace('{crop}', cropTranslated)
    .replace('{condition}', conditionTranslated);
  parts.push(spokenIntro);

  // 5. Confidence & Affected Area
  const confidenceVal = Math.round((ai.confidence || 0.9) * 100);
  const areaVal = ai.affectedArea || '15-20%';
  const confAreaTemplate = t(
    'audio.speechConfidenceArea',
    'The AI confidence is {confidence} percent. Approximately {affectedArea} of the crop area is affected.'
  );
  const spokenConfArea = confAreaTemplate
    .replace('{confidence}', confidenceVal)
    .replace('{affectedArea}', areaVal);
  parts.push(spokenConfArea);

  // 6. Early Warning Threat
  const threatName = risk.predictedThreat || conditionTranslated;
  if (threatName) {
    const threatTemplate = t('audio.speechThreat', 'Early warning threat: {threat}.');
    const spokenThreat = threatTemplate.replace('{threat}', threatName);
    parts.push(spokenThreat);
  }

  // 7. Prevention Measures
  const preventionList = recs.prevention || [];
  if (preventionList.length > 0) {
    const preventionItems = preventionList.slice(0, 2).join('. ');
    const preventionTemplate = t('audio.speechPrevention', 'Recommended prevention measures: {prevention}.');
    const spokenPrevention = preventionTemplate.replace('{prevention}', preventionItems);
    parts.push(spokenPrevention);
  }

  // 8. Immediate Action Steps
  const actionList = recs.immediateActions || [];
  if (actionList.length > 0) {
    const actionItems = actionList.slice(0, 2).join('. ');
    const actionTemplate = t('audio.speechAction', 'Immediate action steps: {actions}.');
    const spokenAction = actionTemplate.replace('{actions}', actionItems);
    parts.push(spokenAction);
  }

  return parts.join(' ');
}

export function useMultilingualSpeech() {
  const { language, t, currentLanguage } = useLanguage();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const targetSpeechCode = currentLanguage?.speechCode || SPEECH_LOCALE_MAP[language] || 'en-IN';
  const isLanguageSupported = tts.isSupported;
  const isVoiceAvailable = tts.isVoiceAvailableForLanguage(targetSpeechCode);

  const voiceNotice = !isVoiceAvailable && language !== 'en'
    ? t('audio.noVoiceNotice', 'Voice for this language is not available on this device/browser.')
    : null;

  // Stop active speech when website language changes or on unmount
  useEffect(() => {
    voiceController.stopSpeechSynthesis();
    setIsSpeaking(false);
    setIsPaused(false);
    return () => {
      voiceController.stopSpeechSynthesis();
    };
  }, [language]);

  const stop = useCallback(() => {
    voiceController.stopSpeechSynthesis();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    tts.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    tts.resume();
    setIsPaused(false);
  }, []);

  const speak = useCallback(
    (analysisResult, customText = '') => {
      // 1. MUTUAL EXCLUSION: Cancel microphone input immediately before speech starts!
      voiceController.notifySpeechStart();

      // 2. Generate natural spoken script strictly in current active website language
      const script = customText || generateSpeechText(analysisResult, language, t);
      if (!script) {
        voiceController.notifySpeechEnd();
        return false;
      }

      setIsSpeaking(true);
      setIsPaused(false);

      const success = tts.speak(script, {
        speechCode: targetSpeechCode,
        onStart: () => {
          setIsSpeaking(true);
          setIsPaused(false);
        },
        onEnd: () => {
          setIsSpeaking(false);
          setIsPaused(false);
          voiceController.notifySpeechEnd();
        },
        onError: () => {
          setIsSpeaking(false);
          setIsPaused(false);
          voiceController.notifySpeechEnd();
        },
        onPause: () => {
          setIsPaused(true);
        },
        onResume: () => {
          setIsPaused(false);
        }
      });

      if (!success) {
        setIsSpeaking(false);
        setIsPaused(false);
        voiceController.notifySpeechEnd();
      }

      return success;
    },
    [language, t, targetSpeechCode]
  );

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isLanguageSupported,
    isVoiceAvailable,
    voiceNotice,
    currentLanguage,
    speechCode: targetSpeechCode
  };
}

// Export alias as requested
export const useTextToSpeech = useMultilingualSpeech;
export default useMultilingualSpeech;
