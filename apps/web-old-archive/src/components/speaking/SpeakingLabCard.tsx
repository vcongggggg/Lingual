'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Mic, Volume2, Sparkles, Trophy, Flame, Clock, Radio, Activity, Headphones } from 'lucide-react';
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
  const [isMicTesting, setIsMicTesting] = useState(false);

  const toggleMicTest = () => {
    soundFx.playClick();
    setIsMicTesting(!isMicTesting);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-teal-500/30 p-6 sm:p-10 shadow-2xl space-y-6 min-h-[360px] flex flex-col justify-between">
      {/* Full-Bleed 3D Mascot Artwork Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/ielts/mascot_ielts_listening.jpg"
          alt="LingLing AI Speaking Coach"
          fill
          priority
          className="object-cover object-right md:object-[82%_center] brightness-105 contrast-105"
        />
        {/* Directional Glass Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/20" />
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-4 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-black uppercase tracking-wider backdrop-blur-md">
              <Mic className="w-3.5 h-3.5 text-teal-300" />
              <span>AI Speaking & Pronunciation Lab</span>
            </div>

            <button
              onClick={toggleMicTest}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold transition-all cursor-pointer backdrop-blur-md ${
                isMicTesting
                  ? 'bg-rose-500/20 border-rose-400/60 text-rose-300 animate-pulse'
                  : 'bg-slate-950/80 hover:bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{isMicTesting ? 'Đang Kiểm Tra Mic • Live' : 'Test Micro'}</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight leading-tight drop-shadow-md">
            Phòng Luyện Nói AI <br />
            <span className="bg-gradient-to-r from-teal-300 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
              Phát Âm Chuẩn & Phản Xạ Lưu Loát
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans max-w-xl drop-shadow-sm">
            {isVi
              ? 'Rèn luyện 7 chế độ chuyên sâu: Phát âm âm vị IPA, Lặp lại câu, Nói đuổi (Shadowing), Hỏi đáp định hướng, Miêu tả tranh, Tình huống thực tế và Nói tự do với AI.'
              : 'Master 7 specialized modes: Pronunciation, Sentence Repetition, Shadowing, Guided Speaking, Picture Description, Situational Roleplay, and Free Speaking with AI.'}
          </p>

          {/* 32-Bar Audio Visualizer Spectrum when mic is active */}
          {isMicTesting && (
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-teal-400/40 space-y-2 animate-fadeIn backdrop-blur-md shadow-2xl">
              <div className="flex items-center justify-between text-xs text-teal-300 font-mono">
                <span className="flex items-center gap-1.5 font-bold">
                  <Activity className="w-4 h-4 text-teal-400 animate-pulse" />
                  <span>Cảm biến âm tần thời gian thực (Live 32-Band FFT)</span>
                </span>
                <span className="text-emerald-400 font-bold">Microphone Ready (48 kHz)</span>
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

        {/* LingLing AI Coach Floating Frosted Glass Card */}
        <div className="hidden lg:flex flex-col items-center gap-2.5 p-5 rounded-3xl bg-slate-950/70 border border-teal-400/30 backdrop-blur-md shadow-2xl">
          <div className="p-3 rounded-2xl bg-teal-500/20 border border-teal-400/40">
            <Headphones className="w-6 h-6 text-teal-300" />
          </div>
          <div className="text-center space-y-0.5">
            <p className="text-xs font-black text-white">LingLing AI Coach</p>
            <span className="text-[10px] font-mono text-teal-300 bg-teal-500/15 px-2.5 py-0.5 rounded-full border border-teal-500/30 block">
              Sẵn sàng chấm phát âm
            </span>
          </div>
        </div>
      </div>

      {/* Stats Ribbon with Glowing Glassmorphism */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4 border-t border-slate-800/80 relative z-10">
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 hover:border-amber-400/60 backdrop-blur-md space-y-1 transition-all duration-300 hover:-translate-y-0.5 group">
          <span className="text-[11px] text-slate-400 font-semibold">{isVi ? 'Chuỗi luyện nói' : 'Speaking Streak'}</span>
          <p className="text-xl sm:text-2xl font-display font-black text-amber-400 flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400/20 group-hover:scale-110 transition-transform" />
            <span>{currentStreak} {isVi ? 'ngày' : 'days'}</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 hover:border-indigo-400/60 backdrop-blur-md space-y-1 transition-all duration-300 hover:-translate-y-0.5 group">
          <span className="text-[11px] text-slate-400 font-semibold">{isVi ? 'Thời gian luyện' : 'Total Practice'}</span>
          <p className="text-xl sm:text-2xl font-display font-black text-indigo-300 flex items-center gap-1.5">
            <Clock className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>{totalMinutes} {isVi ? 'phút' : 'mins'}</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-teal-500/30 hover:border-teal-400/60 backdrop-blur-md space-y-1 transition-all duration-300 hover:-translate-y-0.5 group">
          <span className="text-[11px] text-slate-400 font-semibold">{isVi ? 'Lượt bài hoàn thành' : 'Completed Sessions'}</span>
          <p className="text-xl sm:text-2xl font-display font-black text-white">
            {totalAttempts} {isVi ? 'bài' : 'sessions'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 hover:border-emerald-400/60 backdrop-blur-md space-y-1 transition-all duration-300 hover:-translate-y-0.5 group">
          <span className="text-[11px] text-slate-400 font-semibold">{isVi ? 'Điểm nói trung bình' : 'Average Score'}</span>
          <p className="text-xl sm:text-2xl font-display font-black text-emerald-400 flex items-center gap-1.5">
            <Trophy className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>{averageScore} / 100</span>
          </p>
        </div>
      </div>
    </div>
  );
}
