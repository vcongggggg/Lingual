'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Trophy } from 'lucide-react';
import { SpeakingPrompt, SpeakingResult as ISpeakingResult } from '@linguaflow/domain';
import { speakingApi } from '@/lib/speaking/api';
import SpeakingPromptCard from './SpeakingPromptCard';
import SpeakingRecorder from './SpeakingRecorder';
import SpeakingResult from './SpeakingResult';
import { Badge } from '@linguaflow/ui';

interface SpeakingPracticeShellProps {
  mode: string;
  defaultPrompt?: SpeakingPrompt;
  locale?: string;
}

export default function SpeakingPracticeShell({
  mode,
  defaultPrompt,
  locale = 'vi',
}: SpeakingPracticeShellProps) {
  const isVi = locale === 'vi';
  const [prompts, setPrompts] = useState<SpeakingPrompt[]>(defaultPrompt ? [defaultPrompt] : []);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [result, setResult] = useState<ISpeakingResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(!defaultPrompt);

  useEffect(() => {
    if (!defaultPrompt) {
      speakingApi
        .getPrompts({ mode })
        .then((res) => {
          if (res?.prompts && res.prompts.length > 0) {
            setPrompts(res.prompts);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [mode, defaultPrompt]);

  const activePrompt = prompts[currentPromptIndex];

  const handleSubmit = async (transcript: string, durationMs: number) => {
    if (!activePrompt || !transcript.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await speakingApi.submitAttempt({
        promptId: activePrompt.id,
        transcript,
        durationMs,
      });

      if (res?.feedback) {
        setResult(res);
      }
    } catch {
      // Fallback local evaluation if backend has connection issue
      const localFeedback = await speakingApi.analyze({
        promptId: activePrompt.id,
        transcript,
        durationMs,
      });
      if (localFeedback?.feedback) {
        setResult({
          submissionId: `local-${Date.now()}`,
          feedback: localFeedback.feedback,
          xpAwarded: 20,
          streakUpdated: true,
          srsSuggestions: localFeedback.feedback.vocabularySuggestions.map((v) => v.word),
          duration: Math.round(durationMs / 1000),
          wordCount: transcript.split(/\s+/).filter(Boolean).length,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-400 text-sm">
        <p>{isVi ? 'Đang tải câu hỏi luyện nói...' : 'Loading speaking prompts...'}</p>
      </div>
    );
  }

  if (!activePrompt) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-slate-400 text-sm">
          {isVi ? 'Chưa tìm thấy bài luyện nói phù hợp.' : 'No speaking prompts available for this mode.'}
        </p>
        <Link
          href={`/${locale}/speaking`}
          className="text-xs font-bold text-teal-400 hover:underline"
        >
          {isVi ? 'Quay lại Phòng Luyện Nói' : 'Back to Speaking Lab'}
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-5xl mx-auto space-y-6 pointer-events-auto">
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}/speaking`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isVi ? 'Quay lại Phòng Luyện Nói' : 'Back to Speaking Lab'}</span>
        </Link>

        {prompts.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              Bài {currentPromptIndex + 1} / {prompts.length}
            </span>
            <select
              value={currentPromptIndex}
              onChange={(e) => {
                setCurrentPromptIndex(Number(e.target.value));
                setResult(null);
              }}
              className="bg-slate-900 text-xs text-white border border-slate-800 rounded-xl px-2 py-1 focus:outline-none"
            >
              {prompts.map((p, idx) => (
                <option key={p.id} value={idx}>
                  {idx + 1}. {p.title.slice(0, 30)}...
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {result ? (
        <SpeakingResult result={result} onRetry={handleRetry} locale={locale} />
      ) : (
        <div className="space-y-6">
          <SpeakingPromptCard prompt={activePrompt} locale={locale} />
          <SpeakingRecorder
            maxDurationSeconds={activePrompt.durationSeconds || 60}
            sampleText={activePrompt.sampleAnswer || activePrompt.title}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            locale={locale}
          />
        </div>
      )}
    </main>
  );
}
