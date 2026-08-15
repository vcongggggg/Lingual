'use client';

import React from 'react';
import { Sparkles, Trophy, CheckCircle2 } from 'lucide-react';
import { StrengthArea } from '@linguaflow/domain';
import { formatSkillName } from '@/lib/analytics/analyticsFormatters';
import { getSkillIcon } from './SkillPerformanceCard';
import { Badge } from '@linguaflow/ui';

interface StrengthPanelProps {
  strengths: StrengthArea[];
  locale?: string;
  className?: string;
}

export default function StrengthPanel({
  strengths,
  locale = 'vi',
  className = '',
}: StrengthPanelProps) {
  const isVi = locale === 'vi';

  if (!strengths || strengths.length === 0) return null;

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-teal-400" />
        <div>
          <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
            {isVi ? 'Thế Mạnh Nổi Bật' : 'Your Learning Strengths'}
          </h3>
          <span className="text-xs text-slate-400">
            {isVi ? 'Các kỹ năng đạt độ chính xác từ 80% trở lên' : 'Skills with 80%+ accuracy and mastery'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {strengths.map((s) => {
          const name = formatSkillName(s.skill, locale);

          return (
            <div
              key={s.skill}
              className="p-4 rounded-2xl bg-slate-950/80 border border-teal-500/30 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {getSkillIcon(s.skill)}
                  </div>
                  <h4 className="font-display font-extrabold text-sm text-white">{name}</h4>
                </div>

                <Badge variant="teal" className="text-xs font-mono font-bold">
                  {s.score} / 100
                </Badge>
              </div>

              <ul className="space-y-0.5 text-xs text-slate-300 font-sans">
                {s.evidence.map((ev, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
