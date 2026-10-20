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
} from 'lucide-react';
import { api } from '../../lib/api';
import { LingLing } from '../../components/ui/LingLing';

export default function SettingsPage() {
  const [insightsEnabled, setInsightsEnabled] = useState<boolean>(true);
  const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(true);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(30);
  const [stampEffects, setStampEffects] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(true);
  const [savingPrivacy, setSavingPrivacy] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Load preferences
  useEffect(() => {
    let isMounted = true;
    async function fetchPreferences() {
      try {
        const pref = await api.getInsightsPreferences();
        if (isMounted && pref && typeof pref.enabled === 'boolean') {
          setInsightsEnabled(pref.enabled);
        }
      } catch (err) {
        console.warn('Could not load insights preference:', err);
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
      // Revert if error
      setInsightsEnabled(!nextState);
      setSaveMessage('Có lỗi xảy ra khi lưu cài đặt. Vui lòng thử lại!');
    } finally {
      setSavingPrivacy(false);
      setTimeout(() => setSaveMessage(null), 4000);
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

        <span className="text-xs font-bold text-ink-muted">Phiên bản V1 • Cài đặt hệ thống</span>
      </div>

      {/* Header Banner */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-ink">
              <ShieldCheck className="w-4 h-4 text-red" />
              <span>Cài Đặt Riêng Tư & Ứng Dụng</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight font-sans">
              Tùy Chọn & Quyền Riêng Tư
            </h1>
            <p className="text-sm text-ink-soft leading-relaxed">
              Kiểm soát hoàn toàn cách dữ liệu học tập của bạn được sử dụng. Chúng tôi cam kết bảo vệ sự riêng tư và tôn trọng mọi quyết định của bạn.
            </p>
          </div>

          <div className="flex-shrink-0 self-center sm:self-auto">
            <LingLing reaction="studying" size={88} animate={false} />
          </div>
        </div>
      </div>

      {/* SECTION 1: QUYỀN RIÊNG TƯ & AI INSIGHTS (BẮT BUỘC THEO YÊU CẦU ĐỀ BÀI) */}
      <div className="card-paper p-6 sm:p-8 bg-card border-2 border-ink rounded-3xl shadow-brutal-md space-y-6">
        <div className="flex items-start justify-between gap-4 border-b-2 border-ink/15 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-red">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tính năng cốt lõi</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-ink font-sans flex items-center gap-2">
              Phân tích hành vi học tập (AI Insights V1)
            </h2>
          </div>

          {insightsEnabled ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E8F5E9] border border-[#2E7D32] text-[#2E7D32] text-xs font-black shadow-brutal-sm">
              <Eye className="w-3.5 h-3.5" />
              <span>Đang Bật</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-paper-2 border border-ink text-ink-muted text-xs font-black">
              <EyeOff className="w-3.5 h-3.5" />
              <span>Đã Tắt</span>
            </span>
          )}
        </div>

        {/* Toggle Switch Card */}
        <div className="bg-paper-2 border-2 border-ink rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-lg">
              <label
                htmlFor="insights-toggle"
                className="text-base font-black text-ink block cursor-pointer font-sans"
              >
                Bật phân tích hành vi học tập
              </label>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                Cho phép Bò LingLing thống kê giờ vàng ôn tập SRS, đánh giá 5 kỹ năng để tìm điểm yếu, và ghi nhận các từ vựng bạn hay quên để ưu tiên xuất hiện trong Thử Thách Ngày & Bản Tin.
              </p>
            </div>

            {/* Brutalist Toggle Button */}
            <button
              id="insights-toggle"
              type="button"
              role="switch"
              aria-checked={insightsEnabled}
              disabled={loading || savingPrivacy}
              onClick={handleToggleInsights}
              className={`relative inline-flex h-9 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-ink transition-colors duration-200 ease-in-out shadow-brutal-sm focus:outline-none ${
                insightsEnabled ? 'bg-red' : 'bg-paper'
              } ${savingPrivacy ? 'opacity-60 cursor-wait' : ''}`}
            >
              <span
                className={`inline-block h-7 w-7 transform rounded-full bg-white border-2 border-ink shadow-brutal-sm transition duration-200 ease-in-out mt-0.5 ${
                  insightsEnabled ? 'translate-x-7' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Toast / Thông báo lưu */}
          {saveMessage && (
            <div
              className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                insightsEnabled
                  ? 'bg-[#E8F5E9] border-[#2E7D32] text-[#2E7D32]'
                  : 'bg-[#FFF3E0] border-[#E65100] text-[#E65100]'
              }`}
            >
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{saveMessage}</span>
            </div>
          )}

          {/* Privacy Note */}
          <div className="border-t border-ink/15 pt-3 flex items-start gap-2 text-xs text-ink-muted">
            <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              <b>Nguyên tắc bảo mật:</b> 100% thuật toán rule-based chạy trực tiếp trên cơ sở dữ liệu nội bộ của bạn, hoàn toàn không gửi thông tin người dùng ra API bên thứ ba. Khi tắt, toàn bộ các endpoint <code>/api/v1/insights/*</code> sẽ trả về trạng thái vô hiệu hóa và UI "Góc nhìn của Bò" sẽ ẩn khỏi ứng dụng.
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: TÙY CHỌN HỌC TẬP KHÁC */}
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
