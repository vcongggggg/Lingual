'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export type MascotState = 'idle' | 'thinking' | 'speaking' | 'celebrating' | 'apologetic';

interface LingLingMascotProps {
  state?: MascotState;
  className?: string;
  size?: number;
}

export default function LingLingMascot({
  state = 'idle',
  className = '',
  size = 40,
}: LingLingMascotProps) {
  const shouldReduceMotion = useReducedMotion();

  // Color theme gradients based on mascot state
  const getGradientColors = () => {
    switch (state) {
      case 'thinking':
        return { start: '#F59E0B', mid: '#EC4899', end: '#14B8A6' }; // Amber -> Pink -> Teal
      case 'speaking':
        return { start: '#14B8A6', mid: '#3B82F6', end: '#F59E0B' }; // Teal -> Blue -> Amber
      case 'celebrating':
        return { start: '#FBBF24', mid: '#F43F5E', end: '#10B981' }; // Bright Yellow -> Rose -> Emerald
      case 'apologetic':
        return { start: '#D97706', mid: '#EA580C', end: '#B45309' }; // Warm Amber -> Orange (no harsh red)
      case 'idle':
      default:
        return { start: '#F43F5E', mid: '#F59E0B', end: '#14B8A6' }; // Coral -> Amber -> Teal
    }
  };

  const gradient = getGradientColors();
  const gradientId = `lingling-grad-${state}-${size}`;

  // Framer Motion Animation Variants per State
  const bodyVariants = {
    idle: shouldReduceMotion
      ? { scale: 1 }
      : {
          y: [0, -3, 0],
          scale: [0.98, 1.02, 0.98],
          transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
        },
    thinking: shouldReduceMotion
      ? { rotate: 0 }
      : {
          rotate: [-4, 6, -4],
          y: [0, -2, 0],
          transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
        },
    speaking: shouldReduceMotion
      ? { scale: 1 }
      : {
          scale: [1, 1.05, 0.98, 1.04, 1],
          y: [0, -1, 0, -2, 0],
          transition: { repeat: Infinity, duration: 0.4 },
        },
    celebrating: shouldReduceMotion
      ? { y: 0 }
      : {
          y: [-5, 4, -5],
          rotate: [0, 8, -8, 0],
          scale: [1, 1.1, 1],
          transition: { repeat: Infinity, duration: 0.6 },
        },
    apologetic: shouldReduceMotion
      ? { y: 0 }
      : {
          y: [0, 3, 0],
          rotate: [0, -3, 0],
          transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
        },
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        variants={bodyVariants}
        animate={state}
        className="drop-shadow-[0_4px_12px_rgba(244,63,94,0.3)]"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradient.start} />
            <stop offset="50%" stopColor={gradient.mid} />
            <stop offset="100%" stopColor={gradient.end} />
          </linearGradient>

          {/* Radial Glow Filter */}
          <filter id="mascotGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Aura Glow */}
        <circle cx="50" cy="50" r="42" fill={gradient.start} opacity="0.15" filter="url(#mascotGlow)" />

        {/* 4 Point Star Body - Motif from Lingual Logo ⭐ */}
        <path
          d="M 50 8 C 55 32, 68 45, 92 50 C 68 55, 55 68, 50 92 C 45 68, 32 55, 8 50 C 32 45, 45 32, 50 8 Z"
          fill={`url(#${gradientId})`}
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Core Inner Shimmer */}
        <path
          d="M 50 18 C 53 36, 64 47, 82 50 C 64 53, 53 64, 50 82 C 47 64, 36 53, 18 50 C 36 47, 47 36, 50 18 Z"
          fill="#FFFFFF"
          opacity="0.15"
        />

        {/* EYES & FACE EXPRESSIONS PER STATE */}
        {state === 'celebrating' ? (
          /* Joyful '^ ^' Eyes & Open Mouth */
          <g>
            <path d="M 36 45 Q 41 38 46 45" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 54 45 Q 59 38 64 45" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 43 55 Q 50 64 57 55 Z" fill="#0F172A" />
            {/* Sparkle effects around head */}
            <circle cx="20" cy="25" r="3" fill="#FBBF24" className="animate-ping" />
            <circle cx="80" cy="25" r="3" fill="#10B981" className="animate-ping" />
          </g>
        ) : state === 'apologetic' ? (
          /* Sad 'u u' Eyes & Small Mouth */
          <g>
            <path d="M 36 43 Q 41 48 46 43" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 54 43 Q 59 48 64 43" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
            <ellipse cx="50" cy="57" rx="3" ry="2" fill="#0F172A" />
          </g>
        ) : state === 'thinking' ? (
          /* Upward Looking Eyes & Pondering Mouth */
          <g>
            <circle cx="40" cy="42" r="4.5" fill="#0F172A" />
            <circle cx="41" cy="40" r="1.5" fill="#FFFFFF" />
            <circle cx="60" cy="42" r="4.5" fill="#0F172A" />
            <circle cx="61" cy="40" r="1.5" fill="#FFFFFF" />
            <path d="M 46 56 Q 50 52 54 56" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Floating Thinking Dots */}
            <motion.circle
              cx="74"
              cy="24"
              r="2.5"
              fill="#F59E0B"
              animate={{ scale: [0.8, 1.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
            <motion.circle
              cx="82"
              cy="16"
              r="3.5"
              fill="#14B8A6"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
            />
          </g>
        ) : state === 'speaking' ? (
          /* Animated Mouth for Speaking Token Stream */
          <g>
            <circle cx="39" cy="44" r="4.5" fill="#0F172A" />
            <circle cx="37.5" cy="42.5" r="1.5" fill="#FFFFFF" />
            <circle cx="61" cy="44" r="4.5" fill="#0F172A" />
            <circle cx="59.5" cy="42.5" r="1.5" fill="#FFFFFF" />
            <motion.ellipse
              cx="50"
              cy="56"
              rx="5"
              ry="4"
              fill="#0F172A"
              animate={shouldReduceMotion ? {} : { ry: [2, 5, 2] }}
              transition={{ repeat: Infinity, duration: 0.3 }}
            />
          </g>
        ) : (
          /* Default Idle Blinking Face */
          <g>
            <circle cx="39" cy="44" r="4.5" fill="#0F172A" />
            <circle cx="37.5" cy="42.5" r="1.5" fill="#FFFFFF" />
            <circle cx="61" cy="44" r="4.5" fill="#0F172A" />
            <circle cx="59.5" cy="42.5" r="1.5" fill="#FFFFFF" />
            <path d="M 44 55 Q 50 60 56 55" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Cute Cheek Blushes */}
            <circle cx="31" cy="50" r="3" fill="#F43F5E" opacity="0.3" />
            <circle cx="69" cy="50" r="3" fill="#F43F5E" opacity="0.3" />
          </g>
        )}
      </motion.svg>
    </div>
  );
}
