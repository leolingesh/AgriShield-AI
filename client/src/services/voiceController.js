/**
 * AgriShield AI — Shared Voice Coordination Controller
 * Guarantees strict MUTUAL EXCLUSION:
 * Microphone listening and Speech Synthesis playback NEVER run at the same time.
 */

class VoiceController {
  constructor() {
    this.activeRecognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn({
      isListening: this.isListening,
      isSpeaking: this.isSpeaking
    }));
  }

  registerRecognition(rec) {
    this.activeRecognition = rec;
  }

  unregisterRecognition(rec) {
    if (this.activeRecognition === rec) {
      this.activeRecognition = null;
    }
  }

  /**
   * Called whenever microphone starts recording.
   * Immediately stops any ongoing Read Aloud speech synthesis.
   */
  notifyMicrophoneStart() {
    this.stopSpeechSynthesis();
    this.isListening = true;
    this.notify();
  }

  /**
   * Called whenever microphone stops.
   */
  notifyMicrophoneStop() {
    this.isListening = false;
    this.activeRecognition = null;
    this.notify();
  }

  /**
   * Called whenever Speech Synthesis starts reading.
   * Immediately stops any active microphone recognition.
   */
  notifySpeechStart() {
    this.stopMicrophone();
    this.isSpeaking = true;
    this.notify();
  }

  /**
   * Called whenever Speech Synthesis stops reading.
   */
  notifySpeechEnd() {
    this.isSpeaking = false;
    this.notify();
  }

  /**
   * Stop active microphone recording immediately
   */
  stopMicrophone() {
    if (this.activeRecognition) {
      try {
        this.activeRecognition.abort();
      } catch (e) {
        try {
          this.activeRecognition.stop();
        } catch (err) {}
      }
      this.activeRecognition = null;
    }
    this.isListening = false;
  }

  /**
   * Stop active Speech Synthesis immediately
   */
  stopSpeechSynthesis() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    this.isSpeaking = false;
  }

  /**
   * Reset all audio/voice activity (e.g. on language change or page navigation)
   */
  stopAll() {
    this.stopMicrophone();
    this.stopSpeechSynthesis();
    this.notify();
  }
}

export const voiceController = new VoiceController();
export default voiceController;
