'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Brain, Calendar, Clock, RefreshCw, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AdaptiveLearningPlan } from '@linguaflow/domain';
import { tutorApi } from '@/lib/tutor/tutorApi';
import { Button, Badge } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';

export default function TutorPlanPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const isVi = locale === 'vi';

  const [plan, setPlan] = useState<AdaptiveLearningPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);

  const fetchPlan = (days: number = 7) => {
    setLoading(true);
    tutorApi
      .getPlan('u-demo-1', locale)
      .then((res) => {
        if (res?.plan) setPlan(res.plan);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleRegenerate = async () => {
    sfx.playClick();
    setLoading(true);
    try {
      const res = await tutorApi.generatePlan({ userId: 'u-demo-1', days: 7, locale });
      if (res?.plan) setPlan(res.plan);
    } catch {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [locale]);

  const currentItems =
    selectedDay === 1
      ? plan?.todayItems || []
      : plan?.sevenDayPlan?.find((d) => d.day === selectedDay)?.items || [];

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-5xl mx-auto space-y-8 pointer-events-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href={`/${locale}/tutor`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isVi ? 'Quay lại AI Tutor Chat' : 'Back to AI Tutor Chat'}</span>
        </Link>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleRegenerate}
          disabled={loading}
          icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
        >
          {isVi ? 'Tạo lại lộ trình' : 'Regenerate Plan'}
        </Button>
      </div>

      {/* Hero Overview */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-teal-500/30 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="teal" className="text-xs font-mono uppercase font-bold">
                {isVi ? 'Lộ Trình Thích Ứng Cá Nhân' : 'Adaptive Learning Plan'}
              </Badge>
              <span className="text-xs font-mono text-slate-400">
                Mục tiêu: {plan?.targetCefr || 'B2'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Kế Hoạch Học Tập Hôm Nay
            </h1>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center sm:text-right shrink-0">
            <span className="text-[10px] text-slate-400 block font-semibold">{isVi ? 'Tổng thời gian dự kiến' : 'Estimated Time'}</span>
            <p className="text-2xl font-display font-extrabold text-teal-300 font-mono">
              ~{plan?.totalEstimatedMinutes || 35} {isVi ? 'phút' : 'mins'}
            </p>
          </div>
        </div>
      </div>

      {/* 7-Day Day Selector Tabs */}
      {plan?.sevenDayPlan && plan.sevenDayPlan.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {plan.sevenDayPlan.map((d) => (
            <button
              key={d.day}
              type="button"
              onClick={() => {
                sfx.playClick();
                setSelectedDay(d.day);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold font-mono transition-all shrink-0 ${
                selectedDay === d.day
                  ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-lg shadow-teal-500/20'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      )}

      {/* Plan Items List */}
      <div className="space-y-4">
        {currentItems.map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={item.priority === 'critical' || item.priority === 'high' ? 'amber' : 'teal'}
                  className="text-[10px] uppercase font-bold"
                >
                  {item.priority}
                </Badge>
                <span className="text-xs font-mono font-bold text-teal-300 capitalize">
                  {item.skill}
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {item.estimatedMinutes} {isVi ? 'phút' : 'min'}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-display font-extrabold text-white">
                {item.activity}
              </h3>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                <strong className="text-slate-400">Lý do:</strong> {item.reason}
              </p>

              <div className="text-[11px] text-teal-300/90 font-mono">
                🎯 {item.target}
              </div>
            </div>

            <Link href={item.route} className="shrink-0">
              <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                {isVi ? 'Bắt đầu ngay' : 'Start'}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
