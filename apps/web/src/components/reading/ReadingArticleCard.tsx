'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { ReadingArticle } from '@linguaflow/domain';
import { Card, Badge } from '@linguaflow/ui';

interface ReadingArticleCardProps {
  article: Partial<ReadingArticle> & { paragraphCount?: number; vocabularyCount?: number; questionCount?: number };
  locale: string;
}

export default function ReadingArticleCard({ article, locale }: ReadingArticleCardProps) {
  const levelBadgeVariants: Record<string, 'teal' | 'emerald' | 'amber' | 'coral'> = {
    A1: 'teal',
    A2: 'emerald',
    B1: 'amber',
    B2: 'coral',
    C1: 'coral',
  };

  const vocabCount = article.vocabularyCount || article.vocabularyIds?.length || 0;
  const questCount = article.questionCount || article.questions?.length || 0;

  return (
    <Link href={`/${locale}/reading/${article.id}`} className="block group h-full">
      <Card
        glow="teal"
        className="flex flex-col justify-between h-full p-5 sm:p-6 space-y-4 hover:border-teal-400/40 transition-all"
      >
        <div className="space-y-3">
          {/* Header Level & Topic */}
          <div className="flex items-center justify-between">
            <Badge
              variant={levelBadgeVariants[article.level || 'A1'] || 'teal'}
              className="text-[10px] font-extrabold uppercase px-2.5 py-1"
            >
              {article.level}
            </Badge>

            <span className="text-xs font-semibold text-slate-400">
              {article.topic}
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-white group-hover:text-teal-300 transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {article.subtitle}
            </p>
          </div>

          {/* Metadata badges (Time, Words, Vocab) */}
          <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{article.estimatedMinutes} phút</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>{article.wordCount} từ</span>
            </div>
            {vocabCount > 0 && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>{vocabCount} từ vựng</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* CTA Footer */}
        <div className="pt-3 border-t border-slate-850 flex items-center justify-between text-xs font-bold text-teal-400 group-hover:text-teal-300">
          <span>Đọc bài & Tra từ vựng</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </Card>
    </Link>
  );
}
