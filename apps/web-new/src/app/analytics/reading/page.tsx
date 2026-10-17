'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Play,
} from 'lucide-react';
import { LingLing } from '../../../components/ui/LingLing';

export default function ReadingAnalyticsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 pb-28 sm:pb-20 text-left">
      {/* Breadcrumb text mực */}
      <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
        <Link
          href="/analytics"
          className="hover:text-red transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Báo cáo học tập</span>
        </Link>
        <span>/</span>
        <span className="text-ink">Kỹ năng Đọc (Reading)</span>
      </div>

      {/* Header bar Phiếu Báo Điểm Kỹ Năng Đọc */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-teal">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Phiếu Đánh Giá Chuyên Sâu</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
            Báo cáo chi tiết kỹ năng Đọc (Reading)
          </h1>

          <p className="text-xs sm:text-sm text-ink-soft font-sans">
            Đánh giá khả năng quét tìm ý chính (Skimming), quét tìm chi tiết (Scanning) và phân tích ngữ cảnh bài đọc.
          </p>
        </div>

        <div className="flex flex-col items-center flex-shrink-0">
          <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
            Độ chính xác đọc đạt <span className="text-teal">85%</span>!
          </div>
          <LingLing reaction="greet" size={105} />
        </div>
      </div>

      {/* 3 Thẻ Chỉ Số Kỹ Năng */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card-paper p-5 bg-card space-y-1">
          <span className="text-[11px] font-black uppercase text-ink-muted block">Điểm kỹ năng</span>
          <div className="text-3xl font-black font-mono text-ink">
            81<span className="text-sm font-bold text-ink-muted">/100</span>
          </div>
          <span className="text-xs font-bold text-teal block">Xu hướng: Đang tiến bộ</span>
        </div>

        <div className="card-paper p-5 bg-card space-y-1">
          <span className="text-[11px] font-black uppercase text-ink-muted block">Độ chính xác</span>
          <div className="text-3xl font-black font-mono text-teal">
            85%
          </div>
          <span className="text-xs font-bold text-ink-soft block">Qua 12 bài đọc đã làm</span>
        </div>

        <div className="card-paper p-5 bg-card space-y-1">
          <span className="text-[11px] font-black uppercase text-ink-muted block">Thời gian rèn luyện</span>
          <div className="text-3xl font-black font-mono text-ink">
            240<span className="text-sm font-bold text-ink-muted"> phút</span>
          </div>
          <span className="text-xs font-bold text-ink-soft block">Trung bình 20 phút/bài</span>
        </div>
      </div>

      {/* BẢNG PHÂN TÍCH ĐIỂM MẠNH & ĐIỂM CẦN CẢI THIỆN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Điểm Mạnh */}
        <div className="card-paper p-6 bg-paper-2 border-2 border-ink space-y-3 shadow-brutal-sm">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal">
            <CheckCircle2 className="w-4 h-4" />
            <span>Điểm làm tốt:</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm font-bold text-ink list-disc list-inside">
            <li>Nắm bắt rất tốt câu chủ đề của từng đoạn văn ngắn.</li>
            <li>Độ chính xác dạng bài True/False/Not Given đạt 90%.</li>
            <li>Vốn từ vựng Academic Word List nhận diện nhanh trong ngữ cảnh.</li>
          </ul>
        </div>

        {/* Điểm Cần Cải Thiện */}
        <div className="card-paper p-6 bg-paper-2 border-2 border-ink space-y-3 shadow-brutal-sm">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber">
            <AlertCircle className="w-4 h-4" />
            <span>Khuyến nghị rèn luyện thêm:</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm font-bold text-ink list-disc list-inside">
            <li>Dạng bài nối tiêu đề (Matching Headings) cần đọc bao quát hơn.</li>
            <li>Cải thiện tốc độ đọc đối với các bài luận khoa học dài trên 800 từ.</li>
            <li>Chú ý các từ bẫy phủ định ngầm như "rarely", "seldom".</li>
          </ul>
        </div>
      </div>

      {/* Nút Chuyển Tiếp Luyện Tập */}
      <div className="p-6 bg-card border-2 border-ink rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-brutal-md">
        <div>
          <h3 className="text-base font-black text-ink">Sẵn sàng nâng cao điểm số Đọc?</h3>
          <p className="text-xs text-ink-soft">
            Luyện ngay một bài báo mới để cải thiện tốc độ quét ý chính hôm nay.
          </p>
        </div>

        <Link
          href="/reading/practice"
          className="btn btn-red text-xs font-black shadow-brutal flex items-center gap-2 self-start sm:self-auto"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Luyện đọc bài mới ngay →</span>
        </Link>
      </div>
    </div>
  );
}
