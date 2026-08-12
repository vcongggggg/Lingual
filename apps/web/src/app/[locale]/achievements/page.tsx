'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button, Card, XPBadge } from '@linguaflow/ui';
import { userApi } from '../../../lib/api';
import { Trophy, Award, Sparkles, ArrowLeft, ShieldCheck, Crown, Lock } from 'lucide-react';

const ACHIEVEMENTS = [
  { code: 'FIRST_LESSON', label: 'Bài Học Đầu Tiên', desc: 'Hoàn thành bài học đầu tiên', icon: '✨', xpBonus: 50 },
  { code: 'STREAK_3_DAYS', label: 'Siêng Năng 3 Ngày', desc: 'Duy trì streak 3 ngày liên tiếp', icon: '🔥', xpBonus: 100 },
  { code: 'SRS_MASTER_10', label: 'Bậc Thầy SRS', desc: 'Thành thạo 10 từ vựng SRS', icon: '🧠', xpBonus: 150 },
  { code: 'GAME_CHAMPION', label: 'Nhà Vô Địch Game', desc: 'Đạt 100+ điểm trong 1 game', icon: '🏆', xpBonus: 200 },
  { code: 'VOCAB_100', label: 'Kho Từ Vựng 100', desc: 'Học được 100 từ vựng', icon: '📚', xpBonus: 300 },
  { code: 'DICT_EXPLORER', label: 'Nhà Thám Hiểm Từ Điển', desc: 'Tra cứu 50 từ trong từ điển', icon: '🔍', xpBonus: 150 },
  { code: 'STREAK_7_DAYS', label: 'Bền Bỉ 7 Ngày', desc: 'Duy trì streak 7 ngày liên tiếp', icon: '⚡', xpBonus: 250 },
];

export default function AchievementsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  const [leaderboard, setLeaderboard] = useState<any[]>([
    { rank: 1, name: 'Nguyễn Văn A', totalXP: 1450, streak: 14, avatar: '🥇' },
    { rank: 2, name: 'Trần Thị B', totalXP: 1120, streak: 9, avatar: '🥈' },
    { rank: 3, name: 'Học Viên LinguaFlow (Bạn)', totalXP: 150, streak: 3, avatar: '🥉' },
    { rank: 4, name: 'Lê Hoàng C', totalXP: 90, streak: 2, avatar: '👤' },
  ]);

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-10">
      <div className="flex items-center justify-between">
        <Link href={`/${locale}/dashboard`}>
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Về Lộ Trình
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" />
          <h1 className="text-2xl font-display font-bold text-white">Bảng Xếp Hạng & Danh Hiệu</h1>
        </div>
      </div>

      <Card glow="amber" className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-display font-bold text-white">Bảng Xếp Hạng Tuần (Gold League)</h2>
          </div>
          <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
            Làm mới sau 3 ngày
          </span>
        </div>

        <div className="space-y-3">
          {leaderboard.map((user) => (
            <div
              key={user.rank}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                user.rank === 3
                  ? 'bg-gradient-to-r from-amber-500/20 to-coral-500/20 border-amber-500/40 text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="font-display font-extrabold text-lg w-6 text-center text-slate-400">
                  #{user.rank}
                </span>
                <span className="text-2xl">{user.avatar}</span>
                <div>
                  <span className="font-bold text-sm text-white block">{user.name}</span>
                  <span className="text-xs text-slate-400">{user.streak} ngày streak</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <XPBadge xp={user.totalXP} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-teal-400" />
          <h2 className="text-xl font-display font-bold text-white">Kho Huy Hiệu Thành Tựu</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ACHIEVEMENTS.map((ach) => (
            <Card key={ach.code} glow="teal" className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-coral-500 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20">
                {ach.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">{ach.label}</h4>
                <p className="text-xs text-slate-400">{ach.desc}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-amber-400 font-bold">+{ach.xpBonus} XP</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" /> Đã Mở Khóa
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
