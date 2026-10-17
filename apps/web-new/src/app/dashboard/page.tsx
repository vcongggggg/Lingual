'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StreakCard } from '../../components/ui/StreakCard';
import { LingLing } from '../../components/ui/LingLing';
import { api, getAuthToken } from '../../lib/api';
import { BookOpen, Layers, Zap, GraduationCap, Headphones, Mic, BookMarked, PenTool, Flame, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [srsStats, setSrsStats] = useState<any>({ dueToday: 5, learning: 12, mastered: 24, totalWords: 150 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      // Cho phép xem demo dashboard nếu chưa đăng nhập, hoặc redirect sang login
      setUser({ displayName: 'Học viên', currentStreak: 3, totalXP: 120 });
      setLoading(false);
      return;
    }

    Promise.all([
      api.getMe().then((res) => setUser(res.user)).catch(() => null),
      api.getSrsQueue().then((res) => setSrsStats(res.stats)).catch(() => null),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 text-left space-y-10">
      {/* 1. Header Lời chào */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-ink/20">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-red block mb-1">
            TỔNG QUAN HỌC TẬP
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
            Xin chào, {user?.displayName || 'Bạn'}!
          </h1>
          <p className="text-sm text-ink-soft mt-1">
            Hôm nay là một ngày tuyệt vời để ghi nhớ thêm những điều mới.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/srs">
            <Button variant="red" size="md">
              Ôn Thẻ ghi nhớ ({srsStats.dueToday} từ) →
            </Button>
          </Link>
          <Link href="/games">
            <Button variant="white" size="md">
              Chơi game
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Streak Card Banner */}
      <StreakCard
        currentStreak={user?.currentStreak || 3}
        streakFreezes={user?.streakFreezes || 1}
        completedDays={[0, 1, 2, 3]}
        todayIndex={4}
      />

      {/* 3. 4 Khối Thống Kê Sổ Tay */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal-md">
          <span className="text-xs font-bold text-ink-soft block mb-1">Cần ôn hôm nay</span>
          <div className="text-3xl font-black text-red tracking-tight">{srsStats.dueToday} từ</div>
          <span className="text-[11px] font-bold text-ink-soft mt-1 block">Theo lịch ôn thông minh</span>
        </div>

        <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal-md">
          <span className="text-xs font-bold text-ink-soft block mb-1">Đang học</span>
          <div className="text-3xl font-black text-ink tracking-tight">{srsStats.learning} từ</div>
          <span className="text-[11px] font-bold text-ink-soft mt-1 block">Lặp lại sau 1–3 ngày</span>
        </div>

        <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal-md">
          <span className="text-xs font-bold text-ink-soft block mb-1">Thuộc lòng</span>
          <div className="text-3xl font-black text-ink tracking-tight">{srsStats.mastered} từ</div>
          <span className="text-[11px] font-bold text-ink-soft mt-1 block">Trả lời đúng 3+ lần liên tiếp</span>
        </div>

        <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal-md">
          <span className="text-xs font-bold text-ink-soft block mb-1">Điểm kinh nghiệm</span>
          <div className="text-3xl font-black text-ink tracking-tight">{user?.totalXP || 120} XP</div>
          <span className="text-[11px] font-bold text-ink-soft mt-1 block">Tích lũy qua bài học & game</span>
        </div>
      </div>

      {/* 4. Danh Mục 5 Labs Cốt Lõi */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-black text-ink tracking-tight">5 Kỹ Năng</h2>
          <span className="text-xs font-extrabold text-ink-soft">Chọn kỹ năng bạn muốn rèn luyện</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link href="/vocabulary" className="group">
            <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal hover:-translate-y-1 transition-all h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-paper-2 border-2 border-ink rounded-xl flex items-center justify-center text-ink mb-3 group-hover:scale-105 transition-transform">
                  <BookMarked className="w-5 h-5" />
                </div>
                <h4 className="font-black text-base text-ink mb-1">Từ Vựng</h4>
                <p className="text-xs text-ink-soft leading-relaxed">150+ từ cốt lõi chuẩn CEFR A1 - B2</p>
              </div>
              <span className="text-xs font-black text-red mt-4 inline-flex items-center gap-1">Vào Lab →</span>
            </div>
          </Link>

          <Link href="/listening" className="group">
            <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal hover:-translate-y-1 transition-all h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-paper-2 border-2 border-ink rounded-xl flex items-center justify-center text-ink mb-3 group-hover:scale-105 transition-transform">
                  <Headphones className="w-5 h-5" />
                </div>
                <h4 className="font-black text-base text-ink mb-1">Luyện Nghe</h4>
                <p className="text-xs text-ink-soft leading-relaxed">Chép chính tả & Shadowing theo audio</p>
              </div>
              <span className="text-xs font-black text-red mt-4 inline-flex items-center gap-1">Vào Lab →</span>
            </div>
          </Link>

          <Link href="/speaking" className="group">
            <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal hover:-translate-y-1 transition-all h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-paper-2 border-2 border-ink rounded-xl flex items-center justify-center text-ink mb-3 group-hover:scale-105 transition-transform">
                  <Mic className="w-5 h-5" />
                </div>
                <h4 className="font-black text-base text-ink mb-1">Luyện Nói</h4>
                <p className="text-xs text-ink-soft leading-relaxed">Kiểm tra phát âm & phản xạ đàm thoại</p>
              </div>
              <span className="text-xs font-black text-red mt-4 inline-flex items-center gap-1">Vào Lab →</span>
            </div>
          </Link>

          <Link href="/reading" className="group">
            <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal hover:-translate-y-1 transition-all h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-paper-2 border-2 border-ink rounded-xl flex items-center justify-center text-ink mb-3 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-black text-base text-ink mb-1">Đọc Hiểu</h4>
                <p className="text-xs text-ink-soft leading-relaxed">Đọc bài báo & tra nghĩa tương tác</p>
              </div>
              <span className="text-xs font-black text-red mt-4 inline-flex items-center gap-1">Vào Lab →</span>
            </div>
          </Link>

          <Link href="/writing" className="group">
            <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal hover:-translate-y-1 transition-all h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-paper-2 border-2 border-ink rounded-xl flex items-center justify-center text-ink mb-3 group-hover:scale-105 transition-transform">
                  <PenTool className="w-5 h-5" />
                </div>
                <h4 className="font-black text-base text-ink mb-1">Luyện Viết</h4>
                <p className="text-xs text-ink-soft leading-relaxed">Cấu trúc câu, đoạn văn & bài luận</p>
              </div>
              <span className="text-xs font-black text-red mt-4 inline-flex items-center gap-1">Vào Lab →</span>
            </div>
          </Link>
        </div>
      </div>

      {/* 5. Khối Luyện Thi IELTS & Trò Chơi Tốc Độ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-paper-2 border-2 border-ink rounded-2xl p-7 shadow-brutal-lg flex items-center justify-between">
          <div>
            <div className="inline-block text-[11px] font-black uppercase tracking-wider bg-red text-white border border-ink rounded-full px-2.5 py-0.5 mb-2">
              Phòng thi chuẩn hóa
            </div>
            <h3 className="text-2xl font-black text-ink mb-1">Luyện Thi IELTS</h3>
            <p className="text-xs sm:text-sm text-ink-soft max-w-sm mb-4 leading-relaxed">
              Trải nghiệm bài thi bấm giờ thực tế với đề thi Reading, Listening và thang band điểm chuẩn quốc tế.
            </p>
            <Link href="/ielts">
              <Button variant="red" size="sm">
                Vào Phòng Thi →
              </Button>
            </Link>
          </div>
          <LingLing reaction="hands_on_hips" size={100} className="hidden sm:inline-flex" />
        </div>

        <div className="bg-card border-2 border-ink rounded-2xl p-7 shadow-brutal-lg flex items-center justify-between">
          <div>
            <div className="inline-block text-[11px] font-black uppercase tracking-wider bg-amber text-ink border border-ink rounded-full px-2.5 py-0.5 mb-2">
              Thư giãn & Phản xạ
            </div>
            <h3 className="text-2xl font-black text-ink mb-1">Trò chơi tốc độ</h3>
            <p className="text-xs sm:text-sm text-ink-soft max-w-sm mb-4 leading-relaxed">
              6 trò chơi thử thách tốc độ gõ phím, nối từ và xếp câu giúp bạn ghi nhớ từ vựng tự nhiên nhất.
            </p>
            <Link href="/games">
              <Button variant="ink" size="sm">
                Chơi game →
              </Button>
            </Link>
          </div>
          <LingLing reaction="run" size={100} className="hidden sm:inline-flex" />
        </div>
      </div>
    </div>
  );
}
