'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
  RefreshCw,
  Trophy,
  Flame,
  BookOpen,
  Gamepad2,
  GraduationCap,
  Star,
  X,
  Filter,
} from 'lucide-react';
import { api, AchievementItem, AchievementSummary } from '../../../lib/api';

// Định nghĩa các nhóm danh mục sổ tay
const CATEGORIES: { id: string; label: string; icon: any; codes?: string[] }[] = [
  { id: 'all', label: 'Tất Cả 16 Huy Hiệu', icon: Trophy },
  { id: 'unlocked', label: 'Đã Khai Mở', icon: CheckCircle2 },
  { id: 'locked', label: 'Đang Chinh Phục', icon: Lock },
  {
    id: 'vocab',
    label: 'Từ Vựng & SRS',
    icon: BookOpen,
    codes: ['first_word', 'words_100', 'words_500', 'words_1000', 'srs_500'],
  },
  {
    id: 'habits',
    label: 'Thói Quen & Chuỗi',
    icon: Flame,
    codes: ['streak_3', 'streak_7', 'streak_30', 'daily_goal_7'],
  },
  {
    id: 'games',
    label: 'Trò Chơi Ngôn Ngữ',
    icon: Gamepad2,
    codes: ['first_game', 'game_win_10', 'game_master'],
  },
  {
    id: 'milestones',
    label: 'Kỳ Thi & Cột Mốc',
    icon: GraduationCap,
    codes: ['first_lesson', 'xp_1000', 'ielts_first', 'ielts_band7'],
  },
];

const CELEBRATED_STORAGE_KEY = 'lingual_celebrated_achievements_v1';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [summary, setSummary] = useState<AchievementSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Popup ăn mừng StampSlam cho huy hiệu mới mở
  const [celebratingBadge, setCelebratingBadge] = useState<AchievementItem | null>(null);

  // Hàm tải dữ liệu thật từ API
  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [achRes, sumRes] = await Promise.all([
        api.getAchievements().catch(() => ({ achievements: [] })),
        api.getAchievementSummary().catch(() => null),
      ]);

      const items = achRes?.achievements || [];
      setAchievements(items);
      setSummary(sumRes);

      // Xử lý hiệu ứng StampSlam CHỈ 1 lần cho huy hiệu vừa mới mở
      if (typeof window !== 'undefined' && items.length > 0) {
        try {
          const rawStored = localStorage.getItem(CELEBRATED_STORAGE_KEY);
          const celebratedIds: string[] = rawStored ? JSON.parse(rawStored) : [];

          // Tìm huy hiệu đã mở nhưng chưa được celebrate
          const newlyUnlocked = items.filter(
            (a) => a.unlocked && !celebratedIds.includes(a.code)
          );

          if (newlyUnlocked.length > 0) {
            // Lấy huy hiệu đầu tiên để slam ăn mừng
            const badgeToSlam = newlyUnlocked[0];
            setCelebratingBadge(badgeToSlam);

            // Cập nhật ngay danh sách đã celebrate vào localStorage để không lặp lại
            const updatedCelebrated = Array.from(
              new Set([...celebratedIds, ...newlyUnlocked.map((b) => b.code)])
            );
            localStorage.setItem(
              CELEBRATED_STORAGE_KEY,
              JSON.stringify(updatedCelebrated)
            );
          }
        } catch (storageErr) {
          console.warn('[Achievements] Error reading/writing celebrated localStorage:', storageErr);
        }
      }
    } catch (err: any) {
      console.error('[Achievements] Failed to load:', err);
      setError(err?.message || 'Không thể tải dữ liệu thành tích từ máy chủ.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Đánh giá lại thành tích
  const handleEvaluate = async () => {
    try {
      setRefreshing(true);
      await api.evaluateAchievements();
      await loadData(true);
    } catch (err: any) {
      console.error('[Achievements] Evaluate error:', err);
      await loadData(true);
    }
  };

  // Lọc huy hiệu theo danh mục
  const filteredAchievements = useMemo(() => {
    return achievements.filter((ach) => {
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'unlocked') return ach.unlocked;
      if (selectedCategory === 'locked') return !ach.unlocked;

      const cat = CATEGORIES.find((c) => c.id === selectedCategory);
      if (cat?.codes) {
        return cat.codes.includes(ach.code);
      }
      return true;
    });
  }, [achievements, selectedCategory]);

  const unlockedCount = summary?.unlockedCount ?? achievements.filter((a) => a.unlocked).length;
  const totalCount = summary?.totalCount ?? (achievements.length || 16);
  const bonusXpEarned = summary?.bonusXpEarned ?? achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.xpBonus, 0);
  const progressPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-paper font-sans text-ink selection:bg-red/20 selection:text-ink pb-16">
      {/* Top Paper Header Strip */}
      <header className="border-b-2 border-ink bg-card shadow-brutal-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-paper border-2 border-ink rounded hover:bg-paper-2 transition-all shadow-brutal-sm"
            >
              <ArrowLeft className="w-4 h-4 text-ink" />
              <span>Bàn Học</span>
            </Link>
            <div className="h-5 w-[2px] bg-ink/20" />
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red animate-pulse" />
              <h1 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>SỔ TAY HUY HIỆU & THÀNH TÍCH</span>
                <span className="hidden sm:inline-block text-xs font-bold px-2 py-0.5 bg-red text-white rounded-full border border-ink">
                  {unlockedCount}/{totalCount} Huy Hiệu
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleEvaluate}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-paper text-ink border-2 border-ink rounded hover:bg-paper-2 transition-all shadow-brutal-sm disabled:opacity-50"
              title="Đồng bộ và đánh giá lại toàn bộ tiến độ"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-red ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Cập Nhật Tiến Độ</span>
            </button>
            <Link
              href="/practice"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-amber-soft text-ink border-2 border-ink rounded hover:bg-amber transition-all shadow-brutal-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-red" />
              <span>Luyện Tập Thêm</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Notebook Cover Banner */}
        <div className="relative mb-8 bg-card border-2 border-ink rounded-lg p-6 sm:p-8 shadow-brutal overflow-hidden">
          {/* Subtle notebook binder line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red via-ink to-red" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-bold tracking-widest uppercase bg-paper border border-ink rounded text-red">
                <Award className="w-3.5 h-3.5" />
                <span>Bảng Vinh Danh Học Giả • Mộc Đỏ Son</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight mb-2">
                Bộ Sưu Tập Huy Hiệu Khắc Ghi Thành Tích
              </h2>
              <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
                Mỗi huy hiệu là một mộc son ghi nhận nỗ lực rèn luyện của bạn: từ tích lũy vốn từ, 
                duy trì ngọn lửa chuỗi ngày, cho đến chiến thắng mini-game và chinh phục đề thi IELTS.
              </p>

              {/* Progress Bar & Summary Stats */}
              <div className="mt-5 flex flex-wrap items-center gap-4 sm:gap-6 pt-4 border-t border-ink/15">
                <div>
                  <div className="text-xs font-bold uppercase text-ink-muted">Đã Khai Mở</div>
                  <div className="text-xl sm:text-2xl font-black text-red">
                    {unlockedCount} <span className="text-sm font-bold text-ink-soft">/ {totalCount}</span>
                  </div>
                </div>

                <div className="h-8 w-[1px] bg-ink/20" />

                <div>
                  <div className="text-xs font-bold uppercase text-ink-muted">Tổng Thưởng XP</div>
                  <div className="text-xl sm:text-2xl font-black text-ink">
                    +{bonusXpEarned} <span className="text-xs font-bold text-ink-muted">XP</span>
                  </div>
                </div>

                <div className="h-8 w-[1px] bg-ink/20" />

                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-ink-soft uppercase tracking-wider">Tiến Trình Hoàn Thành</span>
                    <span className="text-red font-black">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-3 bg-paper border-2 border-ink rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-red rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Exactly 1 Mascot on the page */}
            <div className="flex items-center gap-4 bg-paper/90 border-2 border-ink rounded-lg p-3.5 shadow-brutal-sm shrink-0 self-center lg:self-auto">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                <Image
                  src="/mascot/cow_gen_studying.png"
                  alt="LinguaFlow Mascot Chăm Học"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-xs">
                <div className="font-black text-ink uppercase tracking-wider">LingLing Scholar</div>
                <div className="text-ink-muted mt-0.5">Sổ bộ thành tích</div>
                <div className="inline-block mt-1 px-2 py-0.5 bg-red/10 text-red font-black rounded text-[11px] border border-red/30">
                  {progressPercent === 100 ? 'Đại Học Sĩ' : 'Đang Tích Luỹ'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold tracking-wide rounded border-2 transition-all shrink-0 ${
                  active
                    ? 'bg-red text-white border-ink shadow-brutal-sm'
                    : 'bg-card text-ink border-ink hover:bg-paper-2 shadow-brutal-sm'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-red'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-card border-2 border-ink rounded-lg p-12 text-center shadow-brutal">
            <RefreshCw className="w-8 h-8 text-red animate-spin mx-auto mb-3" />
            <p className="text-sm font-bold text-ink-soft">Đang mở trang sổ tay thành tích...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-card border-2 border-red rounded-lg p-6 text-center shadow-brutal mb-6">
            <p className="text-sm font-bold text-red mb-3">{error}</p>
            <button
              onClick={() => loadData(false)}
              className="px-4 py-2 bg-red text-white border-2 border-ink rounded font-bold text-xs shadow-brutal-sm hover:opacity-90"
            >
              Thử Lại
            </button>
          </div>
        )}

        {/* Badges Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredAchievements.map((badge) => {
              const isUnlocked = badge.unlocked;
              const percent = Math.min(100, Math.max(0, badge.progress?.percent ?? 0));
              const current = badge.progress?.current ?? 0;
              const target = badge.progress?.target ?? 1;

              return (
                <div
                  key={badge.id || badge.code}
                  className={`relative flex flex-col justify-between rounded-lg border-2 border-ink p-5 transition-all shadow-brutal ${
                    isUnlocked
                      ? 'bg-card hover:-translate-y-0.5'
                      : 'bg-paper/70 opacity-90'
                  }`}
                >
                  {/* Con dấu triện đỏ 'ĐÃ ĐẠT' phong cách mộc giấy xưa */}
                  {isUnlocked && (
                    <div className="absolute top-3 right-3 select-none pointer-events-none">
                      <div className="border-2 border-dashed border-red text-red font-black text-[10px] tracking-widest uppercase px-2 py-0.5 rounded rotate-[-10deg] shadow-sm bg-red/5">
                        ĐÃ ĐẠT
                      </div>
                    </div>
                  )}

                  {!isUnlocked && (
                    <div className="absolute top-3 right-3 text-ink-muted">
                      <Lock className="w-4 h-4 opacity-50" />
                    </div>
                  )}

                  {/* Header: Icon & XP Tag */}
                  <div>
                    <div className="flex items-start gap-3.5 mb-3">
                      <div
                        className={`w-14 h-14 rounded-lg border-2 border-ink flex items-center justify-center text-2xl shrink-0 shadow-brutal-sm ${
                          isUnlocked
                            ? 'bg-paper'
                            : 'bg-paper/50 grayscale contrast-75'
                        }`}
                      >
                        {badge.icon || '🏅'}
                      </div>
                      <div className="pr-12">
                        <span className="inline-block px-2 py-0.5 bg-amber-soft border border-ink rounded text-[11px] font-black text-ink shadow-xs mb-1">
                          +{badge.xpBonus} XP
                        </span>
                        <h3 className="font-black text-sm text-ink leading-snug">
                          {badge.nameVi || badge.code}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-ink-soft leading-relaxed min-h-[36px] mb-4">
                      {badge.descriptionVi || 'Nhiệm vụ học tập cần đạt mốc quy định.'}
                    </p>
                  </div>

                  {/* Footer: Progress or Unlocked Timestamp */}
                  <div className="pt-3 border-t border-ink/15 mt-auto">
                    {isUnlocked ? (
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-teal-dark flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
                          <span>Đã Khai Mở</span>
                        </span>
                        {badge.unlockedAt && (
                          <span className="text-[11px] text-ink-muted">
                            {new Date(badge.unlockedAt).toLocaleDateString('vi-VN')}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className="text-ink-muted">Tiến độ</span>
                          <span className="text-ink font-black">
                            {current} / {target}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-paper border border-ink rounded-full overflow-hidden p-0.5">
                          <div
                            className="h-full bg-red rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty Filter State */}
        {!loading && !error && filteredAchievements.length === 0 && (
          <div className="bg-card border-2 border-ink rounded-lg p-10 text-center shadow-brutal">
            <Filter className="w-8 h-8 text-ink-muted mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold text-ink-soft">
              Không tìm thấy huy hiệu nào trong danh mục này.
            </p>
          </div>
        )}
      </main>

      {/* MODAL ĂN MỪNG STAMPSLAM CHỈ 1 LẦN KHI VỪA MỞ HUY HIỆU */}
      {celebratingBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-card border-4 border-ink rounded-xl p-6 sm:p-8 text-center shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] transform transition-all animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={() => setCelebratingBadge(null)}
              className="absolute top-3 right-3 p-1 rounded border-2 border-ink bg-paper hover:bg-paper-2 text-ink shadow-brutal-sm"
              title="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Stamp Slam Badge Effect */}
            <div className="relative inline-block my-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-xl border-3 border-ink bg-paper flex items-center justify-center text-5xl shadow-brutal animate-bounce">
                {celebratingBadge.icon || '🏆'}
              </div>
              <div className="absolute -bottom-2 -right-2 border-2 border-dashed border-red bg-paper px-2.5 py-1 rounded text-red font-black text-xs uppercase tracking-wider rotate-[-12deg] shadow-brutal-sm">
                ĐÃ ĐẠT MỐC!
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 text-xs font-black uppercase tracking-widest bg-red text-white border border-ink rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>KHAI MỞ HUY HIỆU MỚI</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-ink tracking-tight mb-2">
              {celebratingBadge.nameVi}
            </h3>

            <p className="text-sm text-ink-soft mb-4">
              {celebratingBadge.descriptionVi}
            </p>

            <div className="p-3 bg-amber-soft border-2 border-ink rounded-lg font-black text-ink text-sm sm:text-base shadow-brutal-sm mb-6 inline-block">
              🎉 Bạn nhận được <span className="text-red font-black">+{celebratingBadge.xpBonus} XP</span> Thưởng!
            </div>

            <div>
              <button
                onClick={() => setCelebratingBadge(null)}
                className="w-full py-2.5 px-4 bg-red text-white font-black text-sm uppercase tracking-wider rounded border-2 border-ink shadow-brutal hover:opacity-95 transition-all"
              >
                Ghi Vào Sổ Tay & Tiếp Tục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
