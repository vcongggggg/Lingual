'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Headphones,
  CheckCircle2,
  AlertCircle,
  Play,
} from 'lucide-react';
import { LingLing } from '../../../components/ui/LingLing';

export default function ListeningAnalyticsPage() {
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
        <span className="text-ink">Kỹ năng Nghe (Listening)</span>
      </div>

      {/* Header bar Phiếu Báo Điểm Kỹ Năng Nghe */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-red">
            <Headphones className="w-3.5 h-3.5" />
            <span>Phiếu Đánh Giá Chuyên Sâu</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
            Báo cáo chi tiết kỹ năng Nghe (Listening)
          </h1>

          <p className="text-xs sm:text-sm text-ink-soft font-sans">
            Đánh giá khả năng bắt từ khóa (Keywords), nhận diện hiện tượng nối âm và nghe hiểu ý chính qua các bài chép chính tả.
          </p>
        </div>

        <div className="flex flex-col items-center flex-shrink-0">
          <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
            Độ chính xác nghe đạt <span className="text-red">64%</span>!
          </div>
          <LingLing reaction="hands_on_hips" size={105} />
        </div>
      </div>

      {/* 3 Thẻ Chỉ Số Kỹ Năng */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card-paper p-5 bg-card space-y-1">
          <span className="text-[11px] font-black uppercase text-ink-muted block">Điểm kỹ năng</span>
          <div className="text-3xl font-black font-mono text-ink">
            64<span className="text-sm font-bold text-ink-muted">/100</span>
          </div>
          <span className="text-xs font-bold text-amber block">Xu hướng: Cần luyện tập thêm</span>
        </div>

        <div className="card-paper p-5 bg-card space-y-1">
          <span className="text-[11px] font-black uppercase text-ink-muted block">Độ chính xác</span>
          <div className="text-3xl font-black font-mono text-red">
            64%
          </div>
          <span className="text-xs font-bold text-ink-soft block">Qua 15 bài nghe chép chính tả</span>
        </div>

        <div className="card-paper p-5 bg-card space-y-1">
          <span className="text-[11px] font-black uppercase text-ink-muted block">Thời gian rèn luyện</span>
          <div className="text-3xl font-black font-mono text-ink">
            210<span className="text-sm font-bold text-ink-muted"> phút</span>
          </div>
          <span className="text-xs font-bold text-ink-soft block">Trung bình 14 phút/bài</span>
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
            <li>Bắt từ khóa danh từ và động từ chính xác trong các câu thoại ngắn.</li>
            <li>Nhận biết ngữ điệu câu hỏi đảo ngữ và câu hỏi đuôi tương đối tốt.</li>
            <li>Tốc độ gõ chép chính tả đều đặn khi nghe ở tốc độ 1.0x.</li>
          </ul>
        </div>

        {/* Điểm Cần Cải Thiện */}
        <div className="card-paper p-6 bg-paper-2 border-2 border-ink space-y-3 shadow-brutal-sm">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber">
            <AlertCircle className="w-4 h-4" />
            <span>Khuyến nghị rèn luyện thêm:</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm font-bold text-ink list-disc list-inside">
            <li>Chú ý hiện tượng nuốt âm (Elision) và nối âm (Linking sounds).</li>
            <li>Luyện nghe thêm với giọng Anh - Úc (Australian accent).</li>
            <li>Tập trung vào các âm đuôi /s/, /z/, /ed/ khi chép chính tả.</li>
          </ul>
        </div>
      </div>

      {/* Nút Chuyển Tiếp Luyện Tập */}
      <div className="p-6 bg-card border-2 border-ink rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-brutal-md">
        <div>
          <h3 className="text-base font-black text-ink">Sẵn sàng nâng cao điểm số Nghe?</h3>
          <p className="text-xs text-ink-soft">
            Luyện ngay một đoạn băng chép chính tả mới để củng cố phản xạ âm thanh hôm nay.
          </p>
        </div>

        <Link
          href="/listening/practice"
          className="btn btn-red text-xs font-black shadow-brutal flex items-center gap-2 self-start sm:self-auto"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Luyện nghe bài mới ngay →</span>
        </Link>
      </div>
    </div>
  );
}
