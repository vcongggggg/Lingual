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
  GraduationCap,
  Award,
  Globe,
  Tag,
  BookMarked,
  RotateCcw,
  Check,
  Plus
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

interface ExamCollection {
  id: string;
  examType: string;
  badge: string;
  title: string;
  targetScore: string;
  wordsCount: number;
  description: string;
  sampleWords: string[];
  accentColor: string;
}

const EXAM_COLLECTIONS: ExamCollection[] = [
  {
    id: 'ielts-core',
    examType: 'IELTS Academic',
    badge: 'Band 6.5–7.5+',
    title: 'Từ Vựng IELTS Học Thuật Cốt Lõi',
    targetScore: 'Mục tiêu 7.0+',
    wordsCount: 1200,
    description: 'Bộ từ vựng then chốt trích từ các bài đọc nghiên cứu, biểu đồ Task 1 và bài luận Task 2.',
    sampleWords: ['fluctuation', 'deteriorate', 'substantial', 'prevalent', 'counteract'],
    accentColor: 'border-red bg-red/10 text-red',
  },
  {
    id: 'ielts-collocations',
    examType: 'IELTS Writing',
    badge: 'Lexical Resource',
    title: 'Cụm Collocations Ăn Điểm Writing & Speaking',
    targetScore: 'Tăng band Lexical',
    wordsCount: 850,
    description: 'Tập hợp các cụm từ kết hợp tự nhiên giúp bài viết thoát khỏi lối dịch từng chữ ngô nghê.',
    sampleWords: ['pressing issue', 'pose a threat', 'foster innovation', 'bridge the gap'],
    accentColor: 'border-teal bg-teal/10 text-teal',
  },
  {
    id: 'toeic-600',
    examType: 'TOEIC Listening & Reading',
    badge: 'Mục tiêu 600+',
    title: 'Từ Vựng Công Sở & Đàm Phán Hợp Đồng',
    targetScore: 'Giao tiếp văn phòng',
    wordsCount: 900,
    description: 'Các chủ đề quen thuộc: đàm phán hợp đồng, bảo hiểm, hội nghị, marketing và mua sắm thiết bị.',
    sampleWords: ['agenda', 'negotiate', 'reimburse', 'itinerary', 'inventory'],
    accentColor: 'border-amber bg-amber/10 text-amber',
  },
  {
    id: 'toeic-850',
    examType: 'TOEIC Advanced',
    badge: 'Mục tiêu 850+',
    title: 'Từ Vựng Chiến Lược Doanh Nghiệp Cấp Cao',
    targetScore: 'Quản lý & Nhân sự',
    wordsCount: 1100,
    description: 'Từ vựng tài chính, báo cáo thường niên, tái cơ cấu doanh nghiệp và giải quyết tranh chấp.',
    sampleWords: ['contingency', 'merger', 'monopoly', 'compliance', 'dividend'],
    accentColor: 'border-ink bg-card text-ink',
  },
  {
    id: 'toefl-ibt',
    examType: 'TOEFL iBT',
    badge: '100+ iBT',
    title: 'Từ Vựng Khoa Học & Giảng Đường Đại Học',
    targetScore: 'Du học Bắc Mỹ',
    wordsCount: 1000,
    description: 'Thuật ngữ liên ngành: Khảo cổ, Địa chất, Thiên văn và Xã hội học thường gặp trong đề thi.',
    sampleWords: ['fossilize', 'tectonic', 'celestial', 'indigenous', 'stratification'],
    accentColor: 'border-teal bg-teal/10 text-teal',
  },
  {
    id: 'vstep-b2',
    examType: 'VSTEP B1-B2',
    badge: 'Chuẩn Bộ GD&ĐT',
    title: 'Từ Vựng Tuyển Sinh & Tốt Nghiệp Đại Học',
    targetScore: 'Chuẩn đầu ra B1/B2',
    wordsCount: 750,
    description: 'Từ vựng bám sát khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam, dễ ghi điểm bài thi viết thư.',
    sampleWords: ['inquire', 'furthermore', 'perspective', 'feasible', 'gratitude'],
    accentColor: 'border-amber bg-amber/10 text-amber',
  },
];

interface TopicCollection {
  id: string;
  topicCode: string;
  title: string;
  vietnameseTitle: string;
  wordsCount: number;
  description: string;
  sampleWords: string[];
}

const TOPIC_COLLECTIONS: TopicCollection[] = [
  {
    id: 'env',
    topicCode: 'CHỦ ĐỀ 01',
    title: 'Environment & Climate Action',
    vietnameseTitle: 'Môi Trường & Biến Đổi Khí Hậu',
    wordsCount: 450,
    description: 'Bảo tồn đa dạng sinh học, năng lượng tái tạo, giảm phát thải carbon và rác thải nhựa đại dương.',
    sampleWords: ['renewable', 'biodiversity', 'deforestation', 'emissions', 'ecological'],
  },
  {
    id: 'tech',
    topicCode: 'CHỦ ĐỀ 02',
    title: 'Artificial Intelligence & Future Tech',
    vietnameseTitle: 'Trí Tuệ Nhân Tạo & Kỷ Nguyên Số',
    wordsCount: 520,
    description: 'Thuật toán học máy, tự động hóa, điện toán lượng tử, an toàn an ninh mạng và dữ liệu lớn.',
    sampleWords: ['algorithm', 'automation', 'cybersecurity', 'quantum', 'biometric'],
  },
  {
    id: 'biz',
    topicCode: 'CHỦ ĐỀ 03',
    title: 'Business, Economics & Finance',
    vietnameseTitle: 'Kinh Tế, Khởi Nghiệp & Tài Chính',
    wordsCount: 480,
    description: 'Lạm phát, thị trường vốn, mô hình kinh doanh tuần hoàn, đầu tư mạo hiểm và tăng trưởng xanh.',
    sampleWords: ['venture', 'inflation', 'sustainability', 'equity', 'revenue'],
  },
  {
    id: 'psy',
    topicCode: 'CHỦ ĐỀ 04',
    title: 'Mind, Psychology & Well-being',
    vietnameseTitle: 'Tâm Lý Học, Cảm Xúc & Đời Sống',
    wordsCount: 380,
    description: 'Sức khỏe tinh thần, trí tuệ cảm xúc, vượt qua căng thẳng và xây dựng lối sống cân bằng.',
    sampleWords: ['resilience', 'mindfulness', 'empathy', 'equilibrium', 'burnout'],
  },
  {
    id: 'travel',
    topicCode: 'CHỦ ĐỀ 05',
    title: 'Travel, Global Heritage & Cultures',
    vietnameseTitle: 'Du Lịch, Di Sản & Văn Hóa Quốc Tế',
    wordsCount: 420,
    description: 'Khám phá văn hóa bản địa, phong tục tập quán, ẩm thực truyền thống và di sản thế giới.',
    sampleWords: ['hospitality', 'itinerary', 'indigenous', 'architecture', 'monument'],
  },
  {
    id: 'health',
    topicCode: 'CHỦ ĐỀ 06',
    title: 'Health, Nutrition & Medical Science',
    vietnameseTitle: 'Sức Khỏe, Dinh Dưỡng & Y Khoa',
    wordsCount: 410,
    description: 'Dinh dưỡng lâm sàng, hệ miễn dịch, y học dự phòng và rèn luyện thể chất bền bỉ.',
    sampleWords: ['immunity', 'metabolism', 'cardiovascular', 'epidemic', 'therapy'],
  },
];

const PERSONAL_BOOKMARKS = [
  { id: 'p-1', word: 'Perseverance', phonetic: '/ˌpɜː.sɪˈvɪə.rəns/', pos: 'noun', vi: 'Lòng kiên trì, sự bền bỉ vượt nghịch cảnh', date: '18/10/2026', level: 'B2' },
  { id: 'p-2', word: 'Serendipity', phonetic: '/ˌser.ənˈdɪp.ə.ti/', pos: 'noun', vi: 'Sự may mắn bất ngờ, cơ duyên kỳ diệu', date: '18/10/2026', level: 'C1' },
  { id: 'p-3', word: 'Resilient', phonetic: '/rɪˈzɪl.jənt/', pos: 'adj', vi: 'Kiên cường, có khả năng phục hồi nhanh', date: '17/10/2026', level: 'B2' },
  { id: 'p-4', word: 'Pragmatic', phonetic: '/præɡˈmæt.ɪk/', pos: 'adj', vi: 'Thực tế, mang tính thực tiễn giải quyết việc', date: '17/10/2026', level: 'C1' },
  { id: 'p-5', word: 'Cognitive', phonetic: '/ˈkɒɡ.nə.tɪv/', pos: 'adj', vi: 'Thuộc về nhận thức và xử lý thông tin', date: '16/10/2026', level: 'B2' },
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

  const filteredExams = EXAM_COLLECTIONS.filter((exam) => {
    return (
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.examType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.sampleWords.some((w) => w.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const filteredTopics = TOPIC_COLLECTIONS.filter((top) => {
    return (
      top.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      top.vietnameseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      top.sampleWords.some((w) => w.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const filteredPersonal = PERSONAL_BOOKMARKS.filter((item) => {
    return (
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vi.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 text-left pb-28 sm:pb-20 select-none">
      {/* Hero Section phong cách sổ tay */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-teal">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Kho Từ Vựng Cốt Lõi</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight font-sans">
              Tích lũy từ vựng như từng trang sách quý
            </h1>

            <p className="text-base sm:text-lg text-ink-soft leading-relaxed font-sans">
              Mỗi cấp độ CEFR và chứng chỉ được biên soạn như một <b>chương sách riêng biệt</b>, kết hợp cùng <b>lịch ôn thông minh</b> giúp bạn nhớ từ vựng vĩnh viễn vào trí nhớ dài hạn.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/vocabulary/practice" className="btn btn-red text-sm font-black shadow-brutal">
                Học thẻ từ hôm nay (10 thẻ) →
              </Link>
              <Link href="/dictionary" className="btn btn-paper text-sm font-black shadow-brutal flex items-center gap-1.5">
                <Search className="w-4 h-4 text-teal" /> Tra cứu phiếu từ điển
              </Link>
              <span className="text-xs font-extrabold text-ink-soft">
                8.500+ từ vựng có ví dụ song ngữ & IPA
              </span>
            </div>
          </div>

          {/* Linh vật LingLing chăm chú học từ vựng */}
          <div className="hidden lg:flex flex-col items-center relative flex-shrink-0">
            <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
              Mỗi ngày <span className="text-red">10 thẻ thư viện</span>, không bao giờ quên!
            </div>
            <LingLing reaction="studying" size={135} />
          </div>
        </div>
      </div>

      {/* Tabs dạng Tab Giấy (Paper Tabs) */}
      <div className="space-y-4">
        <div
          role="tablist"
          aria-label="Phân loại từ vựng"
          className="w-full flex items-center gap-2 border-b-2 border-ink pb-2 overflow-x-auto scrollbar-none"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              data-testid={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-t-xl border-2 border-b-0 border-ink font-black text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-card text-red shadow-brutal-sm -translate-y-1'
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
            placeholder={
              activeTab === 'cefr'
                ? 'Tìm theo cấp độ A1–C2, từ mẫu, tên chương...'
                : activeTab === 'cert'
                ? 'Tìm theo chứng chỉ IELTS, TOEIC, VSTEP...'
                : activeTab === 'topic'
                ? 'Tìm theo chủ đề Môi trường, Công nghệ, Kinh tế...'
                : 'Tìm trong sổ từ cá nhân đã lưu...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border-2 border-ink rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-red shadow-brutal-sm"
          />
        </div>
      </div>

      {/* TAB 1: THEO BẬC CEFR (A1–C2) */}
      {activeTab === 'cefr' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-ink font-sans">
              Khung Năng Lực Chuẩn Châu Âu CEFR (A1 – C2)
            </h2>
            <span className="text-xs font-mono font-bold text-ink-muted">
              {filteredChapters.length} chương giáo trình
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChapters.map((chap) => (
              <div
                key={chap.id}
                className="card-paper p-6 sm:p-7 flex flex-col justify-between hover:-translate-y-1 transition-all relative overflow-hidden group bg-card shadow-brutal"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b-2 border-ink/15 pb-4">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-ink-muted block">
                        {chap.chapterRoman}
                      </span>
                      <h3 className="text-2xl font-black text-ink group-hover:text-red transition-colors">
                        {chap.chapterTitle}
                      </h3>
                    </div>

                    <span className="font-serif text-5xl font-black text-ink/80 select-none tracking-tight">
                      {chap.levelCode}
                    </span>
                  </div>

                  <div className={`p-4 bg-gradient-to-br ${chap.colorScheme} border-2 border-ink rounded-xl shadow-brutal-sm space-y-2`}>
                    <div className="flex items-center justify-between text-xs font-black text-ink">
                      <span>{chap.wordsCount} từ cốt lõi</span>
                      <span className="px-2 py-0.5 bg-card border border-ink rounded-md text-[10px]">
                        {chap.lessonsCount} bài học
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {chap.sampleWords.map((w) => (
                        <span key={w} className="text-[11px] font-mono font-bold bg-card/80 border border-ink/40 px-1.5 py-0.5 rounded text-ink">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-ink-soft leading-relaxed font-medium">
                    {chap.description}
                  </p>
                </div>

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
      )}

      {/* TAB 2: CHỨNG CHỈ (IELTS / TOEIC / TOEFL / VSTEP) */}
      {activeTab === 'cert' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-ink font-sans">
              Tuyển Tập Từ Vựng Theo Chứng Chỉ & Đề Thi Chuẩn Hóa
            </h2>
            <span className="text-xs font-mono font-bold text-ink-muted">
              {filteredExams.length} gói chuyên đề thi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                className="card-paper p-6 sm:p-7 flex flex-col justify-between hover:-translate-y-1 transition-all relative overflow-hidden group bg-card shadow-brutal"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b-2 border-ink/15 pb-4">
                    <div>
                      <span className="text-[10px] font-mono font-black uppercase tracking-wider text-ink-muted block">
                        {exam.examType}
                      </span>
                      <h3 className="text-xl font-black text-ink group-hover:text-red transition-colors leading-snug">
                        {exam.title}
                      </h3>
                    </div>

                    <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded border ${exam.accentColor} flex-shrink-0`}>
                      {exam.badge}
                    </span>
                  </div>

                  <div className="p-4 bg-paper-2 border-2 border-ink rounded-xl shadow-brutal-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-black text-ink">
                      <span>{exam.wordsCount} thuật ngữ học thuật</span>
                      <span className="text-red font-mono">{exam.targetScore}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exam.sampleWords.map((w) => (
                        <span key={w} className="text-[11px] font-mono font-bold bg-card border border-ink/30 px-1.5 py-0.5 rounded text-ink">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-ink-soft leading-relaxed font-medium">
                    {exam.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-ink/15 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-teal">
                    Chuyên đề ôn luyện
                  </span>

                  <Link
                    href="/vocabulary/practice"
                    className="text-sm font-black text-red hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    Vào luyện thi →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CHỦ ĐỀ THÔNG DỤNG (TOPICS) */}
      {activeTab === 'topic' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-ink font-sans">
              Các Chủ Đề Thực Tế & Đàm Thoại Thời Đại
            </h2>
            <span className="text-xs font-mono font-bold text-ink-muted">
              {filteredTopics.length} nhóm chủ đề đời sống
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((top) => (
              <div
                key={top.id}
                className="card-paper p-6 sm:p-7 flex flex-col justify-between hover:-translate-y-1 transition-all relative overflow-hidden group bg-card shadow-brutal"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b-2 border-ink/15 pb-4">
                    <div>
                      <span className="text-[10px] font-mono font-black uppercase tracking-wider text-amber block">
                        {top.topicCode}
                      </span>
                      <h3 className="text-xl font-black text-ink group-hover:text-red transition-colors leading-snug">
                        {top.vietnameseTitle}
                      </h3>
                      <span className="text-[11px] font-mono text-ink-muted block mt-0.5">
                        {top.title}
                      </span>
                    </div>

                    <span className="w-8 h-8 rounded-full border border-ink bg-paper-2 flex items-center justify-center text-teal">
                      <Tag className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="p-4 bg-paper-2 border-2 border-ink rounded-xl shadow-brutal-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-black text-ink">
                      <span>{top.wordsCount} từ vựng ngữ cảnh</span>
                      <span className="text-[10px] text-teal font-mono">Thực chiến cao</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {top.sampleWords.map((w) => (
                        <span key={w} className="text-[11px] font-mono font-bold bg-card border border-ink/30 px-1.5 py-0.5 rounded text-ink">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-ink-soft leading-relaxed font-medium">
                    {top.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-ink/15 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-ink-muted">
                    Theo ngữ cảnh thực tế
                  </span>

                  <Link
                    href="/vocabulary/practice"
                    className="text-sm font-black text-red hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    Học theo chủ đề →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SỔ TỪ VỰNG CÁ NHÂN (PERSONAL VOCABULARY NOTEBOOK) */}
      {activeTab === 'personal' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-ink/20 pb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-red block font-mono">
                SỔ TAY GHI NHỚ CÁ NHÂN
              </span>
              <h2 className="text-2xl font-black text-ink font-sans">
                Bộ sưu tập từ vựng & Thẻ đánh dấu của bạn
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/srs" className="btn btn-red text-xs font-black shadow-brutal flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" /> Mở phòng ôn SRS →
              </Link>
              <Link href="/dictionary" className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Thêm từ mới
              </Link>
            </div>
          </div>

          {/* 3 Khối thống kê sổ tay */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal-md">
              <span className="text-xs font-black text-ink-muted uppercase block">Từ đã đánh dấu</span>
              <div className="text-3xl font-black text-ink mt-1 font-mono">{PERSONAL_BOOKMARKS.length} từ</div>
              <span className="text-[11px] text-ink-soft block mt-1">Được lưu từ bài học & tra cứu</span>
            </div>
            <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal-md">
              <span className="text-xs font-black text-teal uppercase block">Cần ôn hôm nay</span>
              <div className="text-3xl font-black text-teal mt-1 font-mono">5 từ</div>
              <span className="text-[11px] text-ink-soft block mt-1">Theo thuật toán ngắt quãng SM-2</span>
            </div>
            <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal-md">
              <span className="text-xs font-black text-red uppercase block">Đã ghi nhớ sâu</span>
              <div className="text-3xl font-black text-red mt-1 font-mono">24 từ</div>
              <span className="text-[11px] text-ink-soft block mt-1">Đạt cấp độ thành thạo dài hạn</span>
            </div>
          </div>

          {/* Danh sách các từ cá nhân đã đánh dấu */}
          <div className="space-y-3">
            <h3 className="text-base font-black text-ink font-sans">
              Từ vựng gần đây trong sổ tay của bạn ({filteredPersonal.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPersonal.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-card border-2 border-ink rounded-2xl shadow-brutal-sm flex items-start justify-between gap-4 hover:border-red transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-black text-ink font-serif">{item.word}</h4>
                      <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded border border-ink bg-paper">
                        {item.pos}
                      </span>
                      <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded border border-teal text-teal bg-teal/10">
                        {item.level}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-red block font-bold">{item.phonetic}</span>
                    <p className="text-xs font-bold text-ink leading-relaxed">→ {item.vi}</p>
                    <span className="text-[10px] text-ink-muted font-mono block">Ngày lưu: {item.date}</span>
                  </div>

                  <Link
                    href={`/dictionary?q=${encodeURIComponent(item.word)}`}
                    className="p-2 rounded-xl border border-ink bg-paper hover:bg-paper-2 text-ink shadow-sm flex-shrink-0"
                    title="Xem chi tiết trên phiếu mục lục thư viện"
                  >
                    <ArrowRight className="w-4 h-4 text-red" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
