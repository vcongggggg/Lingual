'use client';

import React from 'react';
import { Clock } from 'lucide-react';

interface SpeakingTimerProps {
  seconds: number;
  maxSeconds?: number;
  isRecording?: boolean;
  locale?: string;
  className?: string;
}

export default function SpeakingTimer({
  seconds,
  maxSeconds = 60,
  isRecording = false,
  locale = 'vi',
  className = '',
}: SpeakingTimerProps) {
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSec.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono font-bold text-sm transition-all ${
        isRecording
          ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 animate-pulse'
          : 'bg-slate-950/80 border-slate-800 text-slate-300'
      } ${className}`}
    >
      <Clock className="w-4 h-4 text-teal-400" />
      <span>{formatTime(seconds)}</span>
      {maxSeconds > 0 && <span className="text-slate-500 text-xs">/ {formatTime(maxSeconds)}</span>}
    </div>
  );
}
