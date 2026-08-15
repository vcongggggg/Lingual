'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  PenTool,
  Eye,
  Layers,
  Sparkles,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { WritingPrompt } from '@linguaflow/domain';
import { MASTER_WRITING_PROMPTS } from '@/lib/writing/sampleData';
import { writingApi } from '@/lib/api';
import WritingLabCard from '@/components/writing/WritingLabCard';
import LingLingMascot from '@/components/LingLingMascot';
import { Button, Card, Badge } from '@linguaflow/ui';

export default function WritingLabPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [prompts, setPrompts] = useState<WritingPrompt[]>(MASTER_WRITING_PROMPTS);
  const [stats, setStats] = useState({
    totalAttempts: 1,
    totalWords: 24,
    avgScore: 92,
    writingStreakDays: 3,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [promptsRes, statsRes] = await Promise.allSettled([
        writingApi.getPrompts(),
        writingApi.getStats(),
      ]);

      if (promptsRes.status === 'fulfilled' && promptsRes.value?.prompts) {
        setPrompts(promptsRes.value.prompts);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value?.stats) {
        setStats(statsRes.value.stats);
      }
    } catch {}
  };

  const filteredPrompts = prompts.filter((p) =>
    selectedDifficulty === 'all' ? true : p.difficulty === selectedDifficulty
  );

  return (
    <main className="min-h-screen pb-20 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 pointer-events-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 border border-purple-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <PenTool className="w-3.5 h-3.5 text-purple-400" />
              <span>Writing Lab • Phòng Luyện Viết Tiếng Anh</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              Biến Suy Nghĩ Thành <br />
              <span className="bg-gradient-to-r from-purple-400 via-teal-400 to-amber-300 bg-clip-text text-transparent">
                Câu Từ Tiếng Anh Tự Nhiên.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Thực hành viết theo tranh, dựng câu từng bước và viết tự do với bộ máy phân tích ngữ pháp, gợi ý từ vựng nâng cao và đồng bộ thẻ nhớ SRS.
            </p>
          </div>

          <div className="shrink-0 flex items-center justify-center">
            <LingLingMascot state="thinking" size={120} />
          </div>
        </div>
      </div>

      {/* Writing Stats Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-purple-500/20 backdrop-blur-xl shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Chuỗi ngày luyện viết</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-display font-extrabold text-amber-400">
            {stats.writingStreakDays} ngày
          </p>
          <span className="text-[11px] text-slate-500">Giữ thói quen viết hàng ngày</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Bài viết hoàn thành</span>
            <PenTool className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {stats.totalAttempts} bài
          </p>
          <span className="text-[11px] text-slate-500">Đã nộp & nhận phản hồi</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Điểm trung bình</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400">
            {stats.avgScore} / 100
          </p>
          <span className="text-[11px] text-slate-500">Dựa trên 5 tiêu chí chấm điểm</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Tổng số từ đã viết</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-display font-extrabold text-purple-300">
            {stats.totalWords} từ
          </p>
          <span className="text-[11px] text-slate-500">Vốn từ vựng đã vận dụng</span>
        </div>
      </div>

      {/* 3 Main Writing Modes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
            Chọn Phương Thức Luyện Viết
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WritingLabCard
            title="Quan Sát & Viết"
            subtitle="See & Write"
            description="Mô tả bối cảnh hình ảnh trực quan, sử dụng từ khóa gợi ý và cấu trúc ngữ pháp trọng tâm."
            icon={<Eye className="w-6 h-6 text-teal-400" />}
            href={`/${locale}/writing/see-write`}
            badgeText="Trực quan • A1-C1"
            badgeVariant="teal"
            glowColor="teal"
          />

          <WritingLabCard
            title="Viết Theo Hướng Dẫn"
            subtitle="Guided Writing"
            description="Xây dựng đoạn văn hoàn chỉnh từng bước qua các câu hỏi gợi mở theo trình tự logic."
            icon={<Layers className="w-6 h-6 text-purple-400" />}
            href={`/${locale}/writing/guided`}
            badgeText="Từng bước • A1-B1"
            badgeVariant="teal"
            glowColor="teal"
          />

          <WritingLabCard
            title="Viết Tự Do"
            subtitle="Free Writing"
            description="Diễn đạt quan điểm không giới hạn theo chủ đề tự chọn, đặt mục tiêu số từ và bấm giờ rèn phản xạ."
            icon={<PenTool className="w-6 h-6 text-amber-400" />}
            href={`/${locale}/writing/free`}
            badgeText="Tự do • B1-C1"
            badgeVariant="amber"
            glowColor="amber"
          />
        </div>
      </div>

      {/* Prompt Explorer Section */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
            Đề Bài Luyện Viết Mẫu Theo Cấp Độ
          </h2>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-2xl border border-slate-800 overflow-x-auto">
            {['all', 'A1', 'A2', 'B1', 'B2', 'C1'].map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedDifficulty === diff
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {diff === 'all' ? 'Tất cả' : diff}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrompts.map((prompt) => (
            <Card
              key={prompt.id}
              glow="teal"
              className="flex flex-col justify-between p-5 space-y-4 hover:border-purple-400/40 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="teal" className="text-[10px] font-extrabold uppercase">
                    {prompt.difficulty}
                  </Badge>
                  <span className="text-[11px] text-slate-400 capitalize">{prompt.category}</span>
                </div>

                <h3 className="font-display font-bold text-base text-white line-clamp-1">
                  {prompt.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {prompt.instruction}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-850 flex items-center justify-between">
                <span className="text-[11px] font-mono text-purple-300">
                  {prompt.mode === 'see-write' ? '📷 See & Write' : prompt.mode === 'guided' ? '🧩 Guided' : '📝 Free'}
                </span>

                <Link
                  href={`/${locale}/writing/${prompt.mode}?promptId=${prompt.id}`}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span>Viết bài</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
