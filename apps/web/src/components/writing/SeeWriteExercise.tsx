'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, Sparkles, Send, HelpCircle, ArrowLeft, PenTool } from 'lucide-react';
import { WritingPrompt, WritingResult as IWritingResult } from '@linguaflow/domain';
import WritingEditor from './WritingEditor';
import WritingResult from './WritingResult';
import { writingApi } from '@/lib/api';
import { Button, Badge, Card } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';

interface SeeWriteExerciseProps {
  prompt: WritingPrompt;
  locale: string;
}

export default function SeeWriteExercise({ prompt, locale }: SeeWriteExerciseProps) {
  const [content, setContent] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<IWritingResult | null>(null);
  const [startTime] = useState<number>(Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    sfx.playClick();
    const durationMs = Date.now() - startTime;

    try {
      // 1. Analyze writing
      const analyzeRes = await writingApi.analyze({
        promptId: prompt.id,
        mode: 'see-write',
        content: content.trim(),
        usedHint: showHint,
        durationMs,
      });

      if (analyzeRes?.result) {
        setResult(analyzeRes.result);

        // 2. Record attempt
        await writingApi.submitAttempt({
          promptId: prompt.id,
          mode: 'see-write',
          content: content.trim(),
          score: analyzeRes.result.score,
          xpAwarded: analyzeRes.result.xpAwarded,
          durationMs,
        });
      }
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <WritingResult
        result={result}
        onRetry={() => {
          setResult(null);
          setContent('');
        }}
        locale={locale}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="teal" className="font-extrabold uppercase">
            {prompt.difficulty}
          </Badge>
          <span className="text-xs font-semibold text-slate-400">
            • {prompt.category}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowHint(!showHint)}
          className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-amber-300 transition-all flex items-center gap-1.5"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>{showHint ? 'Ẩn gợi ý' : 'Xem gợi ý ngữ pháp'}</span>
        </button>
      </div>

      {/* Visual Prompt Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-teal-500/20 backdrop-blur-2xl shadow-2xl">
        {/* Visual Image */}
        {prompt.imageHint ? (
          <div className="relative aspect-video sm:aspect-4/3 rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950">
            <img
              src={prompt.imageHint}
              alt={prompt.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 rounded-2xl bg-slate-950/80 border border-slate-800">
            <Eye className="w-12 h-12 text-teal-400/60" />
          </div>
        )}

        {/* Prompt Details & Scenario */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 uppercase tracking-wider">
              <Eye className="w-4 h-4" />
              <span>Quan sát & Viết (See & Write)</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              {prompt.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {prompt.instruction}
            </p>

            {prompt.scenario && (
              <p className="text-xs text-amber-300/90 bg-slate-950/80 p-3 rounded-xl border border-slate-850">
                📌 <strong>Tình huống:</strong> {prompt.scenario}
              </p>
            )}
          </div>

          {showHint && prompt.targetGrammar && (
            <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs text-teal-200 space-y-1">
              <span className="font-bold text-teal-300 block">💡 Gợi ý cấu trúc:</span>
              <p>{prompt.targetGrammar}</p>
            </div>
          )}
        </div>
      </div>

      {/* Writing Area Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <WritingEditor
          value={content}
          onChange={setContent}
          minWords={prompt.minWords || 8}
          maxWords={prompt.maxWords}
          targetWords={prompt.targetWords}
          disabled={submitting}
          showWordCount={true}
          rows={5}
        />

        <div className="flex justify-end">
          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={!content.trim() || submitting}
            icon={<Send className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            {submitting ? 'Đang phân tích bài viết...' : 'Nộp bài & Nhận nhận xét'}
          </Button>
        </div>
      </form>
    </div>
  );
}
