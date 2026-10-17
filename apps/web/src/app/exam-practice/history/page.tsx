'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  GraduationCap,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { LingLing } from '../../../components/ui/LingLing';

const EXAM_ATTEMPTS = [
  {
    id: 'ATT-904',
    date: '16/10/2026 14:00',
    exam: 'TOEIC Full Test #01',
    duration: '118 phút',
    score: '780 / 990',
    breakdown: 'Nghe: 410 · Đọc: 370',
    status: 'Đã hoàn thành',
  },
  {
    id: 'ATT-903',
    date: '14/10/2026 09:30',
    exam: 'IELTS Academic Mock Test Cam 18',
    duration: '155 phút',
    score: 'Overall Band 6.5',
    breakdown: 'Nghe: 6.5 · Đọc: 7.0 · Viết: 6.0',
    status: 'Đã hoàn thành',
  },
  {
    id: 'ATT-902',
    date: '10/10/2026 19:45',
    exam: 'TOEIC Reading Section #03',
    duration: '72 phút',
    score: '385 / 495',
    breakdown: 'Đúng 78 / 100 câu',
    status: 'Đã hoàn thành',
  },
  {
    id: 'ATT-901',
    date: '06/10/2026 20:00',
    exam: 'TOEIC Listening Section #02',
    duration: '44 phút',
    score: '395 / 495',
    breakdown: 'Đúng 82 / 100 câu',
    status: 'Đã hoàn thành',
  },
];

export default function ExamHistoryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 pb-28 sm:pb-20 text-left">
      <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
        <Link
          href="/exam-practice"
          className="hover:text-red transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Trung tâm khảo thí</span>
        </Link>
        <span>/</span>
        <span className="text-ink">Lịch sử bài thi</span>
      </div>

      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-teal">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Sổ Nhật Ký Thi Thử</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
            Lịch sử các lần thi thử chứng chỉ
          </h1>

          <p className="text-xs sm:text-sm text-ink-soft font-sans">
            Lưu trữ toàn bộ phiếu báo điểm, thời gian làm bài và phân tích năng lực của các kỳ thi TOEIC & IELTS.
          </p>
        </div>

        <div className="flex flex-col items-center flex-shrink-0">
          <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
            Điểm số đang tăng dần đều! Chúc mừng bạn!
          </div>
          <LingLing reaction="trophy" size={100} />
        </div>
      </div>

      {/* 3 Thẻ Chỉ Số */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card-paper p-5 bg-card space-y-1">
          <span className="text-[11px] font-black uppercase text-ink-muted block">Số lần thi thử</span>
          <div className="text-3xl font-black font-mono text-ink">6 <span className="text-sm font-bold text-ink-muted">lần</span></div>
          <span className="text-xs font-bold text-teal block">Cả TOEIC & IELTS</span>
        </div>

        <div className="card-paper p-5 bg-card space-y-1">
          <span className="text-[11px] font-black uppercase text-ink-muted block">Điểm cao nhất</span>
          <div className="text-3xl font-black font-mono text-red">780 / 990</div>
          <span className="text-xs font-bold text-ink-soft block">Bài thi TOEIC Full #01</span>
        </div>

        <div className="card-paper p-5 bg-card space-y-1">
          <span className="text-[11px] font-black uppercase text-ink-muted block">Tổng thời gian thi</span>
          <div className="text-3xl font-black font-mono text-ink">11.5 <span className="text-sm font-bold text-ink-muted">giờ</span></div>
          <span className="text-xs font-bold text-ink-soft block">Thời lượng làm đề thực tế</span>
        </div>
      </div>

      {/* Danh Sách Lượt Thi */}
      <div className="space-y-4">
        <h2 className="text-sm sm:text-base font-black text-ink uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-red" />
          <span>Danh sách các phiếu báo điểm</span>
        </h2>

        <div className="space-y-3">
          {EXAM_ATTEMPTS.map((att) => (
            <div
              key={att.id}
              className="bg-card border-2 border-ink rounded-2xl p-4 sm:p-5 shadow-brutal-sm hover:shadow-brutal transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black text-ink bg-paper-2 px-2 py-0.5 rounded border border-ink/20">
                    {att.date}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-teal/10 text-teal border border-teal/30">
                    {att.status}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-black text-ink font-sans">
                  {att.exam}
                </div>
                <div className="text-xs text-ink-soft flex items-center gap-2">
                  <span>Thời gian làm bài: <strong className="text-ink">{att.duration}</strong></span>
                  <span>·</span>
                  <span>{att.breakdown}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                <div className="text-right">
                  <span className="text-xs text-ink-muted block">Điểm số:</span>
                  <span className="text-xl font-black font-mono text-red">{att.score}</span>
                </div>
                <Link
                  href="/exam-practice/toeic/simulation"
                  className="btn btn-outline text-xs font-black"
                >
                  Xem lại
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
