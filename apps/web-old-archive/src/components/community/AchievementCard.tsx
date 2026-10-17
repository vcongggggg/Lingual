'use client';

import React from 'react';
import { Award, CheckCircle2, Lock, Sparkles, Trophy, Users, Shield, Flame, BookOpen, UserPlus } from 'lucide-react';
import { ProgressBar, Badge } from '@linguaflow/ui';

interface AchievementItemProps {
  achievement: {
    id: string;
    code: string;
    title: string;
    description: string;
    icon: string;
    category: string;
    xpReward: number;
    currentProgress?: number;
    maxProgress: number;
    isUnlocked?: boolean;
    unlockedAt?: string;
  };
  locale?: string;
  className?: string;
}

export function getAchievementIcon(iconName: string) {
  switch (iconName) {
    case 'BookOpen':
      return <BookOpen className="w-5 h-5 text-teal-400" />;
    case 'Users':
      return <Users className="w-5 h-5 text-purple-400" />;
    case 'Shield':
      return <Shield className="w-5 h-5 text-teal-300" />;
    case 'Sparkles':
      return <Sparkles className="w-5 h-5 text-amber-300" />;
    case 'UserPlus':
      return <UserPlus className="w-5 h-5 text-purple-300" />;
    case 'Flame':
      return <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />;
    case 'Trophy':
    default:
      return <Trophy className="w-5 h-5 text-amber-400" />;
  }
}

export default function AchievementCard({
  achievement,
  locale = 'vi',
  className = '',
}: AchievementItemProps) {
  const isVi = locale === 'vi';
  const current = achievement.currentProgress || 0;
  const max = achievement.maxProgress || 1;
  const progressPercent = Math.min(100, Math.round((current / max) * 100));

  return (
    <div
      className={`p-5 rounded-3xl border transition-all space-y-3.5 ${
        achievement.isUnlocked
          ? 'bg-gradient-to-br from-amber-500/10 via-slate-900/90 to-purple-950/20 border-amber-500/40 shadow-lg'
          : 'bg-slate-900/80 border-slate-800 backdrop-blur-xl'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 ${
              achievement.isUnlocked
                ? 'bg-amber-500/20 border-amber-400/50 shadow-md'
                : 'bg-slate-950/80 border-slate-800 text-slate-500'
            }`}
          >
            {getAchievementIcon(achievement.icon)}
          </div>

          <div className="space-y-0.5">
            <h4 className="font-display font-extrabold text-sm sm:text-base text-white">
              {achievement.title}
            </h4>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              {achievement.category}
            </span>
          </div>
        </div>

        {achievement.isUnlocked ? (
          <Badge variant="amber" className="text-[10px] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-amber-400" />
            <span>{isVi ? 'Đã đạt' : 'Unlocked'}</span>
          </Badge>
        ) : (
          <Badge variant="teal" className="text-[10px] font-bold">
            +{achievement.xpReward} XP
          </Badge>
        )}
      </div>

      <p className="text-xs text-slate-300 leading-relaxed font-sans">
        {achievement.description}
      </p>

      {/* Progress Bar */}
      <div className="space-y-1 pt-1">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">
            {isVi ? 'Tiến độ:' : 'Progress:'} {current}/{max}
          </span>
          <span className="font-bold text-teal-400">{progressPercent}%</span>
        </div>
        <ProgressBar
          value={progressPercent}
          max={100}
          color={achievement.isUnlocked ? 'amber' : 'teal'}
        />
      </div>
    </div>
  );
}
