'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { mascotReactions } from '@linguaflow/config';

export type MascotState = 'idle' | 'thinking' | 'speaking' | 'celebrating' | 'apologetic';

interface LingLingMascotProps {
  state?: MascotState;
  className?: string;
  size?: number;
}

const stateAssetMap: Record<MascotState, string> = {
  idle: mascotReactions.idle_empty,
  thinking: mascotReactions.focus_mode,
  speaking: mascotReactions.greet,
  celebrating: mascotReactions.celebrate_big,
  apologetic: mascotReactions.wrong_mild,
};

export default function LingLingMascot({
  state = 'idle',
  className = '',
  size = 48,
}: LingLingMascotProps) {
  const shouldReduceMotion = useReducedMotion();
  const stickerSrc = stateAssetMap[state] || mascotReactions.greet;

  // Motion variants for smooth state transition & idle scale pulse
  const containerVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: shouldReduceMotion
      ? { scale: 1, opacity: 1 }
      : state === 'idle'
      ? {
          scale: [0.98, 1.04, 0.98],
          opacity: 1,
          transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
        }
      : {
          scale: [0.85, 1.12, 1],
          opacity: 1,
          transition: { type: 'spring', stiffness: 400, damping: 20 },
        },
  };

  return (
    <motion.div
      key={state}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={stickerSrc}
        alt={`LingLing Cow Mascot - ${state}`}
        className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)] pointer-events-none"
      />
    </motion.div>
  );
}
