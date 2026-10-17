'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  GraduationCap,
  Target,
  Award,
  BookOpen,
  Headphones,
  CheckCircle2,
  Clock,
  Sparkles,
  Play,
  RotateCcw,
} from 'lucide-react';
import { LingLing } from '../../../components/ui/LingLing';

const TOEIC_TARGETS = [
  { score: '450', level: 'Sơ cấp (A2)', desc: 'Giao tiếp công sở cơ bản' },
  { score: '650', level: 'Trung cấp (B1)', desc: 'Chuẩn tốt nghiệp đại học' },
  { score: '750', level: 'Trung cao (B2)', desc: 'Làm việc công ty đa quốc gia' },
  { score: '850', level: 'Cao cấp (C1)', desc: 'Thuyết trình & đàm phán lưu loát' },
  { score: '990', level: 'Xuất sắc', desc: 'Thành thạo gần như người bản xứ' },
];

export default function ToeicHubPage() {
  const [selectedScore, setSelectedScore] = useState('750');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 pb-28 sm:pb-20 text-left">
      {/* Breadcrumb text mực */}
      <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
        <Link
          href="/exam-practice"
          className="hover:text-red transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Trung tâm khảo thí</span>
        </Link>
        <span>/</span>
        <span className="text-ink">Luyện thi TOEIC</span>
      </div>

      {/* Header bar Phiếu Dự Thi TOEIC */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-teal">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Phòng Luyện Thi TOEIC</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight font-sans">
              Luyện thi TOEIC chuẩn định dạng ETS
            </h1>

            <p className="text-xs sm:text-sm text-ink-soft leading-relaxed font-sans">
              Chọn mức điểm mục tiêu của bạn để hệ thống định vị các bộ đề mô phỏng sát thực tế nhất.
            </p>

            {/* BẢNG CHỌN TARGET SCORE DẠNG PHIẾU DỰ THI ĐÓNG DẤU ĐỎ SON */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-ink-muted block">
                Phiếu đăng ký mục tiêu · Chọn mốc điểm mong muốn:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {TOEIC_TARGETS.map((t) => {
                  const isSelected = selectedScore === t.score;
                  return (
                    <button
                      key={t.score}
                      onClick={() => setSelectedScore(t.score)}
                      className={`relative px-4 py-2 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-red text-white border-ink shadow-brutal -translate-y-0.5'
                          : 'bg-paper text-ink border-ink/40 hover:border-ink'
                      }`}
                    >
                      <div className="font-mono text-base font-black">{t.score}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-ink-soft'}`}>
                        {t.level}
                      </div>
                      {isSelected && (
                        <span className="absolute -top-2 -right-2 px-1.5 py-0.2 bg-card text-red border border-ink text-[9px] font-black rounded-full shadow-brutal-sm">
                          ĐÃ CHỌN
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center flex-shrink-0 self-center lg:self-auto">
            <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
              Mục tiêu TOEIC {selectedScore} hoàn toàn khả thi!
            </div>
            <LingLing reaction="greet" size={110} />
          </div>
        </div>
      </div>

      {/* 3 STAT CARDS GIẤY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card-paper p-5 bg-card space-y-1">
          <span className="text-[11px] font-black uppercase text-ink-muted block">Mục tiêu hiện tại</span>
          <div className="text-3xl font-black font-mono text-red">{selectedScore} <span className="text-sm font-bold text-ink-muted">điểm</span></div>
          <span className="text-xs font-bold text-teal block">Mục tiêu bạn đã chọn</span>
        </div>

        <div className="card-paper p-5 bg-card space-y-1">
          <span className="text-[11px] font-black uppercase text-ink-muted block">Trình độ ước tính</span>
          <div className="text-3xl font-black font-mono text-ink">620 <span className="text-sm font-bold text-ink-muted">điểm</span></div>
          <span className="text-xs font-bold text-ink-soft block">Dựa trên 4 bài thi gần nhất</span>
        </div>

        <div className="card-paper p-5 bg-card space-y-1">
          <span className="text-[11px] font-black uppercase text-ink-muted block">Số đề đã rèn luyện</span>
          <div className="text-3xl font-black font-mono text-teal">8 <span className="text-sm font-bold text-ink-muted">bộ đề</span></div>
          <span className="text-xs font-bold text-ink-soft block">Đầy đủ 2 kỹ năng Nghe & Đọc</span>
        </div>
      </div>

      {/* 2 THẺ KỸ NĂNG TOEIC */}
      <div className="space-y-4">
        <h2 className="text-sm sm:text-base font-black text-ink uppercase tracking-wider">
          Phòng thi theo từng phần kỹ năng
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kỹ năng Nghe (Listening) */}
          <div className="card-paper p-6 sm:p-8 bg-card border-2 border-ink rounded-3xl shadow-brutal flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-teal/10 text-teal border border-teal/30">
                  KỸ NĂNG NGHE
                </span>
                <span className="text-xs font-mono font-bold text-ink-muted">100 CÂU · 45 PHÚT</span>
              </div>

              <h3 className="text-xl font-black text-ink">TOEIC Listening (Part 1 - Part 4)</h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                Rèn luyện khả năng bắt từ khóa trong hình ảnh, đối thoại ngắn và bài độc thoại tại công sở.
              </p>
            </div>

            <Link
              href="/exam-practice/toeic/simulation"
              className="btn btn-outline text-xs font-black shadow-brutal flex items-center justify-center gap-2"
            >
              <span>Vào phòng thi Nghe (45p) →</span>
            </Link>
          </div>

          {/* Kỹ năng Đọc (Reading) */}
          <div className="card-paper p-6 sm:p-8 bg-card border-2 border-ink rounded-3xl shadow-brutal flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-red/10 text-red border border-red/30">
                  KỸ NĂNG ĐỌC
                </span>
                <span className="text-xs font-mono font-bold text-ink-muted">100 CÂU · 75 PHÚT</span>
              </div>

              <h3 className="text-xl font-black text-ink">TOEIC Reading (Part 5 - Part 7)</h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                Tối ưu hóa tốc độ làm bài ngữ pháp điền từ, hoàn thành đoạn văn và đọc hiểu chuỗi email đôi/ba.
              </p>
            </div>

            <Link
              href="/exam-practice/toeic/simulation"
              className="btn btn-outline text-xs font-black shadow-brutal flex items-center justify-center gap-2"
            >
              <span>Vào phòng thi Đọc (75p) →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* THI THỬ TOÀN BỘ ĐỀ TOEIC */}
      <div className="card-paper p-6 sm:p-8 bg-card border-2 border-ink rounded-3xl shadow-brutal-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-black text-ink">Sẵn sàng bước vào phòng thi thử toàn bộ?</h3>
          <p className="text-xs text-ink-soft">
            Làm bài thi thử trọn vẹn 200 câu hỏi trong 120 phút với áp lực bấm giờ và tính điểm thực tế.
          </p>
        </div>

        <Link
          href="/exam-practice/toeic/simulation"
          className="btn btn-red text-xs font-black shadow-brutal flex items-center gap-2 self-start sm:self-auto flex-shrink-0"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Bắt đầu thi thử toàn bộ (120p) →</span>
        </Link>
      </div>
    </div>
  );
}
