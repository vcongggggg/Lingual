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
      {/* Weakness Detection Card with LingLing Encouragement */}
      {context.weaknesses && context.weaknesses.length > 0 && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl shadow-xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{isVi ? 'Kỹ Năng Cần Khắc Phục' : 'Weaknesses Detected'}</span>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              Ưu tiên ôn tập
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-0.5">
            {context.weaknesses.map((w) => (
              <span
                key={w}
                className="px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold capitalize shadow-sm"
              >
                {w}
              </span>
            ))}
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed font-sans pt-1 border-t border-slate-800/80">
            {isVi
              ? '💡 LingLing AI Tutor sẽ tự động điều chỉnh độ khó và bài tập vi mô để giúp bạn cải thiện các điểm này.'
              : '💡 LingLing AI Tutor will tailor micro-drills to strengthen these priority skills.'}
          </p>
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
