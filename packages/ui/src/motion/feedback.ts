import type { Variants } from 'framer-motion';
import { transitionPresets } from './transitions';

/**
 * Lingual Motion System — Interactive Learning Feedback Variants
 */

/**
 * Localized Card / Item Shake for Wrong Answers (Non-disruptive, isolated)
 */
export const localShakeVariants: Variants = {
  idle: { x: 0, rotate: 0 },
  shake: {
    x: [0, -5, 5, -3, 3, 0],
    rotate: [0, -1, 1, -0.5, 0.5, 0],
    transition: {
      duration: 0.35,
      ease: 'easeInOut',
    },
  },
};

/**
 * Success Pulse for Correct Answers & Milestone Completion
 */
export const successPulseVariants: Variants = {
  idle: { scale: 1 },
  pulse: {
    scale: [1, 1.025, 1],
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
};

/**
 * Checkmark / Icon Pop-in Variant
 */
export const checkMarkPopVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: [0, 1.2, 1],
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

/**
 * Feedback Sound Trigger Deduplicator Guard
 * Prevents duplicate Web Audio API triggers during React StrictMode / rerenders
 */
let lastAudioTriggerTime = 0;
const AUDIO_COOLDOWN_MS = 200;

export function canPlayFeedbackAudio(): boolean {
  const now = Date.now();
  if (now - lastAudioTriggerTime < AUDIO_COOLDOWN_MS) {
    return false;
  }
  lastAudioTriggerTime = now;
  return true;
}
