'use client';

import React from 'react';
import { Users, Sparkles, Trophy, Flame, Plus } from 'lucide-react';
import LingLingMascot from '@/components/LingLingMascot';
import { Badge, Button } from '@linguaflow/ui';

interface CommunityHeroProps {
  stats: {
    friendsCount: number;
    followingCount: number;
    weeklySocialXP: number;
    currentStreak: number;
  };
  onCreateNote?: () => void;
  locale?: string;
}

export default function CommunityHero({
  stats,
  onCreateNote,
  locale = 'vi',
}: CommunityHeroProps) {
  const isVi = locale === 'vi';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 border border-purple-500/20 p-6 sm:p-10 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Community & Social Learning Lab • Học Tập Cùng Nhau</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
            Cộng Đồng Học Tập <br />
            <span className="bg-gradient-to-r from-purple-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Cùng Học Hỏi • Cùng Tiến Bộ
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {isVi
              ? 'Kết nối bạn học, chia sẻ ghi chú hữu ích, thảo luận theo nhóm và cùng đua top bảng xếp hạng vinh danh hàng tuần.'
              : 'Connect with fellow learners, share valuable study notes, join study groups, and climb the weekly leaderboard together.'}
          </p>

          {onCreateNote && (
            <div className="pt-2">
              <Button
                variant="primary"
                onClick={onCreateNote}
                icon={<Plus className="w-4 h-4" />}
                className="bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-400 hover:to-teal-400 text-white font-extrabold shadow-lg"
              >
                {isVi ? 'Chia sẻ ghi chú mới' : 'Share a Study Note'}
              </Button>
            </div>
          )}
        </div>

        <div className="shrink-0 flex items-center justify-center">
          <LingLingMascot state="celebrating" size={120} />
        </div>
      </div>

      {/* Quick Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-0.5">
          <span className="text-[11px] text-slate-400 font-semibold">{isVi ? 'Bạn bè kết nối' : 'Friends'}</span>
          <p className="text-xl font-display font-extrabold text-white">
            {stats.friendsCount} {isVi ? 'người' : 'friends'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-0.5">
          <span className="text-[11px] text-slate-400 font-semibold">{isVi ? 'Đang theo dõi' : 'Following'}</span>
          <p className="text-xl font-display font-extrabold text-purple-300">
            {stats.followingCount} {isVi ? 'người' : 'users'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-0.5">
          <span className="text-[11px] text-slate-400 font-semibold">{isVi ? 'XP Xã hội tuần này' : 'Social XP'}</span>
          <p className="text-xl font-display font-extrabold text-amber-400">
            +{stats.weeklySocialXP} XP
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-0.5">
          <span className="text-[11px] text-slate-400 font-semibold">{isVi ? 'Chuỗi học tập' : 'Streak'}</span>
          <p className="text-xl font-display font-extrabold text-teal-400 flex items-center gap-1">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            {stats.currentStreak} {isVi ? 'ngày' : 'days'}
          </p>
        </div>
      </div>
    </div>
  );
}
