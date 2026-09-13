'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { ReadingArticle } from '@linguaflow/domain';
import { TiltCard } from '@/components/common/TiltCard';

interface ReadingArticleCardProps {
  article: Partial<ReadingArticle> & { paragraphCount?: number; vocabularyCount?: number; questionCount?: number };
  locale: string;
}

export default function ReadingArticleCard({ article, locale }: ReadingArticleCardProps) {
  const levelColors: Record<string, { badge: string; text: string; border: string; glow: string }> = {
    A1: { badge: 'bg-teal-500/20', text: 'text-teal-300', border: 'border-teal-400/40', glow: 'rgba(20, 184, 166, 0.2)' },
    A2: { badge: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-400/40', glow: 'rgba(16, 185, 129, 0.2)' },
    B1: { badge: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-400/40', glow: 'rgba(59, 130, 246, 0.2)' },
    B2: { badge: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-400/40', glow: 'rgba(245, 158, 11, 0.2)' },
    C1: { badge: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-400/40', glow: 'rgba(244, 63, 94, 0.2)' },
  };

  const currentLevel = article.level || 'A1';
  const theme = levelColors[currentLevel] || levelColors.A1;
  const vocabCount = article.vocabularyCount || article.vocabularyIds?.length || 0;

  // Curated Fallback Visuals with 3D Mascot Character
  const coverImage = article.coverImage && (article.coverImage.startsWith('http') || article.coverImage.startsWith('/'))
    ? article.coverImage
    : currentLevel === 'A1'
    ? '/images/dashboard/hero_study_mascot.jpg'
    : currentLevel === 'A2'
    ? '/images/dashboard/quick_vocabulary.jpg'
    : currentLevel === 'B1'
    ? '/images/ielts/mascot_ielts_reading.jpg'
    : currentLevel === 'B2'
    ? '/images/ielts/mascot_ielts_listening.jpg'
    : '/images/dashboard/unit_study_desk.jpg';

  const mascotSticker = currentLevel === 'A1'
    ? '/mascot/raw/mascot_sticker_clean_01.png'
    : currentLevel === 'A2'
    ? '/mascot/raw/mascot_sticker_clean_04.png'
    : currentLevel === 'B1'
    ? '/mascot/raw/mascot_sticker_clean_08.png'
    : currentLevel === 'B2'
    ? '/mascot/raw/mascot_sticker_clean_15.png'
    : '/mascot/cow_salute.png';

  return (
    <Link href={`/${locale}/reading/${article.id}`} className="block group h-full">
      <TiltCard
        maxTilt={7}
        spotlightColor={theme.glow}
        className="h-full"
      >
        <div className="flex flex-col justify-between h-full rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-400/50 hover:bg-slate-900 transition-all duration-300 shadow-2xl overflow-hidden group">
          {/* 16:9 Cinematic Magazine Cover Image */}
          <div className="relative h-44 w-full overflow-hidden bg-slate-950">
            <Image
              src={coverImage}
              alt={article.title || 'Reading Article'}
              fill
              className="object-cover object-center brightness-100 contrast-105 group-hover:scale-105 group-hover:brightness-110 transition-all duration-500"
            />
            {/* Smooth Vignette Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-transparent" />

            {/* Top Badges: CEFR Level & Topic */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
              <span
                className={`px-3 py-1 rounded-xl text-xs font-mono font-black uppercase tracking-wider backdrop-blur-md border shadow-md ${theme.badge} ${theme.border} ${theme.text}`}
              >
                {currentLevel}
              </span>

              {article.topic && (
                <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-200 bg-slate-950/75 border border-white/10 backdrop-blur-md shadow-md">
                  {article.topic}
                </span>
              )}
            </div>

            {/* Floating Mini Reading Cow Sticker */}
            <div className="absolute -bottom-1 right-3 z-10 group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300 filter drop-shadow-xl">
              <Image
                src={mascotSticker}
                alt="LingLing Reading"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          </div>

          {/* Article Info Body */}
          <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-teal-300 transition-colors line-clamp-2 leading-snug">
                {article.title}
              </h3>
              {article.subtitle && (
                <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed">
                  {article.subtitle}
                </p>
              )}
            </div>

            {/* Metadata Badges Ribbon */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{article.estimatedMinutes} phút</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1 font-mono">
                <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                <span>{article.wordCount} từ</span>
              </div>
              {vocabCount > 0 && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1 font-mono text-purple-300">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>{vocabCount} từ vựng</span>
                  </div>
                </>
              )}
            </div>

            {/* Card CTA Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-teal-400 group-hover:text-teal-300">
              <span>Đọc bài & Tra từ vựng</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </TiltCard>
    </Link>
  );
}

