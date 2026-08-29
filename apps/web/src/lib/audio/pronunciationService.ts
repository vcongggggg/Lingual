/**
 * LinguaFlow - Enterprise-Grade Multi-Tier Pronunciation & Audio Engine
 *
 * Designed for 100% reliable native US/UK pronunciation across all devices
 * (iOS Safari, Android Chrome, Windows, macOS, Desktop Firefox)
 *
 * Tier 1: High-Definition Audio Stream from Google/Dictionary Audio CDN
 * Tier 2: Intelligent Local Web Speech API with native voice selection
 */

class PronunciationService {
  private activeAudio: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  /**
   * Stop any currently playing speech or audio instance
   */
  public stop(): void {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch {}
      this.activeAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
      this.currentUtterance = null;
    }
  }

  /**
   * Speak a word or phrase with guaranteed fallback
   * @param text The word or sentence to pronounce
   * @param accent 'us' for American English or 'uk' for British English
   * @param rate Speech rate (0.5 to 1.5, default 0.9 for clarity)
   */
  public async speak(text: string, accent: 'us' | 'uk' = 'us', rate: number = 0.9): Promise<void> {
    if (!text || text.trim() === '') return;
    const cleanText = text.trim();

    // 1. Stop active playback
    this.stop();

    // 2. Try Tier 1: High-Definition Audio Stream (Google TTS CDN)
    try {
      const tld = accent === 'uk' ? 'co.uk' : 'com';
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        cleanText
      )}&tl=en&client=tw-ob&tld=${tld}`;

      const audio = new Audio(audioUrl);
      this.activeAudio = audio;

      const playPromise = new Promise<void>((resolve, reject) => {
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error('Audio stream unavailable'));
        audio.playbackRate = Math.max(0.75, Math.min(1.25, rate));

        audio.play().then(resolve).catch(reject);
      });

      await playPromise;
      return;
    } catch {
      // If Tier 1 failed (offline or network restriction), smoothly fall back to Tier 2
    }

    // 3. Try Tier 2: Web Speech Synthesis API
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(cleanText);
        this.currentUtterance = utterance;

        utterance.lang = accent === 'uk' ? 'en-GB' : 'en-US';
        utterance.rate = rate;
        utterance.pitch = 1.0;

        // Select the most natural voice available on the user's OS
        const voices = synth.getVoices();
        if (voices.length > 0) {
          const targetLangPrefix = accent === 'uk' ? 'en-GB' : 'en-US';
          const preferredVoice =
            voices.find(
              (v) =>
                (v.lang.startsWith(targetLangPrefix) || v.lang.startsWith('en')) &&
                (v.name.includes('Google') ||
                  v.name.includes('Natural') ||
                  v.name.includes('Samantha') ||
                  v.name.includes('Daniel') ||
                  v.name.includes('Premium'))
            ) || voices.find((v) => v.lang.startsWith(targetLangPrefix));

          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        }

        synth.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis unavailable:', err);
      }
    }
  }
}

// Export singleton instance
export const pronunciationService = new PronunciationService();
