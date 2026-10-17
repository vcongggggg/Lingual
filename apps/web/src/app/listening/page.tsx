'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LingLing } from '../../components/ui/LingLing';
import { 
  Headphones, 
  Search, 
  Plus, 
  Play, 
  Clock, 
  Layers, 
  Volume2, 
  Sparkles,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  englishTitle: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  topic: string;
  duration: string;
  segmentsCount: number;
  thumbnailColor: string;
  plays: number;
}

const LISTENING_LESSONS: Lesson[] = [
  {
    id: 'coffee-morning',
    title: 'Thói quen buổi sáng và tách cà phê ấm',
    englishTitle: 'Morning Coffee & Productivity Routine',
    level: 'A2',
    topic: 'Giao tiếp hằng ngày',
    duration: '02:45',
    segmentsCount: 6,
    thumbnailColor: 'from-amber/30 to-amber-soft',
    plays: 1240,
  },
  {
    id: 'eco-living',
    title: 'Hành động nhỏ bảo vệ môi trường xanh',
    englishTitle: 'Small Daily Actions for the Planet',
    level: 'B1',
    topic: 'Khoa học đời sống',
    duration: '03:15',
    segmentsCount: 8,
    thumbnailColor: 'from-teal/20 to-teal/5',
    plays: 890,
  },
  {
    id: 'job-interview',
    title: 'Phỏng vấn xin việc bằng tiếng Anh tự tin',
    englishTitle: 'Mastering the Job Interview Dialogue',
    level: 'B2',
    topic: 'Phỏng vấn & Nghề nghiệp',
    duration: '04:10',
    segmentsCount: 9,
    thumbnailColor: 'from-red/20 to-amber/20',
    plays: 2150,
  },
  {
    id: 'london-travel',
    title: 'Chuyến tàu ngầm khám phá thành phố London',
    englishTitle: 'Navigating the London Underground',
    level: 'A1',
    topic: 'Du lịch & Khám phá',
    duration: '01:50',
    segmentsCount: 4,
    thumbnailColor: 'from-teal/20 to-paper-2',
    plays: 1670,
  },
  {
    id: 'tech-revolution',
    title: 'Trí tuệ nhân tạo thay đổi cách chúng ta học',
    englishTitle: 'How Artificial Intelligence Shapes Learning',
    level: 'C1',
    topic: 'Tin tức thời sự',
    duration: '05:30',
    segmentsCount: 12,
    thumbnailColor: 'from-ink/10 to-card',
    plays: 740,
  },
  {
    id: 'airport-checkin',
    title: 'Thủ tục làm thủ tục tại sân bay quốc tế',
    englishTitle: 'Checking In at an International Airport',
    level: 'A2',
    topic: 'Du lịch & Khám phá',
    duration: '02:20',
    segmentsCount: 5,
    thumbnailColor: 'from-amber/20 to-paper-2',
    plays: 1420,
  },
];

const LEVELS = ['Tất cả', 'A1', 'A2', 'B1', 'B2', 'C1'];
const TOPICS = ['Tất cả', 'Giao tiếp hằng ngày', 'Tin tức thời sự', 'Phỏng vấn & Nghề nghiệp', 'Du lịch & Khám phá', 'Khoa học đời sống'];

export default function ListeningHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Tất cả');
  const [selectedTopic, setSelectedTopic] = useState('Tất cả');

  const filteredLessons = LISTENING_LESSONS.filter((lesson) => {
    const matchSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.englishTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLevel = selectedLevel === 'Tất cả' || lesson.level === selectedLevel;
    const matchTopic = selectedTopic === 'Tất cả' || lesson.topic === selectedTopic;
    return matchSearch && matchLevel && matchTopic;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 pb-28 sm:pb-20">
      {/* Hero Section phong cách sổ tay */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-teal">
              <Headphones className="w-3.5 h-3.5" />
              <span>Phòng Luyện Nghe</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight">
              Luyện đôi tai thính giác, chép chính xác từng âm
            </h1>

            <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
              Rèn luyện phản xạ nghe tự nhiên bằng phương pháp <b>Chép chính tả (Dictation)</b> và <b>Nhại giọng (Shadowing)</b> chuẩn ngữ điệu bản xứ.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/listening/practice" className="btn btn-red text-sm font-black shadow-brutal">
                Luyện ngay câu hôm nay →
              </Link>
              <button className="btn btn-paper text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4 text-red" />
                <span className="text-red font-black">Thêm video</span>
              </button>
            </div>
          </div>

          {/* Linh vật LingLing đeo tai nghe có chủ đích */}
          <div className="hidden lg:flex flex-col items-center relative flex-shrink-0">
            <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
              Hôm nay cùng tớ nghe <span className="text-red">15 phút</span> nhé!
            </div>
            <LingLing reaction="headphones" size={130} />
          </div>
        </div>
      </div>

      {/* Bộ Lọc & Tìm Kiếm */}
      <div className="space-y-4">
        {/* Search & Cấp độ Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Ô tìm kiếm giấy */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm bài học, chủ đề, tựa đề tiếng Anh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border-2 border-ink rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-red shadow-brutal-sm"
            />
          </div>

          {/* Lọc cấp độ CEFR */}
          <div className="w-full sm:w-auto flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            <span className="text-xs font-black uppercase text-ink-soft mr-1 whitespace-nowrap flex-shrink-0">Cấp độ:</span>
            {LEVELS.map((lvl) => (
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

        {/* Tag chips chủ đề */}
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

      {/* Lưới Danh Sách Bài Học */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="group bg-card border-2 border-ink rounded-2xl overflow-hidden shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Thumbnail Header có hiệu ứng giấy viền */}
              <div className={`h-40 bg-gradient-to-br ${lesson.thumbnailColor} border-b-2 border-ink p-4 flex flex-col justify-between relative`}>
                <div className="flex items-center justify-between">
                  {/* Con dấu CEFR mực đỏ */}
                  <span className="stamp-badge w-10 h-10 text-xs font-black border-2 border-red text-red bg-card">
                    {lesson.level}
                  </span>

                  {/* Tag thời lượng giấy */}
                  <div className="flex items-center gap-1.5 bg-card/90 border border-ink px-2.5 py-1 rounded-lg text-xs font-black text-ink shadow-brutal-sm">
                    <Clock className="w-3.5 h-3.5 text-teal" />
                    <span>{lesson.duration}</span>
                  </div>
                </div>

                {/* Nút Play trung tâm */}
                <div className="self-center">
                  <div className="w-12 h-12 rounded-full bg-card border-2 border-ink flex items-center justify-center shadow-brutal group-hover:scale-110 group-hover:bg-red group-hover:text-white transition-all text-ink">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-black text-ink-soft">
                  <span>{lesson.topic}</span>
                  <span>{lesson.plays.toLocaleString()} lượt học</span>
                </div>
              </div>

              {/* Nội dung bài học */}
              <div className="p-5 space-y-2 text-left">
                <h3 className="font-black text-lg text-ink line-clamp-1 group-hover:text-red transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-xs font-semibold text-ink-muted italic line-clamp-1">
                  {lesson.englishTitle}
                </p>
              </div>
            </div>

            {/* Footer thẻ bài học */}
            <div className="p-5 pt-0 border-t border-ink/10 flex items-center justify-between mt-3">
              <span className="px-2.5 py-1 bg-paper-2 border border-ink rounded-lg font-bold text-xs text-ink flex items-center gap-1">
                <Layers className="w-3 h-3 text-ink-muted" />
                {lesson.segmentsCount} đoạn nghe
              </span>

              <Link
                href="/listening/practice"
                className="text-xs font-black text-red hover:underline flex items-center gap-1"
              >
                Chép chính tả →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="bg-card border-2 border-ink rounded-2xl p-12 text-center shadow-brutal space-y-4">
          <LingLing reaction="shrug" size={96} />
          <h4 className="text-lg font-black text-ink">Không tìm thấy bài nghe phù hợp</h4>
          <p className="text-sm text-ink-soft">Thử chọn cấp độ khác hoặc xóa từ khóa tìm kiếm bạn nhé!</p>
          <Button variant="paper" size="sm" onClick={() => { setSearchQuery(''); setSelectedLevel('Tất cả'); setSelectedTopic('Tất cả'); }}>
            Đặt lại bộ lọc
          </Button>
        </div>
      )}
    </div>
  );
}
