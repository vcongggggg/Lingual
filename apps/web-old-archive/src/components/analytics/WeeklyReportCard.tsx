'use client';

import React from 'react';
import { FileText, TrendingUp, Clock, BookOpen, Target, Sparkles } from 'lucide-react';
import { WeeklyLearningReport } from '@linguaflow/domain';
import { formatSkillName } from '@/lib/analytics/analyticsFormatters';
import { Badge } from '@linguaflow/ui';

interface WeeklyReportCardProps {
  report: WeeklyLearningReport;
  locale?: string;
  className?: string;
}

export default function WeeklyReportCard({
  report,
  locale = 'vi',
  className = '',
}: WeeklyReportCardProps) {
  const isVi = locale === 'vi';
  const strongest = formatSkillName(report.strongestSkill, locale);
  const focus = formatSkillName(report.focusNextWeek, locale);

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-purple-500/30 backdrop-blur-xl shadow-xl space-y-5 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-400" />
          <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
            {isVi ? 'Báo Cáo Tiến Bộ Tuần' : 'Weekly Intelligence Report'}
          </h3>
        </div>
        <Badge variant="teal" className="text-xs font-mono font-bold">
          Tuần {report.weekNumber} • {report.year}
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-1">
          <span className="text-[10px] text-slate-400 block">{isVi ? 'Thời gian học' : 'Study Time'}</span>
          <p className="font-display font-extrabold text-sm text-white font-mono">
            {report.minutesStudied}m
          </p>
          <span className="text-[10px] text-teal-400 font-mono">
            +{report.minutesChangePercent}% vs tuần trước
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-1">
          <span className="text-[10px] text-slate-400 block">{isVi ? 'Từ vựng nạp mới' : 'Vocab Learned'}</span>
          <p className="font-display font-extrabold text-sm text-white font-mono">
            {report.vocabularyCount} từ
          </p>
          <span className="text-[10px] text-teal-400 font-mono">
            +{report.vocabularyChangePercent}% vs tuần trước
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-1">
          <span className="text-[10px] text-slate-400 block">{isVi ? 'Kỹ năng nổi bật' : 'Top Skill'}</span>
          <p className="font-display font-extrabold text-sm text-teal-300">
            {strongest}
          </p>
          <span className="text-[10px] text-slate-400">{isVi ? 'Phong độ cao' : 'Mastery'}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-1">
          <span className="text-[10px] text-slate-400 block">{isVi ? 'Mục tiêu tuần tới' : 'Focus Next'}</span>
          <p className="font-display font-extrabold text-sm text-amber-400">
            {focus}
          </p>
          <span className="text-[10px] text-slate-400">{isVi ? 'Cần rèn luyện' : 'Target'}</span>
        </div>
      </div>

      <p className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-850 text-xs text-slate-300 font-sans leading-relaxed">
        {report.summary}
      </p>
    </div>
  );
}
