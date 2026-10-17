'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-paper mt-24 py-12 text-sm text-ink-soft">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Cột 1: Giới thiệu */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 font-black text-xl text-ink">
              <span className="w-7 h-7 bg-red text-white border-2 border-ink rounded-lg flex items-center justify-center text-sm shadow-brutal-sm">
                L
              </span>
              <span>Lingual</span>
            </div>
            <p className="text-xs sm:text-sm text-ink-soft max-w-md leading-relaxed">
              Nền tảng học tiếng Anh theo phương pháp sổ tay ôn tập thông minh,
              giúp người học xây dựng thói quen kiên trì mỗi ngày mà không bị xao nhãng bởi quảng cáo hay giao diện công nghệ lạnh lẽo.
            </p>
          </div>

          {/* Cột 2: Các phân hệ học */}
          <div className="space-y-2">
            <h5 className="font-black text-xs uppercase tracking-wider text-ink mb-3">5 Kỹ Năng Cốt Lõi</h5>
            <ul className="space-y-1.5 text-xs font-bold">
              <li><Link href="/vocabulary" className="hover:text-red transition-colors">Từ vựng (Vocabulary)</Link></li>
              <li><Link href="/listening" className="hover:text-red transition-colors">Luyện nghe (Listening)</Link></li>
              <li><Link href="/speaking" className="hover:text-red transition-colors">Luyện nói (Speaking)</Link></li>
              <li><Link href="/reading" className="hover:text-red transition-colors">Đọc hiểu (Reading)</Link></li>
              <li><Link href="/writing" className="hover:text-red transition-colors">Luyện viết (Writing)</Link></li>
            </ul>
          </div>

          {/* Cột 3: Công cụ & Luyện thi */}
          <div className="space-y-2">
            <h5 className="font-black text-xs uppercase tracking-wider text-ink mb-3">Công Cụ & Ôn Luyện</h5>
            <ul className="space-y-1.5 text-xs font-bold">
              <li><Link href="/srs" className="hover:text-red transition-colors">Thẻ ghi nhớ thông minh</Link></li>
              <li><Link href="/ielts" className="hover:text-red transition-colors">Phòng Luyện Thi IELTS</Link></li>
              <li><Link href="/games" className="hover:text-red transition-colors">Trò chơi tốc độ</Link></li>
              <li><Link href="/dictionary" className="hover:text-red transition-colors">Từ Điển Anh - Việt</Link></li>
              <li><Link href="/tutor" className="hover:text-red transition-colors">Trợ Lý Sổ Tay LingLing</Link></li>
            </ul>
          </div>
        </div>

        {/* Hàng đáy */}
        <div className="pt-6 border-t-2 border-ink/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-ink-soft">
          <div>
            <b className="text-ink">Lingual</b> — Học tiếng Anh mỗi ngày, nhớ lâu thật sự.
          </div>
          <div>Thiết kế "Sổ tay giấy" độc bản · Lingual 2026</div>
        </div>
      </div>
    </footer>
  );
}
