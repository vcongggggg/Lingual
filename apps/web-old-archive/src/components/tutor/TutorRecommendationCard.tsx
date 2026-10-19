'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { TutorRecommendation } from '@linguaflow/domain';
import TutorActionCard from './TutorActionCard';
import { Badge } from '@linguaflow/ui';

interface TutorRecommendationCardProps {
  recommendation: TutorRecommendation;
  locale?: string;
  className?: string;
}

export default function TutorRecommendationCard({
  recommendation,
  locale = 'vi',
  className = '',
}: TutorRecommendationCardProps) {
  const isVi = locale === 'vi';

  return (
    <div
      className={`p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-3.5 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge
            variant={recommendation.priority === 'critical' || recommendation.priority === 'high' ? 'amber' : 'teal'}
            className="text-[10px] font-mono uppercase font-bold"
          >
            {recommendation.priority}
          </Badge>
          <span className="text-[10px] text-slate-400 font-mono">
            {recommendation.reason}
          </span>
        </div>

        <Sparkles className="w-4 h-4 text-teal-400" />
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-display font-extrabold text-white">
          {recommendation.title}
        </h4>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          {recommendation.description}
        </p>
      </div>

      <TutorActionCard action={recommendation.action} locale={locale} />
    </div>
  );
}
