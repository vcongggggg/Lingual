'use client';

import React from 'react';
import { Award, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { CEFRProgress, calculateCEFRProgress } from '@linguaflow/domain';
import { Badge } from '@linguaflow/ui';

interface CEFRProgressCardProps {
  overallScore: number;
  locale?: string;
  className?: string;
}

export default function CEFRProgressCard({
  overallScore,
  locale = 'vi',
  className = '',
}: CEFRProgressCardProps) {
  const isVi = locale === 'vi';
  const cefr: CEFRProgress = calculateCEFRProgress(overallScore, 380, 4);

  const levels: ('A1' | 'A2' | 'B1' | 'B2' | 'C1')[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
  const currentIndex = levels.indexOf(cefr.currentLevel);

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-5 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
            {isVi ? 'Ước Lượng Cấp Độ CEFR' : 'Estimated CEFR Proficiency'}
          </h3>
        </div>
        <Badge variant="teal" className="text-xs font-mono font-bold">
          {cefr.confidence}% {isVi ? 'Độ tin cậy' : 'Confidence'}
        </Badge>
      </div>

      {/* Stepper Visual */}
      <div className="py-4">
        <div className="flex items-center justify-between relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-800 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-4 h-1 bg-indigo-500 -translate-y-1/2 z-0 transition-all duration-700"
            style={{ width: `${(currentIndex / (levels.length - 1)) * 90}%` }}
          />

          {levels.map((lvl, idx) => {
            const isPassed = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={lvl} className="relative z-10 flex flex-col items-center space-y-1.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-display font-extrabold text-xs transition-all shadow-md ${
                    isCurrent
                      ? 'bg-indigo-500 text-white ring-4 ring-indigo-500/30 scale-110'
                      : isPassed
                      ? 'bg-teal-500 text-slate-950'
                      : 'bg-slate-950 text-slate-500 border border-slate-800'
                  }`}
                >
                  {lvl}
                </div>
                <span
                  className={`text-[10px] font-mono font-bold uppercase ${
                    isCurrent ? 'text-indigo-300' : isPassed ? 'text-teal-400' : 'text-slate-500'
                  }`}
                >
                  {isCurrent ? (isVi ? 'Hiện tại' : 'Current') : lvl}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level Summary & Milestone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-1">
          <span className="text-[11px] text-slate-400 block">{isVi ? 'Mục tiêu tiếp theo' : 'Next Milestone'}</span>
          <p className="font-display font-extrabold text-sm text-white">
            {cefr.nextMilestone} ({isVi ? `còn ~${cefr.scoreToNextLevel} điểm` : `~${cefr.scoreToNextLevel} pts needed`})
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-1">
          <span className="text-[11px] text-slate-400 block">{isVi ? 'Thời gian rèn luyện ước tính' : 'Estimated Hours'}</span>
          <p className="font-display font-extrabold text-sm text-indigo-300 font-mono">
            ~{cefr.estimatedHoursNeeded} {isVi ? 'giờ luyện tập' : 'hours'}
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-850 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <span>{cefr.disclaimer}</span>
      </div>
    </div>
  );
}
