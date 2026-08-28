import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import useMultilingualSpeech from '../hooks/useMultilingualSpeech';
import { Volume2, Play, Pause, Square, AlertCircle } from 'lucide-react';

export const ReadAloudButton = ({
  analysisRecord = null,
  text = '',
  cropName = '',
  condition = '',
  riskLevel = '',
  riskScore = '',
  whyText = '',
  recommendations = []
}) => {
  const { t } = useLanguage();
  const {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isVoiceAvailable,
    voiceNotice,
    currentLanguage
  } = useMultilingualSpeech();

  // Handle Play Click
  const handlePlay = () => {
    if (analysisRecord) {
      speak(analysisRecord);
    } else if (text) {
      speak(null, text);
    } else {
      // Fallback object synthesized from individual props
      const mockResult = {
        cropName,
        aiAnalysis: {
          crop: cropName,
          condition,
          confidence: 0.92,
          affectedArea: '15-20%'
        },
        riskAssessment: {
          riskLevel,
          riskScore,
          predictedThreat: condition,
          whyRiskExists: whyText
        },
        recommendations: {
          immediateActions: Array.isArray(recommendations) ? recommendations : [],
          prevention: []
        }
      };
      speak(mockResult);
    }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  const handleStop = () => {
    stop();
  };

  const ariaLabelText = isSpeaking
    ? (isPaused ? t('audio.resume', 'Resume speech') : t('audio.pause', 'Pause speech'))
    : t('audio.readAloud', 'Read report aloud in selected language');

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: isSpeaking ? '#DCFCE7' : '#F1F5F2',
        border: isSpeaking ? '1px solid #86EFAC' : '1px solid #E5EAE6',
        borderRadius: 10,
        padding: '6px 12px',
        transition: 'all 0.2s ease'
      }}>
        {!isSpeaking ? (
          <button
            type="button"
            onClick={handlePlay}
            aria-label={ariaLabelText}
            title={ariaLabelText}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#15803D',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0
            }}
          >
            <Volume2 size={18} color="#16A34A" />
            <span>{t('audio.readAloud', 'Read Aloud')}</span>
            <span style={{
              fontSize: '0.72rem',
              color: '#15803D',
              background: '#FFFFFF',
              padding: '2px 7px',
              borderRadius: 6,
              border: '1px solid #DCFCE7',
              fontWeight: 600
            }}>
              {currentLanguage?.nativeName || 'Audio'}
            </span>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803D', fontSize: '0.82rem', fontWeight: 600 }}>
              <Volume2 size={18} color="#16A34A" className="spin" />
              <span>{isPaused ? t('audio.pause', 'Pause') : t('audio.playing', 'Reading Aloud...')}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* Pause / Resume Button */}
              <button
                type="button"
                onClick={handlePauseResume}
                aria-label={isPaused ? t('audio.resume') : t('audio.pause')}
                title={isPaused ? t('audio.resume') : t('audio.pause')}
                style={{
                  padding: '5px 8px',
                  borderRadius: 6,
                  background: '#FFFFFF',
                  color: '#17211B',
                  border: '1px solid #E5EAE6',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                {isPaused ? <Play size={14} fill="#17211B" /> : <Pause size={14} fill="#17211B" />}
              </button>

              {/* Stop Button */}
              <button
                type="button"
                onClick={handleStop}
                aria-label={t('audio.stop', 'Stop')}
                title={t('audio.stop', 'Stop')}
                style={{
                  padding: '5px 8px',
                  borderRadius: 6,
                  background: '#FEE2E2',
                  color: '#DC2626',
                  border: '1px solid #FCA5A5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Square size={13} fill="#DC2626" />
                <span>{t('audio.stop', 'Stop')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Voice Unavailable Notice for Non-English languages */}
      {voiceNotice && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.75rem',
          color: '#D97706',
          background: '#FEF3C7',
          border: '1px solid #FDE68A',
          borderRadius: 6,
          padding: '4px 8px',
          marginTop: 2
        }}>
          <AlertCircle size={14} color="#D97706" style={{ flexShrink: 0 }} />
          <span>{voiceNotice}</span>
        </div>
      )}
    </div>
  );
};

export default ReadAloudButton;
