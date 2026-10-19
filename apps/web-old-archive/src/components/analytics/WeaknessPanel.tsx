'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { WeaknessArea, LearningSkill } from '@linguaflow/domain';
import { formatSkillName } from '@/lib/analytics/analyticsFormatters';
import { getSkillIcon } from './SkillPerformanceCard';
import { Badge, Button } from '@linguaflow/ui';

interface WeaknessPanelProps {
  weaknesses: WeaknessArea[];
  locale?: string;
  className?: string;
}

export function getActionRouteForSkill(skill: LearningSkill, locale: string = 'vi'): string {
  switch (skill) {
    case 'listening':
      return `/${locale}/listening/dictation`;
    case 'speaking':
      return `/${locale}/listening/shadowing`;
    case 'vocabulary':
      return `/${locale}/srs`;
    case 'writing':
      return `/${locale}/writing/guided`;
    case 'reading':
      return `/${locale}/reading`;
    case 'exam':
    default:
      return `/${locale}/exam-practice`;
  }
}

export default function WeaknessPanel({
  weaknesses,
  locale = 'vi',
  className = '',
}: WeaknessPanelProps) {
  const isVi = locale === 'vi';

  if (!weaknesses || weaknesses.length === 0) {
    return (
      <div className={`p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-3 text-center ${className}`}>
        <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto" />
        <h3 className="font-display font-extrabold text-base text-white">
          {isVi ? 'Không phát hiện điểm yếu nghiêm trọng' : 'No Critical Weaknesses Detected'}
        </h3>
        <p className="text-xs text-slate-400">
          {isVi ? 'Bạn đang duy trì độ chính xác đồng đều trên mọi kỹ năng!' : 'You are maintaining solid accuracy across all domains!'}
        </p>
      </div>
    );
  }

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-amber-400" />
        <div>
          <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
            {isVi ? 'Kỹ Năng Cần Cải Thiện' : 'Areas to Improve'}
          </h3>
          <span className="text-xs text-slate-400">
            {isVi ? 'Phát hiện tự động dựa trên độ chính xác thực tế' : 'Automatically detected from performance data'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {weaknesses.map((w) => {
          const skillName = formatSkillName(w.skill, locale);
          const targetRoute = getActionRouteForSkill(w.skill, locale);

          return (
            <div
              key={w.skill}
              className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-850 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    {getSkillIcon(w.skill)}
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-sm sm:text-base text-white">
                      {skillName}
                    </h4>
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {w.score} / 100 điểm
                    </span>
                  </div>
                </div>

                <Badge
                  variant={w.severity === 'high' ? 'amber' : 'coral'}
                  className="text-[10px] font-bold uppercase"
                >
                  {w.severity === 'high' ? (isVi ? 'Ưu tiên cao' : 'High Priority') : (isVi ? 'Ưu tiên vừa' : 'Medium')}
                </Badge>
              </div>

              {/* Evidence */}
              <ul className="space-y-1 text-xs text-slate-300 font-sans pl-2 border-l-2 border-slate-800">
                {w.evidence.map((ev, i) => (
                  <li key={i} className="leading-relaxed">
                    • {ev}
                  </li>
                ))}
              </ul>

              {/* CTA Action */}
              <div className="pt-2 flex justify-end">
                <Link href={targetRoute}>
                  <Button variant="primary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                    {isVi ? 'Luyện tập khắc phục ngay' : 'Start Targeted Practice'}
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
