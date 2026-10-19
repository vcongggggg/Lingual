'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Target,
  CheckCircle2,
  Circle,
  ArrowRight,
  Award,
  BookOpen,
  Sparkles,
  ChevronRight,
  Headphones,
  FileText,
  PenTool,
  Mic,
  Lock,
  Play,
} from 'lucide-react';
import { ieltsApi } from '@/lib/api';
import { Button, Badge, ProgressBar } from '@linguaflow/ui';
import { arcadeAudio } from '@/lib/arcadeAudio';

export default function IeltsRoadmapPage() {
  const routeParams = useParams();
  const locale = (routeParams?.locale as string) || 'vi';
  const isVi = locale === 'vi';
  const [selectedBand, setSelectedBand] = useState<number>(6.5);

  const bands = [
    { band: 5.5, label: 'Band 5.5', desc: 'Foundation to Intermediate' },
    { band: 6.5, label: 'Band 6.5', desc: 'Academic Competency' },
    { band: 7.5, label: 'Band 7.5+', desc: 'Advanced Mastery' },
    { band: 8.5, label: 'Band 8.5+', desc: 'Native-Level Precision' },
  ];

  const milestones = [
    {
      band: 5.5,
      title: isVi ? 'Chặng 1: Xây Dựng Nền Tảng (Foundation)' : 'Phase 1: Foundation Building',
      target: 'Band 4.5 → 5.5',
      status: 'completed',
      completionRate: 100,
      skills: [
        { name: 'Listening', task: isVi ? 'Section 1 & 2: Điền từ & Form Completion' : 'Section 1 & 2: Form Completion', icon: <Headphones className="w-3.5 h-3.5 text-teal-400" /> },
        { name: 'Reading', task: isVi ? 'Scanning kỹ thuật & True/False/Not Given cơ bản' : 'Scanning & Basic True/False/Not Given', icon: <BookOpen className="w-3.5 h-3.5 text-blue-400" /> },
        { name: 'Writing', task: isVi ? 'Task 1: Cấu trúc Bar/Line Chart & Thì quá khứ' : 'Task 1: Line graphs & Past tense', icon: <PenTool className="w-3.5 h-3.5 text-amber-400" /> },
      ],
    },
    {
      band: 6.5,
      title: isVi ? 'Chặng 2: Bứt Phá Kỹ Năng (Breakthrough)' : 'Phase 2: Skill Breakthrough',
      target: 'Band 6.0 → 6.5',
      status: 'active',
      completionRate: 65,
      skills: [
        { name: 'Listening', task: isVi ? 'Section 3 & 4: Bài hội thoại học thuật & Map Labelling' : 'Section 3 & 4: Academic Discussions & Maps', icon: <Headphones className="w-3.5 h-3.5 text-teal-400" /> },
        { name: 'Reading', task: isVi ? 'Matching Headings & Summary Completion nâng cao' : 'Matching Headings & Advanced Summary', icon: <BookOpen className="w-3.5 h-3.5 text-blue-400" /> },
        { name: 'Writing', task: isVi ? 'Task 2: Luận điểm 4 đoạn & Coherence & Cohesion' : 'Task 2: 4-Paragraph Essay & Coherence', icon: <PenTool className="w-3.5 h-3.5 text-amber-400" /> },
      ],
    },
    {
      band: 7.5,
      title: isVi ? 'Chặng 3: Chinh Phục Điểm Cao (Advanced Mastery)' : 'Phase 3: Advanced Mastery',
      target: 'Band 7.0 → 7.5+',
      status: 'locked',
      completionRate: 0,
      skills: [
        { name: 'Full Test', task: isVi ? 'Mô phỏng 4 kỹ năng áp lực thời gian thực' : 'Full 3-Hour Timed Simulation', icon: <Target className="w-3.5 h-3.5 text-purple-400" /> },
        { name: 'Writing', task: isVi ? 'Chấm AI 4 tiêu chí chuẩn Examiners' : 'AI 4-Criterion Examiners Rubric', icon: <PenTool className="w-3.5 h-3.5 text-amber-400" /> },
        { name: 'Speaking', task: isVi ? 'Phân tích Fluency & Lexical Resource Band 8' : 'Fluency & Lexical Resource Band 8', icon: <Mic className="w-3.5 h-3.5 text-coral-400" /> },
      ],
    },
  ];

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-8 max-w-6xl mx-auto space-y-8 pointer-events-auto">
      {/* Navigation Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href={`/${locale}/ielts`} className="hover:text-teal-400 transition-colors">
          IELTS Accelerator Hub
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200">{isVi ? 'Lộ Trình Tăng Band' : 'Band Score Roadmap'}</span>
      </div>

      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/30 backdrop-blur-2xl shadow-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-extrabold uppercase">
          <Target className="w-3.5 h-3.5 text-teal-400" />
          <span>{isVi ? 'Lộ Trình Cá Nhân Hóa (Pathway)' : 'Target Band Pathway'}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              {isVi ? 'Kế Hoạch Bứt Phá Band Điểm' : 'Personalized Band Score Trajectory'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-sans">
              {isVi
                ? 'Lộ trình được cấu trúc từ nền tảng 4.5 đến 7.5+. Hoàn thành các module thực hành và vượt qua bài thi thử để mở khóa band tiếp theo.'
                : 'Structured pathway from 4.5 to 7.5+. Complete practice modules and mock simulations to unlock each higher band stage.'}
            </p>
          </div>

          <Link href={`/${locale}/ielts/mock-test`}>
            <Button variant="primary" icon={<Play className="w-4 h-4 fill-slate-950" />}>
              {isVi ? 'Thi Thử Mock Test' : 'Start Mock Test'}
            </Button>
          </Link>
        </div>

        {/* TARGET BAND SELECTOR TABS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
          {bands.map((b) => (
            <button
              key={b.band}
              type="button"
              onClick={() => {
                arcadeAudio.playLaser();
                setSelectedBand(b.band);
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                selectedBand === b.band
                  ? 'bg-teal-500/15 border-teal-500/40 shadow-lg shadow-teal-500/10'
                  : 'bg-slate-950/60 border-slate-850 hover:bg-slate-800/40 text-slate-400'
              }`}
            >
              <span className={`text-base font-display font-extrabold block ${selectedBand === b.band ? 'text-teal-300' : 'text-slate-300'}`}>
                {b.label}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5 line-clamp-1">{b.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MILESTONES PATHWAY */}
      <div className="space-y-6">
        <h2 className="text-xl font-display font-extrabold text-white">
          {isVi ? 'Các Mốc Chinh Phục Mục Tiêu' : 'Milestone Trajectory'}
        </h2>

        <div className="relative space-y-6 before:absolute before:left-6 sm:before:left-8 before:top-6 before:bottom-6 before:w-1 before:bg-gradient-to-b before:from-teal-500/60 before:via-amber-500/40 before:to-slate-800">
          {milestones.map((m, idx) => {
            const isActive = m.status === 'active';
            const isCompleted = m.status === 'completed';

            return (
              <div
                key={idx}
                className={`relative pl-14 sm:pl-20 p-6 rounded-3xl border transition-all ${
                  isActive
                    ? 'bg-slate-900/95 border-teal-500/50 shadow-2xl shadow-teal-500/10'
                    : isCompleted
                    ? 'bg-slate-900/70 border-emerald-500/30'
                    : 'bg-slate-900/40 border-slate-800/70 opacity-75'
                }`}
              >
                {/* Step Node Pin */}
                <div
                  className={`absolute left-3 sm:left-5 top-6 w-8 h-8 rounded-2xl flex items-center justify-center border font-bold text-xs shadow-lg ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : isActive
                      ? 'bg-gradient-to-tr from-amber-500 to-teal-400 border-amber-300 text-slate-950 animate-pulse'
                      : 'bg-slate-950 border-slate-800 text-slate-600'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : isActive ? <Play className="w-4 h-4 fill-slate-950 ml-0.5" /> : <Lock className="w-4 h-4" />}
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={isCompleted ? 'emerald' : isActive ? 'amber' : 'slate'} className="text-[10px] uppercase font-mono">
                          {m.target}
                        </Badge>
                        <span className="text-xs text-slate-400 font-mono">
                          {isCompleted ? (isVi ? 'Đã hoàn thành' : 'Completed') : isActive ? (isVi ? 'Đang học' : 'In Progress') : (isVi ? 'Chưa mở khóa' : 'Locked')}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-display font-extrabold text-white mt-1">
                        {m.title}
                      </h3>
                    </div>

                    <span className="font-mono text-xs font-bold text-teal-300">
                      {m.completionRate}% {isVi ? 'tiến độ' : 'progress'}
                    </span>
                  </div>

                  <ProgressBar value={m.completionRate} max={100} color={isCompleted ? 'teal' : 'amber'} />

                  {/* Skills Checklist Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                    {m.skills.map((s, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3 rounded-2xl bg-slate-950/70 border border-slate-850 flex items-start gap-2.5"
                      >
                        <div className="mt-0.5 shrink-0">{s.icon}</div>
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-bold text-slate-300 block">{s.name}</span>
                          <span className="text-[10px] text-slate-400 font-sans leading-tight block">
                            {s.task}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
