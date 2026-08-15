'use client';

import React from 'react';
import Link from 'next/link';
import { Brain, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { TutorContext, AdaptiveLearningPlanItem } from '@linguaflow/domain';
import TutorSkillSnapshot from './TutorSkillSnapshot';
import TutorPlanPreview from './TutorPlanPreview';

interface TutorContextPanelProps {
  context: TutorContext;
  planItems?: AdaptiveLearningPlanItem[];
  locale?: string;
  className?: string;
}

export default function TutorContextPanel({
  context,
  planItems = [],
  locale = 'vi',
  className = '',
}: TutorContextPanelProps) {
  const isVi = locale === 'vi';

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Weakness Detection Card */}
      {context.weaknesses && context.weaknesses.length > 0 && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl shadow-xl space-y-2.5">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{isVi ? 'Kỹ Năng Cần Khắc Phục' : 'Weaknesses Detected'}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {context.weaknesses.map((w) => (
              <span
                key={w}
                className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold capitalize"
              >
                {w}
              </span>
            ))}
          </div>

          <span className="text-[11px] text-slate-400 block font-sans">
            {isVi ? 'AI Tutor sẽ tự động điều chỉnh bài tập phù hợp.' : 'AI Tutor automatically adjusts practice difficulty.'}
          </span>
        </div>
      )}

      {/* 6 Skill Breakdown Snapshot */}
      <TutorSkillSnapshot skills={context.skills} locale={locale} />

      {/* Today's Plan Preview */}
      {planItems.length > 0 && (
        <TutorPlanPreview items={planItems} locale={locale} />
      )}
    </div>
  );
}
