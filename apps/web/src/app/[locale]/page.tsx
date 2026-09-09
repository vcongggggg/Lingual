'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card } from '@linguaflow/ui';
import dynamic from 'next/dynamic';
import {
  Sparkles,
  ArrowRight,
  Brain,
  Gamepad2,
  Flame,
  CheckCircle2,
  Zap,
  Search,
  Volume2,
  Trophy,
  Target,
  BookOpen,
  Clock,
  Compass,
  HelpCircle,
  Star,
  Users,
  MessageSquare,
  ChevronDown,
  Check,
  Play,
  Award,
  BarChart3,
  GraduationCap,
  ChevronRight,
  ShieldCheck,
  Layers,
  Repeat,
  Radio,
  Sparkle,
} from 'lucide-react';
import { soundFx } from '@/lib/soundFx';

const Hero3DVisual = dynamic(() => import('@/components/Hero3DVisual'), {
  ssr: false,
  loading: () => (
    <div className="relative w-full max-w-4xl h-[400px] sm:h-[460px] mx-auto flex items-center justify-center" />
  ),
});

interface SampleWord {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  cefr: string;
  meaning: string;
  example: string;
  audioLang?: string;
}

const SAMPLE_WORDS: Record<string, SampleWord> = {
  resilience: {
    word: 'Resilience',
    phonetic: '/rɪˈzɪl.jəns/',
    partOfSpeech: 'noun',
    cefr: 'C1',
    meaning: 'Khả năng phục hồi nhanh chóng, kiên cường vượt qua nghịch cảnh.',
    example: 'Her resilience and mental toughness helped her achieve Band 8.5 in IELTS.',
  },
  serendipity: {
    word: 'Serendipity',
    phonetic: '/ˌser.ənˈdɪp.ə.ti/',
    partOfSpeech: 'noun',
    cefr: 'C2',
    meaning: 'Sự tình cờ may mắn tìm thấy những điều bất ngờ và quý giá.',
    example: 'Discovering LinguaFlow was pure serendipity for my daily study routine.',
  },
  eloquent: {
    word: 'Eloquent',
    phonetic: '/ˈel.ə.kwənt/',
    partOfSpeech: 'adjective',
    cefr: 'B2',
    meaning: 'Hùng biện, lưu loát, có khả năng diễn đạt ý tứ thuyết phục.',
    example: 'An eloquent presentation always captures the attention of the examiners.',
  },
  ubiquitous: {
    word: 'Ubiquitous',
    phonetic: '/juːˈbɪk.wɪ.təs/',
    partOfSpeech: 'adjective',
    cefr: 'C1',
    meaning: 'Phổ biến khắp mọi nơi, hiện diện ở bất cứ đâu.',
    example: 'Smartphones have become ubiquitous in modern language learning.',
  },
};

const FAQS = [
  {
    q: 'LinguaFlow có hoàn toàn miễn phí không?',
    a: 'Có! Toàn bộ 26,500+ từ vựng, hệ thống ôn tập Spaced Repetition (SRS), 6 chế độ Arcade Games và bộ đề thi IELTS Cambridge đều có thể truy cập và luyện tập hoàn toàn miễn phí.',
  },
  {
    q: 'Thuật toán lặp lại ngắt quãng (SRS SM-2) hoạt động như thế nào?',
    a: 'Dựa trên Đường cong quên lãng (Ebbinghaus Forgetting Curve), hệ thống tự động tính toán thời điểm vàng trước khi não bộ quên từ vựng (sau 1 ngày, 3 ngày, 7 ngày, 1 tháng) để nhắc bạn ôn lại, giúp đưa từ vựng vào trí nhớ vĩnh viễn.',
  },
  {
    q: 'Ngân hàng đề thi IELTS có bám sát đề thi thật không?',
    a: 'Chính xác! Toàn bộ đề thi IELTS Academic & General Training trên LinguaFlow được biên soạn chuẩn theo format Cambridge IELTS mới nhất với 40 câu hỏi chia 3 Passage dài, đồng hồ đếm ngược LED và dự đoán Band điểm chuẩn xác.',
  },
  {
    q: 'Gia sư AI LingLing 24/7 có thể giúp tôi những gì?',
    a: 'LingLing là trợ lý AI tích hợp sẵn dưới góc màn hình, có thể giải thích chi tiết cấu trúc ngữ pháp khó, dịch câu theo ngữ cảnh, sửa bài viết luận IELTS và phản hồi phát âm bằng giọng đọc bản xứ.',
  },
  {
    q: 'Tôi có thể cài đặt LinguaFlow như một ứng dụng trên điện thoại không?',
    a: 'Được! LinguaFlow hỗ trợ công nghệ Progressive Web App (PWA). Bạn chỉ cần mở website trên trình duyệt Safari (iOS) hoặc Chrome (Android) và bấm "Thêm vào Màn hình chính" để học mượt mà như app native.',
  },
];

export default function LandingPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const router = useRouter();

  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('beginner');

  // Interactive Live Search Demo
  const [searchQuery, setSearchQuery] = useState('resilience');
  const activeWord = useMemo(() => {
    const key = searchQuery.trim().toLowerCase();
    return (
      SAMPLE_WORDS[key] || {
        word: searchQuery.trim(),
        phonetic: '/ˈlɪŋ.ɡwə.floʊ/',
        partOfSpeech: 'noun',
        cefr: 'B2',
        meaning: `Từ khóa "${searchQuery}" sẵn sàng để tra cứu trong kho 26,500+ từ vựng của LinguaFlow!`,
        example: 'Explore thousands of curated examples and collocations in our dictionary.',
      }
    );
  }, [searchQuery]);

  // Interactive Flashcard Demo State
  const [isFlipped, setIsFlipped] = useState(false);
  const [demoXP, setDemoXP] = useState(150);

  // FAQ open index
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const handleStartLearning = () => {
    soundFx.playSuccess();
    router.push(`/${locale}/dashboard`);
  };

  const playWordAudio = (word: string) => {
    soundFx.playClick();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-10 space-y-24 w-full">
      {/* ===================================================================== */}
      {/* 1. HERO SECTION 2.0 (THE GRAND ENTRANCE)                             */}
      {/* ===================================================================== */}
      <section className="relative w-full max-w-6xl text-center space-y-8 pt-4">
        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[450px] h-[450px] bg-coral-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Top Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/40 backdrop-blur-xl shadow-lg shadow-teal-500/10 text-xs font-extrabold text-teal-300"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>Hệ Sinh Thái EdTech Chuẩn Quốc Tế • Kho 26,500+ Từ Vựng & Luyện Thi IELTS 2026</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-artistic tracking-tight text-white leading-[1.15]"
        >
          Chinh Phục Tiếng Anh Theo Cách <br />
          <span className="bg-gradient-to-r from-coral-400 via-amber-300 to-teal-300 bg-clip-text text-transparent drop-shadow-sm">
            Vừa Học Vừa Chơi Nghiêm Túc
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300 leading-relaxed font-normal"
        >
          Đột phá khả năng ngôn ngữ với thuật toán lặp lại ngắt quãng **SRS Ebbinghaus**, phòng thi **IELTS Cambridge Simulator** chuẩn giám khảo, đấu trường **Arcade 6 trò chơi**, và gia sư **AI LingLing** đồng hành 24/7.
        </motion.p>

        {/* Dual Primary Call-To-Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 pt-2 relative z-20"
        >
          <Button
            variant="accent"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            onClick={() => {
              soundFx.playSuccess();
              setShowPlacementModal(true);
            }}
            className="shadow-xl shadow-teal-500/20"
          >
            Bắt Đầu Học Ngay (Miễn Phí)
          </Button>

          <Button
            variant="secondary"
            size="lg"
            icon={<Trophy className="w-5 h-5 text-amber-400" />}
            onClick={() => {
              soundFx.playClick();
              router.push(`/${locale}/ielts/mock-test`);
            }}
          >
            Vào Phòng Thi Thử IELTS
          </Button>
        </motion.div>

        {/* Interactive Live Search Bar Preview (Instant Aha Moment) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="max-w-2xl mx-auto pt-6"
        >
          <div className="p-2.5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-950/70 rounded-2xl border border-slate-800/80">
              <Search className="w-5 h-5 text-teal-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Thử gõ từ tiếng Anh: resilience, serendipity, eloquent..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-medium"
              />
              <button
                onClick={() => playWordAudio(activeWord.word)}
                className="p-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 transition-colors shrink-0"
                title="Nghe phát âm chuẩn IPA"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Sample Tags */}
            <div className="flex items-center gap-2 px-3 pt-3 pb-1 overflow-x-auto text-xs">
              <span className="text-slate-500 font-bold shrink-0">Thử nhanh:</span>
              {Object.keys(SAMPLE_WORDS).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    soundFx.playClick();
                    setSearchQuery(key);
                  }}
                  className={`px-2.5 py-1 rounded-full font-mono font-bold transition-all shrink-0 ${
                    searchQuery.toLowerCase() === key
                      ? 'bg-teal-500/20 border border-teal-400 text-teal-300'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Instant Vocab Preview Card */}
            <div className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-slate-950/90 to-teal-950/20 border border-teal-500/20 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white">{activeWord.word}</span>
                  <span className="text-xs font-mono text-cyan-400 font-semibold">{activeWord.phonetic}</span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                    {activeWord.partOfSpeech}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-mono font-black">
                    {activeWord.cefr}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-300">{activeWord.meaning}</p>
                <p className="text-[11px] text-slate-500 italic font-mono truncate max-w-lg">
                  "{activeWord.example}"
                </p>
              </div>

              <Link
                href={`/${locale}/vocabulary`}
                className="px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold shrink-0 flex items-center gap-1 transition-all"
              >
                <span>Vào Từ Điển 26.5K</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* 3D Orbit Hero Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="pt-4"
        >
          <Hero3DVisual />
        </motion.div>
      </section>

      {/* ===================================================================== */}
      {/* 2. METRICS & SOCIAL PROOF COUNTER (CON SỐ BIẾT NÓI)                  */}
      {/* ===================================================================== */}
      <section className="w-full max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
          <div className="text-center space-y-1 border-r border-slate-800/80 last:border-r-0">
            <span className="block text-3xl sm:text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
              26,500+
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-300">Từ Vựng Oxford & AWL</span>
            <span className="block text-[11px] text-slate-500">6 Cấp độ CEFR A1 - C2</span>
          </div>

          <div className="text-center space-y-1 border-r border-slate-800/80 last:border-r-0">
            <span className="block text-3xl sm:text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300">
              100+
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-300">Bộ Đề Thi IELTS Chuẩn</span>
            <span className="block text-[11px] text-slate-500">Full 4 Kỹ Năng Cambridge</span>
          </div>

          <div className="text-center space-y-1 border-r border-slate-800/80 last:border-r-0">
            <span className="block text-3xl sm:text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              99.4%
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-300">Tỷ Lệ Nhớ Từ Dài Hạn</span>
            <span className="block text-[11px] text-slate-500">Thuật Toán SRS Ebbinghaus</span>
          </div>

          <div className="text-center space-y-1">
            <span className="block text-3xl sm:text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
              24/7
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-300">Gia Sư AI LingLing</span>
            <span className="block text-[11px] text-slate-500">Phản hồi và chấm bài tức thì</span>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. BENTO GRID 2.0: 4 TRỤ CỘT ĐỘT PHÁ CỦA LINGUAFLOW                   */}
      {/* ===================================================================== */}
      <section className="w-full max-w-6xl space-y-8">
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
            ⚡ Hệ Sinh Thái Học Tập Toàn Diện
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white">
            Mọi Công Cụ Bạn Cần Để Làm Chủ Tiếng Anh
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Không còn phải cài đặt hàng tá ứng dụng rời rạc. LinguaFlow tích hợp mọi phương pháp học tập tiên tiến nhất vào một giao diện liền mạch.
          </p>
        </div>

        {/* Bento Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Card 1: IELTS Cambridge Exam Simulator (Col 7) */}
          <div className="md:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 shadow-2xl backdrop-blur-xl flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-xs">
                  IELTS Band 8.5 Simulator
                </span>
              </div>
              <h3 className="text-2xl font-display font-black text-white group-hover:text-amber-300 transition-colors">
                Phòng Luyện Thi IELTS Cambridge Chuẩn Giám Khảo
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Trải nghiệm giao diện phòng thi trên máy tính (Computer-delivered IELTS) với đồng hồ đếm ngược LED, radar 40 câu hỏi, chia đôi màn hình bài đọc và công cụ highlight văn bản tức thì.
              </p>
            </div>

            {/* Visual HUD Mock */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Section 3: Academic Reading</span>
                <span className="text-amber-400 font-black animate-pulse">⏱️ 58:24 Còn lại</span>
              </div>
              <div className="grid grid-cols-10 gap-1.5">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-6 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                      i < 8
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                        : i === 8
                        ? 'bg-amber-500/30 border border-amber-400 text-white animate-pulse'
                        : 'bg-slate-900 border border-slate-800 text-slate-500'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bento Card 2: Spaced Repetition (SRS SM-2) (Col 5) */}
          <div className="md:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 transition-all duration-300 shadow-2xl backdrop-blur-xl flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <Brain className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 font-mono font-bold text-xs">
                  SRS Algorithm SM-2
                </span>
              </div>
              <h3 className="text-2xl font-display font-black text-white group-hover:text-teal-300 transition-colors">
                Ôn Tập Ngắt Quãng Chống Quên
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Tự động tối ưu chu kỳ nhắc lại: 1 ngày, 3 ngày, 7 ngày, 30 ngày. Đảm bảo từ vựng được ghi nhớ vĩnh viễn vào bộ nhớ dài hạn với ít thời gian nhất.
              </p>
            </div>

            {/* SRS Timeline Pill Preview */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Độ Nhớ Từ</span>
                <span className="text-teal-400 font-bold">98.2% Ổn định</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 w-[85%]" />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
                <span>Lần 1 (+1d)</span>
                <span>Lần 2 (+3d)</span>
                <span>Lần 3 (+7d)</span>
                <span className="text-teal-400 font-bold">Thành thạo (+30d)</span>
              </div>
            </div>
          </div>

          {/* Bento Card 3: AI Speaking Lab (Col 5) */}
          <div className="md:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all duration-300 shadow-2xl backdrop-blur-xl flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Radio className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold text-xs">
                  AI Speech-to-Text
                </span>
              </div>
              <h3 className="text-2xl font-display font-black text-white group-hover:text-purple-300 transition-colors">
                AI Speaking & Pronunciation Lab
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Phân tích sóng âm giọng nói 32 cột tần số, so sánh cao độ với phát âm người bản xứ và chấm điểm chi tiết từng âm vị IPA.
              </p>
            </div>

            {/* Equalizer Visualizer */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center gap-1.5 h-16">
              {[40, 65, 85, 45, 95, 75, 55, 90, 60, 80, 45, 70, 90, 50, 65, 40].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-gradient-to-t from-purple-500 to-teal-400 transition-all duration-300"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Bento Card 4: Arcade Game Center 6 Modes (Col 7) */}
          <div className="md:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-coral-500/40 transition-all duration-300 shadow-2xl backdrop-blur-xl flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-coral-500/15 border border-coral-500/30 flex items-center justify-center text-coral-400">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-coral-500/20 text-coral-300 font-mono font-bold text-xs">
                  6 Chế Độ Game Arcade
                </span>
              </div>
              <h3 className="text-2xl font-display font-black text-white group-hover:text-coral-300 transition-colors">
                Học Tiếng Anh Qua Game Phản Xạ Thần Tốc
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Giải phóng sự nhàm chán với 6 trò chơi gay cấn: Đua gõ phím tốc độ WPM, Ghép cặp trí nhớ, Ô chữ Crossword, Treo cổ Hangman và Thử thách nghe phản xạ.
              </p>
            </div>

            {/* Game Badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {['Speed Typing', 'Memory Match', 'Crossword', 'Word Search', 'Hangman', 'Listening Challenge'].map(
                (g) => (
                  <span
                    key={g}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:border-coral-500/50 hover:text-white transition-colors"
                  >
                    🎮 {g}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. INTERACTIVE FLASHCARD STUDIO DEMO (THỬ LẬT THẺ NGAY TRÊN WEB)       */}
      {/* ===================================================================== */}
      <section className="w-full max-w-4xl space-y-6 text-center">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            ✨ Trải Nghiệm Thực Tế
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
            Thử Nghiệm Thẻ Flashcard 3D Tương Tác
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Nhấp chuột vào thẻ bài dưới đây để lật mặt sau và đánh giá mức độ ghi nhớ:
          </p>
        </div>

        {/* 3D Flip Card Container */}
        <div className="relative mx-auto w-full max-w-md h-72 cursor-pointer perspective-1000" onClick={() => {
          soundFx.playWoosh();
          setIsFlipped(!isFlipped);
        }}>
          <motion.div
            className="w-full h-full relative preserve-3d transition-transform duration-500 rounded-3xl"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
          >
            {/* FRONT OF FLASHCARD */}
            <div className="absolute inset-0 backface-hidden p-8 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-900/90 to-slate-800 border-2 border-teal-500/40 shadow-2xl flex flex-col justify-between items-center text-center">
              <div className="w-full flex items-center justify-between text-xs font-mono">
                <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 font-bold">
                  Oxford 3000 • C1
                </span>
                <span className="text-slate-400">Click để lật 🔄</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl sm:text-4xl font-black text-white tracking-wide">
                  Perseverance
                </h3>
                <div className="flex items-center justify-center gap-2 text-sm font-mono text-cyan-400">
                  <span>/ˌpɜː.sɪˈvɪə.rəns/</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playWordAudio('Perseverance');
                    }}
                    className="p-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <span className="text-xs text-slate-500 font-medium">
                Chạm vào thẻ để xem dịch nghĩa và câu ví dụ
              </span>
            </div>

            {/* BACK OF FLASHCARD */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 p-8 rounded-3xl bg-gradient-to-tr from-slate-950 via-teal-950/40 to-slate-900 border-2 border-teal-400 shadow-2xl flex flex-col justify-between items-center text-center">
              <div className="w-full flex items-center justify-between text-xs font-mono">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  Danh từ (Noun)
                </span>
                <span className="text-teal-400 font-bold">Đã lật thẻ ✨</span>
              </div>

              <div className="space-y-3">
                <p className="text-xl font-bold text-white">
                  Sự kiên trì, bền bỉ, không nản lòng trước khó khăn.
                </p>
                <p className="text-xs text-slate-300 font-mono italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  "Through perseverance and hard work, he achieved his goal of Band 8.0."
                </p>
              </div>

              {/* Fake SRS Action Buttons */}
              <div
                className="flex items-center gap-2 w-full pt-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setDemoXP((p) => p + 5);
                    setIsFlipped(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-bold"
                >
                  Chưa nhớ (+5 XP)
                </button>
                <button
                  onClick={() => {
                    soundFx.playSuccess();
                    setDemoXP((p) => p + 15);
                    setIsFlipped(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold"
                >
                  Đã nhớ (+15 XP)
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Live XP Pop Score */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-amber-300">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Điểm XP Thử Nghiệm Của Bạn: </span>
          <span className="font-bold text-white">{demoXP} XP</span>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. ROADMAP: TỪ MẤT GỐC ĐẾN IELTS 7.5+ (CEFR LADDER)                   */}
      {/* ===================================================================== */}
      <section className="w-full max-w-6xl space-y-8">
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            🗺️ Lộ Trình Rõ Ràng
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white">
            Hành Trình Từng Bước Đến Tự Do Ngôn Ngữ
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Không học dàn trải vô định. Lộ trình của bạn được phân cấp chặt chẽ theo khung tham chiếu châu Âu (CEFR).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Level 1: A1 - A2 Foundation */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 transition-all space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-xl bg-teal-500/20 text-teal-300 font-mono font-black text-xs">
                CẤP ĐỘ 1: A1 - A2
              </span>
              <span className="text-xs text-slate-500 font-mono">5,576 Từ vựng</span>
            </div>
            <h4 className="text-xl font-bold text-white">Xây Dựng Nền Móng</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Nắm vững bảng phiên âm quốc tế 44 âm IPA</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Từ vựng các chủ đề đời sống: Gia đình, Ăn uống, Du lịch</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Đặt câu đơn giản và phản xạ hội thoại cơ bản</span>
              </li>
            </ul>
          </div>

          {/* Level 2: B1 - B2 Fluency */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border-2 border-amber-500/40 hover:border-amber-400 transition-all space-y-4 shadow-xl shadow-amber-500/5 relative">
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
              Phổ Biến Nhất
            </div>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-black text-xs">
                CẤP ĐỘ 2: B1 - B2
              </span>
              <span className="text-xs text-slate-500 font-mono">11,010 Từ vựng</span>
            </div>
            <h4 className="text-xl font-bold text-white">Bứt Phá Giao Tiếp & IELTS 6.5</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Nói chuyện trôi chảy, diễn đạt ý kiến chuyên sâu</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Luyện nghe tin tức BBC, CNN, Podcast bản xứ</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Chiến thuật làm bài thi IELTS Reading & Listening 6.5+</span>
              </li>
            </ul>
          </div>

          {/* Level 3: C1 - C2 Mastery */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-mono font-black text-xs">
                CẤP ĐỘ 3: C1 - C2
              </span>
              <span className="text-xs text-slate-500 font-mono">9,925 Từ vựng</span>
            </div>
            <h4 className="text-xl font-bold text-white">Làm Chủ Học Thuật & IELTS 8.0+</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Làm chủ 570 Academic Word List (AWL) chuyên sâu</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Viết luận học thuật IELTS Task 2 mạch lạc chuẩn Band 8.0</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Đọc báo The Economist, Nature và tạp chí khoa học</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. COMMUNITY & SOCIAL PROOF (HỌC VIÊN NÓI GÌ)                        */}
      {/* ===================================================================== */}
      <section className="w-full max-w-6xl space-y-8">
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            ⭐ Đánh Giá Thực Tế
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white">
            Được Tin Dùng Bởi Người Học Nghiêm Túc
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Trần Hoàng Nam',
              role: 'Sinh viên ĐH Bách Khoa • IELTS 8.0',
              comment:
                'Tính năng bấm giờ và làm đề thi IELTS ở đây bám sát kỳ thi thật nhất mình từng làm. Radar câu hỏi giúp mình quản lý thời gian cực kỳ tốt!',
              streak: 'Streak 142 ngày 🔥',
            },
            {
              name: 'Nguyễn Thu Trang',
              role: 'Chuyên viên Marketing • 920 TOEIC',
              comment:
                'Thuật toán SRS nhắc từ trước khi mình kịp quên giúp mình nạp được hơn 3,000 từ vựng chuyên ngành trong 2 tháng mà không hề bị căng thẳng.',
              streak: 'Streak 89 ngày 🔥',
            },
            {
              name: 'Lê Minh Quân',
              role: 'Lập trình viên Software Engineer',
              comment:
                'Giao diện Bento Grid và âm thanh haptic quá đỉnh! Vừa chơi game gõ phím vừa học từ vựng giúp mình tạo thói quen học tiếng Anh mỗi sáng.',
              streak: 'Streak 65 ngày 🔥',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex text-amber-400 gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div>
                  <h5 className="font-bold text-sm text-white">{item.name}</h5>
                  <p className="text-[11px] text-slate-400">{item.role}</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">{item.streak}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 7. FREQUENTLY ASKED QUESTIONS (ACCORDION FAQ)                          */}
      {/* ===================================================================== */}
      <section className="w-full max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            💡 Giải Đáp Thắc Mắc
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
            Câu Hỏi Thường Gặp (FAQ)
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIdx === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setOpenFaqIdx(isOpen ? null : index);
                  }}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-teal-300 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'transform rotate-180 text-teal-400' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 8. FINAL CALL TO ACTION (CTA BANNER)                                   */}
      {/* ===================================================================== */}
      <section className="w-full max-w-6xl">
        <div className="relative overflow-hidden p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border-2 border-teal-500/40 text-center space-y-6 shadow-2xl shadow-teal-500/10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-coral-500/20 rounded-full blur-[100px] pointer-events-none" />

          <span className="px-4 py-1.5 rounded-full bg-slate-950/80 border border-teal-400/40 text-teal-300 font-mono font-bold text-xs">
            🚀 Khởi Đầu Ngay Hôm Nay
          </span>

          <h2 className="text-3xl sm:text-5xl font-display font-black text-white max-w-2xl mx-auto leading-tight">
            Sẵn Sàng Nâng Tầm Tiếng Anh Của Bạn Cùng LinguaFlow?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Học tập miễn phí, không giới hạn bài học, trải nghiệm ngay trên trình duyệt máy tính hoặc điện thoại của bạn.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Button
              variant="accent"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              onClick={() => {
                soundFx.playSuccess();
                setShowPlacementModal(true);
              }}
              className="shadow-2xl shadow-teal-400/25"
            >
              Tạo Lộ Trình Học Miễn Phí
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={<Compass className="w-5 h-5 text-teal-300" />}
              onClick={handleStartLearning}
            >
              Vào Trang Dashboard
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Miễn Phí Khởi Đầu</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Không Cần Thẻ Tín Dụng</span>
            </span>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 9. ENTERPRISE MULTI-COLUMN FOOTER                                     */}
      {/* ===================================================================== */}
      <footer className="w-full max-w-6xl pt-8 pb-12 border-t border-slate-800/80 space-y-8 text-xs text-slate-400">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-coral-500 via-amber-400 to-teal-400 flex items-center justify-center text-slate-950 font-black">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-display font-extrabold text-white">LinguaFlow</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Nền tảng EdTech học tiếng Anh & luyện thi IELTS thế hệ mới, kết hợp khoa học nhận thức não bộ, thuật toán Spaced Repetition và gamification sinh động.
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Designed with Cyber-Academic Luminescence 2.0
            </p>
          </div>

          {/* Col 1: Kỹ năng học tập */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-white uppercase text-[11px] tracking-wider">Học Tiếng Anh</h5>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/vocabulary`} className="hover:text-teal-400 transition-colors">
                  Kho 26.5K Từ Vựng
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/srs`} className="hover:text-teal-400 transition-colors">
                  Thẻ Bài SRS Flashcard
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/speaking`} className="hover:text-teal-400 transition-colors">
                  Phòng Luyện Phát Âm
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/reading`} className="hover:text-teal-400 transition-colors">
                  Reading Lab Báo Chí
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Luyện thi IELTS */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-white uppercase text-[11px] tracking-wider">Luyện Thi IELTS</h5>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/ielts/mock-test`} className="hover:text-amber-400 transition-colors">
                  Thi Thử Full Test
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/ielts/listening`} className="hover:text-amber-400 transition-colors">
                  IELTS Listening
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/ielts/writing`} className="hover:text-amber-400 transition-colors">
                  IELTS Writing Task 1 & 2
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/ielts/speaking`} className="hover:text-amber-400 transition-colors">
                  Speaking Simulator
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Đấu trường & Tiện ích */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-white uppercase text-[11px] tracking-wider">Tiện Ích & Game</h5>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/games`} className="hover:text-coral-400 transition-colors">
                  Arcade Game Center
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/tutor`} className="hover:text-coral-400 transition-colors">
                  Gia Sư AI LingLing
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/community/leaderboard`} className="hover:text-coral-400 transition-colors">
                  Bảng Xếp Hạng Streak
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/dashboard/analytics`} className="hover:text-coral-400 transition-colors">
                  Thống Kê Tiến Độ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <span>© 2026 LinguaFlow. Bản quyền thuộc về đội ngũ phát triển Lingual.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Chính Sách Bảo Mật</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Điều Khoản Sử Dụng</span>
            <span>•</span>
            <span className="text-teal-400 font-bold">Made with ❤️ in Vietnam</span>
          </div>
        </div>
      </footer>

      {/* ===================================================================== */}
      {/* PLACEMENT QUIZ MODAL                                                  */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {showPlacementModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-slate-900 border border-teal-500/30 p-8 space-y-6 shadow-2xl shadow-teal-500/20"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-display font-bold text-white">Đánh Giá Trình Độ Đầu Vào</h3>
                <button
                  onClick={() => setShowPlacementModal(false)}
                  className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-slate-300">
                Hãy chọn trình độ tiếng Anh hiện tại của bạn để LinguaFlow sắp xếp bài học phù hợp nhất:
              </p>

              <div className="space-y-3">
                {[
                  {
                    id: 'beginner',
                    title: 'Mới Bắt Đầu (Beginner - A1)',
                    desc: 'Tôi chưa biết nhiều từ vựng hoặc đã quên nền tảng.',
                  },
                  {
                    id: 'intermediate',
                    title: 'Trung Cấp (Intermediate - A2/B1)',
                    desc: 'Tôi có thể nói câu đơn giản và muốn tăng phản xạ.',
                  },
                  {
                    id: 'advanced',
                    title: 'Nâng Cao (Advanced - B2+)',
                    desc: 'Tôi muốn làm chủ ngữ pháp và mở rộng vốn từ chuyên sâu.',
                  },
                ].map((lvl) => (
                  <div
                    key={lvl.id}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedLevel(lvl.id);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedLevel === lvl.id
                        ? 'bg-teal-500/20 border-teal-400 text-white shadow-lg shadow-teal-500/10'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base">{lvl.title}</span>
                      {selectedLevel === lvl.id && <CheckCircle2 className="w-5 h-5 text-teal-400" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{lvl.desc}</p>
                  </div>
                ))}
              </div>

              <Button variant="accent" size="lg" className="w-full" onClick={handleStartLearning}>
                Vào Lộ Trình Học Ngay
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
