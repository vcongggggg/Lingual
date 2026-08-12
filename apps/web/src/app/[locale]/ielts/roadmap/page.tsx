'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Target, CheckCircle2, Circle, ArrowRight, Award, BookOpen, Sparkles, ChevronRight } from 'lucide-react';
import { ieltsApi } from '@/lib/api';

export default function IeltsRoadmapPage() {
  const routeParams = useParams();
  const locale = (routeParams?.locale as string) || 'vi';
  const [tracks, setTracks] = useState<any[]>([]);
  const [selectedBand, setSelectedBand] = useState<number>(6.5);

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const res = await ieltsApi.getRoadmap();
        if (res.success && res.tracks) {
          setTracks(res.tracks);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchRoadmap();
  }, []);

  const milestones = [
    {
      band: 5.5,
      title: 'Foundation Phase (Xây dựng nền tảng)',
      level: 'Band 4.5 -> 5.5',
      topics: ['Academic Word List (AWL) Level 1', 'Listening Section 1 & 2 (Form/Table completion)', 'Reading True/False/Not Given'],
      status: 'completed',
    },
    {
      band: 6.5,
      title: 'Intermediate Breakthrough (Bứt phá kỹ năng)',
      level: 'Band 6.0 -> 6.5',
      topics: ['Reading 2-Column Passage matching headings', 'Listening Section 3 & 4 (Multiple choice & Map)', 'Writing Task 1 Bar/Line Graph & Task 2 Essay Structure'],
      status: 'active',
    },
    {
      band: 7.5,
      title: 'Advanced Mastery (Chinh phục 7.0+)',
      level: 'Band 7.0 -> 7.5+',
      topics: ['Full Mock Test 4 kỹ năng áp lực thời gian', 'AI Writing Evaluation 4 tiêu chí', 'Advanced Academic Vocabulary & Paraphrasing'],
      status: 'locked',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-8">
      {/* Navigation Header */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href={`/${locale}/ielts`} className="hover:text-blue-400 transition-colors">
          IELTS Hub
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200">Lộ Trình Học Theo Band</span>
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase">
          <Target className="w-4 h-4 text-blue-400" /> IELTS Learning Pathway
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Lộ Trình Học Cá Nhân Hóa
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
          Được thiết kế theo từng chặng rõ ràng từ Band 4.5 đến 7.5+. Theo dõi tiến độ bài học và vượt qua các mốc bài thi thử.
        </p>
      </div>

      {/* Milestones Pathway */}
      <div className="relative space-y-6 before:absolute before:left-6 sm:before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
        {milestones.map((m, idx) => {
          const isActive = m.band === selectedBand || m.status === 'active';
          return (
            <div
              key={idx}
              className={`relative pl-14 sm:pl-20 p-6 rounded-2xl border transition-all ${
                isActive
                  ? 'bg-slate-900/90 border-blue-500/50 shadow-xl shadow-blue-500/10'
                  : 'bg-slate-900/40 border-slate-800 opacity-90'
              }`}
            >
              {/* Step indicator node */}
              <div
                className={`absolute left-3 sm:left-5 top-6 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border text-xs font-bold ${
                  m.status === 'completed'
                    ? 'bg-emerald-500 border-emerald-400 text-white'
                    : isActive
                    ? 'bg-blue-600 border-blue-400 text-white animate-pulse'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {m.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{m.level}</span>
                  <h3 className="text-xl font-bold text-white mt-1">{m.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedBand(m.band)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {isActive ? 'Chặng hiện tại' : 'Chọn chặng này'}
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {m.topics.map((t, tIdx) => (
                  <div
                    key={tIdx}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
