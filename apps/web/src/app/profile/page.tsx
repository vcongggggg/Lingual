'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Shield,
  Award,
  Calendar,
  Zap,
  LogOut,
  Save,
  CheckCircle2,
  Clock,
  Globe,
  Bell,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { LingLing } from '../../components/ui/LingLing';
import { StampBookSection } from '../../components/ui/StampBookSection';



const DAILY_GOALS = [
  { level: 1, name: 'Thong thả', minutes: 15, desc: 'Duy trì phản xạ nhẹ nhàng mỗi ngày' },
  { level: 2, name: 'Vừa sức', minutes: 30, desc: 'Tiến độ chuẩn được khuyên dùng nhất' },
  { level: 3, name: 'Chăm chỉ', minutes: 45, desc: 'Tăng tốc mở rộng vốn từ & cấu trúc' },
  { level: 4, name: 'Cấp tốc', minutes: 60, desc: 'Luyện thi và bứt phá điểm số cao' },
];

export default function ProfilePage() {
  const [goalIndex, setGoalIndex] = useState(1); // Mặc định: Vừa sức (30p)
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isSliderWiggling, setIsSliderWiggling] = useState(false);
  const [timezone, setTimezone] = useState('Asia/Ho_Chi_Minh');
  const [emailAlert, setEmailAlert] = useState(true);
  const [paperSound, setPaperSound] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleGoalChange = (newIdx: number) => {
    setGoalIndex(newIdx);
    setIsSliderWiggling(true);
    setTimeout(() => setIsSliderWiggling(false), 200);
  };

  const [formData, setFormData] = useState({
    fullName: 'Vũ Công',
    displayName: 'vcongggggg',
    email: 'vcong@lingual.edu',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Đã cập nhật thông tin thẻ học viên thành công!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi sổ tay học tập?')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('lingual_token');
        document.cookie = 'access_token=; path=/; max-age=0';
        window.location.href = '/login';
      }
    }
  };

  const activeGoal = DAILY_GOALS[goalIndex];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 pb-28 sm:pb-20 text-left">
      {/* Toast phản hồi */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-teal text-white font-black text-xs px-4 py-3 border-2 border-ink shadow-brutal flex items-center gap-2 rounded-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
        <Link href="/dashboard" className="hover:text-red transition-colors">
          Trang chủ
        </Link>
        <span>/</span>
        <span className="text-ink">Hồ sơ học viên</span>
      </div>

      {/* 1. CONCEPT THẺ HỌC VIÊN LẬT 3D XEM BẢNG VÀNG THÀNH TÍCH MẶT SAU */}
      <div className="perspective-1000 w-full select-none">
        <div
          onClick={() => setIsCardFlipped(!isCardFlipped)}
          className={`preserve-3d transition-transform duration-300 relative cursor-pointer min-h-[300px] sm:min-h-[220px] ${
            isCardFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* MẶT TRƯỚC THẺ HỌC VIÊN */}
          <div className="backface-hidden bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl relative overflow-hidden">
            {/* Họa tiết góc thẻ ID */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-paper-2 rounded-bl-full border-l-2 border-b-2 border-ink -z-0 opacity-50 pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-ink/20 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-teal">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Thẻ Học Viên Lingual (Mặt Trước)</span>
                </div>

                <div className="text-xs font-mono font-bold text-ink-muted">
                  MÃ ĐỊNH DANH: <span className="text-ink font-black">LNG-2026-9921</span>
                </div>
              </div>

              {/* Chi Tiết Thẻ Học Viên */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  {/* Avatar trong vòng tròn mực */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 border-ink bg-paper p-1 shadow-brutal-sm flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <LingLing reaction="proud" size={80} />
                  </div>

                  <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
                      {formData.fullName}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-ink-soft">
                      <span>@{formData.displayName}</span>
                      <span>·</span>
                      <span>{formData.email}</span>
                    </div>
                    <div className="text-[11px] font-bold text-ink-muted flex items-center gap-1.5 pt-1">
                      <Calendar className="w-3.5 h-3.5 text-teal" />
                      <span>Gia nhập sổ tay: 15/09/2026</span>
                    </div>
                  </div>
                </div>

                {/* Con Dấu Mực (Stamps) Chuỗi ngày học & XP */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Stamp Chuyên Cần */}
                  <div className="card-paper p-3 bg-paper-2 border-2 border-ink rounded-2xl text-center min-w-[105px]">
                    <span className="text-[10px] font-black uppercase text-ink-muted block">Chuyên cần</span>
                    <span className="text-lg font-black font-mono text-teal">6 / 7 ngày</span>
                    <span className="text-[10px] font-bold text-ink-soft block">Tuần này</span>
                  </div>

                  {/* Stamp Điểm Tích Lũy */}
                  <div className="card-paper p-3 bg-paper-2 border-2 border-ink rounded-2xl text-center min-w-[105px]">
                    <span className="text-[10px] font-black uppercase text-ink-muted block">Kinh nghiệm</span>
                    <span className="text-lg font-black font-mono text-red">1,420 XP</span>
                    <span className="text-[10px] font-bold text-ink-soft block">Hạng Vàng</span>
                  </div>

                  {/* Nút Đăng Xuất Dạng Nút Giấy */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                    }}
                    className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-2 cursor-pointer self-stretch sm:self-auto"
                    title="Đăng xuất tài khoản"
                  >
                    <LogOut className="w-3.5 h-3.5 text-ink-muted" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] font-bold text-amber-800 bg-amber-50/80 rounded px-2.5 py-1 w-fit border border-dashed border-ink/20 flex items-center gap-1.5">
                <span>↻</span>
                <span>Chạm thẻ để lật 3D xem bảng vàng thành tích mặt sau</span>
              </div>
            </div>
          </div>

          {/* MẶT SAU THẺ HỌC VIÊN (STATS & HUY HIỆU) */}
          <div className="backface-hidden rotate-y-180 absolute inset-0 bg-paper-2 border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl flex flex-col justify-between">
            <div className="flex items-center justify-between border-b-2 border-ink/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red" />
                <span className="font-mono text-xs font-black uppercase tracking-wider text-ink">
                  HỒ SƠ NĂNG LỰC & CHỈ SỐ HỌC VIÊN
                </span>
              </div>
              <span className="text-[11px] font-bold text-ink-muted">↺ Chạm để lật lại mặt trước</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
              <div className="card-paper p-3.5 bg-card border border-ink text-center shadow-brutal-sm">
                <span className="text-[10px] font-black uppercase text-ink-muted block">Tổng từ đã thuộc</span>
                <span className="text-2xl font-mono font-black text-ink">482 từ</span>
                <span className="text-[9px] text-teal font-bold block mt-0.5">Top 5% toàn hệ thống</span>
              </div>

              <div className="card-paper p-3.5 bg-card border border-ink text-center shadow-brutal-sm">
                <span className="text-[10px] font-black uppercase text-ink-muted block">Streak kỷ lục</span>
                <span className="text-2xl font-mono font-black text-red">28 ngày</span>
                <span className="text-[9px] text-red font-bold block mt-0.5">Không đứt đoạn</span>
              </div>

              <div className="card-paper p-3.5 bg-card border border-ink text-center shadow-brutal-sm">
                <span className="text-[10px] font-black uppercase text-ink-muted block">Đóng băng bảo vệ</span>
                <span className="text-2xl font-mono font-black text-teal">1 lượt</span>
                <span className="text-[9px] text-ink-soft font-bold block mt-0.5">Sẵn sàng kích hoạt</span>
              </div>

              <div className="card-paper p-3.5 bg-card border border-ink text-center shadow-brutal-sm">
                <span className="text-[10px] font-black uppercase text-ink-muted block">Huy hiệu đạt được</span>
                <span className="text-2xl font-mono font-black text-amber">12</span>
                <span className="text-[9px] text-amber-700 font-bold block mt-0.5">Bộ sưu tập danh dự</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t-2 border-ink/20 pt-2 text-[11px] font-black text-ink-muted">
              <span>SỔ TAY TIẾNG ANH LINGUAL · ĐÃ XÁC THỰC BẢN QUYỀN</span>
              <span className="text-red">✦ NIÊN KHÓA 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PHÂN HỆ SỔ TEM (STAMP BOOK) · GAMIFICATION */}
      <StampBookSection />

      {/* 3. CÀI ĐẶT VẼ NHƯ "ĐƠN ĐĂNG KÝ" TRÊN GIẤY */}
      <form onSubmit={handleSave} className="card-paper p-6 sm:p-10 bg-card border-2 border-ink rounded-3xl shadow-brutal-xl space-y-8">
        <div className="border-b-2 border-ink/20 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight font-sans">
              Đơn đăng ký cài đặt học tập
            </h2>
            <p className="text-xs text-ink-soft">
              Điền các thông tin và thiết lập nhịp độ rèn luyện mong muốn của bạn.
            </p>
          </div>

          <span className="badge-tag bg-paper text-xs font-bold self-start sm:self-auto">
            MẪU SỐ #01-A
          </span>
        </div>

        {/* Khối Thông Tin Học Viên */}
        <div className="space-y-4">
          <span className="text-xs font-black uppercase tracking-wider text-ink-muted block">
            1. Thông tin cá nhân học viên:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-black uppercase text-ink-muted mb-1.5">
                Họ và tên học viên <span className="text-red">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2.5 bg-paper border-2 border-ink rounded-xl text-xs sm:text-sm font-bold text-ink outline-none focus:border-red"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-ink-muted mb-1.5">
                Tên hiển thị (Biệt danh) <span className="text-red">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-4 py-2.5 bg-paper border-2 border-ink rounded-xl text-xs sm:text-sm font-bold text-ink outline-none focus:border-red"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-ink-muted mb-1.5">
              Địa chỉ thư điện tử (Email) <span className="text-red">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-paper border-2 border-ink rounded-xl text-xs sm:text-sm font-bold text-ink outline-none focus:border-red"
            />
          </div>
        </div>

        {/* Khối Slider Mục Tiêu Ngày với 4 Mốc */}
        <div className="space-y-4 pt-4 border-t-2 border-ink/15">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-ink-muted block">
              2. Mục tiêu rèn luyện mỗi ngày:
            </span>

            <div
              className={`inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-xl text-xs font-black text-red transition-transform ${
                isSliderWiggling ? 'animate-notch-snap' : ''
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>
                Mức {activeGoal.level}: {activeGoal.name} ({activeGoal.minutes} phút/ngày)
              </span>
            </div>
          </div>

          <div className="p-5 bg-paper border-2 border-ink rounded-2xl space-y-5">
            {/* Thanh Slider 4 Mốc có snap từng nấc */}
            <input
              type="range"
              min={0}
              max={3}
              step={1}
              value={goalIndex}
              onChange={(e) => handleGoalChange(parseInt(e.target.value))}
              className="w-full h-3 bg-paper-2 rounded-lg appearance-none cursor-pointer accent-red border border-ink"
            />

            {/* 4 Mốc Thong thả / Vừa sức / Chăm chỉ / Cấp tốc */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DAILY_GOALS.map((g, idx) => {
                const isSelected = goalIndex === idx;
                return (
                  <button
                    type="button"
                    key={g.level}
                    onClick={() => handleGoalChange(idx)}
                    className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-ink bg-card shadow-brutal-sm -translate-y-0.5'
                        : 'border-ink/20 bg-paper hover:border-ink/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-ink">{g.name}</span>
                      <span
                        className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-red text-white' : 'bg-paper-2 text-ink-muted'
                        }`}
                      >
                        {g.minutes}p
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-soft leading-tight">{g.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Khối Múi Giờ & Tùy Chọn */}
        <div className="space-y-4 pt-4 border-t-2 border-ink/15">
          <span className="text-xs font-black uppercase tracking-wider text-ink-muted block">
            3. Thiết lập múi giờ & thông báo:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-black uppercase text-ink-muted mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-teal" />
                <span>Múi giờ học tập</span>
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-2.5 bg-paper border-2 border-ink rounded-xl text-xs sm:text-sm font-bold text-ink outline-none cursor-pointer"
              >
                <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (UTC+07:00 · Hà Nội, TP.HCM)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (UTC+09:00 · Tokyo)</option>
                <option value="Europe/London">Europe/London (UTC+00:00 · London)</option>
                <option value="America/New_York">America/New_York (UTC-05:00 · New York)</option>
              </select>
            </div>

            <div className="space-y-3 pt-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlert}
                  onChange={(e) => setEmailAlert(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-ink text-red accent-red cursor-pointer"
                />
                <span className="text-xs font-bold text-ink">
                  Nhận thư nhắc nhở giờ học mỗi ngày qua Email
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paperSound}
                  onChange={(e) => setPaperSound(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-ink text-red accent-red cursor-pointer"
                />
                <span className="text-xs font-bold text-ink">
                  Phát âm thanh sột soạt khi lật trang sách và hoàn thành bài
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Nút Đỏ Lưu Cài Đặt */}
        <div className="pt-6 border-t-2 border-ink/20 flex items-center justify-end gap-4">
          <Link
            href="/dashboard"
            className="btn btn-outline text-xs font-black cursor-pointer"
          >
            Hủy thay đổi
          </Link>

          <button
            type="submit"
            className="btn btn-red text-xs font-black shadow-brutal flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4 stroke-[3]" />
            <span>Lưu cài đặt hồ sơ</span>
          </button>
        </div>
      </form>
    </div>
  );
}
