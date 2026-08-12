import type { Spring } from 'framer-motion';

/**
 * Lingual Motion System — Semantic Spring Physics Presets
 */
export type SpringPresetName = 'gentle' | 'smooth' | 'snappy' | 'bouncy' | 'mascot';

export const springPresets: Record<SpringPresetName, Spring> = {
  gentle: {
    type: 'spring',
    stiffness: 120,
    damping: 20,
  },
  smooth: {
    type: 'spring',
    stiffness: 300,
    damping: 25,
  },
  snappy: {
    type: 'spring',
    stiffness: 350,
    damping: 25,
  },
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 15,
  },
  mascot: {
    type: 'spring',
    stiffness: 300,
    damping: 20,
  },
};
