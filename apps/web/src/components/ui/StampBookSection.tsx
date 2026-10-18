'use client';

import React, { useState, useEffect } from 'react';
import { StampSlam } from './StampSlam';
import { LingLing } from './LingLing';
import { api } from '../../lib/api';
import { 
  Sparkles, 
  Award, 
  PenTool, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Clock,
  Flame,
  ArrowRight
} from 'lucide-react';

interface StampHistoryItem {
  id: string;
  delta: number;
  reason: string;
  createdAt: string | Date;
}

export function StampBookSection({ className = '' }: { className?: string }) {
  const [balance, setBalance] = useState<number>(3);
  const [maxCap, setMaxCap] = useState<number>(10);
  const [freeUsedToday, setFreeUsedToday] = useState<boolean>(false);
  const [history, setHistory] = useState<StampHistoryItem[]>([
    { id: 'h1', delta: 1, reason: 'DAILY_GOAL', createdAt: new Date(Date.now() - 3600000 * 24) },
    { id: 'h2', delta: 1, reason: 'PERFECT_SCORE', createdAt: new Date(Date.now() - 3600000 * 12) },
    { id: 'h3', delta: 1, reason: 'DAILY_GOAL', createdAt: new Date(Date.now() - 3600000 * 2) },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [newlyStampedIdx, setNewlyStampedIdx] = useState<number | null>(null);

  // Tải dữ liệu sổ tem từ backend API
  const fetchStampData = async () => {
    try {
      const data = await api.getStamps();
      if (data && typeof data.balance === 'number') {
        setBalance(data.balance);
        setMaxCap(data.maxCap || 10);
        setFreeUsedToday(data.freeWritingUsedToday || false);
        if (Array.isArray(data.history)) {
          setHistory(data.history);
        }
      }
    } catch {
      // Graceful fallback đã có dữ liệu mẫu
    }
  };

  useEffect(() => {
    fetchStampData();
  }, []);

  // Gọi API dán tem khi hoàn thành nhiệm vụ
  const handleAwardStamp = async (reason: 'DAILY_GOAL' | 'PERFECT_SCORE' | 'STREAK_7_DAYS', delta: number) => {
    if (balance >= 10) {
      setMessage({ type: 'error', text: 'Sổ tem đã đầy (tối đa 10 tem). Hãy dùng bớt tem để nhận thêm!' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await api.awardStamp(reason, delta);
      if (res.success) {
        setBalance(res.newBalance);
        setNewlyStampedIdx(res.newBalance - 1);
        setMessage({ type: 'success', text: res.message || `Đã dán thêm +${res.deltaAwarded} tem vào sổ!` });
        setTimeout(() => setNewlyStampedIdx(null), 1500);
      } else {
        setMessage({ type: 'error', text: res.message || 'Không thể dán thêm tem.' });
      }
    } catch {
      // Fallback cục bộ tuân thủ cap 10
      const actualDelta = Math.min(delta, 10 - balance);
      if (actualDelta > 0) {
        const next = balance + actualDelta;
        setBalance(next);
        setNewlyStampedIdx(next - 1);
        setMessage({ type: 'success', text: `Đã dán thêm +${actualDelta} tem vào sổ!` });
        setTimeout(() => setNewlyStampedIdx(null), 1500);
      } else {
        setMessage({ type: 'error', text: 'Sổ tem đã đầy (tối đa 10 tem)!' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Đổi lượt chấm AI Writing (mỗi ngày 1 lượt free, từ lượt 2 tốn 1 tem, hết tem báo "Hết tem, mai quay lại")
  const handleRedeemWriting = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.redeemWritingEvaluation();
      if (res.success) {
        setBalance(res.newBalance);
        setFreeUsedToday(true);
        setMessage({
          type: 'success',
          text: res.isFree
            ? 'Đã sử dụng lượt chấm AI miễn phí trong ngày hôm nay!'
            : 'Đã đổi 1 tem cho 1 lượt chấm AI Writing thành công!',
        });
      } else {
        setMessage({ type: 'error', text: res.message || 'Hết tem, mai quay lại' });
      }
    } catch (err: any) {
      if (!freeUsedToday) {
        setFreeUsedToday(true);
        setMessage({ type: 'success', text: 'Đã sử dụng 1 lượt chấm AI miễn phí trong ngày hôm nay!' });
      } else if (balance >= 1) {
        setBalance((prev) => prev - 1);
        setMessage({ type: 'success', text: 'Đã đổi 1 tem cho lượt chấm AI Writing!' });
      } else {
        setMessage({ type: 'error', text: 'Hết tem, mai quay lại' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="so-tem" className={`bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl space-y-6 text-left relative overflow-hidden ${className}`}>
      {/* Header Sổ Tem phong cách Sổ Tay Cổ Điển */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-ink pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-red border border-ink" />
            <span className="text-[11px] font-mono font-black uppercase tracking-widest text-red">
              HỆ THỐNG GAMIFICATION · SỔ TEM
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-ink font-serif tracking-tight">
            Sổ Tem Học Tập Của Bạn
          </h2>
          <p className="text-xs sm:text-sm text-ink-soft font-sans">
            Hoàn thành nhiệm vụ nhận tem mực đỏ dán vào sổ giấy. Tối đa giữ 10 tem.
          </p>
        </div>

        {/* Số dư tem */}
        <div className="flex items-center gap-3 self-start sm:self-auto bg-paper-2 border-2 border-ink rounded-2xl p-3 shadow-brutal-sm">
          <div className="text-right">
            <span className="text-[10px] font-mono font-black uppercase text-ink-muted block">Số Dư Tem</span>
            <div className="text-2xl font-mono font-black text-red">
              {balance} <span className="text-xs text-ink">/ {maxCap} tem</span>
            </div>
          </div>
          <StampSlam text="SỔ TEM" variant="circle" color="red" size="sm" />
        </div>
      </div>

      {/* Thông báo tương tác */}
      {message && (
        <div
          className={`p-3.5 rounded-xl border-2 border-ink shadow-brutal-sm text-xs font-black flex items-center justify-between gap-3 animate-message-slide ${
            message.type === 'success'
              ? 'bg-teal/15 text-teal border-teal'
              : message.type === 'error'
              ? 'bg-red/10 text-red border-red'
              : 'bg-amber/20 text-ink'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-[11px] underline cursor-pointer hover:opacity-75 flex-shrink-0"
          >
            Đóng
          </button>
        </div>
      )}

      {/* 2. TRANG VỞ CÓ 10 Ô TRỐNG DÁN TEM (THE PAPER STAMP SHEET) */}
      <div className="p-6 bg-[#FAF5EB] border-2 border-ink rounded-2xl shadow-brutal-md space-y-4">
        <div className="flex items-center justify-between border-b border-ink/20 pb-2">
          <span className="text-xs font-mono font-black text-ink uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber" />
            <span>Trang Sổ Tem Chính Quy (10 Ô Quy Chuẩn):</span>
          </span>
          <span className="text-xs font-mono font-bold text-ink-muted">
            {10 - balance} ô còn trống
          </span>
        </div>

        {/* 10 Ô Dán Tem (Grid 5x2) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 sm:gap-4">
          {Array.from({ length: 10 }).map((_, idx) => {
            const isStamped = idx < balance;
            const isJustStamped = idx === newlyStampedIdx;

            return (
              <div
                key={idx}
                className={`h-28 sm:h-32 rounded-2xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all relative select-none ${
                  isStamped
                    ? 'border-ink bg-card shadow-brutal-sm'
                    : 'border-dashed border-ink/35 bg-paper/60 text-ink-muted'
                }`}
              >
                {/* Số thứ tự ô */}
                <span className="absolute top-2 left-2.5 text-[10px] font-mono font-black text-ink-muted/80">
                  #{String(idx + 1).padStart(2, '0')}
                </span>

                {isStamped ? (
                  <div className={`space-y-1 ${isJustStamped ? 'animate-scale-up' : ''}`}>
                    <StampSlam
                      text={idx % 2 === 0 ? 'HOÀN THÀNH' : 'XUẤT SẮC'}
                      subtext="LINGUAL"
                      variant="circle"
                      color={idx % 3 === 0 ? 'red' : 'teal'}
                      size="sm"
                    />
                    <span className="text-[9px] font-mono font-black text-ink block mt-0.5">
                      ✓ Đã Dán Tem
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full border border-dashed border-ink/30 flex items-center justify-center text-ink-muted/60 text-xs">
                      ○
                    </div>
                    <span className="text-[10px] font-sans font-bold text-ink-muted">
                      Ô số {idx + 1} trống
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. KHỐI ĐỔI LƯỢT CHẤM AI WRITING & QUY TẮC SỬ DỤNG TEM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* Đổi lượt chấm AI writing */}
        <div className="p-5 bg-card border-2 border-ink rounded-2xl shadow-brutal-sm space-y-3.5">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-red" />
            <h3 className="text-base font-black text-ink font-serif">
              Đổi Lượt Chấm AI Writing
            </h3>
          </div>
          <p className="text-xs text-ink-soft leading-relaxed font-sans">
            Mỗi ngày bạn được <strong>1 lượt miễn phí</strong>. Từ lượt thứ 2 trở đi, mỗi lượt chấm tốn <strong>1 tem/lượt</strong>.
          </p>

          <div className="flex items-center justify-between p-3 bg-paper-2 rounded-xl border border-ink/20 text-xs font-mono">
            <span className="text-ink-muted font-bold">Lượt free hôm nay:</span>
            <span className={`font-black ${freeUsedToday ? 'text-red' : 'text-teal'}`}>
              {freeUsedToday ? 'Đã dùng (Hôm nay)' : '1 lượt khả dụng ✓'}
            </span>
          </div>

          <button
            onClick={handleRedeemWriting}
            disabled={loading}
            className="w-full btn btn-red text-xs font-black shadow-brutal flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>
              {!freeUsedToday
                ? 'Dùng 1 Lượt Chấm Miễn Phí Hôm Nay →'
                : 'Đổi 1 Tem Lấy 1 Lượt Chấm AI (Trừ 1 Tem) →'}
            </span>
          </button>
        </div>

        {/* Cách kiếm tem (Simulate / Claim buttons kết nối API) */}
        <div className="p-5 bg-card border-2 border-ink rounded-2xl shadow-brutal-sm space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-teal" />
            <h3 className="text-base font-black text-ink font-serif">
              Cách Thu Thập Thêm Tem
            </h3>
          </div>
          <p className="text-xs text-ink-soft leading-relaxed">
            Tem được cộng qua API khi bạn hoàn thành nhiệm vụ thực tế trên hệ thống:
          </p>

          <div className="space-y-2">
            <button
              onClick={() => handleAwardStamp('DAILY_GOAL', 1)}
              disabled={loading || balance >= 10}
              className="w-full p-2.5 rounded-xl border border-ink bg-paper hover:bg-paper-2 flex items-center justify-between text-xs font-bold text-ink cursor-pointer transition-transform active:translate-y-0.5 disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-teal" />
                <span>Hoàn thành mục tiêu học trong ngày</span>
              </div>
              <span className="font-mono font-black text-red bg-red/10 px-2 py-0.5 rounded border border-red/30">
                +1 Tem
              </span>
            </button>

            <button
              onClick={() => handleAwardStamp('PERFECT_SCORE', 1)}
              disabled={loading || balance >= 10}
              className="w-full p-2.5 rounded-xl border border-ink bg-paper hover:bg-paper-2 flex items-center justify-between text-xs font-bold text-ink cursor-pointer transition-transform active:translate-y-0.5 disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-amber" />
                <span>Bài học / quiz đạt điểm tuyệt đối 100%</span>
              </div>
              <span className="font-mono font-black text-red bg-red/10 px-2 py-0.5 rounded border border-red/30">
                +1 Tem
              </span>
            </button>

            <button
              onClick={() => handleAwardStamp('STREAK_7_DAYS', 2)}
              disabled={loading || balance >= 10}
              className="w-full p-2.5 rounded-xl border border-ink bg-paper hover:bg-paper-2 flex items-center justify-between text-xs font-bold text-ink cursor-pointer transition-transform active:translate-y-0.5 disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-red" />
                <span>Duy trì chuỗi học tập liên tiếp 7 ngày</span>
              </div>
              <span className="font-mono font-black text-red bg-red/10 px-2 py-0.5 rounded border border-red/30">
                +2 Tem
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
