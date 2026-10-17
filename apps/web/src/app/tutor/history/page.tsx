'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  History,
  FileText,
  Calendar,
  MessageSquare,
  ArrowRight,
  FolderOpen,
} from 'lucide-react';
import { LingLing } from '../../../components/ui/LingLing';

interface HistoryFile {
  id: string;
  fileCode: string;
  topic: string;
  summary: string;
  date: string;
  messageCount: number;
  keyConcepts: string[];
}

const ARCHIVED_FILES: HistoryFile[] = [
  {
    id: 'arch-1',
    fileCode: 'FILE-LOG-041',
    topic: 'Phân tích thì Hiện tại hoàn thành vs Quá khứ đơn',
    summary: 'Giải thích sự khác biệt giữa hành động vừa xảy ra có kết quả ở hiện tại và hành động đã chấm dứt hoàn toàn trong quá khứ.',
    date: '17/10/2026 14:20',
    messageCount: 8,
    keyConcepts: ['Present Perfect', 'Past Simple', 'Since / For', 'Signal Words'],
  },
  {
    id: 'arch-2',
    fileCode: 'FILE-LOG-040',
    topic: 'Chiến thuật làm bài IELTS Reading Matching Headings',
    summary: 'Cách xác định câu chủ đề (Topic sentence), phân tích ý khái quát của từng đoạn văn thay vì bẫy từ vựng chi tiết.',
    date: '16/10/2026 19:45',
    messageCount: 12,
    keyConcepts: ['Topic Sentence', 'Skimming', 'Distractor Filtering'],
  },
  {
    id: 'arch-3',
    fileCode: 'FILE-LOG-039',
    topic: 'Từ vựng Collocation chủ đề Kinh tế & Môi trường',
    summary: 'Cung cấp 6 cụm từ vựng band 7.0+ như "carbon footprint", "sustainable development", "economic dislocation".',
    date: '15/10/2026 09:10',
    messageCount: 6,
    keyConcepts: ['Academic Collocations', 'Environment Band 7+'],
  },
  {
    id: 'arch-4',
    fileCode: 'FILE-LOG-038',
    topic: 'Mẹo nối âm và biến âm trong Tiếng Anh giao tiếp',
    summary: 'Quy tắc nuốt âm /t/ giữa hai phụ âm và hiện tượng đồng hóa âm trong bài nghe Section 1.',
    date: '14/10/2026 21:00',
    messageCount: 10,
    keyConcepts: ['Elision', 'Assimilation', 'Connected Speech'],
  },
];

export default function TutorHistoryPage() {
  const [selectedFile, setSelectedFile] = useState<HistoryFile | null>(null);

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
        <span className="text-ink">Hồ sơ lịch sử trò chuyện</span>
      </div>

      {/* Header bar */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-teal">
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Kho Lưu Trữ Hồ Sơ</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
            Hồ sơ lưu trữ các cuộc trò chuyện đã qua
          </h1>

          <p className="text-xs sm:text-sm text-ink-soft font-sans">
            Mỗi phiên trao đổi với LingLing đều được lưu trữ cẩn thận như một tập tài liệu tham khảo để bạn ôn lại bất kỳ lúc nào.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/tutor" className="btn btn-red text-xs font-black shadow-brutal">
            Bắt đầu trò chuyện mới →
          </Link>
        </div>
      </div>

      {/* DANH SÁCH NHƯ "HỒ SƠ" GIẤY */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-ink font-sans">
            Các tập hồ sơ gần đây ({ARCHIVED_FILES.length} hồ sơ)
          </h2>
          <span className="text-xs font-mono font-bold text-ink-muted">
            Sắp xếp theo ngày lưu trữ
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ARCHIVED_FILES.map((file) => (
            <div
              key={file.id}
              className="card-paper p-6 space-y-4 bg-card border-2 border-ink shadow-brutal-md hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Hồ Sơ: Mã lưu trữ + Ngày tháng */}
                <div className="flex items-center justify-between border-b-2 border-dashed border-ink/20 pb-2.5">
                  <span className="font-mono text-xs font-black uppercase tracking-wider text-ink-muted">
                    {file.fileCode}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-ink-soft">
                    {file.date}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-ink font-sans leading-snug">
                    {file.topic}
                  </h3>
                  <span className="text-xs font-mono font-bold text-teal block">
                    {file.messageCount} lượt trao đổi
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-ink-soft leading-relaxed font-sans">
                  {file.summary}
                </p>

                {/* Các khái niệm cốt lõi dạng Stamp */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {file.keyConcepts.map((concept, cIdx) => (
                    <span
                      key={cIdx}
                      className="text-[10px] font-mono font-black px-2 py-0.5 rounded border border-ink/30 bg-paper-2 text-ink"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Nút Xem Chi Tiết */}
              <div className="pt-3 border-t-2 border-dashed border-ink/20 flex items-center justify-between">
                <Link
                  href="/tutor"
                  className="text-xs font-black text-red hover:underline inline-flex items-center gap-1.5"
                >
                  <span>Mở lại phiên hỏi đáp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[10px] font-black uppercase text-ink-muted">Đã lưu trữ</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
