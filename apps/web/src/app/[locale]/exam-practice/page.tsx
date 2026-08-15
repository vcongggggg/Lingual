'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Trophy, Award, Clock, ArrowRight, BookOpen, History, BarChart3, Filter, Sparkles } from 'lucide-react';
import { MASTER_EXAMS } from '@/lib/exams/sampleData';
import { examsApi } from '@/lib/exams/api';
import LingLingMascot from '@/components/LingLingMascot';
import { Card, Badge, Button } from '@linguaflow/ui';

const EXAM_TYPES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'toeic', label: 'TOEIC' },
  { id: 'ielts', label: 'IELTS' },
  { id: 'vstep', label: 'VSTEP' },
  { id: 'hsk', label: 'HSK' },
  { id: 'jlpt', label: 'JLPT' },
  { id: 'topik', label: 'TOPIK' },
  { id: 'dsat', label: 'Digital SAT' },
];

export default function ExamPracticeHubPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  const [selectedType, setSelectedType] = useState('all');
  const [exams, setExams] = useState(MASTER_EXAMS);
  const [stats, setStats] = useState({
    totalAttempts: 1,
    avgScore: 7,
    bestScore: 7,
    avgAccuracy: 100,
    totalStudyMinutes: 20,
    strongestSection: 'Reading Comprehension',
  });

  useEffect(() => {
    examsApi
      .getExams({ type: selectedType !== 'all' ? selectedType : undefined })
      .then((res: any) => {
        if (res?.exams) setExams(res.exams);
      })
      .catch(() => {});

    examsApi
      .getExamStats()
      .then((res: any) => {
        if (res?.stats) setStats(res.stats);
      })
      .catch(() => {});
  }, [selectedType]);

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 pointer-events-auto">
      {/* Hero Studio Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-teal-400" />
              <span>Exam Practice Lab • Phòng Thi Thử Trực Tuyến</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              Thi Thử Chuẩn Quốc Tế <br />
              <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
                Phân Tích & Bứt Phá Điểm Số
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Mô phỏng phòng thi thực chiến TOEIC, IELTS, VSTEP, HSK, JLPT, TOPIK, DSAT với đồng hồ bấm giờ chuẩn, chấm điểm tự động không gian lận và phát hiện lỗ hổng kiến thức.
            </p>
          </div>

          <div className="shrink-0 flex items-center justify-center">
            <LingLingMascot state="thinking" size={120} />
          </div>
        </div>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-teal-500/20 backdrop-blur-xl shadow-lg space-y-1">
          <span className="text-slate-400 text-xs font-semibold">Đã thi thử</span>
          <p className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {stats.totalAttempts} lượt
          </p>
          <span className="text-[11px] text-slate-500">Tổng số bài thi đã hoàn tất</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg space-y-1">
          <span className="text-slate-400 text-xs font-semibold">Độ chính xác TB</span>
          <p className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400">
            {stats.avgAccuracy}%
          </p>
          <span className="text-[11px] text-slate-500">Tỷ lệ trả lời đúng</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg space-y-1">
          <span className="text-slate-400 text-xs font-semibold">Thời gian ôn luyện</span>
          <p className="text-2xl sm:text-3xl font-display font-extrabold text-teal-400">
            {stats.totalStudyMinutes} phút
          </p>
          <span className="text-[11px] text-slate-500">Tổng thời gian làm bài thi</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg space-y-1">
          <span className="text-slate-400 text-xs font-semibold">Kỹ năng mạnh nhất</span>
          <p className="text-base font-display font-extrabold text-amber-300 truncate">
            {stats.strongestSection}
          </p>
          <span className="text-[11px] text-slate-500">Phần thi đạt kết quả cao</span>
        </div>
      </div>

      {/* Quick Navigation Links & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {EXAM_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedType(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 border ${
                selectedType === t.id
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/${locale}/exam-practice/history`}>
            <Button variant="outline" size="sm" icon={<History className="w-4 h-4" />}>
              Lịch sử thi
            </Button>
          </Link>
          <Link href={`/${locale}/exam-practice/stats`}>
            <Button variant="outline" size="sm" icon={<BarChart3 className="w-4 h-4" />}>
              Phân tích
            </Button>
          </Link>
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {exams.map((exam) => (
          <Link
            key={exam.id}
            href={`/${locale}/exam-practice/${exam.id}`}
            className="block group h-full"
          >
            <Card
              glow="teal"
              className="flex flex-col justify-between h-full p-5 sm:p-6 space-y-4 hover:border-teal-400/40 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="teal" className="text-[10px] font-extrabold uppercase px-2.5 py-1">
                    {exam.type} • {exam.difficulty}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-400">
                    {exam.durationMinutes} phút
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-teal-300 transition-colors line-clamp-2">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {exam.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                    <span>{exam.totalQuestions} câu hỏi</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{exam.durationMinutes} phút</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-850 flex items-center justify-between text-xs font-bold text-teal-400 group-hover:text-teal-300">
                <span>Vào phòng thi thử</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
