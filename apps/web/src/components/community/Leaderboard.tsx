'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Medal, Flame, Crown, BookOpen, PenTool, Headphones, FileText, Sparkles } from 'lucide-react';
import { LeaderboardEntry } from '@linguaflow/domain';
import { Badge } from '@linguaflow/ui';
import { communityApi } from '@/lib/community/api';

interface LeaderboardViewProps {
  currentUserId?: string;
  locale?: string;
  className?: string;
}

const CATEGORIES = [
  { id: 'xp', labelVi: 'Tổng XP', labelEn: 'Total XP', icon: <Trophy className="w-3.5 h-3.5" /> },
  { id: 'vocabulary', labelVi: 'Từ vựng', labelEn: 'Vocab', icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: 'reading', labelVi: 'Luyện đọc', labelEn: 'Reading', icon: <FileText className="w-3.5 h-3.5" /> },
  { id: 'writing', labelVi: 'Luyện viết', labelEn: 'Writing', icon: <PenTool className="w-3.5 h-3.5" /> },
  { id: 'listening', labelVi: 'Luyện nghe', labelEn: 'Listening', icon: <Headphones className="w-3.5 h-3.5" /> },
  { id: 'exams', labelVi: 'Thi thử', labelEn: 'Exams', icon: <Medal className="w-3.5 h-3.5" /> },
];

export default function LeaderboardView({
  currentUserId = 'demo-user-id-001',
  locale = 'vi',
  className = '',
}: LeaderboardViewProps) {
  const isVi = locale === 'vi';
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all_time'>('weekly');
  const [category, setCategory] = useState('xp');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    communityApi
      .getLeaderboard({ period, category })
      .then((res: any) => {
        if (res?.leaderboard) {
          setLeaderboard(res.leaderboard);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period, category]);

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];
  const rest = leaderboard.slice(3);
  const myEntry = leaderboard.find((e) => e.userId === currentUserId);

  return (
    <div className={`space-y-6 max-w-4xl mx-auto ${className}`}>
      {/* Header & Controls */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-amber-500/20 backdrop-blur-xl shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="font-display font-extrabold text-xl text-white">
                {isVi ? 'Bảng Xếp Hạng Vinh Danh' : 'Learning Leaderboard'}
              </h2>
              <p className="text-xs text-slate-400">
                {isVi ? 'Đua top học tập nhận danh hiệu và vinh danh cộng đồng' : 'Compete with peers and climb the ranks'}
              </p>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
            {(['weekly', 'monthly', 'all_time'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  period === p
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p === 'weekly' ? (isVi ? 'Tuần này' : 'Weekly') : p === 'monthly' ? (isVi ? 'Tháng này' : 'Monthly') : (isVi ? 'Tất cả' : 'All-time')}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                category === cat.id
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm'
                  : 'bg-slate-950/80 text-slate-400 hover:text-white border-slate-850'
              }`}
            >
              {cat.icon}
              <span>{isVi ? cat.labelVi : cat.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Visual */}
      {top1 && (
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 items-end pt-4 pb-2">
          {/* Top 2 Silver */}
          {top2 ? (
            <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-3xl bg-slate-900/80 border border-slate-700/60 shadow-lg">
              <span className="w-6 h-6 rounded-full bg-slate-400 text-slate-950 font-extrabold text-xs flex items-center justify-center font-mono shadow">
                2
              </span>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full ring-2 ring-slate-400 overflow-hidden bg-slate-800 relative">
                {top2.avatarUrl ? (
                  <Image src={top2.avatarUrl} alt={top2.displayName} fill className="object-cover" unoptimized />
                ) : (
                  <span className="font-bold text-base text-white">{top2.displayName.charAt(0)}</span>
                )}
              </div>
              <div className="space-y-0.5 max-w-full">
                <span className="font-display font-extrabold text-xs sm:text-sm text-white truncate block">
                  {top2.displayName}
                </span>
                <span className="text-xs font-mono font-bold text-slate-300 block">
                  {top2.score.toLocaleString()} {category.toUpperCase()}
                </span>
              </div>
            </div>
          ) : <div />}

          {/* Top 1 Gold Champion */}
          <div className="flex flex-col items-center text-center space-y-2 p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-900 border border-amber-400/50 shadow-2xl scale-105 z-10">
            <Crown className="w-6 h-6 text-amber-400 animate-bounce" />
            <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center font-mono shadow-md">
              1
            </span>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-4 ring-amber-400 overflow-hidden bg-slate-800 shadow-xl relative">
              {top1.avatarUrl ? (
                <Image src={top1.avatarUrl} alt={top1.displayName} fill className="object-cover" unoptimized />
              ) : (
                <span className="font-bold text-lg text-white">{top1.displayName.charAt(0)}</span>
              )}
            </div>
            <div className="space-y-0.5 max-w-full">
              <span className="font-display font-extrabold text-sm sm:text-base text-amber-300 truncate block">
                {top1.displayName}
              </span>
              <span className="text-xs sm:text-sm font-mono font-extrabold text-white block">
                {top1.score.toLocaleString()} {category.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Top 3 Bronze */}
          {top3 ? (
            <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-3xl bg-slate-900/80 border border-amber-800/40 shadow-lg">
              <span className="w-6 h-6 rounded-full bg-amber-700 text-amber-100 font-extrabold text-xs flex items-center justify-center font-mono shadow">
                3
              </span>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full ring-2 ring-amber-700 overflow-hidden bg-slate-800 relative">
                {top3.avatarUrl ? (
                  <Image src={top3.avatarUrl} alt={top3.displayName} fill className="object-cover" unoptimized />
                ) : (
                  <span className="font-bold text-base text-white">{top3.displayName.charAt(0)}</span>
                )}
              </div>
              <div className="space-y-0.5 max-w-full">
                <span className="font-display font-extrabold text-xs sm:text-sm text-white truncate block">
                  {top3.displayName}
                </span>
                <span className="text-xs font-mono font-bold text-amber-400/90 block">
                  {top3.score.toLocaleString()} {category.toUpperCase()}
                </span>
              </div>
            </div>
          ) : <div />}
        </div>
      )}

      {/* Ranks 4+ Table */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-2">
        {rest.map((entry) => {
          const isMe = entry.userId === currentUserId;

          return (
            <div
              key={entry.userId}
              className={`p-3 sm:p-4 rounded-2xl flex items-center justify-between gap-3 border transition-all ${
                isMe
                  ? 'bg-teal-500/15 border-teal-500/40 shadow-md ring-1 ring-teal-500/30'
                  : 'bg-slate-950/60 border-slate-850 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 font-mono font-bold text-xs text-slate-400 text-center">
                  #{entry.rank}
                </span>

                <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-800 shrink-0 relative">
                  {entry.avatarUrl ? (
                    <Image src={entry.avatarUrl} alt={entry.displayName} fill className="object-cover" unoptimized />
                  ) : (
                    <span className="font-bold text-xs text-white flex items-center justify-center h-full">
                      {entry.displayName.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <span className="font-display font-extrabold text-xs sm:text-sm text-white flex items-center gap-1.5">
                    {entry.displayName}
                    {isMe && <Badge variant="teal" className="text-[9px] py-0 px-1.5">Bạn</Badge>}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {entry.currentStreak} ngày streak
                  </span>
                </div>
              </div>

              <span className="font-mono font-extrabold text-xs sm:text-sm text-teal-300">
                {entry.score.toLocaleString()} {category.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Sticky My Rank Summary */}
      {myEntry && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/60 via-slate-900 to-purple-950/60 border border-teal-500/40 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <Badge variant="teal" className="text-xs font-mono font-extrabold px-3 py-1">
              Hạng #{myEntry.rank}
            </Badge>
            <div>
              <span className="text-xs font-bold text-white block">Thứ hạng hiện tại của bạn</span>
              <span className="text-[11px] text-slate-400">Tiếp tục duy trì chuỗi học tập để bứt phá top 3!</span>
            </div>
          </div>

          <span className="font-mono font-extrabold text-sm sm:text-base text-amber-400">
            {myEntry.score.toLocaleString()} {category.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}
