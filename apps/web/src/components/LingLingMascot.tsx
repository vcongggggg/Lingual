'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mascotReactions } from '@linguaflow/config';
import { mascotStateVariants, useMotionAccessibility, transitionPresets } from '@linguaflow/ui';

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
  const { shouldReduceMotion } = useMotionAccessibility();
  const stickerSrc = stateAssetMap[state] || mascotReactions.greet;

  const currentVariant = shouldReduceMotion
    ? { opacity: 1 }
    : mascotStateVariants[state] || mascotStateVariants.idle;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={currentVariant as any}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={shouldReduceMotion ? transitionPresets.micro : undefined}
          className="w-full h-full flex items-center justify-center"
        >
          <img
            src={stickerSrc}
            alt={`LingLing Cow Mascot - ${state}`}
            className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)] pointer-events-none"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
