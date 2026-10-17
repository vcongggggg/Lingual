'use client';

import React from 'react';
import { LingLing } from './LingLing';
import { Flame, ShieldCheck } from 'lucide-react';

export interface StreakCardProps {
  currentStreak?: number;
  streakFreezes?: number;
  completedDays?: number[]; // [0, 1, 2, 3] cho T2, T3, T4, T5
  todayIndex?: number;      // 0..6
  compact?: boolean;
  className?: string;
}

const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export function StreakCard({
  currentStreak = 4,
  streakFreezes = 1,
  completedDays = [0, 1, 2, 3],
  todayIndex = 4, // T6
  compact = false,
  className = '',
}: StreakCardProps) {
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 bg-card border-2 border-ink rounded-xl px-3 py-1.5 shadow-brutal-sm ${className}`}>
        <Flame className="w-5 h-5 text-red fill-red animate-pulse" />
        <span className="font-black text-sm text-ink">{currentStreak} ngày</span>
      </div>
    );
  }

  return (
    <div className={`bg-teal text-white border-2 border-ink rounded-2xl shadow-brutal-lg p-6 ${className}`}>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <LingLing reaction="salute" size={110} animate={true} />
        <div className="flex-1 text-left">
          <div className="flex items-center gap-3 mb-1">
            <span className="inline-flex items-center gap-1.5 bg-card text-ink font-black text-xs px-3 py-1 rounded-full border-2 border-ink shadow-brutal-sm">
              <Flame className="w-4 h-4 text-red fill-red" />
              CHUỖI {currentStreak} NGÀY LIÊN TIẾP
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-paper opacity-90">
              <ShieldCheck className="w-3.5 h-3.5 text-amber" />
              {streakFreezes} bảo vệ streak
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight mt-1 mb-1">
            Chuỗi ngày học là tài sản.
          </h3>
          <p className="text-xs md:text-sm text-white/90 leading-relaxed max-w-lg mb-4">
            Mỗi ngày học xong, bạn thắp thêm một ô. Bỏ một ngày, chuỗi vẫn được bảo vệ bằng đóng băng streak.
          </p>

          {/* Hàng 7 ngày */}
          <div className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-1">
            {dayNames.map((name, idx) => {
              const isDone = completedDays.includes(idx);
              const isToday = idx === todayIndex;

              return (
                <div
                  key={name}
                  className={`w-11 h-14 sm:w-12 sm:h-16 rounded-xl border-2 border-ink flex flex-col items-center justify-center font-extrabold text-ink transition-transform select-none ${
                    isDone
                      ? 'bg-amber shadow-brutal-sm'
                      : isToday
                      ? 'bg-card ring-2 ring-white ring-offset-2 ring-offset-teal shadow-brutal-sm'
                      : 'bg-paper opacity-75'
                  }`}
                >
                  <span className="text-[10px] text-ink-soft uppercase tracking-wider mb-0.5">{name}</span>
                  <span className="text-sm font-black">
                    {isDone ? '✓' : isToday ? '•' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
