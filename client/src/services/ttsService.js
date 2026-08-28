/**
 * AgriShield AI Multilingual Text-to-Speech (TTS) Service
 * Accessible audio synthesis for all supported website languages
 */

class TextToSpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.voices = [];
    this.isSupported = Boolean(this.synth);

    if (this.isSupported) {
      this.loadVoices();
      if (typeof window !== 'undefined' && window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return [];
    try {
      this.voices = this.synth.getVoices() || [];
    } catch (e) {
      this.voices = [];
    }
    return this.voices;
  }

  /**
   * Find best voice match for target speechCode
   * Selection Priority:
   * 1. Exact locale match (e.g. 'ta-IN', 'hi-IN')
   * 2. Language-only match (e.g. 'ta', 'hi')
   * 3. Compatible regional fallback for English
   */
  getBestVoice(speechCode) {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }

    if (!speechCode) return null;

    const codeLower = speechCode.toLowerCase();
    const baseLang = codeLower.split('-')[0];

    // 1. Exact match (e.g. 'ta-IN')
    let match = this.voices.find(v => v.lang.toLowerCase() === codeLower);
    if (match) return match;

    // 2. Language prefix match (e.g. 'ta')
    match = this.voices.find(v => v.lang.toLowerCase().startsWith(baseLang));
    if (match) return match;

    // 3. English regional fallback
    if (baseLang === 'en') {
      match = this.voices.find(v => 
        v.lang.toLowerCase().includes('en-us') || 
        v.lang.toLowerCase().includes('en-gb') || 
        v.lang.toLowerCase().startsWith('en')
      );
      if (match) return match;
    }

    return null;
  }

  /**
   * Check if a native voice is available for target language on the current browser/device
   */
  isVoiceAvailableForLanguage(speechCode) {
    if (!this.isSupported) return false;
    const voice = this.getBestVoice(speechCode);
    if (!voice) return false;

    const baseLang = speechCode.split('-')[0].toLowerCase();
    const voiceLangBase = voice.lang.split('-')[0].toLowerCase();

    // For non-English languages, ensure the voice matches the language prefix
    if (baseLang !== 'en' && voiceLangBase !== baseLang) {
      return false;
    }

    return true;
  }

  speak(text, { speechCode = 'en-IN', rate = 0.95, pitch = 1.0, onStart, onEnd, onError, onPause, onResume } = {}) {
    if (!this.isSupported || !text) {
      if (onError) onError(new Error('Speech synthesis is not supported on this browser.'));
      return false;
    }

    // Always cancel ongoing speech to prevent overlapping audio
    this.stop();

    try {
      const cleanText = text
        .replace(/[*_~`#\[\]]/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .trim();

      if (!cleanText) return false;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = speechCode;

      const voice = this.getBestVoice(speechCode);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (err) => {
        this.currentUtterance = null;
        if (onError) onError(err);
      };

      utterance.onpause = () => {
        if (onPause) onPause();
      };

      utterance.onresume = () => {
        if (onResume) onResume();
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
      return true;
    } catch (err) {
      console.warn('TTS error:', err);
      if (onError) onError(err);
      return false;
    }
  }

  pause() {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  isSpeaking() {
    return Boolean(this.synth && this.synth.speaking);
  }

  isPaused() {
    return Boolean(this.synth && this.synth.paused);
  }
}

export const tts = new TextToSpeechService();
export default tts;
