'use client';

import React from 'react';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TutorSkillContext } from '@linguaflow/domain';
import { ProgressBar } from '@linguaflow/ui';

interface TutorSkillSnapshotProps {
  skills: TutorSkillContext[];
  locale?: string;
  className?: string;
}

export default function TutorSkillSnapshot({
  skills,
  locale = 'vi',
  className = '',
}: TutorSkillSnapshotProps) {
  const isVi = locale === 'vi';

  const skillNameMap: Record<string, string> = {
    vocabulary: 'Từ Vựng',
    listening: 'Luyện Nghe',
    reading: 'Đọc Hiểu',
    writing: 'Kỹ Năng Viết',
    speaking: 'Luyện Nói',
    exam: 'Thi Thử',
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return <TrendingUp className="w-3.5 h-3.5 text-teal-400" />;
    if (trend === 'declining') return <TrendingDown className="w-3.5 h-3.5 text-rose-400" />;
    return <Minus className="w-3.5 h-3.5 text-slate-500" />;
  };

  return (
    <div className={`p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-teal-400" />
          <span>{isVi ? 'Phân Tích 6 Kỹ Năng' : '6 Skills Snapshot'}</span>
        </h3>
        <span className="text-[10px] text-slate-400 font-mono">Real-time</span>
      </div>

      <div className="space-y-3">
        {skills.map((s) => (
          <div key={s.skill} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 capitalize flex items-center gap-1">
                <span>{isVi ? skillNameMap[s.skill] || s.skill : s.skill}</span>
                {getTrendIcon(s.trend)}
              </span>
              <span className="font-mono font-bold text-white">{s.score}%</span>
            </div>
            <ProgressBar
              value={s.score}
              max={100}
              color={s.score >= 75 ? 'teal' : s.score >= 60 ? 'amber' : 'coral'}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
