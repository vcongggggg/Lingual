'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Mic,
  Activity,
  Trophy,
  History,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { speakingApi } from '@/lib/speaking/api';
import SpeakingLabCard from '@/components/speaking/SpeakingLabCard';
import SpeakingModeSelector from '@/components/speaking/SpeakingModeSelector';
import SpeakingStatsCard from '@/components/speaking/SpeakingStatsCard';
import SpeakingHistory from '@/components/speaking/SpeakingHistory';
import SpeakingRecommendationCard from '@/components/speaking/SpeakingRecommendationCard';
import { Button } from '@linguaflow/ui';

export default function SpeakingLabHubPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const isVi = locale === 'vi';

  const [stats, setStats] = useState<any>({
    totalAttempts: 12,
    totalMinutes: 125,
    totalXP: 540,
    averageScore: 78,
    averagePronunciation: 82,
    averageFluency: 75,
    topGrade: 'Good',
  });

  const [history, setHistory] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    speakingApi
      .getStats()
      .then((res: any) => {
        if (res?.stats) setStats(res.stats);
      })
      .catch(() => {});

    speakingApi
      .getHistory()
      .then((res: any) => {
        if (res?.attempts) setHistory(res.attempts);
      })
      .catch(() => {});

    speakingApi
      .getRecommendations(locale)
      .then((res: any) => {
        if (res?.recommendations) setRecommendations(res.recommendations);
      })
      .catch(() => {});
  }, [locale]);

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 pointer-events-auto">
      {/* Hero Header */}
      <SpeakingLabCard
        totalMinutes={stats.totalMinutes}
        totalAttempts={stats.totalAttempts}
        averageScore={stats.averageScore}
        currentStreak={5}
        locale={locale}
      />

      {/* 7 Practice Modes Grid */}
      <SpeakingModeSelector locale={locale} />

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-lg text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <span>{isVi ? 'Bài Luyện Được Đề Xuất Cho Bạn' : 'Recommended For You'}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <SpeakingRecommendationCard key={rec.id} recommendation={rec} locale={locale} />
            ))}
          </div>
        </div>
      )}

      {/* Stats & Recent History Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <SpeakingStatsCard stats={stats} locale={locale} />
        </div>

        <div className="lg:col-span-7">
          <SpeakingHistory attempts={history} locale={locale} />
        </div>
      </div>
    </main>
  );
}
