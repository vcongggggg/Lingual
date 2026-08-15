'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Clock, Award, Sparkles, RotateCcw, ArrowRight, BookOpen, Brain, CheckCircle2 } from 'lucide-react';
import { ReadingArticle, ReadingFeedback } from '@linguaflow/domain';
import LingLingMascot from '../LingLingMascot';
import ReadingAnswerFeedback from './ReadingAnswerFeedback';
import ReadingVocabularyPanel from './ReadingVocabularyPanel';
import { extractReadingVocabulary } from '@/lib/reading/extractReadingVocabulary';
import { Button, Badge, useMotionAccessibility, springPresets } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';
import { motion } from 'framer-motion';

interface ReadingResultProps {
  article: ReadingArticle;
  feedback: ReadingFeedback;
  onRetry?: () => void;
  locale: string;
}

export default function ReadingResult({
  article,
  feedback,
  onRetry,
  locale,
}: ReadingResultProps) {
  const { shouldReduceMotion } = useMotionAccessibility();
  const vocabularyList = extractReadingVocabulary(article);

  useEffect(() => {
    if (feedback.score >= 75) {
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
          parsed.totalXP = (parsed.totalXP || 0) + feedback.xpAwarded;
          localStorage.setItem('lingual_user', JSON.stringify(parsed));
          window.dispatchEvent(
            new CustomEvent('linguaflow_xp_update', {
              detail: { totalXP: parsed.totalXP, streakDays: parsed.currentStreak || 1 },
            })
          );
        }
      } catch {}
    }
  }, [feedback.score, feedback.xpAwarded]);

  const mascotState =
    feedback.score >= 80 ? 'celebrating' : feedback.score >= 60 ? 'speaking' : 'thinking';

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
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kết quả Đọc hiểu • {article.title}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            {feedback.score >= 80
              ? 'Đọc hiểu xuất sắc! 🎉'
              : feedback.score >= 60
              ? 'Hoàn thành tốt! 👍'
              : 'Hãy tiếp tục cố gắng! 💪'}
          </h1>

          <p className="text-sm text-slate-300">
            Cấp độ: <strong className="text-teal-400 font-bold">{article.level}</strong> • Nhận được:{' '}
            <strong className="text-amber-400 font-mono">+{feedback.xpAwarded} XP</strong>
          </p>
        </div>

        <div className="shrink-0">
          <LingLingMascot state={mascotState} size={96} />
        </div>
      </div>

      {/* Metrics Bar (Score, WPM, Correct Answers, Grade) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Điểm đọc hiểu</span>
          <p className="text-2xl font-display font-extrabold text-white">
            {feedback.score}%
          </p>
          <Badge variant="teal" className="text-[10px] font-bold">
            {feedback.grade}
          </Badge>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Tốc độ đọc (WPM)</span>
          <p className="text-2xl font-display font-extrabold text-teal-400">
            {feedback.wpm}
          </p>
          <span className="text-[11px] text-slate-500">từ / phút</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Câu trả lời đúng</span>
          <p className="text-2xl font-display font-extrabold text-emerald-400">
            {feedback.correctCount} / {feedback.totalQuestions}
          </p>
          <span className="text-[11px] text-slate-500">Độ chính xác: {feedback.accuracy}%</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Kinh nghiệm nhận được</span>
          <p className="text-2xl font-display font-extrabold text-amber-400">
            +{feedback.xpAwarded} XP
          </p>
          <span className="text-[11px] text-slate-500">Đã cộng vào hồ sơ</span>
        </div>
      </div>

      {/* Answer Explanations Review */}
      {feedback.answersFeedback?.length > 0 && (
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
          <h3 className="font-display font-bold text-lg text-white">
            Chi Tiết Giải Thích Câu Trả Lời ({feedback.answersFeedback.length})
          </h3>

          <div className="space-y-3">
            {feedback.answersFeedback.map((ans, idx) => (
              <ReadingAnswerFeedback key={idx} feedback={ans} />
            ))}
          </div>
        </div>
      )}

      {/* Vocabulary to Review with "Add all to SRS" */}
      <ReadingVocabularyPanel vocabulary={vocabularyList} />

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        {onRetry && (
          <Button
            variant="outline"
            onClick={onRetry}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Luyện tập lại
          </Button>
        )}

        <Link href={`/${locale}/reading/${article.id}`}>
          <Button
            variant="outline"
            icon={<BookOpen className="w-4 h-4" />}
          >
            Đọc lại bài văn
          </Button>
        </Link>

        <Link href={`/${locale}/reading`}>
          <Button
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Quay lại Reading Lab
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
