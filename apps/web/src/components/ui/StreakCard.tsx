'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LingLing } from './LingLing';
import { Flame, Bookmark } from 'lucide-react';
import { api } from '../../lib/api';

export interface StreakCardProps {
  currentStreak?: number;
  streakFreezes?: number;
  leavePasses?: number;
  leave_passes?: number;
  leavePassUsed?: boolean;
  autoUsedLeavePass?: boolean;
  completedDays?: number[]; // Các ngày trong tuần đã hoàn thành (0=T2 .. 6=CN)
  todayIndex?: number;      // 0=T2 .. 6=CN (nếu không truyền sẽ tự tính từ ngày thật hệ thống)
  compact?: boolean;
  className?: string;
}

const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const dayFullNames = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];

export function StreakCard({
  currentStreak: currentStreakProp,
  streakFreezes = 1,
  leavePasses: leavePassesProp,
  leave_passes: leavePassesSnakeProp,
  leavePassUsed: leavePassUsedProp,
  autoUsedLeavePass = false,
  completedDays: completedDaysProp,
  todayIndex: todayIndexProp,
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

  // Giá trị streak & phiếu nghỉ phép
  const resolvedStreak = currentStreakProp ?? serverStreak?.currentStreak ?? 0;
  const resolvedLeavePasses = leavePassesProp ?? leavePassesSnakeProp ?? serverStreak?.leavePasses ?? 1;
  const hasUsedPass = Boolean(leavePassUsedProp ?? autoUsedLeavePass ?? serverStreak?.leavePassUsed);

  // Tính toán ngày thực tế theo hệ thống
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1..6 is Mon..Sat
  const realTodayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0=T2 .. 6=CN
  const resolvedTodayIndex = todayIndexProp !== undefined ? todayIndexProp : realTodayIndex;

  // Tính ngày Thứ Hai đầu tuần hiện tại
  const monday = new Date(now);
  monday.setDate(now.getDate() - realTodayIndex);

  // Danh sách 7 ngày trong tuần với ngày tháng thật (DD/MM)
  const weekDays = [0, 1, 2, 3, 4, 5, 6].map((i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return {
      name: dayNames[i],
      dateStr: `${dd}/${mm}`,
      dayIndex: i,
    };
  });

  // Tính thứ và ngày hôm qua để hiển thị thông điệp thấu cảm
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yestDayIdx = yesterday.getDay() === 0 ? 6 : yesterday.getDay() - 1;
  const yestDayName = dayFullNames[yestDayIdx];
  const yestDateStr = `${String(yesterday.getDate()).padStart(2, '0')}/${String(yesterday.getMonth() + 1).padStart(2, '0')}`;
  const yesterdayFormatted = `${yestDayName}, ${yestDateStr}`;

  // Danh sách ngày đã hoàn thành mặc định: nếu đứt chuỗi nhưng có học các ngày trước trong tuần
  const completedDays = completedDaysProp !== undefined
    ? completedDaysProp
    : resolvedStreak > 0
    ? Array.from({ length: Math.min(resolvedStreak, resolvedTodayIndex + 1) }, (_, i) => resolvedTodayIndex - i)
    : [0, 1, 2, 3]; // Mặc định hiển thị T2-T5 đã học nếu prop chưa cấp

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 bg-[#FFFDF4] border-2 border-ink rounded-xl px-3 py-1.5 shadow-brutal-sm ${className}`}>
        <Flame className="w-4 h-4 text-red fill-red animate-pulse" />
        <span className="font-black text-sm text-ink">{resolvedStreak} ngày</span>
        <span className="text-[11px] font-mono font-bold text-ink-muted">· {resolvedLeavePasses} phiếu</span>
      </div>
    );
  }

  // Mascot: ĐỘNG VIÊN (khuyến khích người học thắp lại chuỗi hoặc duy trì phong độ)
  // Registry: /mascot/cow_gen_thumbsup.png (pose: 'thumbsup')
  const mascotPose = 'thumbsup';

  return (
    <div
      className={`bg-[#FFFDF4] text-ink border-2 border-ink rounded-[18px] shadow-[5px_5px_0px_0px_#211A13] p-5 sm:p-6 overflow-hidden max-w-full text-left space-y-5 ${className}`}
    >
      {/* 1. HÀNG TRÊN: Nhãn 'CHUỖI HỌC TẬP' đỏ son & Phiếu nghỉ phép */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-ink/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red border border-ink" />
          <span className="text-xs font-mono font-black uppercase tracking-wider text-red">
            CHUỖI HỌC TẬP
          </span>
        </div>

        <span className="text-xs font-mono font-bold text-ink-muted">
          Còn {resolvedLeavePasses} phiếu nghỉ phép · reset thứ Hai
        </span>
      </div>

      {/* Thông báo tự động bảo vệ chuỗi nếu có dùng phiếu */}
      {hasUsedPass && (
        <div className="bg-[#F1E9D6] border-2 border-ink/40 p-2.5 sm:p-3 rounded-xl flex items-center justify-between gap-3 text-ink text-xs">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-red fill-red flex-shrink-0" />
            <span className="font-medium text-ink-soft">
              Hệ thống đã tự động dùng <strong className="text-ink">1 phiếu nghỉ phép 🔖</strong> giữ chuỗi cho bạn hôm qua.
            </span>
          </div>
          <span className="font-mono text-[11px] font-bold text-ink-muted flex-shrink-0">
            Còn lại {resolvedLeavePasses} phiếu
          </span>
        </div>
      )}

      {/* 2. GIỮA CARD: Mascot LingLing (Trái) -> Tiêu đề & Dòng phụ (Giữa) -> Nút CTA (Phải) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
        {/* Mascot LingLing động viên */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <LingLing reaction={mascotPose} size={85} animate={true} />
        </div>

        {/* Tiêu đề & Lời nhắn */}
        <div className="flex-1 text-center md:text-left min-w-0">
          <h3 className="text-xl sm:text-2xl font-black text-ink tracking-tight font-serif">
            {resolvedStreak > 0
              ? `Chuỗi ${resolvedStreak} ngày liên tiếp`
              : 'Chuỗi đang chờ bạn nối lại'}
          </h3>
          <p className="text-xs sm:text-sm text-ink-soft leading-relaxed mt-1 font-sans">
            {resolvedStreak > 0
              ? 'Học hôm nay để giữ chuỗi.'
              : `Hôm qua (${yesterdayFormatted}) bạn lỡ một ngày nên chuỗi về 0. Học 1 bài hôm nay là chuỗi chạy tiếp.`}
          </p>
        </div>

        {/* Nút CTA đỏ son */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <Link href="/srs">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 bg-red hover:bg-red-dark active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-white font-black text-sm px-6 py-3 rounded-xl border-2 border-ink shadow-brutal-sm transition-all whitespace-nowrap cursor-pointer"
            >
              Học ngay 1 bài →
            </button>
          </Link>
          <span className="text-[11px] font-mono font-medium text-ink-muted mt-1.5">
            Mất khoảng 5 phút
          </span>
        </div>
      </div>

      {/* 3. DÃY TUẦN (7 ô T2 - CN của tuần hiện tại với ngày tháng thật) */}
      <div className="space-y-2.5 pt-1">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 w-full">
          {weekDays.map((d) => {
            const idx = d.dayIndex;
            const isToday = idx === resolvedTodayIndex;
            const isPast = idx < resolvedTodayIndex;
            const isFuture = idx > resolvedTodayIndex;
            const isDone = completedDays.includes(idx);
            const isSavedByPass = hasUsedPass && idx === resolvedTodayIndex - 1;

            if (isToday) {
              return (
                <div
                  key={d.name}
                  className="rounded-xl border-2 border-ink bg-red text-white shadow-brutal-sm p-1.5 sm:p-2 flex flex-col items-center justify-center select-none text-center min-w-0"
                >
                  <span className="text-[10px] font-bold uppercase text-white/90">{d.name}</span>
                  <span className="text-xs sm:text-sm font-black tracking-tight">{d.dateStr}</span>
                  <span className="text-[9px] font-black uppercase tracking-wider mt-0.5 bg-white text-red px-1 rounded">
                    Hôm nay
                  </span>
                </div>
              );
            }

            if (isPast) {
              if (isDone || isSavedByPass) {
                return (
                  <div
                    key={d.name}
                    className="rounded-xl border-2 border-ink bg-[#F1E9D6] text-ink shadow-brutal-sm p-1.5 sm:p-2 flex flex-col items-center justify-center select-none text-center min-w-0"
                  >
                    <span className="text-[10px] font-bold uppercase text-ink-muted">{d.name}</span>
                    <span className="text-xs sm:text-sm font-bold text-ink-soft">{d.dateStr}</span>
                    <span className="text-sm sm:text-base font-black text-ink mt-0.5">
                      {isSavedByPass ? '🔖' : '✓'}
                    </span>
                  </div>
                );
              }

              // Lỡ nhịp
              return (
                <div
                  key={d.name}
                  className="rounded-xl border-2 border-ink/40 bg-white text-red p-1.5 sm:p-2 flex flex-col items-center justify-center select-none text-center min-w-0"
                >
                  <span className="text-[10px] font-bold uppercase text-ink-muted">{d.name}</span>
                  <span className="text-xs sm:text-sm font-bold text-ink-soft">{d.dateStr}</span>
                  <span className="text-sm sm:text-base font-black text-red mt-0.5">✕</span>
                </div>
              );
            }

            // Tương lai (isFuture)
            return (
              <div
                key={d.name}
                className="rounded-xl border border-dashed border-ink/30 bg-transparent opacity-40 text-ink-muted p-1.5 sm:p-2 flex flex-col items-center justify-center select-none text-center min-w-0"
              >
                <span className="text-[10px] font-medium uppercase">{d.name}</span>
                <span className="text-xs sm:text-sm font-medium">{d.dateStr}</span>
                <span className="text-sm sm:text-base font-medium mt-0.5">—</span>
              </div>
            );
          })}
        </div>

        {/* Chú thích 4 trạng thái */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[11px] font-mono font-bold text-ink-muted pt-2 border-t border-ink/10">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#F1E9D6] border border-ink flex items-center justify-center text-[10px] text-ink font-black">
              ✓
            </span>
            Đã học
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-white border border-ink/40 flex items-center justify-center text-[10px] text-red font-black">
              ✕
            </span>
            Lỡ nhịp
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-red border border-ink flex items-center justify-center text-[8px] text-white font-black">
              ●
            </span>
            Hôm nay
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded border border-dashed border-ink/30 flex items-center justify-center text-[10px] text-ink-muted">
              —
            </span>
            Chưa tới
          </span>
        </div>
      </div>
    </div>
  );
}
