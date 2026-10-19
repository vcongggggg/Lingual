'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Activity,
  ArrowRight,
  TrendingUp,
  Clock,
  Trophy,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { analyticsApi } from '@/lib/analytics/analyticsApi';
import { SkillPerformance, LearningSkill } from '@linguaflow/domain';
import { formatSkillName } from '@/lib/analytics/analyticsFormatters';
import { getSkillIcon } from '@/components/analytics/SkillPerformanceCard';
import { getActionRouteForSkill } from '@/components/analytics/WeaknessPanel';
import SkillTrendChart from '@/components/analytics/SkillTrendChart';
import { Badge, Button } from '@linguaflow/ui';

export default function SkillAnalyticsDetailPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const skillParam = (params?.skill as LearningSkill) || 'listening';
  const isVi = locale === 'vi';

  const [skills, setSkills] = useState<SkillPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi
      .getSkills()
      .then((res: any) => {
        if (res?.skills) setSkills(res.skills);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const currentSkill = skills.find((s) => s.skill === skillParam) || {
    skill: skillParam,
    score: 75,
    accuracy: 80,
    attempts: 10,
    completed: 10,
    studyMinutes: 120,
    xpEarned: 450,
    trend: 'stable' as const,
  };

  const skillName = formatSkillName(skillParam, locale);
  const targetRoute = getActionRouteForSkill(skillParam, locale);

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-5xl mx-auto space-y-6 pointer-events-auto">
      <Link
        href={`/${locale}/analytics`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isVi ? 'Quay lại Bảng Phân Tích' : 'Back to Analytics Dashboard'}</span>
      </Link>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-teal-500/30 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-950 border border-teal-500/40 flex items-center justify-center shrink-0 shadow-lg">
              {getSkillIcon(skillParam)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                  {skillName}
                </h1>
                <Badge variant="teal" className="text-xs uppercase font-bold">
                  {currentSkill.trend === 'up' ? 'Xu hướng tăng' : currentSkill.trend === 'down' ? 'Cần cải thiện' : 'Ổn định'}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                {isVi ? 'Phân tích chi tiết tiến độ, độ chính xác và lịch sử luyện tập' : 'In-depth performance, accuracy & study history'}
              </p>
            </div>
          </div>

          <Link href={targetRoute}>
            <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
              {isVi ? 'Luyện tập kỹ năng này' : 'Practice Now'}
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-0.5">
            <span className="text-[10px] text-slate-400 block">{isVi ? 'Điểm năng lực' : 'Proficiency Score'}</span>
            <p className="text-2xl font-display font-extrabold text-white font-mono">
              {currentSkill.score} <span className="text-xs text-slate-500">/ 100</span>
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-0.5">
            <span className="text-[10px] text-slate-400 block">{isVi ? 'Độ chính xác trung bình' : 'Average Accuracy'}</span>
            <p className="text-2xl font-display font-extrabold text-teal-300 font-mono">
              {currentSkill.accuracy}%
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-0.5">
            <span className="text-[10px] text-slate-400 block">{isVi ? 'Thời gian rèn luyện' : 'Total Study Time'}</span>
            <p className="text-2xl font-display font-extrabold text-indigo-300 font-mono">
              {currentSkill.studyMinutes}m
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-0.5">
            <span className="text-[10px] text-slate-400 block">{isVi ? 'Số lượt bài hoàn thành' : 'Completed Sessions'}</span>
            <p className="text-2xl font-display font-extrabold text-amber-400 font-mono">
              {currentSkill.completed} / {currentSkill.attempts}
            </p>
          </div>
        </div>
      </div>

      {/* Historical Trend Chart */}
      <SkillTrendChart locale={locale} />
    </main>
  );
}
