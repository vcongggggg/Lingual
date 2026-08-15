'use client';

import React, { useEffect } from 'react';
import { Trophy, Sparkles, Brain, RotateCcw, ArrowRight, CheckCircle2, Award } from 'lucide-react';
import Link from 'next/link';
import { ListeningMode } from '@linguaflow/domain';
import LingLingMascot from '../LingLingMascot';
import { sfx } from '@/lib/soundEffects';
import { Button, Card, useMotionAccessibility, springPresets } from '@linguaflow/ui';
import { motion } from 'framer-motion';

interface ListeningResultProps {
  mode: ListeningMode;
  totalExercises: number;
  completedExercises: number;
  averageAccuracy: number;
  totalXPEarned: number;
  onRetry: () => void;
  locale: string;
}

export default function ListeningResult({
  mode,
  totalExercises,
  completedExercises,
  averageAccuracy,
  totalXPEarned,
  onRetry,
  locale,
}: ListeningResultProps) {
  const { shouldReduceMotion } = useMotionAccessibility();

  // Play celebration sound and sync XP event on mount
  useEffect(() => {
    sfx.playVictory();

    // Dispatch global XP update event for header badge sync
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('lingual_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          parsed.totalXP = (parsed.totalXP || 0) + totalXPEarned;
          localStorage.setItem('lingual_user', JSON.stringify(parsed));
          window.dispatchEvent(
            new CustomEvent('linguaflow_xp_update', {
              detail: { totalXP: parsed.totalXP, streakDays: parsed.currentStreak || 1 },
            })
          );
        }
      } catch {}
    }
  }, [totalXPEarned]);

  const modeLabel = mode === 'dictation' ? 'Chép chính tả (Dictation)' : 'Nhại giọng bản xứ (Shadowing)';

  return (
    <motion.div
      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={springPresets.smooth}
      className="w-full max-w-2xl mx-auto rounded-3xl bg-slate-900/90 border border-teal-500/30 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-teal-500/10 space-y-6 text-center"
    >
      {/* Mascot & Crown Celebration */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="relative">
          <LingLingMascot state="celebrating" size={100} />
          <div className="absolute -top-3 -right-3 p-2 rounded-full bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 animate-bounce">
            <Trophy className="w-5 h-5" />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Hoàn Thành Phiên Luyện Nghe Nói! 🎉
          </h2>
          <p className="text-sm font-medium text-teal-300">
            Bạn đã xuất sắc hoàn thành bài tập {modeLabel}
          </p>
        </div>
      </div>

      {/* Metrics Highlights Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Độ chính xác</span>
          <p className="text-2xl font-display font-extrabold text-teal-400">
            {averageAccuracy}%
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Số câu đạt</span>
          <p className="text-2xl font-display font-extrabold text-emerald-400">
            {completedExercises}/{totalExercises}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kinh nghiệm</span>
          <p className="text-2xl font-display font-extrabold text-amber-400 flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4" />
            +{totalXPEarned}
          </p>
        </div>
      </div>

      {/* SRS Flashcard Next Recommendation */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-slate-950 to-amber-500/10 border border-teal-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-500/20 text-teal-300">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Ôn tập từ vựng ngắt quãng (SRS)</h4>
            <p className="text-xs text-slate-400">Củng cố các từ vựng mới vừa học trong phòng nghe</p>
          </div>
        </div>

        <Link
          href={`/${locale}/srs`}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0"
        >
          <span>Vào thẻ nhớ SRS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* CTA Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onRetry}
          icon={<RotateCcw className="w-4 h-4" />}
        >
          Luyện tập lại
        </Button>

        <Link href={`/${locale}/listening`}>
          <Button
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Quay lại Listening Lab
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
