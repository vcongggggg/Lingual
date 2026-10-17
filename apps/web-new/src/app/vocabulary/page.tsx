'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LingLing } from '../../components/ui/LingLing';
import { 
  BookOpen, 
  Search, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  CheckCircle2, 
  Bookmark,
  GraduationCap
} from 'lucide-react';

interface ChapterLevel {
  id: string;
  levelCode: string;
  chapterRoman: string;
  chapterTitle: string;
  wordsCount: number;
  lessonsCount: number;
  description: string;
  colorScheme: string;
  badgeText: string;
  sampleWords: string[];
}

const CHAPTERS: ChapterLevel[] = [
  {
    id: 'a1',
    levelCode: 'A1',
    chapterRoman: 'Chương I',
    chapterTitle: 'Nền Tảng Căn Bản',
    wordsCount: 500,
    lessonsCount: 4,
    description: 'Từ vựng cốt lõi về bản thân, gia đình, chào hỏi, đồ vật xung quanh và các thì căn bản.',
    colorScheme: 'from-amber/20 to-paper-2',
    badgeText: 'Mới bắt đầu',
    sampleWords: ['apple', 'morning', 'water', 'family', 'happy'],
  },
  {
    id: 'a2',
    levelCode: 'A2',
    chapterRoman: 'Chương II',
    chapterTitle: 'Giao Tiếp Hằng Ngày',
    wordsCount: 800,
    lessonsCount: 6,
    description: 'Mua sắm, hỏi đường, đặt vé tàu xe, miêu tả sở thích cá nhân và kể lại một chuyến đi ngắn.',
    colorScheme: 'from-teal/15 to-paper-2',
    badgeText: 'Sơ cấp vững vàng',
    sampleWords: ['journey', 'weather', 'recipe', 'schedule', 'luggage'],
  },
  {
    id: 'b1',
    levelCode: 'B1',
    chapterRoman: 'Chương III',
    chapterTitle: 'Độc Lập Ngôn Ngữ',
    wordsCount: 1200,
    lessonsCount: 8,
    description: 'Trình bày quan điểm cá nhân, xử lý tình huống du lịch và diễn đạt cảm xúc, hy vọng, ước mơ.',
    colorScheme: 'from-amber/30 to-paper-2',
    badgeText: 'Trung cấp',
    sampleWords: ['perseverance', 'attitude', 'challenge', 'solution', 'community'],
  },
  {
    id: 'b2',
    levelCode: 'B2',
    chapterRoman: 'Chương IV',
    chapterTitle: 'Lưu Loát & Học Thuật',
    wordsCount: 1500,
    lessonsCount: 10,
    description: 'Thảo luận chuyên sâu về môi trường, kinh tế, công nghệ và bài tập viết luận phức tạp.',
    colorScheme: 'from-red/15 to-paper-2',
    badgeText: 'Trung cấp trên',
    sampleWords: ['inevitable', 'significant', 'subsequent', 'hypothesis', 'collaborate'],
  },
  {
    id: 'c1',
    levelCode: 'C1',
    chapterRoman: 'Chương V',
    chapterTitle: 'Tinh Tế & Chuyên Gia',
    wordsCount: 2000,
    lessonsCount: 12,
    description: 'Cấu trúc thành ngữ hiếm, từ ngữ giàu hình tượng văn học, bài báo học thuật và diễn ngôn cấp cao.',
    colorScheme: 'from-teal/25 to-card',
    badgeText: 'Cao cấp',
    sampleWords: ['ubiquitous', 'resilience', 'paradigm', 'ephemeral', 'eloquent'],
  },
  {
    id: 'c2',
    levelCode: 'C2',
    chapterRoman: 'Chương VI',
    chapterTitle: 'Bản Xứ Điêu Luyện',
    wordsCount: 2500,
    lessonsCount: 14,
    description: 'Hiểu trọn vẹn mọi sắc thái văn hóa, châm biếm, ẩn dụ và sự tinh vi của tiếng Anh bản xứ.',
    colorScheme: 'from-ink/10 to-paper-2',
    badgeText: 'Bậc thầy',
    sampleWords: ['serendipity', 'meticulous', 'vicissitude', 'quintessential', 'juxtapose'],
  },
];

const TABS = [
  { id: 'cefr', label: 'Theo Bậc CEFR (A1–C2)' },
  { id: 'cert', label: 'Chứng chỉ (IELTS / TOEIC)' },
  { id: 'topic', label: 'Chủ đề thông dụng' },
  { id: 'personal', label: 'Sổ từ vựng cá nhân' },
];

export default function VocabularyHubPage() {
  const [activeTab, setActiveTab] = useState('cefr');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChapters = CHAPTERS.filter((chap) => {
    return (
      chap.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chap.levelCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chap.sampleWords.some((w) => w.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 text-left pb-28 sm:pb-20">
      {/* Hero Section phong cách sổ tay */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-teal">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Kho Từ Vựng Cốt Lõi · Vocabulary Lab</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight">
              Tích lũy từ vựng như từng trang sách quý
            </h1>

            <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
              Mỗi cấp độ CEFR được biên soạn như một <b>chương sách riêng biệt</b>, kết hợp cùng <b>lịch ôn thông minh</b> giúp bạn nhớ từ vựng vĩnh viễn vào trí nhớ dài hạn.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/vocabulary/practice" className="btn btn-red text-sm font-black shadow-brutal">
                Học thẻ từ hôm nay (10 thẻ) →
              </Link>
              <span className="text-xs font-extrabold text-ink-soft">
                8.500+ từ vựng có ví dụ song ngữ & IPA
              </span>
            </div>
          </div>

          {/* Linh vật LingLing cầm thẻ flashcard */}
          <div className="hidden lg:flex flex-col items-center relative flex-shrink-0">
            <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
              Mỗi ngày <span className="text-red">10 thẻ thư viện</span>, không bao giờ quên!
            </div>
            <LingLing reaction="greet" size={135} />
          </div>
        </div>
      </div>

      {/* Tabs dạng Tab Giấy (Paper Tabs) */}
      <div className="space-y-4">
        <div className="w-full flex items-center gap-2 border-b-2 border-ink pb-2 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-xl border-2 border-b-0 border-ink font-black text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-card text-ink shadow-brutal-sm -translate-y-1'
                  : 'bg-paper-2 text-ink-muted hover:bg-paper'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Ô tìm kiếm từ vựng */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm theo cấp độ, từ vựng, tên chương..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border-2 border-ink rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-red shadow-brutal-sm"
          />
        </div>
      </div>

      {/* Lưới Thẻ Cấp Độ A1–C2 Vẽ Như "Chương Sách" */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChapters.map((chap) => (
          <div
            key={chap.id}
            className="card-paper p-6 sm:p-7 flex flex-col justify-between hover:-translate-y-1 transition-all relative overflow-hidden group bg-card"
          >
            <div className="space-y-4">
              {/* Header chương sách: Chữ cái Serif to + Số La Mã */}
              <div className="flex items-start justify-between border-b-2 border-ink/15 pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-ink-muted block">
                    {chap.chapterRoman}
                  </span>
                  <h3 className="text-2xl font-black text-ink group-hover:text-red transition-colors">
                    {chap.chapterTitle}
                  </h3>
                </div>

                {/* Chữ cái Serif TO như trang đầu chương sách */}
                <span className="font-serif text-5xl font-black text-ink/80 select-none tracking-tight">
                  {chap.levelCode}
                </span>
              </div>

              {/* Minh họa đóng khung viền mực nhẹ */}
              <div className={`p-4 bg-gradient-to-br ${chap.colorScheme} border-2 border-ink rounded-xl shadow-brutal-sm space-y-2`}>
                <div className="flex items-center justify-between text-xs font-black text-ink">
                  <span>{chap.wordsCount} từ cốt lõi</span>
                  <span className="px-2 py-0.5 bg-card border border-ink rounded-md text-[10px]">
                    {chap.lessonsCount} bài học
                  </span>
                </div>
                {/* Sample words chip */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {chap.sampleWords.map((w) => (
                    <span key={w} className="text-[11px] font-mono font-bold bg-card/80 border border-ink/40 px-1.5 py-0.5 rounded text-ink">
                      {w}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mô tả chương sách */}
              <p className="text-xs text-ink-soft leading-relaxed font-medium">
                {chap.description}
              </p>
            </div>

            {/* Link Đỏ Son: "Vào học ngay →" */}
            <div className="pt-4 mt-4 border-t border-ink/15 flex items-center justify-between">
              <span className="stamp-badge w-9 h-9 text-[10px] font-black border-2 border-teal text-teal bg-card">
                {chap.levelCode}
              </span>

              <Link
                href="/vocabulary/practice"
                className="text-sm font-black text-red hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                Vào học ngay →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
