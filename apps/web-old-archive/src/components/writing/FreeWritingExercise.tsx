'use client';

import React, { useState } from 'react';
import { PenTool, Target, Clock, Send, Sparkles, RotateCcw } from 'lucide-react';
import { WritingPrompt, WritingResult as IWritingResult } from '@linguaflow/domain';
import WritingEditor from './WritingEditor';
import WritingResult from './WritingResult';
import { writingApi } from '@/lib/api';
import { Button, Badge } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';

interface FreeWritingExerciseProps {
  prompt?: WritingPrompt;
  locale: string;
}

export default function FreeWritingExercise({ prompt, locale }: FreeWritingExerciseProps) {
  const [customTopic, setCustomTopic] = useState(prompt?.title || '');
  const [content, setContent] = useState('');
  const [targetWordGoal, setTargetWordGoal] = useState<number>(prompt?.minWords || 50);
  const [enableTimer, setEnableTimer] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<IWritingResult | null>(null);
  const [startTime] = useState<number>(Date.now());

  const goalOptions = [30, 50, 100, 150, 250];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    sfx.playClick();
    const durationMs = Date.now() - startTime;

    try {
      const analyzeRes = await writingApi.analyze({
        promptId: prompt?.id || 'free-custom-topic',
        mode: 'free',
        content: content.trim(),
        durationMs,
      });

      if (analyzeRes?.result) {
        setResult(analyzeRes.result);

        await writingApi.submitAttempt({
          promptId: prompt?.id || 'free-custom-topic',
          mode: 'free',
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
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-teal-500/20 backdrop-blur-2xl shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 uppercase tracking-wider">
              <PenTool className="w-4 h-4" />
              <span>Viết Tự Do (Free Writing)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              {prompt?.title || 'Viết theo chủ đề tự chọn'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {prompt?.instruction || 'Rèn luyện khả năng diễn đạt lưu loát với mục tiêu số từ và nhận phản hồi chi tiết.'}
            </p>
          </div>

          {/* Goal Selector */}
          <div className="space-y-1 sm:text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Mục tiêu số từ:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {goalOptions.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setTargetWordGoal(goal)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all border ${
                    targetWordGoal === goal
                      ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
                  }`}
                >
                  {goal} từ
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Topic Input if no fixed prompt */}
        {!prompt && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Chủ đề bài viết của bạn:
            </label>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Ví dụ: My Favorite Book, The Benefits of Artificial Intelligence..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-teal-400"
            />
          </div>
        )}
      </div>

      {/* Writing Area Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <WritingEditor
          value={content}
          onChange={setContent}
          minWords={targetWordGoal}
          targetWords={prompt?.targetWords}
          disabled={submitting}
          showTimer={enableTimer}
          showWordCount={true}
          rows={8}
        />

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setContent('')}
            disabled={!content || submitting}
            className="text-xs font-bold text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Xóa nội dung
          </button>

          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={!content.trim() || submitting}
            icon={<Send className="w-4 h-4" />}
          >
            {submitting ? 'Đang phân tích bài viết...' : 'Nộp bài & Nhận nhận xét'}
          </Button>
        </div>
      </form>
    </div>
  );
}
