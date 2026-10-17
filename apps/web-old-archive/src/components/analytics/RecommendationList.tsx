'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { LearningRecommendation } from '@linguaflow/domain';
import RecommendationCard from './RecommendationCard';

interface RecommendationListProps {
  recommendations: LearningRecommendation[];
  locale?: string;
  className?: string;
}

export default function RecommendationList({
  recommendations,
  locale = 'vi',
  className = '',
}: RecommendationListProps) {
  const isVi = locale === 'vi';

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-400" />
          <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
            {isVi ? 'Lộ Trình Tối Ưu Hôm Nay' : 'Recommended For You'}
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          {isVi ? 'Gợi ý cá nhân hóa thông minh' : 'Smart targeted learning path'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <RecommendationCard key={rec.id} recommendation={rec} locale={locale} />
        ))}
      </div>
    </div>
  );
}
