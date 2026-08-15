'use client';

import React from 'react';
import Link from 'next/link';
import {
  Headphones,
  Mic,
  BookOpen,
  PenTool,
  FileText,
  Trophy,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { SkillPerformance, LearningSkill } from '@linguaflow/domain';
import { formatSkillName } from '@/lib/analytics/analyticsFormatters';
import { Badge } from '@linguaflow/ui';

interface SkillPerformanceCardProps {
  performance: SkillPerformance;
  locale?: string;
  className?: string;
}

export function getSkillIcon(skill: LearningSkill) {
  switch (skill) {
    case 'listening':
      return <Headphones className="w-5 h-5 text-teal-300" />;
    case 'speaking':
      return <Mic className="w-5 h-5 text-purple-400" />;
    case 'vocabulary':
      return <BookOpen className="w-5 h-5 text-teal-400" />;
    case 'writing':
      return <PenTool className="w-5 h-5 text-purple-300" />;
    case 'reading':
      return <FileText className="w-5 h-5 text-teal-400" />;
    case 'exam':
    default:
      return <Trophy className="w-5 h-5 text-amber-400" />;
  }
}

export default function SkillPerformanceCard({
  performance,
  locale = 'vi',
  className = '',
}: SkillPerformanceCardProps) {
  const isVi = locale === 'vi';
  const skillName = formatSkillName(performance.skill, locale);

  const getTrendBadge = (trend: string) => {
    if (trend === 'up') {
      return (
        <span className="inline-flex items-center gap-0.5 text-xs font-mono font-bold text-teal-400">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+Tăng</span>
        </span>
      );
    }
    if (trend === 'down') {
      return (
        <span className="inline-flex items-center gap-0.5 text-xs font-mono font-bold text-rose-400">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>-Giảm</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-mono font-bold text-slate-400">
        <Minus className="w-3.5 h-3.5" />
        <span>Ổn định</span>
      </span>
    );
  };

  return (
    <Link
      href={`/${locale}/analytics/${performance.skill}`}
      className={`p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-lg hover:border-teal-500/40 transition-all flex flex-col justify-between space-y-4 group ${className}`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center shrink-0">
            {getSkillIcon(performance.skill)}
          </div>
          {getTrendBadge(performance.trend)}
        </div>

        <div className="space-y-1">
          <h4 className="font-display font-extrabold text-base text-white group-hover:text-teal-300 transition-colors flex items-center justify-between">
            <span>{skillName}</span>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-teal-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </h4>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-display font-extrabold text-white font-mono">
              {performance.score}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 100 điểm</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-850 text-xs">
        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-500 block">{isVi ? 'Độ chính xác' : 'Accuracy'}</span>
          <span className="font-mono font-bold text-slate-200">{performance.accuracy}%</span>
        </div>
        <div className="space-y-0.5 text-right">
          <span className="text-[10px] text-slate-500 block">{isVi ? 'Thời gian học' : 'Study Time'}</span>
          <span className="font-mono font-bold text-teal-300">{performance.studyMinutes}m</span>
        </div>
      </div>
    </Link>
  );
}
