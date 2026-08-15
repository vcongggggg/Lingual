'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Sparkles, Brain, RotateCcw, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { VocabularyPracticeResult as IVocabularyPracticeResult } from '@linguaflow/domain';
import LingLingMascot from '../../LingLingMascot';
import { sfx } from '@/lib/soundEffects';
import { Button, Card, useMotionAccessibility, springPresets } from '@linguaflow/ui';
import { motion } from 'framer-motion';

interface VocabularyPracticeResultProps {
  result: IVocabularyPracticeResult;
  onRetry: () => void;
  locale: string;
}

export default function VocabularyPracticeResult({
  result,
  onRetry,
  locale,
}: VocabularyPracticeResultProps) {
  const { shouldReduceMotion } = useMotionAccessibility();

  useEffect(() => {
    sfx.playVictory();

    // Sync XP to header badges
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('lingual_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          parsed.totalXP = (parsed.totalXP || 0) + result.xpEarned;
          localStorage.setItem('lingual_user', JSON.stringify(parsed));
          window.dispatchEvent(
            new CustomEvent('linguaflow_xp_update', {
              detail: { totalXP: parsed.totalXP, streakDays: parsed.currentStreak || 1 },
            })
          );
        }
      } catch {}
    }
  }, [result.xpEarned]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={springPresets.smooth}
      className="w-full max-w-2xl mx-auto rounded-3xl bg-slate-900/90 border border-teal-500/30 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center"
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
            Hoàn thành bài luyện từ vựng! 🎉
          </h2>
          <p className="text-sm font-medium text-teal-300">
            Dữ liệu ôn tập đã tự động cập nhật vào thuật toán lặp lại ngắt quãng (SM-2 SRS).
          </p>
        </div>
      </div>

      {/* Metrics Highlights Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Độ chính xác</span>
          <p className="text-2xl font-display font-extrabold text-teal-400">
            {result.accuracy}%
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Số câu đúng</span>
          <p className="text-2xl font-display font-extrabold text-emerald-400">
            {result.correctCount}/{result.totalQuestions}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kinh nghiệm</span>
          <p className="text-2xl font-display font-extrabold text-amber-400 flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4" />
            +{result.xpEarned} XP
          </p>
        </div>
      </div>

      {/* Words Needing Review List */}
      {result.missedWords.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-left space-y-2">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <XCircle className="w-4 h-4" />
            <span>Các từ cần củng cố thêm ({result.missedWords.length}):</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {result.missedWords.map((word, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* SRS Flashcards Link Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-slate-950 to-amber-500/10 border border-teal-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-500/20 text-teal-300">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Xem lịch ôn tập Spaced Repetition</h4>
            <p className="text-xs text-slate-400">Kiểm tra chu kỳ ôn tập các thẻ đến hạn</p>
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

      {/* CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onRetry}
          icon={<RotateCcw className="w-4 h-4" />}
        >
          Luyện tập lại
        </Button>

        <Link href={`/${locale}/vocabulary`}>
          <Button
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Quay lại Kho từ vựng
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
