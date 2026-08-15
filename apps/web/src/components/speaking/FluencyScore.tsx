'use client';

import React from 'react';
import { Activity, Clock } from 'lucide-react';
import { ProgressBar } from '@linguaflow/ui';

interface FluencyScoreProps {
  score: number;
  wpm?: number;
  locale?: string;
  className?: string;
}

export default function FluencyScore({
  score,
  wpm = 110,
  locale = 'vi',
  className = '',
}: FluencyScoreProps) {
  const isVi = locale === 'vi';

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-white">
            {isVi ? 'Độ Trôi Chảy & Tốc Độ (Fluency)' : 'Fluency & Cadence'}
          </span>
        </div>
        <span className="text-sm font-display font-extrabold text-indigo-300 font-mono">
          {score}%
        </span>
      </div>

      <ProgressBar value={score} max={100} color="amber" />

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>Tốc độ: ~{wpm} WPM</span>
        <span>{wpm >= 90 && wpm <= 160 ? 'Tự nhiên' : 'Cần điều chỉnh nhịp'}</span>
      </div>
    </div>
  );
}
