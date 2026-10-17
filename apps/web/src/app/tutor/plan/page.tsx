'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  Headphones,
  FileText,
  Volume2,
  RotateCw,
} from 'lucide-react';
import { LingLing } from '../../../components/ui/LingLing';

interface TimetableDay {
  dayName: string;
  dayDate: string;
  focusSkill: string;
  taskTitle: string;
  durationMins: number;
  status: 'completed' | 'today' | 'upcoming';
  icon: any;
  notes: string;
}

const WEEKLY_TIMETABLE: TimetableDay[] = [
  {
    dayName: 'Thứ Hai',
    dayDate: '12/10',
    focusSkill: 'Từ vựng (Vocabulary)',
    taskTitle: 'Ôn tập 20 thẻ từ vựng chủ đề Giáo dục & Sự nghiệp',
    durationMins: 15,
    status: 'completed',
    icon: BookOpen,
    notes: 'Đã hoàn thành xuất sắc 20 thẻ, độ chính xác 90%.',
  },
  {
    dayName: 'Thứ Ba',
    dayDate: '13/10',
    focusSkill: 'Luyện nghe (Listening)',
    taskTitle: 'Chép chính tả đoạn hội thoại Sân bay quốc tế (A2)',
    durationMins: 20,
    status: 'completed',
    icon: Headphones,
    notes: 'Luyện nghe 3 lần, chú ý nối âm các phụ âm cuối.',
  },
  {
    dayName: 'Thứ Tư',
    dayDate: '14/10',
    focusSkill: 'Luyện đọc (Reading)',
    taskTitle: 'Đọc bài báo "Trí tuệ nhân tạo thay đổi việc làm" + Quiz',
    durationMins: 25,
    status: 'completed',
    icon: BookOpen,
    notes: 'Đạt 4/5 câu đúng trắc nghiệm đọc hiểu.',
  },
  {
    dayName: 'Thứ Năm',
    dayDate: '15/10',
    focusSkill: 'Luyện nói (Speaking)',
    taskTitle: 'Nhại giọng ngữ điệu bài thuyết trình ngắn (Shadowing)',
    durationMins: 15,
    status: 'completed',
    icon: Volume2,
    notes: 'Điểm phát âm và ngữ điệu đạt 82/100.',
  },
  {
    dayName: 'Thứ Sáu',
    dayDate: '16/10',
    focusSkill: 'Luyện viết (Writing)',
    taskTitle: 'Viết bài luận ngắn 4 đoạn về Lợi ích của việc đọc sách',
    durationMins: 30,
    status: 'completed',
    icon: FileText,
    notes: 'Đáp ứng 210 từ, từ vựng phong phú.',
  },
  {
    dayName: 'Thứ Bảy',
    dayDate: '17/10',
    focusSkill: 'Thi thử (Mock Test)',
    taskTitle: 'Làm bài thi thử 2 kỹ năng Reading & Listening 30 phút',
    durationMins: 30,
    status: 'today',
    icon: Clock,
    notes: 'Nhiệm vụ trọng tâm hôm nay! Chuẩn bị không gian yên tĩnh.',
  },
  {
    dayName: 'Chủ Nhật',
    dayDate: '18/10',
    focusSkill: 'Tổng kết & Nghỉ ngơi',
    taskTitle: 'Điểm lại các từ khó trong tuần và thư giãn nhẹ nhàng',
    durationMins: 15,
    status: 'upcoming',
    icon: Calendar,
    notes: 'Xem lại phiếu báo điểm học tập tuần.',
  },
];

export default function TutorPlanPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 pb-28 sm:pb-20 text-left">
      {/* Breadcrumb text mực */}
      <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
        <Link
          href="/tutor"
          className="hover:text-red transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Trợ lý LingLing</span>
        </Link>
        <span>/</span>
        <span className="text-ink">Thời khóa biểu thích ứng</span>
      </div>

      {/* Header Thời Khóa Biểu Giấy */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-amber">
            <Calendar className="w-3.5 h-3.5" />
            <span>Thời Khóa Biểu Tuần</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
            Kế hoạch rèn luyện được điều chỉnh theo tiến độ
          </h1>

          <p className="text-xs sm:text-sm text-ink-soft font-sans">
            LingLing tự động cân đối thời lượng học tập mỗi ngày dựa trên điểm mạnh và điểm cần cải thiện của bạn.
          </p>
        </div>

        <div className="flex flex-col items-center flex-shrink-0">
          <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
            Tập trung học sâu, <span className="text-teal">nghỉ ngơi hợp lý</span> nhé!
          </div>
          <LingLing reaction="meditate" size={105} />
        </div>
      </div>

      {/* THỜI KHÓA BIỂU GIẤY KẺ (WEEKLY TIMETABLE SHEET) */}
      <div className="card-paper p-6 sm:p-8 space-y-6 bg-paper shadow-brutal-xl">
        <div className="flex items-center justify-between border-b-2 border-ink/20 pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-ink-muted block">
              Bảng phân bổ thời gian học tuần
            </span>
            <h2 className="text-xl font-black text-ink font-sans">
              Thời khóa biểu tuần hiện tại (12/10 – 18/10)
            </h2>
          </div>

          <span className="font-mono text-xs font-black px-3 py-1 rounded-full border border-ink bg-card text-teal">
            Đã hoàn thành 5/7 ngày
          </span>
        </div>

        {/* Danh Sách Các Ngày Trong Tuần */}
        <div className="space-y-4">
          {WEEKLY_TIMETABLE.map((day, idx) => {
            const Icon = day.icon;
            const isCompleted = day.status === 'completed';
            const isToday = day.status === 'today';
            const isUpcoming = day.status === 'upcoming';

            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isToday
                    ? 'border-4 border-ink bg-amber/10 shadow-brutal-md'
                    : isCompleted
                    ? 'border-ink/40 bg-card'
                    : 'border-ink/20 bg-paper-2 opacity-80'
                }`}
              >
                {/* Cột Trái: Thứ, Ngày, Icon */}
                <div className="flex items-center gap-4">
                  <div className="w-14 text-center border-r-2 border-ink/15 pr-3 flex-shrink-0">
                    <span className="text-xs font-black text-ink block font-sans">
                      {day.dayName}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-ink-muted block">
                      {day.dayDate}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl border border-ink bg-paper-2 flex items-center justify-center text-ink shadow-brutal-sm flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-teal block">
                      {day.focusSkill}
                    </span>
                    <h3 className="text-base font-black text-ink font-sans">
                      {day.taskTitle}
                    </h3>
                    <p className="text-xs text-ink-soft italic font-serif">
                      {day.notes}
                    </p>
                  </div>
                </div>

                {/* Cột Phải: Thời lượng + Stamp Trạng thái */}
                <div className="flex items-center gap-3 self-end md:self-auto flex-shrink-0">
                  <span className="font-mono text-xs font-bold text-ink-muted">
                    {day.durationMins} phút
                  </span>

                  {isCompleted && (
                    <span className="px-3 py-1 rounded-full border-2 border-teal bg-teal/10 text-teal text-xs font-black uppercase tracking-wider inline-flex items-center gap-1 shadow-brutal-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đã học</span>
                    </span>
                  )}

                  {isToday && (
                    <Link
                      href="/ielts/mock-test"
                      className="btn btn-red text-xs font-black shadow-brutal px-3.5 py-1.5"
                    >
                      Bắt đầu làm bài →
                    </Link>
                  )}

                  {isUpcoming && (
                    <span className="px-2.5 py-1 rounded-full border border-ink/30 text-ink-muted text-xs font-black uppercase tracking-wider">
                      Sắp tới
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
