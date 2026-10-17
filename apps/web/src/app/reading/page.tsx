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
  Clock, 
  FileText, 
  Newspaper, 
  ArrowRight,
  Bookmark,
  Sparkles
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  vietnameseTitle: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  topic: string;
  readTime: string;
  wordCount: number;
  excerpt: string;
  date: string;
}

const ARTICLES: Article[] = [
  {
    id: 'morning-coffee',
    title: 'The Art of the Morning Coffee: How a Simple Habit Ignites Focus',
    vietnameseTitle: 'Nghệ thuật thưởng thức cà phê sáng: Thói quen kích hoạt sự tập trung',
    level: 'A2',
    topic: 'Đời sống',
    readTime: '2 phút',
    wordCount: 165,
    excerpt: 'For millions worldwide, the scent of freshly ground beans is more than a beverage; it is a mindful transition into the challenges of the morning.',
    date: '17 Th10, 2026',
  },
  {
    id: 'eco-architecture',
    title: 'Green Horizons: How Bamboo Architecture is Reshaping Modern Cities',
    vietnameseTitle: 'Chân trời xanh: Kiến trúc tre tái định hình thành phố hiện đại',
    level: 'B1',
    topic: 'Khoa học & Môi trường',
    readTime: '3 phút',
    wordCount: 240,
    excerpt: 'Bamboo grows four times faster than standard timber and sequesters enormous volumes of carbon dioxide, offering a sustainable building alternative.',
    date: '16 Th10, 2026',
  },
  {
    id: 'deep-work',
    title: 'The Solitude of Deep Work: Reclaiming Attention in a Distracted Age',
    vietnameseTitle: 'Sự tĩnh lặng của công việc sâu: Giành lại sự tập trung trong kỷ nguyên số',
    level: 'B2',
    topic: 'Tư duy & Kỹ năng',
    readTime: '4 phút',
    wordCount: 320,
    excerpt: 'Deep work is the ability to focus without distraction on a cognitively demanding task. It is a superpower in our modern knowledge economy.',
    date: '15 Th10, 2026',
  },
  {
    id: 'vietnam-heritage',
    title: 'Ancient Alleys of Hanoi: Where Coffee Culture Meets Timeless Charm',
    vietnameseTitle: 'Những con ngõ cổ Hà Nội: Nơi văn hóa cà phê hòa cùng nét quyến rũ vượt thời gian',
    level: 'A1',
    topic: 'Văn hóa & Du lịch',
    readTime: '2 phút',
    wordCount: 140,
    excerpt: 'Wandering through the French quarters, one discovers tiny sidewalk stools where locals gather over egg coffee and sweet conversations.',
    date: '14 Th10, 2026',
  },
  {
    id: 'neuroscience-sleep',
    title: 'The Architecture of Sleep: What the Brain Does While You Rest',
    vietnameseTitle: 'Cấu trúc của giấc ngủ: Bộ não làm gì khi chúng ta nghỉ ngơi?',
    level: 'C1',
    topic: 'Khoa học & Môi trường',
    readTime: '5 phút',
    wordCount: 450,
    excerpt: 'Far from being an inactive state, deep slow-wave sleep coordinates the lymphatic clearance of metabolic debris and solidifies memory traces.',
    date: '12 Th10, 2026',
  },
  {
    id: 'remote-work-future',
    title: 'Asynchronous Collaboration: The True Revolution in Remote Work',
    vietnameseTitle: 'Hợp tác bất đồng bộ: Cuộc cách mạng thực sự trong làm việc từ xa',
    level: 'B2',
    topic: 'Kinh doanh & Công nghệ',
    readTime: '3 phút',
    wordCount: 290,
    excerpt: 'True productivity in distributed teams does not come from endless video calls, but from clear written communication and independent deep focus.',
    date: '10 Th10, 2026',
  },
];

const CEFR_LEVELS = ['Tất cả', 'A1', 'A2', 'B1', 'B2', 'C1'];
const TOPICS = ['Tất cả', 'Đời sống', 'Văn hóa & Du lịch', 'Khoa học & Môi trường', 'Tư duy & Kỹ năng', 'Kinh doanh & Công nghệ'];

export default function ReadingHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Tất cả');
  const [selectedTopic, setSelectedTopic] = useState('Tất cả');

  const filteredArticles = ARTICLES.filter((art) => {
    const matchSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.vietnameseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLevel = selectedLevel === 'Tất cả' || art.level === selectedLevel;
    const matchTopic = selectedTopic === 'Tất cả' || art.topic === selectedTopic;
    return matchSearch && matchLevel && matchTopic;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 pb-28 sm:pb-20">
      {/* Hero Section phong cách sổ tay với bò đeo kính đọc sách */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-teal">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Thư Viện Bài Đọc</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight">
              Đọc báo mỗi ngày, mở rộng vốn từ & tư duy ngữ cảnh
            </h1>

            <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
              Trải nghiệm đọc các bài báo chuẩn ngữ văn bản xứ với giao diện như <b>tờ báo in truyền thống</b>, tích hợp tra từ một chạm và bài tập đọc hiểu.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/reading/practice" className="btn btn-red text-sm font-black shadow-brutal">
                Đọc bài báo nổi bật hôm nay →
              </Link>
              <span className="text-xs font-extrabold text-ink-soft">
                Bài báo mới cập nhật mỗi tuần
              </span>
            </div>
          </div>

          {/* Linh vật LingLing đeo kính đọc sách trên nền giấy */}
          <div className="hidden lg:flex flex-col items-center relative flex-shrink-0">
            <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
              Mỗi ngày <span className="text-red">1 bài báo</span>, tích lũy 50 từ vựng!
            </div>
            <LingLing reaction="studying" size={135} />
          </div>
        </div>
      </div>

      {/* Bộ Lọc & Tìm Kiếm Tag/Chip Giấy */}
      <div className="space-y-4">
        {/* Search & CEFR level */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm bài báo theo tiêu đề, chủ đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border-2 border-ink rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-teal shadow-brutal-sm"
            />
          </div>

          {/* Lọc cấp độ CEFR */}
          <div className="w-full sm:w-auto flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            <span className="text-xs font-black uppercase text-ink-soft mr-1 whitespace-nowrap flex-shrink-0">Bậc CEFR:</span>
            {CEFR_LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-xl border-2 border-ink text-xs font-black transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  selectedLevel === lvl
                    ? 'bg-ink text-paper shadow-brutal-sm'
                    : 'bg-card text-ink hover:bg-paper-2'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Tag chips chủ đề giấy */}
        <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
          <span className="text-xs font-bold text-ink-muted whitespace-nowrap flex-shrink-0">Chủ đề:</span>
          {TOPICS.map((tpc) => (
            <button
              key={tpc}
              onClick={() => setSelectedTopic(tpc)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                selectedTopic === tpc
                  ? 'border-ink bg-teal text-white shadow-brutal-sm'
                  : 'border-ink/30 bg-card text-ink-soft hover:border-ink hover:text-ink'
              }`}
            >
              {tpc}
            </button>
          ))}
        </div>
      </div>

      {/* Lưới Thẻ Bài Đọc Vẽ Như "Tờ Báo" */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((art) => (
          <article
            key={art.id}
            className="group card-paper p-6 flex flex-col justify-between text-left hover:-translate-y-1 transition-all relative"
          >
            <div className="space-y-4">
              {/* Header tờ báo: Ngày tháng + Stamp CEFR */}
              <div className="flex items-center justify-between border-b-2 border-ink/15 pb-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-ink-muted">
                  {art.date} · {art.topic}
                </span>

                <span className="stamp-badge w-10 h-10 text-[11px] font-black border-2 border-red text-red bg-card">
                  {art.level}
                </span>
              </div>

              {/* Tiêu đề Serif */}
              <div className="space-y-1.5">
                <h3 className="font-serif text-xl sm:text-2xl font-black text-ink leading-snug group-hover:text-red transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs font-bold text-teal line-clamp-1 italic">
                  {art.vietnameseTitle}
                </p>
              </div>

              {/* Đoạn trích (Excerpt) phong cách báo chí */}
              <p className="text-xs sm:text-sm font-normal text-ink-soft leading-relaxed line-clamp-3 font-serif">
                &ldquo;{art.excerpt}&rdquo;
              </p>
            </div>

            {/* Meta & Nút Đọc Báo */}
            <div className="pt-4 mt-4 border-t border-ink/15 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-ink-soft">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal" />
                  {art.readTime}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-ink-muted" />
                  {art.wordCount} từ
                </span>
              </div>

              <Link
                href="/reading/practice"
                className="text-xs font-black text-red hover:underline flex items-center gap-1"
              >
                Đọc bài này →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="bg-card border-2 border-ink rounded-2xl p-12 text-center shadow-brutal space-y-4">
          <LingLing reaction="shrug" size={96} />
          <h4 className="text-lg font-black text-ink">Không tìm thấy bài báo phù hợp</h4>
          <p className="text-sm text-ink-soft">Hãy thử tìm kiếm với từ khóa khác hoặc bỏ bớt bộ lọc bạn nhé!</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedLevel('Tất cả');
              setSelectedTopic('Tất cả');
            }}
            className="btn btn-paper text-xs font-black shadow-brutal"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
