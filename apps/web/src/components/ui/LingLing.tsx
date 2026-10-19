'use client';

import React from 'react';
import Image from 'next/image';

import { MASCOT_REGISTRY, MascotPose } from '../mascot';

export type LingLingReaction = MascotPose;

export interface LingLingProps {
  reaction?: LingLingReaction;
  bubbleText?: string;
  bubblePosition?: 'top' | 'right' | 'bottom' | 'left';
  size?: number;
  animate?: boolean;
  className?: string;
}

export function LingLing({
  reaction = 'greet',
  bubbleText,
  bubblePosition = 'top',
  size = 96,
  animate = true,
  className = '',
}: LingLingProps) {
  const imageSrc = MASCOT_REGISTRY[reaction] || MASCOT_REGISTRY.studying;

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Speech Bubble nếu có */}
      {bubbleText && (
        <div
          className={`absolute z-20 max-w-[220px] bg-card border-2 border-ink rounded-xl px-3 py-2 text-xs font-semibold leading-relaxed shadow-brutal-sm text-ink pointer-events-none whitespace-normal ${
            bubblePosition === 'top'
              ? '-top-12 left-1/2 -translate-x-1/2 after:content-[""] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-card after:filter after:drop-shadow-[0_2px_0_#211A13]'
              : bubblePosition === 'right'
              ? 'left-full ml-3 top-1/2 -translate-y-1/2'
              : '-bottom-12 left-1/2 -translate-x-1/2'
          }`}
        >
          <span className="text-red font-black">LingLing: </span>
          {bubbleText}
        </div>
      )}

      {/* Mascot Image */}
      <div
        className={`relative ${animate ? 'animate-mascot' : ''}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={imageSrc}
          alt={`LingLing Cow Mascot - ${reaction}`}
          fill
          unoptimized
          className="object-contain filter drop-shadow-[0_8px_16px_rgba(33,26,19,0.18)] pointer-events-none"
        />
      </div>
    </div>
  );
}
