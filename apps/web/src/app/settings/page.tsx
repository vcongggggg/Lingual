'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Volume2,
  Clock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  HelpCircle,
  Bell,
  Moon,
  Flame,
  BookOpen,
  Award,
  Compass,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../../lib/api';
import { LingLing } from '../../components/ui/LingLing';

export default function SettingsPage() {
  const [insightsEnabled, setInsightsEnabled] = useState<boolean>(true);
  const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(true);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(30);

  // Notification Preferences State
  const [notifEnabled, setNotifEnabled] = useState<boolean>(true);
  const [srsDue, setSrsDue] = useState<boolean>(true);
  const [streakRisk, setStreakRisk] = useState<boolean>(true);
  const [goldenHour, setGoldenHour] = useState<boolean>(true);
  const [weakSkill, setWeakSkill] = useState<boolean>(true);
  const [forgetfulWords, setForgetfulWords] = useState<boolean>(true);
  const [weekly, setWeekly] = useState<boolean>(true);
  const [achievement, setAchievement] = useState<boolean>(true);
  const [quietStart, setQuietStart] = useState<string>('22:00');
  const [quietEnd, setQuietEnd] = useState<string>('07:00');

  const [loading, setLoading] = useState<boolean>(true);
  const [savingPrivacy, setSavingPrivacy] = useState<boolean>(false);
  const [savingNotif, setSavingNotif] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [notifSaveMessage, setNotifSaveMessage] = useState<string | null>(null);

  // Load preferences
  useEffect(() => {
    let isMounted = true;
    async function fetchPreferences() {
      try {
        // 1. Insights preference
        const pref = await api.getInsightsPreferences().catch(() => null);
        if (isMounted && pref && typeof pref.enabled === 'boolean') {
          setInsightsEnabled(pref.enabled);
        }

        // 2. Notification preferences
        const notifPref = await api.getNotificationPreferences().catch(() => null);
        if (isMounted && notifPref?.preferences) {
          const p = notifPref.preferences;
          setNotifEnabled(p.enabled ?? true);
          setSrsDue(p.srsDue ?? true);
          setStreakRisk(p.streakRisk ?? true);
          setGoldenHour(p.goldenHour ?? true);
          setWeakSkill(p.weakSkill ?? true);
          setForgetfulWords(p.forgetfulWords ?? true);
          setWeekly(p.weekly ?? true);
          setAchievement(p.achievement ?? true);
          if (p.quietStart) setQuietStart(p.quietStart);
          if (p.quietEnd) setQuietEnd(p.quietEnd);
        }
      } catch (err) {
        console.warn('Could not load preferences:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchPreferences();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleInsights = async () => {
    const nextState = !insightsEnabled;
    setInsightsEnabled(nextState);
    setSavingPrivacy(true);
    setSaveMessage(null);

    try {
      await api.setInsightsPreferences(nextState);
      setSaveMessage(
        nextState
          ? 'Đã bật tính năng Phân tích hành vi học tập!'
          : 'Đã tắt. Mục "Góc nhìn của Bò" trên trang Phân tích sẽ ẩn hoàn toàn.'
      );
    } catch (err) {
      console.error('Failed to update preference:', err);
      setInsightsEnabled(!nextState);
      setSaveMessage('Có lỗi xảy ra khi lưu cài đặt. Vui lòng thử lại!');
    } finally {
      setSavingPrivacy(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  // Cập nhật cài đặt thông báo
  const handleSaveNotifications = async (updates: Partial<{
    enabled: boolean;
    srsDue: boolean;
    streakRisk: boolean;
    goldenHour: boolean;
    weakSkill: boolean;
    forgetfulWords: boolean;
    weekly: boolean;
    achievement: boolean;
    quietStart: string;
    quietEnd: string;
  }>) => {
    setSavingNotif(true);
    setNotifSaveMessage(null);
    try {
      const payload = {
        enabled: updates.enabled ?? notifEnabled,
        srsDue: updates.srsDue ?? srsDue,
        streakRisk: updates.streakRisk ?? streakRisk,
        goldenHour: updates.goldenHour ?? goldenHour,
        weakSkill: updates.weakSkill ?? weakSkill,
        forgetfulWords: updates.forgetfulWords ?? forgetfulWords,
        weekly: updates.weekly ?? weekly,
        achievement: updates.achievement ?? achievement,
        quietStart: updates.quietStart ?? quietStart,
        quietEnd: updates.quietEnd ?? quietEnd,
      };

      await api.updateNotificationPreferences(payload);
      setNotifSaveMessage('Đã lưu cấu hình thông báo!');
    } catch (err) {
      console.error('Failed to update notification preferences:', err);
      setNotifSaveMessage('Lỗi khi lưu cài đặt thông báo.');
    } finally {
      setSavingNotif(false);
      setTimeout(() => setNotifSaveMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 pb-28 sm:pb-20 text-left">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/analytics"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-ink hover:text-red transition-colors bg-card border-2 border-ink px-3 py-1.5 rounded-xl shadow-brutal-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Báo cáo</span>
        </Link>

        <span className="text-xs font-bold text-ink-muted">Cài đặt hệ thống LinguaFlow</span>
      </div>

      {/* Header Banner */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-ink">
              <ShieldCheck className="w-4 h-4 text-red" />
              <span>Cài Đặt Riêng Tư & Thông Báo</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight font-sans">
              Trung Tâm Cài Đặt
            </h1>
            <p className="text-sm font-semibold text-ink-soft">
              Kiểm soát toàn diện quyền riêng tư, thông báo chuông và trải nghiệm học tập
            </p>
          </div>

          <div className="flex-shrink-0">
            <LingLing reaction="studying" size={88} />
          </div>
        </div>
      </div>

      {/* SECTION 1: CÀI ĐẶT THÔNG BÁO (NOTIFICATION SETTINGS - PHASE 1) */}
      <div className="card-paper p-6 sm:p-8 bg-card border-2 border-ink rounded-3xl shadow-brutal-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-ink/15 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red text-white border border-ink flex items-center justify-center font-black">
                <Bell className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-ink font-sans">
                Thông Báo & Lời Nhắc (Notifications)
              </h2>
            </div>
            <p className="text-xs text-ink-muted font-medium">
              Quản lý chuông thông báo trên thanh menu, lời nhắc giờ vàng, nguy cơ mất chuỗi và báo cáo tuần
            </p>
          </div>

          {/* Master Kill Switch */}
          <div className="flex items-center gap-3 bg-paper-2 border-2 border-ink rounded-2xl px-4 py-2 self-start sm:self-auto shadow-brutal-sm">
            <span className="text-xs font-black text-ink">
              {notifEnabled ? 'Đang Bật' : 'Đã Tắt'}
            </span>
            <button
              type="button"
              onClick={() => {
                const next = !notifEnabled;
                setNotifEnabled(next);
                handleSaveNotifications({ enabled: next });
              }}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-ink transition-colors ${
                notifEnabled ? 'bg-green-500' : 'bg-paper'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white border-2 border-ink transition mt-0.5 ${
                  notifEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Thông báo trạng thái lưu */}
        {notifSaveMessage && (
          <div className="p-3 bg-green-500/15 border-2 border-green-600 rounded-2xl text-xs font-bold text-green-800 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{notifSaveMessage}</span>
          </div>
        )}

        {notifEnabled ? (
          <div className="space-y-6">
            {/* Toggle từng loại thông báo */}
            <div className="space-y-3">
              <span className="text-[11px] font-black uppercase text-ink-muted tracking-wider block">
                Bật / Tắt theo từng loại nội dung:
              </span>

              {/* 1. SRS Due */}
              <div className="flex items-center justify-between p-3.5 bg-paper-2 border-2 border-ink rounded-2xl shadow-brutal-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl border border-ink bg-card flex items-center justify-center text-green-600 shadow-brutal-sm">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-ink block">
                      Thẻ ghi nhớ SRS đến hạn
                    </span>
                    <span className="text-[11px] text-ink-muted">
                      Nhắc nhở lúc 07:30 sáng khi có từ vựng cần ôn tập hôm nay
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={srsDue}
                  onChange={(e) => {
                    setSrsDue(e.target.checked);
                    handleSaveNotifications({ srsDue: e.target.checked });
                  }}
                  className="w-5 h-5 rounded border-2 border-ink text-green-600 focus:ring-0 cursor-pointer accent-green-600"
                />
              </div>

              {/* 2. Streak Risk */}
              <div className="flex items-center justify-between p-3.5 bg-paper-2 border-2 border-ink rounded-2xl shadow-brutal-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl border border-ink bg-card flex items-center justify-center text-red shadow-brutal-sm">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-ink block">
                      Cảnh báo nguy cơ mất chuỗi Streak
                    </span>
                    <span className="text-[11px] text-ink-muted">
                      Nhắc lúc 20:30 tối nếu hôm nay bạn chưa hoàn thành bài học
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={streakRisk}
                  onChange={(e) => {
                    setStreakRisk(e.target.checked);
                    handleSaveNotifications({ streakRisk: e.target.checked });
                  }}
                  className="w-5 h-5 rounded border-2 border-ink text-green-600 focus:ring-0 cursor-pointer accent-green-600"
                />
              </div>

              {/* 3. Golden Hour */}
              <div className="flex items-center justify-between p-3.5 bg-paper-2 border-2 border-ink rounded-2xl shadow-brutal-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl border border-ink bg-card flex items-center justify-center text-yellow-deep shadow-brutal-sm">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-ink block">
                      Khung giờ vàng học tập
                    </span>
                    <span className="text-[11px] text-ink-muted">
                      Gửi lời nhắc trước 15 phút khi đến khung giờ não bộ ghi nhớ tốt nhất của bạn
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={goldenHour}
                  onChange={(e) => {
                    setGoldenHour(e.target.checked);
                    handleSaveNotifications({ goldenHour: e.target.checked });
                  }}
                  className="w-5 h-5 rounded border-2 border-ink text-green-600 focus:ring-0 cursor-pointer accent-green-600"
                />
              </div>

              {/* 4. Weak Skill & Forgotten Words */}
              <div className="flex items-center justify-between p-3.5 bg-paper-2 border-2 border-ink rounded-2xl shadow-brutal-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl border border-ink bg-card flex items-center justify-center text-amber-600 shadow-brutal-sm">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-ink block">
                      Điểm yếu & Từ vựng hay quên
                    </span>
                    <span className="text-[11px] text-ink-muted">
                      Gợi ý bài tập khắc phục kỹ năng thấp nhất và ôn tập từ vựng hay sai
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={weakSkill}
                  onChange={(e) => {
                    setWeakSkill(e.target.checked);
                    setForgetfulWords(e.target.checked);
                    handleSaveNotifications({ weakSkill: e.target.checked, forgetfulWords: e.target.checked });
                  }}
                  className="w-5 h-5 rounded border-2 border-ink text-green-600 focus:ring-0 cursor-pointer accent-green-600"
                />
              </div>

              {/* 5. Weekly Cow Report */}
              <div className="flex items-center justify-between p-3.5 bg-paper-2 border-2 border-ink rounded-2xl shadow-brutal-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl border border-ink bg-card flex items-center justify-center text-blue shadow-brutal-sm">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-ink block">
                      Báo cáo Bò hàng tuần
                    </span>
                    <span className="text-[11px] text-ink-muted">
                      Thông báo khi Bò LingLing chấm xong Báo cáo Tuần và Kế hoạch 7 ngày mới
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={weekly}
                  onChange={(e) => {
                    setWeekly(e.target.checked);
                    handleSaveNotifications({ weekly: e.target.checked });
                  }}
                  className="w-5 h-5 rounded border-2 border-ink text-green-600 focus:ring-0 cursor-pointer accent-green-600"
                />
              </div>

              {/* 6. Achievement */}
              <div className="flex items-center justify-between p-3.5 bg-paper-2 border-2 border-ink rounded-2xl shadow-brutal-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl border border-ink bg-card flex items-center justify-center text-yellow-deep shadow-brutal-sm">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-ink block">
                      Mở khóa huy hiệu & Thành tựu
                    </span>
                    <span className="text-[11px] text-ink-muted">
                      Chúc mừng khi bạn chinh phục cột mốc bài học hoặc chuỗi ngày mới
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={achievement}
                  onChange={(e) => {
                    setAchievement(e.target.checked);
                    handleSaveNotifications({ achievement: e.target.checked });
                  }}
                  className="w-5 h-5 rounded border-2 border-ink text-green-600 focus:ring-0 cursor-pointer accent-green-600"
                />
              </div>
            </div>

            {/* Quiet Hours (Khung giờ yên lặng) */}
            <div className="p-4 bg-paper-2 border-2 border-ink rounded-2xl space-y-3 shadow-brutal-sm">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-ink" />
                <span className="text-xs sm:text-sm font-black text-ink">
                  Khung Giờ Yên Lặng (Quiet Hours)
                </span>
              </div>
              <p className="text-xs text-ink-muted font-medium">
                Hệ thống sẽ không gửi thông báo trong khoảng thời gian này để bạn nghỉ ngơi trọn vẹn.
              </p>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ink">Từ:</span>
                  <input
                    type="time"
                    value={quietStart}
                    onChange={(e) => {
                      setQuietStart(e.target.value);
                      handleSaveNotifications({ quietStart: e.target.value });
                    }}
                    className="px-3 py-1.5 bg-card border-2 border-ink rounded-xl text-xs font-black text-ink shadow-brutal-sm focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ink">Đến:</span>
                  <input
                    type="time"
                    value={quietEnd}
                    onChange={(e) => {
                      setQuietEnd(e.target.value);
                      handleSaveNotifications({ quietEnd: e.target.value });
                    }}
                    className="px-3 py-1.5 bg-card border-2 border-ink rounded-xl text-xs font-black text-ink shadow-brutal-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-paper-2 border-2 border-ink/40 rounded-2xl text-center space-y-1">
            <span className="text-xs font-bold text-ink-muted block">
              Bạn đã tắt công tắc nhận thông báo.
            </span>
            <span className="text-[11px] text-ink-soft block">
              Biểu tượng chuông thông báo trên thanh điều hướng sẽ được ẩn đi.
            </span>
          </div>
        )}
      </div>

      {/* SECTION 2: QUYỀN RIÊNG TƯ PHÂN TÍCH HÀNH VI (V1 INSIGHTS) */}
      <div className="card-paper p-6 sm:p-8 bg-card border-2 border-ink rounded-3xl shadow-brutal-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-ink/15 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-deep" />
              <h2 className="text-xl sm:text-2xl font-black text-ink font-sans">
                Phân Tích Hành Vi Học Tập
              </h2>
            </div>
            <p className="text-xs text-ink-muted font-medium">
              Cho phép hệ thống phân tích giờ vàng, radar 5 kỹ năng và từ vựng hay quên
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleInsights}
            disabled={savingPrivacy || loading}
            className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-ink transition-colors shadow-brutal-sm self-start sm:self-auto ${
              insightsEnabled ? 'bg-teal' : 'bg-paper'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white border-2 border-ink shadow-brutal-sm transition mt-0.5 ${
                insightsEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {saveMessage && (
          <div
            className={`p-3.5 rounded-2xl border-2 text-xs font-bold flex items-center gap-2 ${
              insightsEnabled
                ? 'bg-[#E8F5E9] border-[#2E7D32] text-[#2E7D32]'
                : 'bg-[#FFF3E0] border-[#E65100] text-[#E65100]'
            }`}
          >
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}

        <div className="border-t border-ink/15 pt-3 flex items-start gap-2 text-xs text-ink-muted">
          <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <b>Nguyên tắc bảo mật:</b> 100% thuật toán rule-based chạy trực tiếp trên cơ sở dữ liệu nội bộ của bạn. Khi tắt, các endpoint <code>/api/v1/insights/*</code> sẽ trả về trạng thái vô hiệu hóa và UI phân tích sẽ ẩn khỏi ứng dụng.
          </span>
        </div>
      </div>

      {/* SECTION 3: TÙY CHỌN HỌC TẬP KHÁC */}
      <div className="card-paper p-6 sm:p-8 bg-card border-2 border-ink rounded-3xl shadow-brutal-md space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-ink font-sans border-b-2 border-ink/15 pb-4">
          Tùy Chọn Học Tập & Giao Diện
        </h2>

        <div className="space-y-4">
          {/* Audio Auto-play */}
          <div className="flex items-center justify-between p-4 bg-paper-2 border-2 border-ink rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border-2 border-ink bg-card flex items-center justify-center text-ink shadow-brutal-sm">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-black text-ink block font-sans">
                  Tự động phát âm từ vựng
                </span>
                <span className="text-xs text-ink-muted">
                  Phát âm giọng bản xứ khi lật mở thẻ SRS hoặc tra cứu từ
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAutoPlayAudio(!autoPlayAudio)}
              className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-ink transition-colors shadow-brutal-sm ${
                autoPlayAudio ? 'bg-teal' : 'bg-paper'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white border-2 border-ink shadow-brutal-sm transition mt-0.5 ${
                  autoPlayAudio ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Daily Goal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-paper-2 border-2 border-ink rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border-2 border-ink bg-card flex items-center justify-center text-ink shadow-brutal-sm">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-black text-ink block font-sans">
                  Mục tiêu rèn luyện hàng ngày
                </span>
                <span className="text-xs text-ink-muted">
                  Đặt chỉ tiêu thời gian học mỗi ngày trên bảng chấm công
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setDailyGoalMinutes(mins)}
                  className={`px-3 py-1.5 rounded-xl border-2 border-ink text-xs font-black shadow-brutal-sm transition-all cursor-pointer ${
                    dailyGoalMinutes === mins
                      ? 'bg-red text-white'
                      : 'bg-card text-ink hover:bg-paper'
                  }`}
                >
                  {mins}p
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
