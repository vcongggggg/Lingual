'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, BookOpen, Search, Compass } from 'lucide-react';
import { LingLing } from '../components/ui/LingLing';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div
      className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 py-12 select-none"
      style={{
        backgroundImage: 'radial-gradient(circle, #211A13 0.6px, transparent 0.6px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="max-w-xl w-full bg-card border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl relative overflow-hidden text-center space-y-6">
        {/* Băng keo dán góc sổ tay (Tape decoration) */}
        <div
          aria-hidden="true"
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-7 bg-amber/50 border border-ink/30 rotate-1 shadow-sm pointer-events-none"
        />

        {/* Con dấu dập nổi thư viện (Library Stamp Badge) */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-paper-2 border-2 border-ink rounded-full text-[11px] font-mono font-black uppercase tracking-wider text-red shadow-brutal-sm">
          <span>PHIẾU THẤT LẠC MỤC LỤC</span>
          <span className="text-ink">•</span>
          <span>MÃ LỖI: #404-KHÔNG-TÌM-THẤY-TRANG</span>
        </div>

        {/* Mã lỗi số lớn kiểu chữ in mộc */}
        <div className="space-y-1">
          <div className="text-6xl sm:text-7xl font-black text-ink font-serif tracking-tight">
            404
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink font-serif tracking-tight">
            Trang Sổ Này Chưa Từng Được Viết
          </h1>
        </div>

        {/* Linh vật Bò sữa LingLing ngơ ngác nhún vai */}
        <div className="flex flex-col items-center justify-center pt-2">
          <LingLing
            reaction="shrug"
            size={135}
            bubbleText="Úi chà! Lật khắp cuốn sổ mà không tìm thấy trang này đâu cả..."
            bubblePosition="top"
          />
        </div>

        {/* Lời giải thích mộc mạc phong cách sổ tay */}
        <p className="text-sm sm:text-base text-ink-soft leading-relaxed font-sans max-w-md mx-auto">
          Có vẻ như trang sổ tay bạn đang tìm kiếm đã bị di dời, đổi tên hoặc chưa từng tồn tại trong giáo trình LinguaFlow. Đừng lo, LingLing sẽ dẫn bạn trở về đúng lộ trình học tập!
        </p>

        {/* Các nút điều hướng hành động */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="red"
              size="lg"
              className="w-full sm:w-auto flex items-center justify-center gap-2 shadow-brutal"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về trang chủ</span>
            </Button>
          </Link>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="white"
              size="lg"
              className="w-full sm:w-auto flex items-center justify-center gap-2 shadow-brutal"
            >
              <Home className="w-4 h-4 text-teal" />
              <span>Bàn học (Dashboard)</span>
            </Button>
          </Link>

          <Link href="/dictionary" className="w-full sm:w-auto">
            <Button
              variant="white"
              size="lg"
              className="w-full sm:w-auto flex items-center justify-center gap-2 shadow-brutal"
            >
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>Từ điển</span>
            </Button>
          </Link>
        </div>

        {/* Dòng ghi chú chân trang phong cách thư viện */}
        <div className="pt-4 border-t-2 border-ink/10 text-[11px] font-mono font-bold text-ink-muted">
          LinguaFlow Library Archive • Hệ thống sổ tay học tiếng Anh tương tác
        </div>
      </div>
    </div>
  );
}
