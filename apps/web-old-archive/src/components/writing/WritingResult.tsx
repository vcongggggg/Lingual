'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Sparkles, RotateCcw, ArrowRight, BookOpen, Brain, PenTool } from 'lucide-react';
import { WritingResult as IWritingResult } from '@linguaflow/domain';
import LingLingMascot from '../LingLingMascot';
import WritingFeedback from './WritingFeedback';
import WritingCorrections from './WritingCorrections';
import WritingVocabularySuggestions from './WritingVocabularySuggestions';
import { Button, Card, useMotionAccessibility, springPresets } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';
import { motion } from 'framer-motion';

interface WritingResultProps {
  result: IWritingResult;
  onRetry?: () => void;
  locale: string;
}

export default function WritingResult({ result, onRetry, locale }: WritingResultProps) {
  const { shouldReduceMotion } = useMotionAccessibility();

  useEffect(() => {
    if (result.score >= 75) {
      sfx.playVictory();
    } else {
      sfx.playCorrect();
    }

    // Sync XP with header badges
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('lingual_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          parsed.totalXP = (parsed.totalXP || 0) + result.xpAwarded;
          localStorage.setItem('lingual_user', JSON.stringify(parsed));
          window.dispatchEvent(
            new CustomEvent('linguaflow_xp_update', {
              detail: { totalXP: parsed.totalXP, streakDays: parsed.currentStreak || 1 },
            })
          );
        }
      } catch {}
    }
  }, [result.score, result.xpAwarded]);

  const mascotState = result.score >= 80 ? 'celebrating' : result.score >= 60 ? 'speaking' : 'apologetic';

  return (
    <motion.div
      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={springPresets.smooth}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Top Banner with LingLing Mascot */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-teal-500/30 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <PenTool className="w-3.5 h-3.5" />
            <span>Kết quả Đánh giá Bài viết</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            {result.score >= 80 ? 'Bài viết xuất sắc! 🎉' : result.score >= 60 ? 'Rất tốt, hãy tiếp tục phát huy! 👍' : 'Cố gắng lên nhé! 💪'}
          </h1>
          <p className="text-sm text-slate-300">
            Tổng số từ: <strong className="text-white font-mono">{result.wordCount}</strong> • Kinh nghiệm nhận được:{' '}
            <strong className="text-amber-400 font-mono">+{result.xpAwarded} XP</strong>
          </p>
        </div>

        <div className="shrink-0">
          <LingLingMascot state={mascotState} size={96} />
        </div>
      </div>

      {/* User Submission Original Box */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Đoạn văn bạn đã viết:
        </span>
        <p className="text-base text-slate-200 leading-relaxed font-serif italic bg-slate-900/60 p-4 rounded-2xl border border-slate-850">
          "{result.content}"
        </p>
      </div>

      {/* Feedback Breakdown */}
      <WritingFeedback feedback={result.feedback} />

      {/* Grammar & Spelling Corrections */}
      <WritingCorrections corrections={result.corrections} />

      {/* Vocabulary Suggestions */}
      <WritingVocabularySuggestions suggestions={result.vocabularySuggestions} />

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        {onRetry && (
          <Button
            variant="outline"
            onClick={onRetry}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Viết lại bài này
          </Button>
        )}

        <Link href={`/${locale}/writing`}>
          <Button
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Quay lại Writing Lab
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
