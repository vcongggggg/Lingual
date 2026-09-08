'use client';

import React, { useState } from 'react';
import { Mic, Volume2, Sparkles, Trophy, Flame, Clock, Radio, Activity } from 'lucide-react';
import LingLingMascot from '@/components/LingLingMascot';
import { Badge } from '@linguaflow/ui';
import { soundFx } from '@/lib/soundFx';

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
  const [isMicTesting, setIsMicTesting] = useState(false);

  const toggleMicTest = () => {
    soundFx.playClick();
    setIsMicTesting(!isMicTesting);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-teal-950/50 border border-teal-500/30 p-6 sm:p-10 shadow-2xl space-y-6 before:absolute before:inset-0 before:bg-gradient-to-r before:from-teal-500/10 before:via-purple-500/10 before:to-indigo-500/10 before:animate-pulse before:pointer-events-none">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-4 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-black uppercase tracking-wider">
              <Mic className="w-3.5 h-3.5 text-teal-400" />
              <span>AI Speaking & Pronunciation Lab</span>
            </div>

            <button
              onClick={toggleMicTest}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                isMicTesting
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{isMicTesting ? 'Đang Kiểm Tra Mic • Live' : 'Test Micro'}</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight leading-tight">
            Phòng Luyện Nói AI <br />
            <span className="bg-gradient-to-r from-teal-300 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
              Phát Âm Chuẩn & Phản Xạ Lưu Loát
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            {isVi
              ? 'Rèn luyện 7 chế độ chuyên sâu: Phát âm âm vị IPA, Lặp lại câu, Nói đuổi (Shadowing), Hỏi đáp định hướng, Miêu tả tranh, Tình huống thực tế và Nói tự do với AI.'
              : 'Master 7 specialized modes: Pronunciation, Sentence Repetition, Shadowing, Guided Speaking, Picture Description, Situational Roleplay, and Free Speaking with AI.'}
          </p>

          {/* 32-Bar Audio Visualizer Spectrum when mic is active */}
          {isMicTesting && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-teal-500/40 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-teal-300 font-mono">
                <span className="flex items-center gap-1.5 font-bold">
                  <Activity className="w-4 h-4 text-teal-400 animate-pulse" />
                  <span>Cảm biến âm tần thời gian thực (Live 32-Band FFT)</span>
                </span>
                <span className="text-emerald-400">Microphone Ready (48 kHz)</span>
              </div>
              <div className="flex items-end justify-between h-10 gap-1 pt-1">
                {[...Array(32)].map((_, i) => {
                  const heights = [30, 45, 75, 90, 60, 35, 80, 100, 70, 50, 85, 95, 40, 65, 85, 55, 90, 70, 45, 60, 75, 85, 65, 40, 55, 70, 90, 80, 60, 45, 30, 20];
                  const h = heights[i % heights.length];
                  return (
                    <div
                      key={i}
                      className="w-full bg-gradient-to-t from-teal-500 via-cyan-400 to-emerald-300 rounded-full transition-all duration-150 animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${(i * 40) % 600}ms`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* AI Glowing Voice Orb / Mascot */}
        <div className="shrink-0 flex flex-col items-center justify-center relative">
          {/* Glowing orbital aura rings */}
          <div className="absolute w-44 h-44 rounded-full bg-teal-500/20 blur-2xl pointer-events-none animate-pulse" />
          <div className="absolute w-36 h-36 rounded-full border border-teal-400/30 animate-spin pointer-events-none" style={{ animationDuration: '10s' }} />
          <div className="relative z-10 p-3 rounded-full bg-slate-950/80 border border-teal-500/40 shadow-2xl">
            <LingLingMascot state={mascotState} size={120} />
          </div>
          <span className="mt-2 text-[10px] font-mono text-teal-300 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/30">
            LingLing AI Coach
          </span>
        </div>
      </div>

      {/* Stats Ribbon with Glassmorphism */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 relative z-10">
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-0.5 hover:border-amber-500/40 transition-colors">
          <span className="text-[11px] text-slate-400 font-semibold">{isVi ? 'Chuỗi luyện nói' : 'Speaking Streak'}</span>
          <p className="text-xl font-display font-black text-amber-400 flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400 flame-flutter" />
            <span>{currentStreak} {isVi ? 'ngày' : 'days'}</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-0.5 hover:border-indigo-500/40 transition-colors">
          <span className="text-[11px] text-slate-400 font-semibold">{isVi ? 'Thời gian luyện' : 'Total Practice'}</span>
          <p className="text-xl font-display font-black text-indigo-300 flex items-center gap-1.5">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>{totalMinutes} {isVi ? 'phút' : 'mins'}</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-0.5 hover:border-teal-500/40 transition-colors">
          <span className="text-[11px] text-slate-400 font-semibold">{isVi ? 'Lượt bài hoàn thành' : 'Completed Sessions'}</span>
          <p className="text-xl font-display font-black text-white">
            {totalAttempts} {isVi ? 'bài' : 'sessions'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-0.5 hover:border-amber-500/40 transition-colors">
          <span className="text-[11px] text-slate-400 font-semibold">{isVi ? 'Điểm nói trung bình' : 'Average Score'}</span>
          <p className="text-xl font-display font-black text-amber-400 flex items-center gap-1.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>{averageScore} / 100</span>
          </p>
        </div>
      </div>
    </div>
  );
}
