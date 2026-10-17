'use client';

import React from 'react';
import { LingLing, LingLingReaction } from './ui/LingLing';

export type MascotState = 'idle' | 'thinking' | 'speaking' | 'celebrating' | 'apologetic';

interface LingLingMascotProps {
  state?: MascotState;
  className?: string;
  size?: number;
}

const stateToReaction: Record<MascotState, LingLingReaction> = {
  idle: 'greet',
  thinking: 'salute',
  speaking: 'greet',
  celebrating: 'wink',
  apologetic: 'cry',
};

export default function LingLingMascot({
  state = 'idle',
  className = '',
  size = 48,
}: LingLingMascotProps) {
  const reaction = stateToReaction[state] || 'greet';
  return <LingLing reaction={reaction} size={size} className={className} />;
}
