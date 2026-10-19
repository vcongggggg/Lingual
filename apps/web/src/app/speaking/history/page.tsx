'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Mic,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  Play,
} from 'lucide-react';
import { LingLing } from '../../../components/ui/LingLing';

const SPEAKING_LOGS = [
  {
    id: 'SPK-012',
    date: '17/10/2026 15:30',
    mode: 'Lặp lại câu (Repetition)',
    topic: 'Chào hỏi & Giới thiệu bản thân',
    accuracy: '92%',
    duration: '2 phút 15 giây',
    status: 'Tốt',
  },
  {
    id: 'SPK-011',
    date: '16/10/2026 20:10',
    mode: 'Miêu tả tranh (Picture)',
    topic: 'Quán cà phê buổi sáng',
    accuracy: '85%',
    duration: '45 giây',
    status: 'Đạt',
  },
  {
    id: 'SPK-010',
    date: '15/10/2026 19:40',
    mode: 'Hội thoại tình huống (Situation)',
    topic: 'Nhận phòng tại khách sạn',
    accuracy: '90%',
    duration: '3 phút 10 giây',
    status: 'Tốt',
  },
  {
    id: 'SPK-009',
    date: '14/10/2026 18:20',
    mode: 'Nói tự do (Free Talk)',
    topic: 'Cách thư giãn sau ngày bận rộn',
    accuracy: '88%',
    duration: '1 phút 00 giây',
    status: 'Tốt',
  },
];

export default function SpeakingHistoryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 pb-28 sm:pb-20 text-left">
      <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
        <Link
          href="/speaking"
          className="hover:text-red transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Phòng Luyện Nói</span>
        </Link>
        <span>/</span>
        <span className="text-ink">Lịch sử luyện nói</span>
      </div>

      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-red">
            <Mic className="w-3.5 h-3.5" />
            <span>Sổ Nhật Ký Luyện Nói</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
            Lịch sử các phiên luyện nói
          </h1>

          <p className="text-xs sm:text-sm text-ink-soft font-sans">
            Theo dõi chi tiết các lượt phát âm, miêu tả tranh và hội thoại thực tế của bạn qua từng ngày.
          </p>
        </div>

        <div className="flex flex-col items-center flex-shrink-0">
          <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
            Bạn đã hoàn thành 24 bài nói!
          </div>
          <LingLing reaction="greet" size={100} />
        </div>
      </div>

      {/* 3 Thẻ Chỉ Số */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card-paper p-5 bg-card space-y-1">
          <span className="text-[11px] font-black uppercase text-ink-muted block">Tổng lượt luyện nói</span>
          <div className="text-3xl font-black font-mono text-ink">24 <span className="text-sm font-bold text-ink-muted">phiên</span></div>
          <span className="text-xs font-bold text-teal block">Duy trì đều đặn</span>
        </div>

        <div className="card-paper p-5 bg-card space-y-1">
          <span className="text-[11px] font-black uppercase text-ink-muted block">Độ khớp trung bình</span>
          <div className="text-3xl font-black font-mono text-teal">88%</div>
          <span className="text-xs font-bold text-ink-soft block">Trọng âm & ngữ điệu tốt</span>
        </div>

        <div className="card-paper p-5 bg-card space-y-1">
          <span className="text-[11px] font-black uppercase text-ink-muted block">Thời gian phát âm</span>
          <div className="text-3xl font-black font-mono text-ink">48 <span className="text-sm font-bold text-ink-muted">phút</span></div>
          <span className="text-xs font-bold text-ink-soft block">Tích lũy toàn hệ thống</span>
        </div>
      </div>

      {/* Danh Sách Các Phiên Nói */}
      <div className="space-y-4">
        <h2 className="text-sm sm:text-base font-black text-ink uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-red" />
          <span>Danh sách các bài rèn luyện gần đây</span>
        </h2>

        <div className="space-y-3">
          {SPEAKING_LOGS.map((log) => (
            <div
              key={log.id}
              className="bg-card border-2 border-ink rounded-2xl p-4 sm:p-5 shadow-brutal-sm hover:shadow-brutal transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black text-ink bg-paper-2 px-2 py-0.5 rounded border border-ink/20">
                    {log.date}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red/10 text-red border border-red/30">
                    {log.mode}
                  </span>
                </div>
                <div className="text-sm font-black text-ink">
                  Chủ đề: {log.topic}
                </div>
                <div className="text-xs text-ink-soft">
                  Thời lượng nói: <strong className="text-ink">{log.duration}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                <div className="text-right">
                  <span className="text-xs text-ink-muted block">Độ khớp âm:</span>
                  <span className="text-lg font-black font-mono text-teal">{log.accuracy}</span>
                </div>
                <Link
                  href="/speaking/practice"
                  className="btn btn-outline text-xs font-black"
                >
                  Luyện lại
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
