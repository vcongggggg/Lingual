'use client';

import React from 'react';
import { Award, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';
import { Badge } from '@linguaflow/ui';

interface OverallLearningScoreProps {
  score: number;
  consistencyScore?: number;
  estimatedCEFR?: string;
  locale?: string;
  className?: string;
}

export default function OverallLearningScore({
  score,
  consistencyScore = 75,
  estimatedCEFR = 'B1',
  locale = 'vi',
  className = '',
}: OverallLearningScoreProps) {
  const isVi = locale === 'vi';

  const strokeDashoffset = 283 - (283 * Math.min(100, Math.max(0, score))) / 100;

  const getEvaluation = (s: number) => {
    if (s >= 85) return { label: isVi ? 'Xuất Sắc (Mastery)' : 'Mastery', color: 'text-amber-300', bg: 'bg-amber-500/20', border: 'border-amber-400/40' };
    if (s >= 70) return { label: isVi ? 'Tiến Bộ Tốt (Good Progress)' : 'Good Progress', color: 'text-teal-300', bg: 'bg-teal-500/20', border: 'border-teal-400/40' };
    if (s >= 50) return { label: isVi ? 'Đang Phát Triển (Developing)' : 'Developing', color: 'text-purple-300', bg: 'bg-purple-500/20', border: 'border-purple-400/40' };
    return { label: isVi ? 'Cần Nỗ Lực Thêm' : 'Needs Practice', color: 'text-rose-300', bg: 'bg-rose-500/20', border: 'border-rose-400/40' };
  };

  const evalInfo = getEvaluation(score);

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-6 flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-teal-400" />
          <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
            {isVi ? 'Điểm Đánh Giá Năng Lực' : 'Overall Learning Score'}
          </h3>
        </div>
        <Badge variant="teal" className="text-[10px] font-bold uppercase">
          {estimatedCEFR} Level
        </Badge>
      </div>

      {/* Radial Chart Visual */}
      <div className="flex flex-col items-center justify-center relative py-2">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className="text-slate-800 stroke-current"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className="text-teal-400 stroke-current transition-all duration-1000 ease-out"
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Centered Score */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-display font-extrabold text-white tracking-tight">
              {score}
            </span>
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
              / 100 Điểm
            </span>
          </div>
        </div>

        <div className={`mt-4 px-3.5 py-1 rounded-full text-xs font-extrabold border ${evalInfo.bg} ${evalInfo.color} ${evalInfo.border}`}>
          {evalInfo.label}
        </div>
      </div>

      {/* Consistency Sub-bar */}
      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 flex items-center justify-between text-xs">
        <span className="text-slate-400 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <span>{isVi ? 'Chỉ số chăm chỉ & đều đặn' : 'Study Consistency'}</span>
        </span>
        <span className="font-mono font-extrabold text-teal-400">{consistencyScore}%</span>
      </div>
    </div>
  );
}
