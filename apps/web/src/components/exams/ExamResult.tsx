'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Clock, Award, Sparkles, RotateCcw, ArrowRight, BookOpen, Brain, CheckCircle2, History } from 'lucide-react';
import { ExamResult as IExamResult } from '@linguaflow/domain';
import LingLingMascot from '../LingLingMascot';
import ExamSectionResult from './ExamSectionResult';
import ExamQuestionReview from './ExamQuestionReview';
import ExamWeaknessCard from './ExamWeaknessCard';
import ExamVocabularyReview from './ExamVocabularyReview';
import { Button, Badge, useMotionAccessibility, springPresets } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';
import { motion } from 'framer-motion';

interface ExamResultViewProps {
  result: IExamResult;
  examTitle?: string;
  onRetry?: () => void;
  locale: string;
}

export default function ExamResultView({
  result,
  examTitle = 'Bài Thi Thử',
  onRetry,
  locale,
}: ExamResultViewProps) {
  const { shouldReduceMotion } = useMotionAccessibility();

  useEffect(() => {
    if (result.accuracy >= 75) {
      sfx.playVictory();
    } else {
      sfx.playCorrect();
    }

    // Sync XP to header badges
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
  }, [result.accuracy, result.xpAwarded]);

  const mascotState =
    result.accuracy >= 80 ? 'celebrating' : result.accuracy >= 60 ? 'speaking' : 'thinking';

  const usedMinutes = Math.floor(result.elapsedSeconds / 60);
  const usedSecs = result.elapsedSeconds % 60;

  return (
    <motion.div
      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={springPresets.smooth}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Top Banner with Mascot */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-teal-500/30 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>Kết quả thi thử • {examTitle}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            {result.accuracy >= 80
              ? 'Thành tích xuất sắc! 🎉'
              : result.accuracy >= 60
              ? 'Làm bài rất tốt! 👍'
              : 'Hãy tiếp tục rèn luyện! 💪'}
          </h1>

          <p className="text-sm text-slate-300">
            Quy đổi điểm thi: <strong className="text-teal-400 font-bold font-mono">{result.scaledScoreLabel || `${result.score}/${result.maxScore}`}</strong> • Thưởng:{' '}
            <strong className="text-amber-400 font-mono">+{result.xpAwarded} XP</strong>
          </p>
        </div>

        <div className="shrink-0">
          <LingLingMascot state={mascotState} size={96} />
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Điểm số chuẩn</span>
          <p className="text-2xl font-display font-extrabold text-white">
            {result.scaledScoreLabel || `${result.score}/${result.maxScore}`}
          </p>
          <Badge variant="teal" className="text-[10px] font-bold">
            {result.grade}
          </Badge>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Độ chính xác</span>
          <p className="text-2xl font-display font-extrabold text-emerald-400">
            {result.accuracy}%
          </p>
          <span className="text-[11px] text-slate-500">
            {result.score}/{result.maxScore} câu đúng
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Thời gian làm bài</span>
          <p className="text-2xl font-display font-extrabold text-teal-400">
            {usedMinutes}p {usedSecs}s
          </p>
          <span className="text-[11px] text-slate-500">Hoàn thành {result.completionRate}%</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Kinh nghiệm nhận</span>
          <p className="text-2xl font-display font-extrabold text-amber-400">
            +{result.xpAwarded} XP
          </p>
          <span className="text-[11px] text-slate-500">Đã cộng vào hồ sơ</span>
        </div>
      </div>

      {/* Section Breakdowns */}
      {result.sectionResults?.length > 0 && (
        <ExamSectionResult sectionResults={result.sectionResults} />
      )}

      {/* Weakness Detector */}
      <ExamWeaknessCard weaknesses={result.weaknesses} />

      {/* Vocabulary Review & SRS Bridge */}
      {result.weakVocabularyIds?.length > 0 && (
        <ExamVocabularyReview vocabularyIds={result.weakVocabularyIds} />
      )}

      {/* Detailed Question Review */}
      {result.questionResults?.length > 0 && (
        <ExamQuestionReview questionResults={result.questionResults} />
      )}

      {/* Navigation Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        {onRetry && (
          <Button
            variant="outline"
            onClick={onRetry}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Làm lại bài thi
          </Button>
        )}

        <Link href={`/${locale}/exam-practice/history`}>
          <Button
            variant="outline"
            icon={<History className="w-4 h-4" />}
          >
            Lịch sử thi thử
          </Button>
        </Link>

        <Link href={`/${locale}/exam-practice`}>
          <Button
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Về Exam Practice Lab
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
