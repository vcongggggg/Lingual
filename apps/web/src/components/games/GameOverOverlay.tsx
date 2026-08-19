'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { RotateCcw, HeartCrack, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@linguaflow/ui';
import { mascotReactions } from '@linguaflow/config';
import { arcadeAudio } from '@/lib/arcadeAudio';

interface GameOverOverlayProps {
  score: number;
  onRetry: () => void;
  onExit: () => void;
  locale?: string;
}

export default function GameOverOverlay({
  score,
  onRetry,
  onExit,
  locale = 'vi',
}: GameOverOverlayProps) {
  const isVi = locale === 'vi';

  useEffect(() => {
    arcadeAudio.playGameOver();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/30 border border-rose-500/30 shadow-2xl text-center space-y-6 overflow-hidden"
      >
        {/* Mascot Encouraging Reaction */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="relative w-24 h-24 mx-auto drop-shadow-[0_8px_16px_rgba(244,63,94,0.3)]"
        >
          <Image
            src={mascotReactions.challenge || mascotReactions.idle_empty}
            alt="LingLing Encouragement"
            fill
            unoptimized
            className="object-contain"
          />
        </motion.div>

        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-extrabold uppercase tracking-wider">
            <HeartCrack className="w-3.5 h-3.5" />
            <span>{isVi ? 'Hết Mạng Rồi!' : 'Game Over!'}</span>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white">
            {isVi ? 'Đừng nản lòng, thử lại nào!' : 'Keep going! Try once more!'}
          </h2>
          <p className="text-xs text-slate-400">
            {isVi
              ? `Bạn đã đạt ${score.toLocaleString()} điểm trong lượt chơi này.`
              : `You scored ${score.toLocaleString()} points this run.`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onExit}
            className="flex-1"
          >
            {isVi ? 'Về Menu' : 'Back to Menu'}
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              arcadeAudio.playCoin();
              onRetry();
            }}
            className="flex-1"
            icon={<RotateCcw className="w-4 h-4" />}
          >
            {isVi ? 'Thử Lại Ngay' : 'Try Again'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
