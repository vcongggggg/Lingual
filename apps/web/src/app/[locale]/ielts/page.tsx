'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  BookOpen,
  Headphones,
  FileText,
  Mic,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  Target,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { ieltsApi } from '@/lib/api';
import ThemeIllustration from '@/components/ThemeIllustration';

export default function IeltsHubPage() {
  const routeParams = useParams();
  const locale = (routeParams?.locale as string) || 'vi';
  const [targetBand, setTargetBand] = useState<number>(6.5);
  const [roadmapTracks, setRoadmapTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await ieltsApi.getRoadmap();
        if (res.success && res.tracks) {
          setRoadmapTracks(res.tracks);
        }
      } catch (err) {
        console.error('Failed to load IELTS roadmap', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const skills = [
    {
      id: 'reading',
      title: 'Reading',
      desc: 'Luyện đọc 2 cột chuẩn thi thật (Passages + 14 dạng câu hỏi)',
      icon: BookOpen,
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
      badge: 'Passage 2-Col',
      link: `/${locale}/ielts/practice/reading`,
    },
    {
      id: 'listening',
      title: 'Listening',
      desc: 'Nghe audio chọn đáp án, điền từ & xem Transcript thông minh',
      icon: Headphones,
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
      badge: 'Audio Player',
      link: `/${locale}/ielts/practice/listening`,
    },
    {
      id: 'writing',
      title: 'Writing (AI Feedback)',
      desc: 'Soạn bài Task 1/2 & nhận chấm điểm 4 tiêu chí band descriptor từ AI',
      icon: FileText,
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
      badge: 'AI Chấm điểm 4 tiêu chí',
      link: `/${locale}/ielts/practice/writing`,
    },
    {
      id: 'mock-test',
      title: 'Full Mock Test',
      desc: 'Thi thử 4 kỹ năng trong áp lực thời gian thực & quy đổi Band score',
      icon: Clock,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
      badge: 'Mô phỏng áp lực thi',
      link: `/${locale}/ielts/mock-test`,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border border-blue-500/20 p-6 sm:p-10 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            IELTS Academic & General Prep
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-blue-200">
            Phân hệ Luyện Thi IELTS Toàn Diện
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Học tập theo lộ trình cá nhân hóa, rèn luyện 4 kỹ năng chuẩn đề thi Cambridge và nhận phản hồi chi tiết từ AI Chấm điểm 4 tiêu chí IELTS.
          </p>

          {/* Target Band Selector */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-300 font-medium flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-400" /> Target Band mục tiêu:
            </span>
            {[5.5, 6.0, 6.5, 7.0, 7.5, 8.0].map((band) => (
              <button
                key={band}
                onClick={() => setTargetBand(band)}
                className={`px-3 py-1.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                  targetBand === band
                    ? 'bg-blue-600 text-white ring-2 ring-blue-400 scale-105'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                Band {band}
              </button>
            ))}
          </div>
        </div>

        {/* IELTS Hero Graphic Illustration */}
        <ThemeIllustration type="ielts" size={130} className="hidden md:block shrink-0 z-10" />

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Progress & Target Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Mục tiêu đặt ra</div>
            <div className="text-2xl font-bold text-slate-100">IELTS Band {targetBand}</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Trình độ ước tính hiện tại</div>
            <div className="text-2xl font-bold text-purple-300">Band 6.0</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Bài làm hoàn thành</div>
            <div className="text-2xl font-bold text-emerald-300">12 Bài luyện</div>
          </div>
        </div>
      </div>

      {/* Skills Practice Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" /> Rèn Luyện Theo Kỹ Năng
          </h2>
          <Link
            href={`/${locale}/ielts/roadmap`}
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
          >
            Xem Lộ trình đầy đủ <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <Link
                key={skill.id}
                href={skill.link}
                className="group relative p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/50 border border-slate-800 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3.5 rounded-xl bg-gradient-to-br border ${skill.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {skill.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                      {skill.title}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">{skill.desc}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-blue-400">
                  <span>Bắt đầu luyện tập</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Target Band Pathway Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Lộ Trình Học Theo Chặng (Target Band Pathway)</h2>
            <p className="text-slate-400 text-sm mt-1">Các chặng học được cá nhân hóa theo Band mục tiêu của bạn.</p>
          </div>
          <Link
            href={`/${locale}/ielts/roadmap`}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/20 text-center"
          >
            Vào Lộ Trình Học
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roadmapTracks.map((track, idx) => (
            <div
              key={track.id || idx}
              className={`p-5 rounded-2xl border transition-all ${
                track.targetBand === targetBand
                  ? 'bg-blue-950/40 border-blue-500/50 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-900/40 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Chặng {idx + 1}
                </span>
                <span className="text-lg font-black text-white">Band {track.targetBand}</span>
              </div>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">{track.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
