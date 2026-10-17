'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Flame,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BookmarkPlus,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { SpeakingResult as ISpeakingResult } from '@linguaflow/domain';
import LingLingMascot from '@/components/LingLingMascot';
import SpeakingFeedback from './SpeakingFeedback';
import { speakingSrsAdapter } from '@/lib/speaking/speakingSrsAdapter';
import { Button, Badge } from '@linguaflow/ui';

interface SpeakingResultProps {
  result: ISpeakingResult;
  onRetry: () => void;
  locale?: string;
  className?: string;
}

export default function SpeakingResult({
  result,
  onRetry,
  locale = 'vi',
  className = '',
}: SpeakingResultProps) {
  const isVi = locale === 'vi';
  const [savedWords, setSavedWords] = useState<string[]>([]);

  const mascotState =
    result.feedback.overallScore >= 80
      ? 'celebrating'
      : result.feedback.overallScore >= 60
      ? 'thinking'
      : 'apologetic';

  const wpm =
    result.duration > 0
      ? Math.round((result.wordCount / result.duration) * 60)
      : 100;

  const handleSaveToSRS = async (word: string) => {
    const res = await speakingSrsAdapter.saveVocabularyToSRS([word], result.submissionId);
    if (res.success) {
      setSavedWords((prev) => [...prev, word]);
    }
  };

  const handleSaveAllSRS = async () => {
    if (result.srsSuggestions && result.srsSuggestions.length > 0) {
      const res = await speakingSrsAdapter.saveVocabularyToSRS(result.srsSuggestions, result.submissionId);
      if (res.success) {
        setSavedWords((prev) => Array.from(new Set([...prev, ...result.srsSuggestions])));
      }
    }
  };

  return (
    <div className={`space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200 ${className}`}>
      {/* Result Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-teal-500/30 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isVi ? 'Hoàn thành bài luyện nói' : 'Speaking Session Completed'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Kết Quả Đánh Giá Bài Nói
            </h2>

            <p className="text-xs sm:text-sm text-slate-300">
              {isVi
                ? 'Hệ thống đã phân tích phản xạ, độ trôi chảy và mức độ khớp văn bản nhận diện của bạn.'
                : 'Your speaking fluency, pronunciation match, and lexical richness have been evaluated.'}
            </p>
          </div>

          <div className="shrink-0 flex items-center justify-center">
            <LingLingMascot state={mascotState} size={110} />
          </div>
        </div>

        {/* Highlight Score & Rewards Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-0.5">
            <span className="text-[10px] text-slate-400 font-semibold">{isVi ? 'Điểm năng lực' : 'Proficiency Score'}</span>
            <p className="text-2xl font-display font-extrabold text-white font-mono">
              {result.feedback.overallScore} <span className="text-xs text-slate-500">/ 100</span>
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-0.5">
            <span className="text-[10px] text-slate-400 font-semibold">{isVi ? 'Thưởng kinh nghiệm' : 'XP Awarded'}</span>
            <p className="text-2xl font-display font-extrabold text-amber-400 font-mono flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              +{result.xpAwarded} XP
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-0.5">
            <span className="text-[10px] text-slate-400 font-semibold">{isVi ? 'Thời gian nói' : 'Duration'}</span>
            <p className="text-2xl font-display font-extrabold text-indigo-300 font-mono flex items-center gap-1">
              <Clock className="w-4 h-4 text-indigo-400" />
              {result.duration}s
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-0.5">
            <span className="text-[10px] text-slate-400 font-semibold">{isVi ? 'Số từ đã nói' : 'Word Count'}</span>
            <p className="text-2xl font-display font-extrabold text-teal-300 font-mono">
              {result.wordCount} <span className="text-xs text-slate-500">({wpm} WPM)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Feedback Section */}
      <SpeakingFeedback
        feedback={result.feedback}
        wpm={wpm}
        onSaveToSRS={handleSaveToSRS}
        savedWords={savedWords}
        locale={locale}
      />

      {/* Actions Strip */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={onRetry}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            {isVi ? 'Luyện lại bài này' : 'Practice Again'}
          </Button>

          <Link href={`/${locale}/speaking`}>
            <Button variant="ghost">
              {isVi ? 'Chọn chế độ khác' : 'All Modes'}
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {result.srsSuggestions && result.srsSuggestions.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSaveAllSRS}
              icon={<BookmarkPlus className="w-4 h-4 text-teal-400" />}
            >
              {isVi ? 'Lưu toàn bộ từ vựng vào SRS' : 'Save All Words to SRS'}
            </Button>
          )}

          <Link href={`/${locale}/analytics/speaking`}>
            <Button
              variant="ghost"
              size="sm"
              icon={<Activity className="w-4 h-4 text-purple-400" />}
            >
              {isVi ? 'Xem Phân Tích Kỹ Năng Nói' : 'Speaking Analytics'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
