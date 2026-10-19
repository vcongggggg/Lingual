'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, History, Sparkles, Filter } from 'lucide-react';
import { ReadingArticle, ReadingStats as IReadingStats } from '@linguaflow/domain';
import { MASTER_READING_ARTICLES } from '@/lib/reading/sampleData';
import { readingApi } from '@/lib/api';
import ReadingHero from '@/components/reading/ReadingHero';
import ReadingStats from '@/components/reading/ReadingStats';
import ReadingFilters from '@/components/reading/ReadingFilters';
import ReadingArticleCard from '@/components/reading/ReadingArticleCard';

export default function ReadingLabPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [articles, setArticles] = useState<any[]>(MASTER_READING_ARTICLES);
  const [stats, setStats] = useState<IReadingStats>({
    articlesCompleted: 1,
    readingMinutes: 2,
    avgComprehension: 96,
    wordsLearned: 5,
    readingStreakDays: 3,
  });

  useEffect(() => {
    loadData();
  }, [selectedLevel, selectedTopic]);

  const loadData = async () => {
    try {
      const [articlesRes, statsRes] = await Promise.allSettled([
        readingApi.getArticles({
          level: selectedLevel !== 'all' ? selectedLevel : undefined,
          topic: selectedTopic !== 'all' ? selectedTopic : undefined,
        }),
        readingApi.getStats(),
      ]);

      if (articlesRes.status === 'fulfilled' && articlesRes.value?.articles) {
        setArticles(articlesRes.value.articles);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value?.stats) {
        setStats(statsRes.value.stats);
      }
    } catch {}
  };

  return (
    <main className="min-h-screen pb-20 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 pointer-events-auto">
      {/* Hero Studio Banner */}
      <ReadingHero locale={locale} />

      {/* Reading Performance Stats */}
      <ReadingStats stats={stats} />

      {/* Level & Topic Filters + History Link */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
            Kho Bài Đọc Phân Tầng Theo Chuẩn CEFR
          </h2>

          <Link
            href={`/${locale}/reading/history`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-teal-300 transition-all self-start sm:self-auto"
          >
            <History className="w-4 h-4 text-teal-400" />
            <span>Xem lịch sử đọc</span>
          </Link>
        </div>

        <ReadingFilters
          selectedLevel={selectedLevel}
          onSelectLevel={setSelectedLevel}
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
        />
      </div>

      {/* Graded Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((art) => (
          <ReadingArticleCard key={art.id} article={art} locale={locale} />
        ))}
      </div>
    </main>
  );
}
