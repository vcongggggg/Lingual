'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Clock, ArrowRight, BookOpen, Headphones, PenTool, FileText, Trophy } from 'lucide-react';
import { LearningRecommendation, LearningSkill } from '@linguaflow/domain';
import { getSkillIcon } from './SkillPerformanceCard';
import { Badge, Button } from '@linguaflow/ui';

interface RecommendationCardProps {
  recommendation: LearningRecommendation;
  locale?: string;
  className?: string;
}

export default function RecommendationCard({
  recommendation,
  locale = 'vi',
  className = '',
}: RecommendationCardProps) {
  const isVi = locale === 'vi';

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="amber" className="text-[10px] font-bold uppercase">{isVi ? 'Ưu tiên cao' : 'High'}</Badge>;
      case 'medium':
        return <Badge variant="coral" className="text-[10px] font-bold uppercase">{isVi ? 'Khuyên học' : 'Medium'}</Badge>;
      case 'low':
      default:
        return <Badge variant="teal" className="text-[10px] font-bold uppercase">{isVi ? 'Khám phá' : 'Low'}</Badge>;
    }
  };

  return (
    <div
      className={`p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 ${className}`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center">
              {getSkillIcon(recommendation.skill)}
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>~{recommendation.estimatedMinutes} {isVi ? 'phút' : 'mins'}</span>
            </span>
          </div>

          {getPriorityBadge(recommendation.priority)}
        </div>

        <div className="space-y-1">
          <h4 className="font-display font-extrabold text-base text-white leading-snug">
            {recommendation.title}
          </h4>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {recommendation.description}
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-850 flex justify-end">
        <Link href={recommendation.actionRoute}>
          <Button variant="primary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
            {recommendation.actionLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
}
