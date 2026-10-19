'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { LingLing } from '../../../components/ui/LingLing';

const READING_LOGS = [
  {
    id: 'RD-018',
    date: '17/10/2026 14:15',
    title: 'The Psychological Power of Deep Reading in a Digital World',
    category: 'Tâm lý & Lối sống',
    level: 'B2',
    wordsRead: 720,
    accuracy: '90%',
    readingSpeed: '190 wpm',
  },
  {
    id: 'RD-017',
    date: '16/10/2026 11:30',
    title: 'Sustainable Urban Architecture: Building the Cities of Tomorrow',
    category: 'Môi trường & Công nghệ',
    level: 'B1',
    wordsRead: 580,
    accuracy: '85%',
    readingSpeed: '180 wpm',
  },
  {
    id: 'RD-016',
    date: '15/10/2026 16:45',
    title: 'The Evolution of Coffee Culture and Global Trade Networks',
    category: 'Kinh tế & Văn hóa',
    level: 'B2',
    wordsRead: 640,
    accuracy: '95%',
    readingSpeed: '195 wpm',
  },
  {
    id: 'RD-015',
    date: '13/10/2026 09:20',
    title: 'How Daily Routine Impacts Long-term Mental Well-being',
    category: 'Đời sống & Sức khỏe',
    level: 'A2',
    wordsRead: 450,
    accuracy: '100%',
    readingSpeed: '175 wpm',
  },
];

export default function ReadingHistoryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 pb-28 sm:pb-20 text-left">
      <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
        <Link
          href="/reading"
          className="hover:text-red transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Thư Viện Bài Đọc</span>
        </Link>
        <span>/</span>
        <span className="text-ink">Lịch sử bài đọc</span>
      </div>

      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-teal">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sổ Nhật Ký Đọc Báo</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
            Lịch sử các bài đọc đã hoàn thành
          </h1>

          <p className="text-xs sm:text-sm text-ink-soft font-sans">
            Thống kê khối lượng đọc hiểu, tốc độ đọc và độ chính xác câu hỏi trắc nghiệm qua từng ngày rèn luyện.
          </p>
        </div>

        <div className="flex flex-col items-center flex-shrink-0">
          <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
            Đã đọc hơn 14.000 từ vựng!
          </div>
          <LingLing reaction="greet" size={100} />
        </div>
      </div>

      {/* 3 Thẻ Chỉ Số */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card-paper p-5 bg-card space-y-1">
          <span className="text-[11px] font-black uppercase text-ink-muted block">Tổng bài đã đọc</span>
          <div className="text-3xl font-black font-mono text-ink">18 <span className="text-sm font-bold text-ink-muted">bài</span></div>
          <span className="text-xs font-bold text-teal block">Qua 4 chủ đề lớn</span>
        </div>

        <div className="card-paper p-5 bg-card space-y-1">
          <span className="text-[11px] font-black uppercase text-ink-muted block">Khối lượng từ ngữ</span>
          <div className="text-3xl font-black font-mono text-teal">14,200 <span className="text-sm font-bold text-ink-muted">từ</span></div>
          <span className="text-xs font-bold text-ink-soft block">Vốn từ học thuật</span>
        </div>

        <div className="card-paper p-5 bg-card space-y-1">
          <span className="text-[11px] font-black uppercase text-ink-muted block">Tốc độ đọc trung bình</span>
          <div className="text-3xl font-black font-mono text-ink">185 <span className="text-sm font-bold text-ink-muted">wpm</span></div>
          <span className="text-xs font-bold text-ink-soft block">Từ mỗi phút (chuẩn B2)</span>
        </div>
      </div>

      {/* Danh Sách Các Bài Đọc */}
      <div className="space-y-4">
        <h2 className="text-sm sm:text-base font-black text-ink uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-red" />
          <span>Danh sách bài đọc gần đây</span>
        </h2>

        <div className="space-y-3">
          {READING_LOGS.map((log) => (
            <div
              key={log.id}
              className="bg-card border-2 border-ink rounded-2xl p-4 sm:p-5 shadow-brutal-sm hover:shadow-brutal transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black text-ink bg-paper-2 px-2 py-0.5 rounded border border-ink/20">
                    {log.date}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-teal/10 text-teal border border-teal/30">
                    {log.category}
                  </span>
                  <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded border border-ink/40 bg-card text-ink">
                    Bậc {log.level}
                  </span>
                </div>
                <div className="text-sm font-black text-ink">
                  {log.title}
                </div>
                <div className="text-xs text-ink-soft flex items-center gap-2">
                  <span>Khối lượng: <strong className="text-ink">{log.wordsRead} từ</strong></span>
                  <span>·</span>
                  <span>Tốc độ: <strong className="text-ink">{log.readingSpeed}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                <div className="text-right">
                  <span className="text-xs text-ink-muted block">Độ chính xác:</span>
                  <span className="text-lg font-black font-mono text-teal">{log.accuracy}</span>
                </div>
                <Link
                  href="/reading/practice"
                  className="btn btn-outline text-xs font-black"
                >
                  Đọc lại
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
