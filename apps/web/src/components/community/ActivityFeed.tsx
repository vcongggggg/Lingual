'use client';

import React from 'react';
import { LearningActivity } from '@linguaflow/domain';
import ActivityCard from './ActivityCard';
import { Sparkles, MessageSquare } from 'lucide-react';

interface ActivityFeedProps {
  activities: LearningActivity[];
  locale?: string;
  className?: string;
}

export default function ActivityFeed({
  activities,
  locale = 'vi',
  className = '',
}: ActivityFeedProps) {
  const isVi = locale === 'vi';

  if (!activities || activities.length === 0) {
    return (
      <div className={`p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2 ${className}`}>
        <MessageSquare className="w-8 h-8 text-slate-500 mx-auto" />
        <h4 className="font-display font-bold text-sm text-white">
          {isVi ? 'Chưa có hoạt động nào gần đây' : 'No recent activities'}
        </h4>
        <p className="text-xs text-slate-400">
          {isVi
            ? 'Hãy hoàn thành các bài học, luyện đọc, luyện viết hoặc thi thử để chia sẻ tiến độ học tập!'
            : 'Complete lessons, reading, writing, or exam practice to share your learning journey!'}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3.5 ${className}`}>
      {activities.map((act) => (
        <ActivityCard key={act.id} activity={act} locale={locale} />
      ))}
    </div>
  );
}
