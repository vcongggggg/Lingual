'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Headphones,
  Sparkles,
  History,
  BarChart2,
} from 'lucide-react';
import { LingLing } from '../../components/ui/LingLing';

const EXAMS = [
  {
    id: 'toeic',
    name: 'TOEIC (Listening & Reading)',
    badge: 'ĐANG MỞ THI THỬ',
    badgeColor: 'bg-teal/15 text-teal border-teal/40',
    targetOptions: ['450+', '650+', '750+', '850+', '990'],
    desc: 'Luyện đề định dạng ETS chuẩn 200 câu với đồng hồ đếm ngược và phân tích đáp án chi tiết.',
    href: '/exam-practice/toeic',
    active: true,
  },
  {
    id: 'ielts',
    name: 'IELTS Academic & General',
    badge: 'TRUNG TÂM HOẠT ĐỘNG',
    badgeColor: 'bg-red/15 text-red border-red/40',
    targetOptions: ['5.5', '6.0', '6.5', '7.0', '7.5+'],
    desc: 'Luyện 4 kỹ năng Đọc 2 cột, Nghe 4 phần, Viết luận có dàn ý và chấm theo quy tắc.',
    href: '/ielts',
    active: true,
  },
  {
    id: 'vstep',
    name: 'VSTEP B1-B2-C1',
    badge: 'SẮP RA MẮT',
    badgeColor: 'bg-paper-2 text-ink-muted border-ink/30',
    targetOptions: ['B1', 'B2', 'C1'],
    desc: 'Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam theo chuẩn Bộ GD&ĐT.',
    href: '/exam-practice/vstep',
    active: false,
  },
  {
    id: 'dsat',
    name: 'Digital SAT',
    badge: 'SẮP RA MẮT',
    badgeColor: 'bg-paper-2 text-ink-muted border-ink/30',
    targetOptions: ['1200+', '1400+', '1550+'],
    desc: 'Đề thi chuẩn hóa xét tuyển đại học quốc tế với dạng bài đọc hiểu thích ứng.',
    href: '/exam-practice/dsat',
    active: false,
  },
  {
    id: 'hsk',
    name: 'HSK Tiếng Trung',
    badge: 'SẮP RA MẮT',
    badgeColor: 'bg-paper-2 text-ink-muted border-ink/30',
    targetOptions: ['HSK 3', 'HSK 4', 'HSK 5'],
    desc: 'Đánh giá năng lực Hán ngữ từ sơ cấp đến nâng cao.',
    href: '/exam-practice/hsk',
    active: false,
  },
  {
    id: 'jlpt',
    name: 'JLPT Tiếng Nhật',
    badge: 'SẮP RA MẮT',
    badgeColor: 'bg-paper-2 text-ink-muted border-ink/30',
    targetOptions: ['N4', 'N3', 'N2'],
    desc: 'Kỳ thi năng lực Nhật ngữ phổ biến nhất thế giới.',
    href: '/exam-practice/jlpt',
    active: false,
  },
];

export default function ExamPracticeHubPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 pb-28 sm:pb-20 text-left">
      {/* Header bar Trung Tâm Khảo Thí */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-red">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Phòng Thi Thử & Chứng Chỉ</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight font-sans">
            Trung tâm khảo thí & luyện thi chứng chỉ
          </h1>

          <p className="text-xs sm:text-sm text-ink-soft leading-relaxed font-sans">
            Chọn kỳ thi mục tiêu của bạn để bước vào phòng thi thử với áp lực thời gian thật và báo cáo điểm số chi tiết.
          </p>
        </div>

        <div className="flex flex-col items-center flex-shrink-0">
          <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
            Tập trung cao độ, <span className="text-red">bước vào phòng thi</span> nào!
          </div>
          <LingLing reaction="coolSerious" size={110} />
        </div>
      </div>

      {/* Action links */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-sm sm:text-base font-black text-ink uppercase tracking-wider">
          Danh sách các kỳ thi chứng chỉ
        </h2>

        <div className="flex items-center gap-2.5">
          <Link
            href="/exam-practice/history"
            className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-teal" />
            <span>Lịch sử bài thi</span>
          </Link>

          <Link
            href="/exam-practice/stats"
            className="btn btn-ink text-xs font-black shadow-brutal flex items-center gap-1.5"
          >
            <BarChart2 className="w-3.5 h-3.5 text-amber" />
            <span>Thống kê điểm</span>
          </Link>
        </div>
      </div>

      {/* Grid Các Kỳ Thi Dạng Phiếu Dự Thi Giấy */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXAMS.map((exam) => (
          <div
            key={exam.id}
            className={`card-paper p-6 rounded-3xl border-2 flex flex-col justify-between space-y-5 transition-all ${
              exam.active
                ? 'bg-card border-ink shadow-brutal-md hover:shadow-brutal-xl hover:-translate-y-0.5'
                : 'bg-paper-2 border-ink/40 opacity-75 shadow-none'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded border ${exam.badgeColor}`}>
                  {exam.badge}
                </span>

                <Award className={`w-4 h-4 ${exam.active ? 'text-red' : 'text-ink-muted'}`} />
              </div>

              <h3 className="text-xl font-black text-ink font-sans tracking-tight">
                {exam.name}
              </h3>

              <p className="text-xs text-ink-soft leading-relaxed">
                {exam.desc}
              </p>

              {/* Mục tiêu điểm */}
              <div className="pt-2">
                <span className="text-[10px] font-black uppercase text-ink-muted tracking-wider block mb-1.5">
                  Các mốc điểm phổ biến:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {exam.targetOptions.map((opt) => (
                    <span
                      key={opt}
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-paper border border-ink/30 text-ink"
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-ink/15">
              <Link
                href={exam.href}
                className={`w-full text-xs font-black shadow-brutal flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-ink transition-all ${
                  exam.active
                    ? 'btn-red'
                    : 'bg-paper text-ink hover:bg-paper-2'
                }`}
              >
                <span>{exam.active ? 'Vào phòng luyện thi →' : 'Xem thông tin kỳ thi'}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
