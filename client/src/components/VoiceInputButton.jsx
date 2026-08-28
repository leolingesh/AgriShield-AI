import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import useVoiceInput from '../hooks/useVoiceInput';
import { Mic, MicOff, Loader2, AlertCircle } from 'lucide-react';

export const VoiceInputButton = ({
  onTranscript,
  compact = false,
  placeholderText = '',
  style = {},
  className = ''
}) => {
  const { t, currentLanguage } = useLanguage();
  const {
    startListening,
    stopListening,
    isListening,
    isProcessing,
    interimTranscript,
    transcript,
    isSupported,
    error
  } = useVoiceInput();

  const handleToggleListening = (e) => {
    e.preventDefault();
    if (isListening) {
      stopListening();
    } else {
      startListening({
        onFinal: (text) => {
          if (onTranscript && text) {
            onTranscript(text);
          }
        }
      });
    }
  };

  const getButtonText = () => {
    if (isProcessing) return t('voice.processing', 'Processing...');
    if (isListening) return t('voice.stop', 'Stop Listening');
    return t('voice.speak', 'Speak');
  };

  const ariaLabel = isListening
    ? t('voice.stop', 'Stop Listening')
    : `${t('voice.speak', 'Speak')} (${currentLanguage?.nativeName || 'Voice'})`;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start', ...style }} className={className}>
      <button
        type="button"
        onClick={handleToggleListening}
        disabled={isProcessing}
        aria-label={ariaLabel}
        aria-pressed={isListening}
        aria-live="polite"
        title={ariaLabel}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: compact ? 4 : 6,
          padding: compact ? '6px 10px' : '8px 14px',
          borderRadius: 10,
          background: isListening 
            ? '#FEE2E2' 
            : isProcessing 
              ? '#FEF3C7' 
              : '#DCFCE7',
          color: isListening 
            ? '#DC2626' 
            : isProcessing 
              ? '#B45309' 
              : '#15803D',
          border: isListening 
            ? '1.5px solid #FCA5A5' 
            : isProcessing 
              ? '1.5px solid #FDE68A' 
              : '1.5px solid #86EFAC',
          fontSize: compact ? '0.78rem' : '0.85rem',
          fontWeight: 700,
          cursor: isProcessing ? 'wait' : 'pointer',
          transition: 'all 0.2s ease',
          outline: 'none',
          boxShadow: isListening ? '0 0 12px rgba(220, 38, 38, 0.25)' : '0 2px 6px rgba(0, 0, 0, 0.04)'
        }}
      >
        {isProcessing ? (
          <Loader2 size={compact ? 14 : 16} className="spin" color="#B45309" />
        ) : isListening ? (
          <span style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#DC2626',
            animation: 'pulse 1.2s infinite'
          }} />
        ) : (
          <Mic size={compact ? 14 : 16} color="#16A34A" />
        )}

        <span>{getButtonText()}</span>

        {!compact && (
          <span style={{
            fontSize: '0.7rem',
            background: '#FFFFFF',
            color: '#15803D',
            padding: '2px 6px',
            borderRadius: 6,
            border: '1px solid #DCFCE7',
            fontWeight: 600
          }}>
            {currentLanguage?.nativeName || 'Voice'}
          </span>
        )}
      </button>

      {/* Live Interim Transcript Badge */}
      {(isListening || isProcessing || interimTranscript) && (
        <div 
          aria-live="polite"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.8rem',
            color: '#15803D',
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: 8,
            padding: '6px 12px',
            maxWidth: 360,
            boxShadow: '0 2px 8px rgba(22, 163, 74, 0.08)'
          }}
        >
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#16A34A',
            flexShrink: 0
          }} />
          <span style={{ fontStyle: 'italic', fontWeight: 500 }}>
            {interimTranscript || transcript || t('voice.listening', 'Listening...')}
          </span>
        </div>
      )}

      {/* Error notice if permission or speech error */}
      {error && !isListening && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.75rem',
          color: '#DC2626',
          background: '#FEE2E2',
          border: '1px solid #FCA5A5',
          borderRadius: 6,
          padding: '4px 8px',
          marginTop: 2
        }}>
          <AlertCircle size={14} color="#DC2626" style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default VoiceInputButton;
