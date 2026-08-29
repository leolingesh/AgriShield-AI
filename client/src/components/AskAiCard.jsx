import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';
import { useWeather } from '../context/WeatherContext';
import useMultilingualSpeech from '../hooks/useMultilingualSpeech';
import VoiceInputButton from './VoiceInputButton';
import ReadAloudButton from './ReadAloudButton';
import { MessageSquare, Sparkles, Send, Volume2, Loader2, AlertCircle, Info } from 'lucide-react';
import { getLocalizedCropName, getLocalizedDiseaseName } from '../utils/localizationUtils';

export const AskAiCard = ({ currentAnalysis = null, cropName = 'Tomato' }) => {
  const { t, language } = useLanguage();
  const { location } = useLocation();
  const { weather } = useWeather();
  const { speak } = useMultilingualSpeech();

  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState(null);
  const [autoRead, setAutoRead] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const activeCropName = currentAnalysis?.cropName || currentAnalysis?.aiAnalysis?.crop || cropName || 'Tomato';
  const localizedCropName = getLocalizedCropName(activeCropName, language);
  const activeCondition = currentAnalysis?.aiAnalysis?.condition;
  const localizedCondition = activeCondition ? getLocalizedDiseaseName(activeCondition, language) : null;
  const riskScore = currentAnalysis?.riskAssessment?.riskScore;

  const handleAskQuestion = async (textToSubmit) => {
    const qText = typeof textToSubmit === 'string' ? textToSubmit : question;
    if (!qText || !qText.trim()) return;

    setErrorMsg(null);
    setLoading(true);
    setAiAnswer(null);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: qText.trim(),
          currentAnalysis,
          cropName: activeCropName,
          language,
          location,
          weather
        })
      });

      const data = await res.json();
      if (data.success && data.answer) {
        setAiAnswer(data.answer);

        // Auto read aloud if enabled
        if (autoRead) {
          speak(null, data.answer);
        }
      } else {
        throw new Error(data.message || 'Unable to get answer from AI.');
      }
    } catch (err) {
      console.error('Ask AI error:', err);
      setErrorMsg(err.message || 'Unable to connect to AgriShield AI assistant.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceTranscript = (spokenText) => {
    setQuestion(spokenText);
    handleAskQuestion(spokenText);
  };

  return (
    <div className="glass-card" style={{ padding: '22px', border: '1px solid #E5EAE6' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: '#DCFCE7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MessageSquare size={18} color="#16A34A" aria-hidden="true" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#17211B', fontWeight: 700 }}>
              {t('ask.title')}
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#647067', margin: 0 }}>
              {t('ask.subtitle')}
            </p>
          </div>
        </div>

        {/* Current Analysis Context Badge */}
        {localizedCondition && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.75rem',
            background: '#F0FDF4',
            color: '#15803D',
            padding: '4px 10px',
            borderRadius: 8,
            border: '1px solid #BBF7D0',
            fontWeight: 600
          }}>
            <Info size={13} color="#16A34A" aria-hidden="true" />
            <span>{localizedCropName}: {localizedCondition} {riskScore ? `(${riskScore}% risk)` : ''}</span>
          </div>
        )}
      </div>

      {/* Input Form with Voice Button & Ask AI Submit */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="text"
            placeholder={t('ask.placeholder')}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAskQuestion();
              }
            }}
            className="input-field"
            style={{ flex: 1, padding: '10px 14px' }}
          />

          {/* Voice Input Button 🎙️ */}
          <VoiceInputButton
            onTranscript={handleVoiceTranscript}
            compact={true}
          />

          {/* Submit Ask AI Button */}
          <button
            type="button"
            onClick={() => handleAskQuestion()}
            disabled={loading || !question.trim()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 16px',
              borderRadius: 10,
              background: loading || !question.trim() ? '#9CA3AF' : '#16A34A',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: loading || !question.trim() ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? <Loader2 size={16} className="spin" color="#FFFFFF" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
            <span>{t('ask.button')}</span>
          </button>
        </div>

        {/* Auto Read Aloud Option Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#647067' }}>
          <input
            type="checkbox"
            id="autoReadCheckbox"
            checked={autoRead}
            onChange={(e) => setAutoRead(e.target.checked)}
            style={{ cursor: 'pointer', accentColor: '#16A34A' }}
          />
          <label htmlFor="autoReadCheckbox" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Volume2 size={14} color="#16A34A" aria-hidden="true" />
            <span>{t('ask.autoSpeech')}</span>
          </label>
        </div>
      </div>

      {/* Error Notice */}
      {errorMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#FEE2E2',
          border: '1px solid #FCA5A5',
          borderRadius: 8,
          padding: '8px 12px',
          color: '#DC2626',
          fontSize: '0.82rem',
          marginTop: 12
        }}>
          <AlertCircle size={16} color="#DC2626" aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* AI Answer Display Card */}
      {aiAnswer && (
        <div style={{
          marginTop: 14,
          padding: '16px',
          background: '#F0FDF4',
          border: '1.5px solid #BBF7D0',
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803D', fontWeight: 700, fontSize: '0.85rem' }}>
              <Sparkles size={16} color="#16A34A" aria-hidden="true" />
              <span>{t('appName')} AI</span>
            </div>

            {/* Read Answer Aloud Button */}
            <ReadAloudButton text={aiAnswer} />
          </div>

          <p style={{ color: '#17211B', fontSize: '0.92rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            {aiAnswer}
          </p>
        </div>
      )}
    </div>
  );
};

export default AskAiCard;
