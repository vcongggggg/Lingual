'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Trophy, Star, Sparkles, RotateCcw, ArrowRight, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@linguaflow/ui';
import { mascotReactions } from '@linguaflow/config';
import { arcadeAudio } from '@/lib/arcadeAudio';

interface VictoryOverlayProps {
  score: number;
  xpEarned: number;
  maxCombo: number;
  accuracy: number;
  onPlayAgain: () => void;
  onExit: () => void;
  locale?: string;
}

export default function VictoryOverlay({
  score,
  xpEarned,
  maxCombo,
  accuracy,
  onPlayAgain,
  onExit,
  locale = 'vi',
}: VictoryOverlayProps) {
  const isVi = locale === 'vi';

  useEffect(() => {
    arcadeAudio.playVictoryFanfare();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/40 shadow-2xl text-center space-y-6 overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-500/20 blur-3xl rounded-full pointer-events-none" />

        {/* Mascot Victory Reaction */}
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="relative w-24 h-24 mx-auto drop-shadow-[0_8px_20px_rgba(245,158,11,0.4)]"
        >
          <Image
            src={mascotReactions.celebrate_big || mascotReactions.greet}
            alt="LingLing Victory Dance"
            fill
            unoptimized
            className="object-contain"
          />
        </motion.div>

        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>{isVi ? 'Chiến Thắng Xuất Sắc!' : 'Stage Cleared!'}</span>
          </div>
          <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
            {score.toLocaleString()} <span className="text-amber-400 text-lg">PTS</span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">XP Thưởng</span>
            <span className="text-lg font-mono font-extrabold text-teal-300">+{xpEarned}</span>
          </div>
          <div className="space-y-0.5 border-x border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Max Combo</span>
            <span className="text-lg font-mono font-extrabold text-amber-400">{maxCombo}x</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Chính Xác</span>
            <span className="text-lg font-mono font-extrabold text-purple-300">{accuracy}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onExit}
            className="flex-1"
          >
            {isVi ? 'Thoát Arcade' : 'Exit'}
          </Button>

          <Button
            variant="accent"
            onClick={() => {
              arcadeAudio.playCoin();
              onPlayAgain();
            }}
            className="flex-1"
            icon={<RotateCcw className="w-4 h-4" />}
          >
            {isVi ? 'Chơi Lại' : 'Play Again'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
