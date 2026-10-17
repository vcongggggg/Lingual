'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Brain, Sparkles, Activity, Trophy, Flame, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { TutorContext, TutorRecommendation } from '@linguaflow/domain';
import { tutorApi } from '@/lib/tutor/tutorApi';
import TutorSkillSnapshot from '@/components/tutor/TutorSkillSnapshot';
import TutorRecommendationCard from '@/components/tutor/TutorRecommendationCard';
import { Button, Badge } from '@linguaflow/ui';

export default function TutorDashboardPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const isVi = locale === 'vi';

  const [context, setContext] = useState<TutorContext | null>(null);
  const [recommendations, setRecommendations] = useState<TutorRecommendation[]>([]);

  useEffect(() => {
    tutorApi
      .getContext()
      .then((res) => {
        if (res?.context) setContext(res.context);
      })
      .catch(() => {});

    tutorApi
      .getRecommendations('u-demo-1', locale)
      .then((res) => {
        if (res?.recommendations) setRecommendations(res.recommendations);
      })
      .catch(() => {});
  }, [locale]);

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-6xl mx-auto space-y-8 pointer-events-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}/tutor`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isVi ? 'Quay lại Chat với AI Tutor' : 'Back to AI Tutor Chat'}</span>
        </Link>

        <Link href={`/${locale}/tutor/plan`}>
          <Button variant="primary" size="sm" icon={<Brain className="w-3.5 h-3.5" />}>
            {isVi ? 'Xem Lộ Trình Học' : 'View Learning Plan'}
          </Button>
        </Link>
      </div>

      {/* Header Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold">{isVi ? 'Trình độ CEFR' : 'CEFR Level'}</span>
          <p className="text-2xl font-display font-extrabold text-teal-300 font-mono">
            {context?.user?.cefrEstimate || 'B2'}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold">{isVi ? 'Điểm năng lực tổng thể' : 'Overall Score'}</span>
          <p className="text-2xl font-display font-extrabold text-white font-mono">
            {context?.overallScore || 78}%
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold">{isVi ? 'Chuỗi ngày liên tiếp' : 'Streak'}</span>
          <p className="text-2xl font-display font-extrabold text-amber-400 font-mono flex items-center gap-1">
            <Flame className="w-5 h-5 text-amber-400" />
            {context?.user?.currentStreak || 5} {isVi ? 'ngày' : 'days'}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold">{isVi ? 'Thẻ SRS đến hạn' : 'SRS Due'}</span>
          <p className="text-2xl font-display font-extrabold text-purple-400 font-mono flex items-center gap-1">
            <Brain className="w-5 h-5 text-purple-400" />
            {context?.srsDueCount || 14}
          </p>
        </div>
      </div>

      {/* Main Grid: Skills Snapshot + Strengths & Weaknesses + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 space-y-6">
          {context && <TutorSkillSnapshot skills={context.skills} locale={locale} />}

          {/* Strengths and Weaknesses */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
            <h3 className="font-display font-extrabold text-base text-white">
              {isVi ? 'Điểm Mạnh & Kỹ Năng Cần Cải Thiện' : 'Strengths & Growth Areas'}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <span className="text-teal-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>{isVi ? 'Điểm mạnh nổi bật:' : 'Top Strengths:'}</span>
                </span>
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {context?.strengths?.map((s) => (
                    <Badge key={s} variant="teal" className="uppercase font-mono">
                      {s}
                    </Badge>
                  )) || <span className="text-slate-400">Từ vựng, Đọc hiểu</span>}
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-850">
                <span className="text-amber-300 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>{isVi ? 'Cần cải thiện:' : 'Target Weaknesses:'}</span>
                </span>
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {context?.weaknesses?.map((w) => (
                    <Badge key={w} variant="amber" className="uppercase font-mono">
                      {w}
                    </Badge>
                  )) || <span className="text-slate-400">Luyện nói, Kỹ năng viết</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-base text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>{isVi ? 'Đề Xuất Hành Động Mục Tiêu' : 'Targeted Actions'}</span>
            </h3>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => (
              <TutorRecommendationCard key={rec.id} recommendation={rec} locale={locale} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
