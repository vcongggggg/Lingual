'use client';

import React, { useState } from 'react';
import { Layers, Check, ArrowRight, ArrowLeft, Send, Sparkles, HelpCircle } from 'lucide-react';
import { WritingPrompt, WritingResult as IWritingResult } from '@linguaflow/domain';
import WritingEditor from './WritingEditor';
import WritingProgress from './WritingProgress';
import WritingResult from './WritingResult';
import { writingApi } from '@/lib/api';
import { Button, Badge } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';

interface GuidedWritingExerciseProps {
  prompt: WritingPrompt;
  locale: string;
}

export default function GuidedWritingExercise({ prompt, locale }: GuidedWritingExerciseProps) {
  const steps = prompt.guidedSteps || [
    { stepNumber: 1, question: 'Introduce your topic in 1 sentence:', hint: 'Start with the main idea.' },
    { stepNumber: 2, question: 'Give a specific detail or example:', hint: 'Explain why or what happened.' },
    { stepNumber: 3, question: 'Conclude your thought or feeling:', hint: 'Summarize your perspective.' },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepAnswers, setStepAnswers] = useState<string[]>(new Array(steps.length).fill(''));
  const [currentInput, setCurrentInput] = useState('');
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [finalParagraph, setFinalParagraph] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<IWritingResult | null>(null);
  const [startTime] = useState<number>(Date.now());

  const currentStep = steps[currentStepIndex];

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const updated = [...stepAnswers];
    updated[currentStepIndex] = currentInput.trim();
    setStepAnswers(updated);
    sfx.playClick();

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setCurrentInput(updated[currentStepIndex + 1] || '');
    } else {
      // All steps answered -> Combine into complete paragraph for review
      const combined = updated.filter(Boolean).join(' ');
      setFinalParagraph(combined);
      setIsReviewMode(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setCurrentInput(stepAnswers[currentStepIndex - 1] || '');
    }
  };

  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalParagraph.trim() || submitting) return;

    setSubmitting(true);
    sfx.playClick();
    const durationMs = Date.now() - startTime;

    try {
      const analyzeRes = await writingApi.analyze({
        promptId: prompt.id,
        mode: 'guided',
        content: finalParagraph.trim(),
        durationMs,
      });

      if (analyzeRes?.result) {
        setResult(analyzeRes.result);

        await writingApi.submitAttempt({
          promptId: prompt.id,
          mode: 'guided',
          content: finalParagraph.trim(),
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
          setStepAnswers(new Array(steps.length).fill(''));
          setCurrentStepIndex(0);
          setCurrentInput('');
          setIsReviewMode(false);
        }}
        locale={locale}
      />
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
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

        <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4" />
          <span>Viết Theo Hướng Dẫn (Guided Writing)</span>
        </span>
      </div>

      {/* Progress */}
      <WritingProgress
        currentStep={isReviewMode ? steps.length : currentStepIndex + 1}
        totalSteps={steps.length}
        wordCount={isReviewMode ? finalParagraph.split(/\s+/).filter(Boolean).length : stepAnswers.filter(Boolean).join(' ').split(/\s+/).filter(Boolean).length}
        minWords={prompt.minWords || 20}
      />

      {/* STEP MODE */}
      {!isReviewMode ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-purple-500/20 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Bước {currentStep.stepNumber} / {steps.length}
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
              {currentStep.question}
            </h2>
            {currentStep.hint && (
              <p className="text-xs text-slate-400 bg-slate-950/80 p-3 rounded-xl border border-slate-850">
                💡 <strong>Gợi ý:</strong> {currentStep.hint}
              </p>
            )}
          </div>

          <form onSubmit={handleNextStep} className="space-y-4">
            <WritingEditor
              value={currentInput}
              onChange={setCurrentInput}
              placeholder={currentStep.samplePhrase || 'Nhập câu trả lời của bạn...'}
              minWords={3}
              showWordCount={true}
              rows={3}
            />

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                type="button"
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Bước trước
              </Button>

              <Button
                variant="primary"
                type="submit"
                disabled={!currentInput.trim()}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {currentStepIndex === steps.length - 1 ? 'Ghép đoạn văn & Xem lại' : 'Bước tiếp theo'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        /* REVIEW & SUBMIT MODE */
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-teal-500/20 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              Hoàn thiện đoạn văn
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
              Xem lại và chỉnh sửa đoạn văn hoàn chỉnh
            </h2>
            <p className="text-xs text-slate-400">
              Các câu trả lời từng bước của bạn đã được kết hợp. Bạn có thể trau chuốt thêm trước khi nộp bài.
            </p>
          </div>

          <form onSubmit={handleSubmitFinal} className="space-y-4">
            <WritingEditor
              value={finalParagraph}
              onChange={setFinalParagraph}
              minWords={prompt.minWords || 20}
              showWordCount={true}
              rows={6}
            />

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setIsReviewMode(false)}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Quay lại từng bước
              </Button>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={!finalParagraph.trim() || submitting}
                icon={<Send className="w-4 h-4" />}
              >
                {submitting ? 'Đang phân tích bài viết...' : 'Nộp bài & Nhận nhận xét'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
