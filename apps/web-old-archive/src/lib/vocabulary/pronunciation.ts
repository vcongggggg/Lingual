/**
 * Vocabulary Pronunciation Audio Helper
 * Provides US ('en-US') and UK ('en-GB') natural pronunciation via Web Speech API.
 */

import { sfx } from '@/lib/soundEffects';

export type PronunciationAccent = 'US' | 'UK';

export function playWordPronunciation(
  text: string,
  accent: PronunciationAccent = 'US',
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  // If SFX is muted by user setting, do not blast sound
  if (sfx.isMuted()) {
    return false;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = accent === 'UK' ? 'en-GB' : 'en-US';
  utterance.rate = 0.88; // Natural, clear pedagogical pace

  // Try to find a high-quality regional voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    const targetLang = accent === 'UK' ? 'en-GB' : 'en-US';
    const matchingVoice = voices.find((v) => v.lang === targetLang || v.lang.startsWith(targetLang.slice(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  try {
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
}
