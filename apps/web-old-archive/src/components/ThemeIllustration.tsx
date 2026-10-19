'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type IllustrationType =
  | 'dashboard'
  | 'ielts'
  | 'empty_state'
  | 'unit_family'
  | 'unit_greetings'
  | 'unit_travel'
  | 'unit_business'
  | 'game_match'
  | 'game_scramble'
  | 'game_typing'
  | 'game_blitz';

interface ThemeIllustrationProps {
  type: IllustrationType;
  className?: string;
  size?: number;
}

export default function ThemeIllustration({
  type,
  className = '',
  size = 120,
}: ThemeIllustrationProps) {
  switch (type) {
    case 'dashboard':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-[0_8px_24px_rgba(20,184,166,0.25)] ${className}`}
        >
          <defs>
            <linearGradient id="dashGrad1" x1="0" y1="0" x2="200" y2="200">
              <stop offset="0%" stopColor="#14B8A6" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
            <linearGradient id="dashGrad2" x1="200" y1="0" x2="0" y2="200">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>

          {/* Floating Game Console & Crown Illustration */}
          <rect x="25" y="45" width="150" height="110" rx="32" fill="url(#dashGrad1)" opacity="0.9" />
          <rect x="33" y="53" width="134" height="94" rx="26" fill="#0F172A" stroke="#334155" strokeWidth="2" />

          {/* D-Pad Buttons */}
          <path d="M 60 85 H 80 V 105 H 60 Z" fill="#14B8A6" />
          <path d="M 65 75 H 75 V 115 H 65 Z" fill="#14B8A6" />

          {/* Action Buttons */}
          <circle cx="125" cy="85" r="7" fill="#F43F5E" />
          <circle cx="140" cy="100" r="7" fill="#F59E0B" />

          {/* Floating Trophy & Spark */}
          <path d="M 100 20 L 108 36 L 126 38 L 112 50 L 116 68 L 100 58 L 84 68 L 88 50 L 74 38 L 92 36 Z" fill="#F59E0B" />
        </svg>
      );

    case 'ielts':
      return (
        <svg
          width={size * 1.5}
          height={size}
          viewBox="0 0 300 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-[0_8px_24px_rgba(139,92,246,0.25)] ${className}`}
        >
          <defs>
            <linearGradient id="ieltsGrad" x1="0" y1="0" x2="300" y2="200">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>

          {/* IELTS Open Book & Certificate Graphic */}
          <rect x="30" y="40" width="240" height="130" rx="24" fill="url(#ieltsGrad)" opacity="0.85" />
          <rect x="38" y="48" width="224" height="114" rx="18" fill="#0F172A" stroke="#475569" strokeWidth="2" />

          {/* Left Page Column Lines */}
          <rect x="55" y="68" width="85" height="10" rx="5" fill="#8B5CF6" />
          <rect x="55" y="86" width="75" height="6" rx="3" fill="#64748B" />
          <rect x="55" y="98" width="80" height="6" rx="3" fill="#64748B" />
          <rect x="55" y="110" width="60" height="6" rx="3" fill="#64748B" />

          {/* Right Page Column Band Score Badge */}
          <rect x="160" y="68" width="85" height="10" rx="5" fill="#EC4899" />
          <circle cx="200" cy="115" r="22" fill="#8B5CF6" opacity="0.2" />
          <circle cx="200" cy="115" r="18" fill="#8B5CF6" stroke="#C084FC" strokeWidth="2" />
          <text x="200" y="121" fill="#FFFFFF" fontSize="14" fontWeight="800" textAnchor="middle" fontStyle="sans-serif">
            8.5
          </text>
        </svg>
      );

    case 'empty_state':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-[0_4px_16px_rgba(245,158,11,0.2)] ${className}`}
        >
          <defs>
            <linearGradient id="emptyGrad" x1="0" y1="0" x2="200" y2="200">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>
          </defs>

          {/* Empty Rocket & Cloud Scene */}
          <circle cx="100" cy="100" r="70" fill="url(#emptyGrad)" opacity="0.15" />
          <path
            d="M 100 35 C 115 65 125 90 120 120 L 100 110 L 80 120 C 75 90 85 65 100 35 Z"
            fill="url(#emptyGrad)"
          />
          <circle cx="100" cy="70" r="8" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M 85 115 L 70 135 L 88 128 Z" fill="#F43F5E" />
          <path d="M 115 115 L 130 135 L 112 128 Z" fill="#F43F5E" />
        </svg>
      );

    case 'unit_family':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" fill="#F43F5E" opacity="0.15" />
          <path d="M 35 45 A 8 8 0 0 1 45 45 C 45 55 35 62 35 62 C 35 62 25 55 25 45 A 8 8 0 0 1 35 45 Z" fill="#F43F5E" />
          <path d="M 65 45 A 8 8 0 0 1 75 45 C 75 55 65 62 65 62 C 65 62 55 55 55 45 A 8 8 0 0 1 65 45 Z" fill="#F43F5E" />
        </svg>
      );

    case 'unit_greetings':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" fill="#14B8A6" opacity="0.15" />
          <rect x="28" y="32" width="44" height="30" rx="10" fill="#14B8A6" />
          <path d="M 40 62 L 32 72 L 48 62 Z" fill="#14B8A6" />
        </svg>
      );

    case 'unit_travel':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" fill="#3B82F6" opacity="0.15" />
          <path d="M 25 50 L 75 30 L 60 55 L 75 75 Z" fill="#3B82F6" />
        </svg>
      );

    case 'unit_business':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" fill="#F59E0B" opacity="0.15" />
          <rect x="30" y="40" width="40" height="30" rx="6" fill="#F59E0B" />
          <path d="M 42 40 V 32 H 58 V 40 Z" stroke="#F59E0B" strokeWidth="3" fill="none" />
        </svg>
      );

    case 'game_match':
    case 'game_scramble':
    case 'game_typing':
    case 'game_blitz':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="opacity-30">
          <circle cx="50" cy="50" r="45" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="50" cy="50" r="25" fill="#1E293B" />
        </svg>
      );
  }
}
