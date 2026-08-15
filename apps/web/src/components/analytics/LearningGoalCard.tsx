'use client';

import React from 'react';
import { Target, CheckCircle2, Clock, BookOpen, PenTool, Headphones, Trophy, Trash2 } from 'lucide-react';
import { LearningGoal, calculateGoalProgress } from '@linguaflow/domain';
import { formatGoalTypeLabel } from '@/lib/analytics/analyticsFormatters';
import { ProgressBar, Badge } from '@linguaflow/ui';

interface LearningGoalCardProps {
  goal: LearningGoal;
  onDelete?: (id: string) => void;
  locale?: string;
  className?: string;
}

export function getGoalTypeIcon(type: string) {
  switch (type) {
    case 'daily_minutes':
    case 'weekly_minutes':
      return <Clock className="w-4 h-4 text-indigo-400" />;
    case 'vocabulary':
      return <BookOpen className="w-4 h-4 text-teal-400" />;
    case 'writing':
      return <PenTool className="w-4 h-4 text-purple-300" />;
    case 'listening':
      return <Headphones className="w-4 h-4 text-teal-300" />;
    case 'exam':
      return <Trophy className="w-4 h-4 text-amber-400" />;
    case 'weekly_xp':
    default:
      return <Target className="w-4 h-4 text-amber-400" />;
  }
}

export default function LearningGoalCard({
  goal,
  onDelete,
  locale = 'vi',
  className = '',
}: LearningGoalCardProps) {
  const isVi = locale === 'vi';
  const progress = calculateGoalProgress(goal.current, goal.target);
  const typeLabel = formatGoalTypeLabel(goal.type, locale);

  return (
    <div
      className={`p-5 rounded-3xl bg-slate-900/90 border transition-all space-y-3.5 ${
        goal.completed
          ? 'border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-slate-900/90 to-slate-900 shadow-md'
          : 'border-slate-800'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center">
            {getGoalTypeIcon(goal.type)}
          </div>
          <div>
            <h4 className="font-display font-extrabold text-sm text-white">
              {typeLabel}
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              Hạn: {new Date(goal.endDate).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {goal.completed ? (
            <Badge variant="amber" className="text-[10px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-amber-400" />
              <span>{isVi ? 'Hoàn thành' : 'Done'}</span>
            </Badge>
          ) : (
            <Badge variant="teal" className="text-[10px] font-bold">
              +{goal.xpReward || 50} XP
            </Badge>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(goal.id)}
              className="text-slate-500 hover:text-rose-400 transition-colors p-1"
              title="Xóa mục tiêu"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300">
            {goal.current} / {goal.target}
          </span>
          <span className="font-bold text-teal-400">{progress.percentage}%</span>
        </div>
        <ProgressBar
          value={progress.percentage}
          max={100}
          color={goal.completed ? 'amber' : 'teal'}
        />
      </div>
    </div>
  );
}
