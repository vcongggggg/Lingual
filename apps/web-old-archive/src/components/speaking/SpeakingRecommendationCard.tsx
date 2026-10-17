'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Mic } from 'lucide-react';
import { Button } from '@linguaflow/ui';

interface SpeakingRecommendationCardProps {
  recommendation: {
    id: string;
    title: string;
    description: string;
    mode: string;
    actionRoute: string;
  };
  locale?: string;
  className?: string;
}

export default function SpeakingRecommendationCard({
  recommendation,
  locale = 'vi',
  className = '',
}: SpeakingRecommendationCardProps) {
  const isVi = locale === 'vi';

  return (
    <div className={`p-5 rounded-3xl bg-slate-900/90 border border-teal-500/30 backdrop-blur-xl shadow-lg flex flex-col justify-between space-y-3 ${className}`}>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-teal-400">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            {isVi ? 'Bài Luyện Khuyên Học' : 'Targeted Drill'}
          </span>
        </div>

        <h4 className="font-display font-extrabold text-base text-white">
          {recommendation.title}
        </h4>

        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          {recommendation.description}
        </p>
      </div>

      <div className="pt-2 flex justify-end">
        <Link href={recommendation.actionRoute}>
          <Button variant="primary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
            {isVi ? 'Luyện ngay' : 'Practice Now'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
