'use client';

import React from 'react';
import { ProgressBar, useMotionAccessibility } from '@linguaflow/ui';

interface WritingProgressProps {
  currentStep?: number;
  totalSteps?: number;
  wordCount: number;
  minWords: number;
  className?: string;
}

export default function WritingProgress({
  currentStep,
  totalSteps,
  wordCount,
  minWords,
  className = '',
}: WritingProgressProps) {
  const { shouldReduceMotion } = useMotionAccessibility();

  const isMultiStep = Boolean(currentStep && totalSteps);
  const progressVal = isMultiStep
    ? (currentStep! / totalSteps!) * 100
    : Math.min(100, Math.round((wordCount / (minWords || 1)) * 100));

  return (
    <div className={`p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        {isMultiStep ? (
          <span className="font-bold text-slate-300">
            Bước <strong className="text-teal-400 font-mono">{currentStep}</strong> / {totalSteps}
          </span>
        ) : (
          <span className="font-bold text-slate-300">
            Tiến độ độ dài bài viết
          </span>
        )}

        <span className="font-mono text-slate-400 font-bold">
          {wordCount} / {minWords} từ ({Math.min(100, Math.round((wordCount / (minWords || 1)) * 100))}%)
        </span>
      </div>

      <ProgressBar
        value={progressVal}
        max={100}
        color={progressVal >= 100 ? 'teal' : 'amber'}
      />
    </div>
  );
}
