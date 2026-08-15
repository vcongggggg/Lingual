'use client';

import React from 'react';
import { Mic, Volume2, Sparkles, Trophy, Flame, Clock } from 'lucide-react';
import LingLingMascot from '@/components/LingLingMascot';
import { Badge } from '@linguaflow/ui';

interface SpeakingLabCardProps {
  totalMinutes: number;
  totalAttempts: number;
  averageScore: number;
  currentStreak: number;
  locale?: string;
}

export default function SpeakingLabCard({
  totalMinutes,
  totalAttempts,
  averageScore,
  currentStreak,
  locale = 'vi',
}: SpeakingLabCardProps) {
  const isVi = locale === 'vi';
  const mascotState = averageScore >= 80 ? 'celebrating' : averageScore >= 60 ? 'thinking' : 'apologetic';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/20 p-6 sm:p-10 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Mic className="w-3.5 h-3.5 text-teal-400" />
            <span>Speaking & Pronunciation Lab</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
            Phòng Luyện Nói <br />
            <span className="bg-gradient-to-r from-teal-300 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
              Phát Âm Chuẩn & Phản Xạ Lưu Loát
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {isVi
              ? 'Rèn luyện 7 chế độ chuyên sâu: Phát âm âm vị, Lặp lại câu, Nói đuổi (Shadowing), Hỏi đáp định hướng, Miêu tả tranh, Tình huống thực tế và Nói tự do.'
              : 'Master 7 specialized modes: Pronunciation, Sentence Repetition, Shadowing, Guided Speaking, Picture Description, Situational Roleplay, and Free Speaking.'}
          </p>

          <div className="pt-1 flex items-center gap-2">
            <Badge variant="teal" className="text-xs font-mono font-extrabold px-3 py-1">
              {isVi ? 'Nhận diện Transcript Match cục bộ an toàn' : 'Safe local transcript speech match'}
            </Badge>
          </div>
        </div>

        <div className="shrink-0 flex items-center justify-center">
          <LingLingMascot state={mascotState} size={120} />
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-0.5">
          <span className="text-[11px] text-slate-400 font-semibold">{isVi ? 'Chuỗi luyện nói' : 'Speaking Streak'}</span>
          <p className="text-xl font-display font-extrabold text-teal-400 flex items-center gap-1">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            {currentStreak} {isVi ? 'ngày' : 'days'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-0.5">
          <span className="text-[11px] text-slate-400 font-semibold">{isVi ? 'Thời gian luyện' : 'Total Practice'}</span>
          <p className="text-xl font-display font-extrabold text-indigo-300 flex items-center gap-1">
            <Clock className="w-4 h-4 text-indigo-400" />
            {totalMinutes} {isVi ? 'phút' : 'mins'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-0.5">
          <span className="text-[11px] text-slate-400 font-semibold">{isVi ? 'Lượt bài hoàn thành' : 'Completed Sessions'}</span>
          <p className="text-xl font-display font-extrabold text-white">
            {totalAttempts} {isVi ? 'bài' : 'sessions'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-0.5">
          <span className="text-[11px] text-slate-400 font-semibold">{isVi ? 'Điểm nói trung bình' : 'Average Score'}</span>
          <p className="text-xl font-display font-extrabold text-amber-400 flex items-center gap-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            {averageScore} / 100
          </p>
        </div>
      </div>
    </div>
  );
}
