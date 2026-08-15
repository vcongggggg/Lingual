'use client';

import React from 'react';
import { Sparkles, Trophy, Flame } from 'lucide-react';
import { ListeningDifficulty } from '@linguaflow/domain';
import { Badge, ProgressBar } from '@linguaflow/ui';

interface ListeningProgressProps {
  currentIndex: number;
  totalExercises: number;
  difficulty: ListeningDifficulty;
  category: string;
  sessionXP: number;
  className?: string;
}

export default function ListeningProgress({
  currentIndex,
  totalExercises,
  difficulty,
  category,
  sessionXP,
  className = '',
}: ListeningProgressProps) {
  const currentStep = Math.min(totalExercises, currentIndex + 1);
  const progressPercent = totalExercises > 0
    ? Math.round((currentIndex / totalExercises) * 100)
    : 0;

  const difficultyVariant =
    difficulty === 'A1'
      ? 'emerald'
      : difficulty === 'A2'
      ? 'teal'
      : difficulty === 'B1'
      ? 'amber'
      : 'coral';

  return (
    <div className={`p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant={difficultyVariant} className="font-extrabold tracking-wider">
            {difficulty}
          </Badge>
          <span className="text-xs font-semibold text-slate-300 truncate max-w-[160px] sm:max-w-xs">
            {category}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>+{sessionXP} XP</span>
          </div>

          <div className="text-xs font-bold text-slate-400 font-mono">
            <span className="text-white text-sm">{currentStep}</span> / {totalExercises}
          </div>
        </div>
      </div>

      <ProgressBar
        value={currentIndex}
        max={totalExercises}
        color={difficulty === 'A1' || difficulty === 'A2' ? 'teal' : 'amber'}
      />
    </div>
  );
}
