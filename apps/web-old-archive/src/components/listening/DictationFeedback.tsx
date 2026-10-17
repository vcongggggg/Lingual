'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles, BookOpen, Check, X, HelpCircle, Plus } from 'lucide-react';
import { DictationResult, WordComparisonToken } from '@linguaflow/domain';
import { motion } from 'framer-motion';
import { useMotionAccessibility, springPresets } from '@linguaflow/ui';

interface DictationFeedbackProps {
  result: DictationResult;
  expectedTranscript: string;
  vietnameseTranslation: string;
  className?: string;
}

export default function DictationFeedback({
  result,
  expectedTranscript,
  vietnameseTranslation,
  className = '',
}: DictationFeedbackProps) {
  const { shouldReduceMotion } = useMotionAccessibility();
  const { accuracy, mistakes, tokens, correctWords, missingWords, extraWords, incorrectWords } = result;

  const isSuccess = accuracy >= 80;
  const isPartial = accuracy >= 50 && accuracy < 80;

  const encouragement =
    accuracy === 100
      ? 'Tuyệt đỉnh! Bạn đã nghe và gõ chính xác 100% từng từ!'
      : accuracy >= 85
      ? 'Rất xuất sắc! Khả năng bắt âm của bạn cực kỳ chuẩn xác.'
      : accuracy >= 70
      ? 'Làm tốt lắm! Bạn đã nắm được phần lớn nội dung câu.'
      : accuracy >= 50
      ? 'Khá ổn! Hãy chú ý các từ nối và âm đuôi để đạt điểm tối đa.'
      : 'Đừng nản lòng! Hãy nghe lại với tốc độ 0.75x và gõ lại nhé.';

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springPresets.smooth}
      className={`p-5 rounded-3xl border backdrop-blur-xl space-y-5 shadow-2xl ${
        isSuccess
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/30 border-emerald-500/30 shadow-emerald-500/10'
          : isPartial
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/30 border-amber-500/30 shadow-amber-500/10'
          : 'bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/30 border-rose-500/30 shadow-rose-500/10'
      } ${className}`}
    >
      {/* Accuracy & Score Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-extrabold text-xl shadow-lg ${
              isSuccess
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                : isPartial
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/30'
                : 'bg-rose-500 text-white shadow-rose-500/30'
            }`}
          >
            {accuracy}%
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base text-white">
                {isSuccess ? 'Độ chính xác xuất sắc' : isPartial ? 'Kết quả tương đối tốt' : 'Cần rèn luyện thêm'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                {mistakes === 0 ? '0 Lỗi' : `${mistakes} điểm lệch`}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{encouragement}</p>
          </div>
        </div>

        {/* Word Counts Breakdown Badges */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Check className="w-3.5 h-3.5" />
            {correctWords.length} Đúng
          </span>
          {missingWords.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <HelpCircle className="w-3.5 h-3.5" />
              {missingWords.length} Thiếu
            </span>
          )}
          {incorrectWords.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <X className="w-3.5 h-3.5" />
              {incorrectWords.length} Sai
            </span>
          )}
          {extraWords.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Plus className="w-3.5 h-3.5" />
              {extraWords.length} Thừa
            </span>
          )}
        </div>
      </div>

      {/* Word-by-Word Diff Visualizer */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Phân tích chi tiết từng từ bạn đã gõ:
        </span>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-wrap items-center gap-2 min-h-[56px] text-sm">
          {tokens.map((token, idx) => {
            if (token.status === 'correct') {
              return (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium"
                >
                  {token.word}
                </span>
              );
            }

            if (token.status === 'incorrect') {
              return (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 font-medium inline-flex items-center gap-1 line-through"
                  title={`Bạn gõ "${token.submittedWord}", đáp án là "${token.expectedWord}"`}
                >
                  <span>{token.submittedWord || token.word}</span>
                  {token.expectedWord && (
                    <span className="text-[10px] text-emerald-400 no-underline font-mono bg-emerald-950/60 px-1 rounded ml-1">
                      → {token.expectedWord}
                    </span>
                  )}
                </span>
              );
            }

            if (token.status === 'missing') {
              return (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-medium border-dashed inline-flex items-center gap-1"
                  title={`Từ bị thiếu: ${token.word}`}
                >
                  <span className="text-[10px] uppercase font-bold text-amber-400">Thiếu:</span>
                  <span>{token.word}</span>
                </span>
              );
            }

            if (token.status === 'extra') {
              return (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-300 font-medium line-through"
                  title={`Từ bị thừa: ${token.word}`}
                >
                  <span className="text-[10px] uppercase font-bold text-orange-400 mr-1">Thừa:</span>
                  <span>{token.word}</span>
                </span>
              );
            }

            return <span key={idx}>{token.word}</span>;
          })}
        </div>
      </div>

      {/* Target Transcript & Vietnamese Meaning */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-teal-500/20 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Văn bản câu gốc & Bản dịch</span>
        </div>

        <p className="text-base font-semibold text-white leading-relaxed">
          🇬🇧 "{expectedTranscript}"
        </p>

        <p className="text-sm font-medium text-teal-300/90 leading-relaxed">
          🇻🇳 {vietnameseTranslation}
        </p>
      </div>
    </motion.div>
  );
}
