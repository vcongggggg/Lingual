'use client';

import React from 'react';
import { Flame, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ComboMeterProps {
  combo: number;
  maxCombo?: number;
  className?: string;
}

export default function ComboMeter({ combo, maxCombo = 5, className = '' }: ComboMeterProps) {
  const isHighCombo = combo >= 3;
  const isUltra = combo >= 5;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border transition-all duration-300 font-sans shadow-lg ${
        isUltra
          ? 'bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-rose-500/30 border-amber-400 text-amber-300 shadow-amber-500/20 animate-pulse'
          : isHighCombo
          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
          : 'bg-slate-900/80 border-slate-800 text-slate-300'
      } ${className}`}
    >
      <motion.div
        key={combo}
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: [1, 1.25, 1], rotate: [0, 8, 0] }}
        transition={{ duration: 0.25 }}
        className="flex items-center gap-1"
      >
        {isUltra ? (
          <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-bounce" />
        ) : isHighCombo ? (
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
        ) : (
          <Sparkles className="w-4 h-4 text-teal-400" />
        )}
        <span className="font-mono font-extrabold text-sm tracking-wide">
          {combo}x COMBO
        </span>
      </motion.div>

      {isUltra && (
        <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider">
          🔥 ULTRA
        </span>
      )}
    </div>
  );
}
