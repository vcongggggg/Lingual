'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  TrendingUp,
  Clock,
  BookOpen,
  Headphones,
  FileText,
  Volume2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import { api } from '../../lib/api';
import { LingLing } from '../../components/ui/LingLing';
import { StampSlam } from '../../components/ui/StampSlam';
import { useCountUp } from '../../lib/useCountUp';

interface SkillScore {
  key: string;
  name: string;
  englishName: string;
  score: number;
  accuracy: number;
  attempts: number;
  studyMinutes: number;
  trend: 'up' | 'stable' | 'down';
  href: string;
  icon: any;
}

const DEFAULT_SKILLS: SkillScore[] = [
  {
    key: 'vocabulary',
    name: 'Từ vựng',
    englishName: 'Vocabulary',
    score: 84,
    accuracy: 88,
    attempts: 24,
    studyMinutes: 380,
    trend: 'stable',
    href: '/analytics/vocabulary',
    icon: BookOpen,
  },
  {
    key: 'reading',
    name: 'Kỹ năng Đọc',
    englishName: 'Reading',
    score: 81,
    accuracy: 85,
    attempts: 12,
    studyMinutes: 240,
    trend: 'up',
    href: '/analytics/reading',
    icon: BookOpen,
  },
  {
    key: 'writing',
    name: 'Kỹ năng Viết',
    englishName: 'Writing',
    score: 68,
    accuracy: 72,
    attempts: 9,
    studyMinutes: 180,
    trend: 'up',
    href: '/analytics/writing',
    icon: FileText,
  },
  {
    key: 'listening',
    name: 'Kỹ năng Nghe',
    englishName: 'Listening',
    score: 62,
    accuracy: 64,
    attempts: 18,
    studyMinutes: 210,
    trend: 'down',
    href: '/analytics/listening',
    icon: Headphones,
  },
  {
    key: 'speaking',
    name: 'Kỹ năng Nói',
    englishName: 'Speaking',
    score: 61,
    accuracy: 65,
    attempts: 8,
    studyMinutes: 90,
    trend: 'up',
    href: '/analytics/speaking',
    icon: Volume2,
  },
];

// Attendance Record (Bảng Chấm Công Tuần)
const ATTENDANCE_DAYS = [
  { day: 'T2', date: '12/10', minutes: 45, status: 'checked' },
  { day: 'T3', date: '13/10', minutes: 30, status: 'checked' },
  { day: 'T4', date: '14/10', minutes: 50, status: 'checked' },
  { day: 'T5', date: '15/10', minutes: 25, status: 'checked' },
  { day: 'T6', date: '16/10', minutes: 35, status: 'checked' },
  { day: 'T7', date: '17/10', minutes: 30, status: 'today' },
  { day: 'CN', date: '18/10', minutes: 0, status: 'rest' },
];

export default function AnalyticsPage() {
  const [overallScore, setOverallScore] = useState(74);
  const [estimatedCEFR, setEstimatedCEFR] = useState('B2');
  const [totalStudyMinutes, setTotalStudyMinutes] = useState(1240);
  const [skills, setSkills] = useState<SkillScore[]>(DEFAULT_SKILLS);
  const [loading, setLoading] = useState(true);

  const animatedScore = useCountUp(overallScore, 800);
  const animatedMinutes = useCountUp(totalStudyMinutes, 800);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getAnalyticsOverview();
        if (res) {
          if (res.overallScore) setOverallScore(res.overallScore);
          if (res.estimatedCEFR) setEstimatedCEFR(res.estimatedCEFR);
          if (res.totalStudyMinutes) setTotalStudyMinutes(res.totalStudyMinutes);

          if (Array.isArray(res.skills) && res.skills.length > 0) {
            const mapped = DEFAULT_SKILLS.map((sk) => {
              const matched = res.skills.find((s: any) => s.skill?.toLowerCase() === sk.key);
              if (matched) {
                return {
                  ...sk,
                  score: matched.score || sk.score,
                  accuracy: matched.accuracy || sk.accuracy,
                  attempts: matched.attempts || sk.attempts,
                  studyMinutes: matched.studyMinutes || sk.studyMinutes,
                  trend: matched.trend || sk.trend,
                };
              }
              return sk;
            });
            setSkills(mapped);
          }
        }
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 pb-28 sm:pb-20 text-left">
      {/* Header bar Báo Cáo Học Tập */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-red">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Báo Cáo Học Tập</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight font-sans">
              Phiếu báo điểm & đánh giá năng lực toàn diện
            </h1>

            <p className="text-sm sm:text-base text-ink-soft leading-relaxed font-sans">
              Tổng hợp điểm số thực tế từ các bài luyện tập và đề thi.
              Minh bạch từng chỉ số để bạn dễ dàng tập trung cải thiện kỹ năng còn yếu.
            </p>
          </div>

          <div className="flex flex-col items-center flex-shrink-0">
            <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
              Điểm tổng kết tuần đạt <span className="text-red">{animatedScore}/100</span>! Phong độ đỉnh cao!
            </div>
            <LingLing reaction="flex" size={125} />
          </div>
        </div>
      </div>

      {/* PHIẾU BÁO ĐIỂM TỔNG QUAN (REPORT CARD SUMMARY) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Điểm tổng hợp */}
        <div className="card-paper p-6 space-y-2 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-ink-muted">
              Điểm năng lực chung
            </span>
            <span className="w-8 h-8 rounded-full border border-ink bg-paper-2 flex items-center justify-center text-red">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="text-4xl font-black text-ink font-mono">
            {animatedScore}<span className="text-lg font-bold text-ink-muted">/100</span>
          </div>
          <span className="text-xs font-bold text-teal block">
            Trình độ ước tính: Bậc {estimatedCEFR}
          </span>
        </div>

        {/* Tổng thời gian rèn luyện */}
        <div className="card-paper p-6 space-y-2 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-ink-muted">
              Thời gian rèn luyện
            </span>
            <span className="w-8 h-8 rounded-full border border-ink bg-paper-2 flex items-center justify-center text-teal">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-4xl font-black text-teal font-mono">
            {Math.floor(animatedMinutes / 60)}h {animatedMinutes % 60}p
          </div>
          <span className="text-xs font-bold text-ink-soft block">
            Tổng số phút tích lũy trên hệ thống
          </span>
        </div>

        {/* Chuỗi ngày học tập */}
        <div className="card-paper p-6 space-y-2 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-ink-muted">
              Tính chuyên cần
            </span>
            <span className="w-8 h-8 rounded-full border border-ink bg-paper-2 flex items-center justify-center text-amber">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="text-4xl font-black text-ink font-mono">
            6 / 7 ngày
          </div>
          <span className="text-xs font-bold text-ink-soft block">
            Đã duy trì lịch học đều đặn trong tuần
          </span>
        </div>
      </div>

      {/* LỊCH HỌC NHƯ "BẢNG CHẤM CÔNG" (ATTENDANCE RECORD) & BIỂU ĐỒ HIGHLIGHTER 7 NGÀY */}
      <div className="card-paper p-6 sm:p-8 space-y-6 bg-paper-2 border-2 border-ink shadow-brutal-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink/20 pb-3">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-ink-muted block">
              Bảng chấm công rèn luyện & Phân tích thời lượng
            </span>
            <h3 className="text-lg font-black text-ink font-sans">
              Nhật ký chuyên cần & Cột giờ học tuần này
            </h3>
          </div>
          <span className="font-mono text-xs font-black text-teal bg-card border border-ink px-2.5 py-1 rounded-md self-start sm:self-auto">
            Mục tiêu: 30 phút/ngày
          </span>
        </div>

        {/* Biểu đồ cột highlighter 7 ngày (Bars grow upward like highlighter strokes with 80ms stagger) */}
        <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-ink flex items-center gap-1.5">
              <span>📊</span>
              <span>Thời lượng học mỗi ngày (Vệt mực bút dạ quang):</span>
            </span>
            <span className="text-[11px] font-mono text-ink-muted">Mục tiêu 30p - 50p</span>
          </div>

          <div className="h-36 pt-4 pb-2 px-2 flex items-end justify-between gap-2 sm:gap-4 border-b-2 border-dashed border-ink/30">
            {ATTENDANCE_DAYS.map((d, idx) => {
              const heightPercent = d.minutes > 0 ? Math.min(100, Math.round((d.minutes / 50) * 100)) : 8;
              const isToday = d.status === 'today';

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-mono font-bold text-ink-muted mb-1 group-hover:text-ink transition-colors">
                    {d.minutes > 0 ? `${d.minutes}p` : '0p'}
                  </span>
                  <div className="w-full max-w-[42px] h-full flex items-end">
                    <div
                      className={`w-full rounded-t-lg border-2 border-ink origin-bottom animate-bar-grow shadow-brutal-sm ${
                        isToday ? 'bg-red' : d.minutes >= 30 ? 'bg-teal' : d.minutes > 0 ? 'bg-amber' : 'bg-paper-2 opacity-50'
                      }`}
                      style={{
                        height: `${heightPercent}%`,
                        animationDelay: `${idx * 80}ms`,
                      }}
                      title={`${d.day}: ${d.minutes} phút`}
                    />
                  </div>
                  <span className={`text-xs font-black font-sans mt-2 ${isToday ? 'text-red font-black underline' : 'text-ink'}`}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7 Ô Chấm Công (Attendance matrix with sequential StampSlam delayMs={idx * 150}) */}
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-ink-muted block mb-3">
            Dấu mộc điểm danh theo ngày:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
            {ATTENDANCE_DAYS.map((d, idx) => {
              const isChecked = d.status === 'checked';
              const isToday = d.status === 'today';

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-between min-h-[110px] ${
                    isToday
                      ? 'border-red bg-red/10 shadow-brutal-sm'
                      : isChecked
                      ? 'border-ink bg-card shadow-brutal-sm'
                      : 'border-ink/30 bg-paper opacity-60'
                  }`}
                >
                  <div>
                    <span className="text-xs font-black text-ink block font-sans">
                      {d.day}
                    </span>
                    <span className="text-[10px] font-mono text-ink-muted block">
                      {d.date}
                    </span>
                  </div>

                  <div className="my-2 flex items-center justify-center min-h-[32px]">
                    {isChecked && (
                      <StampSlam
                        text="ĐÃ HỌC"
                        variant="rect"
                        color="teal"
                        size="sm"
                        delayMs={idx * 150}
                      />
                    )}

                    {isToday && (
                      <StampSlam
                        text="HÔM NAY"
                        variant="rect"
                        color="red"
                        size="sm"
                        delayMs={idx * 150}
                      />
                    )}

                    {!isChecked && !isToday && (
                      <span className="w-7 h-7 rounded-full border border-ink/30 inline-flex items-center justify-center font-mono text-xs text-ink-muted">
                        -
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-mono font-bold text-ink-soft block">
                    {d.minutes > 0 ? `${d.minutes}p` : 'Nghỉ'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ĐIỂM TỪNG KỸ NĂNG VẼ KIỂU MỰC TAY (HAND-DRAWN INK BARS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-ink font-sans">
            Bảng điểm 5 kỹ năng chính
          </h2>
          <span className="text-xs font-bold text-ink-muted">Bấm vào kỹ năng để xem chi tiết</span>
        </div>

        <div className="space-y-4">
          {skills.map((sk) => {
            const Icon = sk.icon;

            return (
              <Link
                key={sk.key}
                href={sk.href}
                className="card-paper p-5 sm:p-6 bg-card border-2 border-ink shadow-brutal-md hover:-translate-y-0.5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 block group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl border-2 border-ink bg-paper-2 flex items-center justify-center text-ink shadow-brutal-sm flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-1 flex-1 max-w-md">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-ink font-sans group-hover:text-red transition-colors">
                        {sk.name}
                      </h3>
                      <span className="text-xs font-mono font-bold text-ink-muted">
                        ({sk.englishName})
                      </span>
                    </div>

                    {/* Vạch Mực Tay Tiến Độ (Hand-drawn styled ink progress bar) */}
                    <div className="w-full h-3 bg-paper-2 border-2 border-ink rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-ink rounded-full transition-all duration-700"
                        style={{ width: `${sk.score}%` }}
                      />
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold text-ink-soft pt-0.5">
                      <span>Độ chính xác: <b>{sk.accuracy}%</b></span>
                      <span>•</span>
                      <span>Đã làm: <b>{sk.attempts} bài</b></span>
                      <span>•</span>
                      <span>Thời lượng: <b>{sk.studyMinutes}p</b></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto flex-shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase text-ink-muted block">Điểm số</span>
                    <span className="font-mono text-2xl font-black text-red">
                      {sk.score}<span className="text-xs text-ink-muted">/100</span>
                    </span>
                  </div>

                  <div className="w-9 h-9 rounded-xl border border-ink bg-paper-2 flex items-center justify-center text-ink group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
