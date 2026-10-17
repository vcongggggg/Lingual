'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Trophy,
  Flame,
  Sparkles,
  PenTool,
  Headphones,
  Users,
  Award,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { LearningActivity, mapActivityToFeedItem } from '@linguaflow/domain';
import { Badge } from '@linguaflow/ui';

interface ActivityCardProps {
  activity: LearningActivity;
  locale?: string;
  className?: string;
}

export function getActivityIcon(type: string) {
  switch (type) {
    case 'reading_completed':
      return <FileText className="w-4 h-4 text-teal-400" />;
    case 'writing_completed':
      return <PenTool className="w-4 h-4 text-purple-400" />;
    case 'listening_completed':
      return <Headphones className="w-4 h-4 text-teal-300" />;
    case 'exam_completed':
      return <Trophy className="w-4 h-4 text-amber-400" />;
    case 'streak_milestone':
      return <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />;
    case 'achievement_unlocked':
      return <Award className="w-4 h-4 text-purple-300" />;
    case 'group_joined':
      return <Users className="w-4 h-4 text-teal-400" />;
    case 'note_created':
      return <Sparkles className="w-4 h-4 text-amber-300" />;
    default:
      return <BookOpen className="w-4 h-4 text-teal-400" />;
  }
}

export default function ActivityCard({
  activity,
  locale = 'vi',
  className = '',
}: ActivityCardProps) {
  const { actionText, highlight } = mapActivityToFeedItem(activity, locale);

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-md hover:border-slate-700 transition-all flex items-start gap-3.5 ${className}`}>
      {/* User Avatar */}
      <Link href={`/${locale}/community/profile/${activity.userId}`} className="shrink-0">
        <div className="w-10 h-10 rounded-full ring-2 ring-purple-500/30 overflow-hidden bg-slate-800 flex items-center justify-center relative">
          {activity.userAvatar ? (
            <Image src={activity.userAvatar} alt={activity.userName} fill className="object-cover" unoptimized />
          ) : (
            <span className="font-bold text-xs text-white">{activity.userName.charAt(0)}</span>
          )}
        </div>
      </Link>

      {/* Main Content */}
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <Link
            href={`/${locale}/community/profile/${activity.userId}`}
            className="font-display font-extrabold text-white hover:text-teal-300 transition-colors"
          >
            {activity.userName}
          </Link>
          <span className="text-slate-400">{actionText}</span>
        </div>

        <h4 className="font-display font-bold text-sm sm:text-base text-teal-300">
          {highlight}
        </h4>

        {activity.description && (
          <p className="text-xs text-slate-300 leading-relaxed font-sans pt-0.5">
            {activity.description}
          </p>
        )}

        <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            {getActivityIcon(activity.type)}
            <span className="capitalize">{activity.type.replace(/_/g, ' ')}</span>
          </div>
          <span>•</span>
          <span>
            {new Date(activity.timestamp).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
              hour: '2-digit',
              minute: '2-digit',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
