'use client';

import React from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  Headphones,
  BookMarked,
  PenTool,
  Mic,
  Trophy,
} from 'lucide-react';
import { TutorSkillContext } from '@linguaflow/domain';

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

  const skillIconMap: Record<string, React.ReactNode> = {
    vocabulary: <BookOpen className="w-3.5 h-3.5 text-teal-400" />,
    listening: <Headphones className="w-3.5 h-3.5 text-indigo-400" />,
    reading: <BookMarked className="w-3.5 h-3.5 text-blue-400" />,
    writing: <PenTool className="w-3.5 h-3.5 text-purple-400" />,
    speaking: <Mic className="w-3.5 h-3.5 text-amber-400" />,
    exam: <Trophy className="w-3.5 h-3.5 text-emerald-400" />,
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return <TrendingUp className="w-3 h-3 text-teal-400" />;
    if (trend === 'declining') return <TrendingDown className="w-3 h-3 text-rose-400" />;
    return <Minus className="w-3 h-3 text-slate-500" />;
  };

  const getProgressGradient = (score: number) => {
    if (score >= 75) return 'from-teal-400 via-emerald-400 to-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.4)]';
    if (score >= 60) return 'from-amber-400 via-yellow-400 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]';
    return 'from-rose-500 via-orange-400 to-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.4)]';
  };

  return (
    <div className={`p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-400" />
          <span>{isVi ? 'Phân Tích 6 Kỹ Năng' : '6 Skills Snapshot'}</span>
        </h3>
        <span className="text-[10px] text-teal-400 font-mono font-bold bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
          Real-time
        </span>
      </div>

      <div className="space-y-3.5">
        {skills.map((s) => (
          <div key={s.skill} className="space-y-1.5 group">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 capitalize flex items-center gap-1.5">
                <span className="p-1 rounded-lg bg-slate-950/80 border border-slate-800">
                  {skillIconMap[s.skill] || <Activity className="w-3.5 h-3.5 text-teal-400" />}
                </span>
                <span>{isVi ? skillNameMap[s.skill] || s.skill : s.skill}</span>
                {getTrendIcon(s.trend)}
              </span>
              <span className="font-mono font-bold text-white">{s.score}%</span>
            </div>

            {/* Neon Glowing Shimmer Progress Bar */}
            <div className="h-2 w-full rounded-full bg-slate-950 border border-slate-800/80 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${getProgressGradient(s.score)} transition-all duration-700`}
                style={{ width: `${Math.min(100, Math.max(5, s.score))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

