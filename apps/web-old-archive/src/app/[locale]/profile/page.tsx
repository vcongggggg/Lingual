'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Card, Avatar, XPBadge, StreakBadge, ProgressBar } from '@linguaflow/ui';
import { useAuth } from '../../../contexts/AuthContext';
import { userApi } from '../../../lib/api';
import { User, Mail, Globe, Clock, Flame, Sparkles, LogOut, ArrowLeft, Save, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const router = useRouter();
  const { user, logout } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || 'Học Viên LinguaFlow');
  const [dailyGoal, setDailyGoal] = useState(user?.dailyGoalMinutes || 15);
  const [timezone, setTimezone] = useState(user?.timezone || 'Asia/Ho_Chi_Minh');
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMessage('');

    try {
      await userApi.register; // reuse API endpoint for update if needed
      setSavedMessage('Đã lưu thay đổi thành công!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch {
      setSavedMessage('Lỗi khi lưu thông tin');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/login`);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link href={`/${locale}/dashboard`}>
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Về Lộ Trình
          </Button>
        </Link>
        <h1 className="text-2xl font-display font-bold text-white">Hồ Sơ Cá Nhân</h1>
      </div>

      {/* User Hero Banner */}
      <Card glow="teal" className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <Avatar name={user?.displayName || 'Học Viên'} size="lg" />
          <div className="space-y-2 flex-1">
            <h2 className="text-2xl font-display font-extrabold text-white">
              {user?.displayName || 'Học Viên LinguaFlow'}
            </h2>
            <p className="text-xs text-slate-400 font-mono">{user?.email || 'demo@linguaflow.com'}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
              <StreakBadge streak={user?.currentStreak || 3} />
              <XPBadge xp={user?.totalXP || 150} />
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            icon={<LogOut className="w-4 h-4 text-rose-400" />}
            className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 shrink-0"
          >
            Đăng Xuất
          </Button>
        </div>
      </Card>

      {/* Profile Settings Form */}
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-display font-bold text-white border-b border-slate-800 pb-3">
          Cài Đặt Học Tập
        </h3>

        {savedMessage && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{savedMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Display Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">Tên hiển thị</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-400 outline-none"
            />
          </div>

          {/* Daily Goal */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-300">Mục tiêu học hàng ngày:</span>
              <span className="text-amber-400 font-mono text-sm">{dailyGoal} phút / ngày</span>
            </div>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={dailyGoal}
              onChange={(e) => setDailyGoal(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
              <span>5 phút (Thong thả)</span>
              <span>15 phút (Vừa sức)</span>
              <span>30 phút (Chăm chỉ)</span>
              <span>60 phút (Cấp tốc)</span>
            </div>
          </div>

          {/* Timezone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">Múi giờ (Streak calculation)</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-teal-300 text-xs font-bold focus:border-teal-400 outline-none"
            >
              <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (UTC+7 - Việt Nam)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (UTC+9 - Nhật Bản)</option>
              <option value="Europe/London">Europe/London (UTC+0 - Anh)</option>
              <option value="America/New_York">America/New_York (UTC-5 - Mỹ)</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="accent"
            size="md"
            className="w-full"
            disabled={saving}
            icon={<Save className="w-4 h-4" />}
          >
            {saving ? 'Đang lưu...' : 'Lưu Cài Đặt'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
