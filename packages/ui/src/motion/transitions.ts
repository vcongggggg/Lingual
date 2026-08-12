import type { Transition } from 'framer-motion';
import { springPresets } from './presets';

/**
 * Lingual Motion System — Semantic Transition Presets
 */
export type TransitionPresetName = 'micro' | 'normal' | 'reveal' | 'page' | 'spring';

export const transitionPresets: Record<TransitionPresetName, Transition> = {
  micro: {
    duration: 0.14,
    ease: [0.25, 0.1, 0.25, 1],
  },
  normal: {
    duration: 0.24,
    ease: [0.25, 0.1, 0.25, 1],
  },
  reveal: {
    duration: 0.38,
    ease: [0.16, 1, 0.3, 1],
  },
  page: {
    duration: 0.42,
    ease: [0.16, 1, 0.3, 1],
  },
  spring: springPresets.smooth,
};
