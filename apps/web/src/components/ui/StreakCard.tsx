'use client';

import React, { useState, useEffect } from 'react';
import { LingLing } from './LingLing';
import { Flame, Bookmark } from 'lucide-react';
import { api } from '../../lib/api';

export interface StreakCardProps {
  currentStreak?: number;
  streakFreezes?: number;
  leavePasses?: number;
  leave_passes?: number;
  leavePassUsed?: boolean;
  autoUsedLeavePass?: boolean; // Tương thích ngược
  completedDays?: number[];     // [0, 1, 2, 3] cho T2, T3, T4, T5
  todayIndex?: number;          // 0..6
  compact?: boolean;
  className?: string;
}

const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export function StreakCard({
  currentStreak: currentStreakProp,
  streakFreezes = 1,
  leavePasses: leavePassesProp,
  leave_passes: leavePassesSnakeProp,
  leavePassUsed: leavePassUsedProp,
  autoUsedLeavePass = false,
  completedDays = [0, 1, 2, 3],
  todayIndex = 4, // T6
  compact = false,
  className = '',
}: StreakCardProps) {
  // Lấy dữ liệu thực từ Server API khi không được truyền prop trực tiếp
  const [serverStreak, setServerStreak] = useState<{
    currentStreak: number;
    leavePasses: number;
    leavePassUsed: boolean;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    api.getUserStreak()
      .then((data) => {
        if (mounted && data) {
          setServerStreak({
            currentStreak: data.currentStreak,
            leavePasses: data.leavePasses ?? data.leave_passes ?? 0,
            leavePassUsed: Boolean(data.leavePassUsed),
          });
        }
      })
      .catch(() => {
        // Fallback an toàn nếu API bận
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Giá trị quyết định hoàn toàn từ Server:
  const resolvedStreak = currentStreakProp ?? serverStreak?.currentStreak ?? 0;
  const resolvedLeavePasses = leavePassesProp ?? leavePassesSnakeProp ?? serverStreak?.leavePasses ?? 1;
  const hasUsedPass = Boolean(leavePassUsedProp ?? autoUsedLeavePass ?? serverStreak?.leavePassUsed);

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 bg-card border-2 border-ink rounded-xl px-3 py-1.5 shadow-brutal-sm ${className}`}>
        <Flame className="w-5 h-5 text-red fill-red animate-pulse" />
        <span className="font-black text-sm text-ink">{resolvedStreak} ngày</span>
        <span className="text-[11px] font-mono font-bold text-ink-muted">· 🔖 {resolvedLeavePasses} phiếu</span>
      </div>
    );
  }

  // Mascot reaction: Nếu server báo đã dùng phiếu nghỉ phép -> bò sleeping; nếu không -> theo streak
  const mascotReaction = hasUsedPass
    ? 'sleeping'
    : resolvedStreak >= 7
    ? 'party'
    : resolvedStreak >= 3
    ? 'flex'
    : resolvedStreak > 0
    ? 'proud'
    : 'stretch';

  const mascotBubble = hasUsedPass
    ? 'Đừng lo! 1 phiếu nghỉ phép đã giữ chuỗi cho bạn hôm qua zzz...'
    : undefined;

  return (
    <div className={`bg-teal text-white border-2 border-ink rounded-2xl shadow-brutal-lg p-5 sm:p-6 overflow-hidden max-w-full text-left space-y-4 ${className}`}>
      {/* THÔNG BÁO TỰ ĐỘNG DÙNG PHIẾU NGHỈ PHÉP: CHỈ HIỂN THỊ KHI SERVER TRẢ VỀ leavePassUsed: true */}
      {hasUsedPass && (
        <div className="bg-amber text-ink border-2 border-ink p-3 rounded-xl shadow-brutal-sm flex items-center justify-between gap-3 animate-message-slide">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-red fill-red flex-shrink-0" />
            <div className="text-xs font-black">
              <span className="font-serif text-sm">Đã dùng 1 phiếu nghỉ phép giữ chuỗi 🔖</span>
              <p className="font-sans font-medium text-[11px] opacity-90">
                Bạn đã quên học 1 ngày, nhưng chuỗi {resolvedStreak} ngày của bạn vẫn được máy chủ bảo toàn nguyên vẹn!
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-card border border-ink flex-shrink-0">
            Còn lại: {resolvedLeavePasses} phiếu tuần này
          </span>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-6">
        <LingLing
          reaction={mascotReaction}
          size={105}
          animate={true}
          bubbleText={mascotBubble}
        />
        <div className="flex-1 text-left w-full min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5">
            <span className="inline-flex items-center gap-1.5 bg-card text-ink font-black text-xs px-3 py-1 rounded-full border-2 border-ink shadow-brutal-sm">
              <Flame className="w-4 h-4 text-red fill-red" />
              CHUỖI {resolvedStreak} NGÀY LIÊN TIẾP
            </span>

            {/* HIỂN THỊ SỐ PHIẾU NGHỈ PHÉP (1 PHIẾU / TUẦN, RESET THỨ HAI THEO ASIA/HO_CHI_MINH) */}
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-ink bg-amber-soft px-3 py-1 rounded-full border-2 border-ink shadow-brutal-sm">
              <Bookmark className="w-3.5 h-3.5 text-red" />
              <span>Phiếu nghỉ phép: {resolvedLeavePasses}/1 phiếu</span>
              <span className="text-[10px] opacity-75 font-normal">(reset thứ Hai)</span>
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight mt-1 mb-1 font-serif">
            {resolvedStreak > 0 ? 'Chuỗi ngày học là tài sản quý báu.' : 'Chuỗi học đã dừng — Bắt đầu lại ngay hôm nay!'}
          </h3>
          <p className="text-xs md:text-sm text-white/90 leading-relaxed max-w-xl mb-4 font-sans">
            Mỗi tuần bạn có <strong>1 phiếu nghỉ phép 🔖</strong> (làm mới vào 00:00 thứ Hai). Nếu chẳng may bận rộn một ngày, hệ thống sẽ tự động dùng phiếu để bảo vệ chuỗi học tập, giúp bạn luôn an tâm giữ vững nhịp rèn luyện.
          </p>

          {/* Hàng 7 ngày trong tuần */}
          <div className="flex gap-1.5 sm:gap-2.5 overflow-x-auto pb-1 max-w-full items-center">
            {dayNames.map((name, idx) => {
              const isDone = completedDays.includes(idx);
              const isToday = idx === todayIndex;
              const isSavedByPass = hasUsedPass && idx === todayIndex - 1;

              return (
                <div
                  key={name}
                  className={`w-11 h-14 sm:w-12 sm:h-16 rounded-xl border-2 border-ink flex flex-col items-center justify-center font-extrabold text-ink transition-transform select-none ${
                    isSavedByPass
                      ? 'bg-amber border-red ring-2 ring-red shadow-brutal-sm'
                      : isDone
                      ? 'bg-amber shadow-brutal-sm'
                      : isToday
                      ? 'bg-card ring-2 ring-white ring-offset-2 ring-offset-teal shadow-brutal-sm'
                      : 'bg-paper opacity-75'
                  }`}
                  title={isSavedByPass ? 'Được bảo vệ bởi Phiếu nghỉ phép 🔖' : undefined}
                >
                  <span className="text-[10px] text-ink-soft uppercase tracking-wider mb-0.5">{name}</span>
                  <span className="text-sm font-black">
                    {isSavedByPass ? '🔖' : isDone ? '✓' : isToday ? '•' : ''}
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
