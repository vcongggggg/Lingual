'use client';

import React from 'react';
import { Mic, Activity } from 'lucide-react';
import { ProgressBar } from '@linguaflow/ui';

interface PronunciationScoreProps {
  score: number;
  locale?: string;
  className?: string;
}

export default function PronunciationScore({
  score,
  locale = 'vi',
  className = '',
}: PronunciationScoreProps) {
  const isVi = locale === 'vi';

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-bold text-white">
            {isVi ? 'Độ Khớp Phát Âm (Transcript Match)' : 'Pronunciation Match'}
          </span>
        </div>
        <span className="text-sm font-display font-extrabold text-teal-300 font-mono">
          {score}%
        </span>
      </div>

      <ProgressBar value={score} max={100} color="teal" />

      <span className="text-[10px] text-slate-400 block font-mono">
        * So khớp văn bản nhận diện tự động với câu mẫu chuẩn.
      </span>
    </div>
  );
}
