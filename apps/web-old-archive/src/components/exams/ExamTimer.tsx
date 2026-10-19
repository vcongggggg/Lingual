'use client';

import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface ExamTimerProps {
  initialSeconds: number;
  onTimeExpired: () => void;
  className?: string;
}

export default function ExamTimer({
  initialSeconds,
  onTimeExpired,
  className = '',
}: ExamTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);

  useEffect(() => {
    setRemainingSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      onTimeExpired();
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds, onTimeExpired]);

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const isWarning = remainingSeconds <= 300 && remainingSeconds > 60;
  const isCritical = remainingSeconds <= 60;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border font-mono font-bold text-xs sm:text-sm shadow-sm transition-all ${
        isCritical
          ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
          : isWarning
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
          : 'bg-slate-950/80 text-teal-300 border-teal-500/30'
      } ${className}`}
    >
      {isCritical ? (
        <AlertTriangle className="w-4 h-4 text-rose-400" />
      ) : (
        <Clock className="w-4 h-4 text-teal-400" />
      )}

      <span>
        {hours > 0 ? `${hours.toString().padStart(2, '0')}:` : ''}
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
