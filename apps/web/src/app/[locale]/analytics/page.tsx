'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Activity,
  Award,
  Sparkles,
  Plus,
  Compass,
  Calendar,
  Flame,
  Clock,
  Target,
  FileText,
} from 'lucide-react';
import { analyticsApi } from '@/lib/analytics/analyticsApi';
import { LearningAnalytics, LearningGoal } from '@linguaflow/domain';
import LearningAnalyticsHero from '@/components/analytics/LearningAnalyticsHero';
import OverallLearningScore from '@/components/analytics/OverallLearningScore';
import SkillPerformanceGrid from '@/components/analytics/SkillPerformanceGrid';
import SkillRadarChart from '@/components/analytics/SkillRadarChart';
import SkillTrendChart from '@/components/analytics/SkillTrendChart';
import LearningHeatmap from '@/components/analytics/LearningHeatmap';
import WeaknessPanel from '@/components/analytics/WeaknessPanel';
import StrengthPanel from '@/components/analytics/StrengthPanel';
import RecommendationList from '@/components/analytics/RecommendationList';
import LearningGoalCard from '@/components/analytics/LearningGoalCard';
import LearningGoalDialog from '@/components/analytics/LearningGoalDialog';
import CEFRProgressCard from '@/components/analytics/CEFRProgressCard';
import WeeklyReportCard from '@/components/analytics/WeeklyReportCard';
import { Button } from '@linguaflow/ui';

export default function LearningAnalyticsDashboard() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const isVi = locale === 'vi';

  const [analytics, setAnalytics] = useState<LearningAnalytics | null>(null);
  const [weeklyReport, setWeeklyReport] = useState<any>(null);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi
      .getOverview()
      .then((res: any) => {
        if (res) setAnalytics(res);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    analyticsApi
      .getWeeklyReport()
      .then((res: any) => {
        if (res?.report) setWeeklyReport(res.report);
      })
      .catch(() => {});
  }, []);

  const handleGoalCreated = async (data: any) => {
    try {
      const res = await analyticsApi.createGoal(data);
      if (res?.goal && analytics) {
        setAnalytics({
          ...analytics,
          goals: [...analytics.goals, res.goal],
        });
      }
    } catch {}
  };

  const handleGoalDelete = async (goalId: string) => {
    try {
      await analyticsApi.deleteGoal(goalId);
      if (analytics) {
        setAnalytics({
          ...analytics,
          goals: analytics.goals.filter((g) => g.id !== goalId),
        });
      }
    } catch {}
  };

  if (!analytics && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        <p>{isVi ? 'Đang tổng hợp dữ liệu trí tuệ học tập...' : 'Aggregating intelligence metrics...'}</p>
      </div>
    );
  }

  const defaultSkills = analytics?.skills || [];
  const defaultWeaknesses = analytics?.weaknesses || [];
  const defaultStrengths = analytics?.strengths || [];
  const defaultRecommendations = analytics?.recommendations || [];
  const defaultGoals = analytics?.goals || [];

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 pointer-events-auto">
      {/* Hero Banner */}
      <LearningAnalyticsHero
        overallScore={analytics?.overallScore || 78}
        estimatedCEFR={analytics?.estimatedCEFR || 'B1'}
        totalStudyMinutes={analytics?.totalStudyMinutes || 1240}
        totalXP={analytics?.totalXP || 5010}
        currentStreak={analytics?.currentStreak || 5}
        weeklyMinutes={analytics?.weeklyMinutes || 185}
        locale={locale}
      />

      {/* Top Split: Overall Score & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 flex">
          <OverallLearningScore
            score={analytics?.overallScore || 78}
            consistencyScore={analytics?.consistency?.score || 75}
            estimatedCEFR={analytics?.estimatedCEFR || 'B1'}
            locale={locale}
            className="w-full"
          />
        </div>

        <div className="lg:col-span-7 flex">
          <SkillRadarChart
            skills={defaultSkills}
            locale={locale}
            className="w-full"
          />
        </div>
      </div>

      {/* Skill Performance Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-400" />
            <span>{isVi ? 'Hiệu Suất Từng Kỹ Năng' : 'Multi-Skill Performance'}</span>
          </h3>
          <span className="text-xs text-slate-400">
            {isVi ? 'Nhấn vào kỹ năng để xem phân tích chi tiết' : 'Click any skill to view in-depth metrics'}
          </span>
        </div>

        <SkillPerformanceGrid skills={defaultSkills} locale={locale} />
      </div>

      {/* Trend Chart */}
      <SkillTrendChart locale={locale} />

      {/* 365 Days Activity Heatmap */}
      <LearningHeatmap locale={locale} />

      {/* Recommendations & Action Plan */}
      <RecommendationList recommendations={defaultRecommendations} locale={locale} />

      {/* Weaknesses & Strengths Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <WeaknessPanel weaknesses={defaultWeaknesses} locale={locale} />
        <StrengthPanel strengths={defaultStrengths} locale={locale} />
      </div>

      {/* Goals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
                {isVi ? 'Mục Tiêu Học Tập Cá Nhân' : 'Personal Learning Goals'}
              </h3>
              <span className="text-xs text-slate-400">
                {isVi ? 'Tự đặt chỉ tiêu rèn luyện và nhận thưởng điểm XP khi hoàn thành' : 'Set targets and earn XP rewards'}
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setGoalDialogOpen(true)}
            icon={<Plus className="w-4 h-4" />}
            className="bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-bold"
          >
            {isVi ? 'Thêm mục tiêu' : 'Add Goal'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {defaultGoals.map((goal) => (
            <LearningGoalCard
              key={goal.id}
              goal={goal}
              onDelete={handleGoalDelete}
              locale={locale}
            />
          ))}
        </div>
      </div>

      {/* CEFR Progress and Weekly Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <CEFRProgressCard overallScore={analytics?.overallScore || 78} locale={locale} />
        {weeklyReport && <WeeklyReportCard report={weeklyReport} locale={locale} />}
      </div>

      {/* Goal Creator Dialog */}
      <LearningGoalDialog
        isOpen={goalDialogOpen}
        onClose={() => setGoalDialogOpen(false)}
        onGoalCreated={handleGoalCreated}
        locale={locale}
      />
    </main>
  );
}
