'use client';

import React from 'react';
import { Mic, Clock, Trophy, CheckCircle2 } from 'lucide-react';
import { Badge } from '@linguaflow/ui';

interface SpeakingHistoryProps {
  attempts: any[];
  locale?: string;
  className?: string;
}

export default function SpeakingHistory({
  attempts,
  locale = 'vi',
  className = '',
}: SpeakingHistoryProps) {
  const isVi = locale === 'vi';

  if (!attempts || attempts.length === 0) {
    return (
      <div className={`p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl text-center space-y-2 ${className}`}>
        <p className="text-slate-400 text-xs">
          {isVi ? 'Chưa có lịch sử bài nói nào. Hãy bắt đầu buổi luyện tập đầu tiên!' : 'No speaking history found. Start your first practice session!'}
        </p>
      </div>
    );
  }

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 ${className}`}>
      <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
        {isVi ? 'Lịch Sử Luyện Nói Gần Đây' : 'Recent Speaking Sessions'}
      </h3>

      <div className="space-y-2.5">
        {attempts.slice(0, 10).map((att) => (
          <div
            key={att.id}
            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-white text-sm">
                  {att.promptTitle || 'Bài luyện nói'}
                </span>
                <Badge variant="teal" className="text-[10px] uppercase font-bold">
                  {att.mode}
                </Badge>
              </div>
              <p className="text-slate-400 font-mono text-[11px] line-clamp-1 italic">
                "{att.transcript}"
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 font-mono">
              <span className="text-teal-300 font-bold">
                {att.overallScore} / 100
              </span>
              <span className="text-amber-400 flex items-center gap-1 font-bold">
                <Trophy className="w-3.5 h-3.5" />
                +{att.xpAwarded} XP
              </span>
              <span className="text-slate-500 text-[10px]">
                {new Date(att.submittedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
