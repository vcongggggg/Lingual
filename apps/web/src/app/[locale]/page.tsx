'use client';

import React, { useState, useMemo, useRef } from 'react';
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
  Mic,
  RotateCcw,
  Activity,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { soundFx } from '@/lib/soundFx';
import { MagneticButton } from '@/components/common/MagneticButton';
import { DecoderText } from '@/components/common/DecoderText';
import ParticleCanvas, { ParticleCanvasRef } from '@/components/games/ParticleCanvas';

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

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
    a: 'Có! Toàn bộ 26,500+ từ vựng, hệ thống ôn tập chống quên thông minh, 6 trò chơi phản xạ và bộ đề thi thử IELTS đều có thể truy cập và luyện tập hoàn toàn miễn phí.',
  },
  {
    q: 'Phương pháp ôn tập chống quên thông minh hoạt động như thế nào?',
    a: 'Dựa trên quy luật ghi nhớ tự nhiên của não bộ, hệ thống sẽ tự động tính toán đúng "thời điểm vàng" trước khi bạn chuẩn bị quên từ vựng (sau 1 ngày, 3 ngày, 7 ngày, 1 tháng) để nhắc bạn mở thẻ ra xem lại một lần. Nhờ vậy, từ vựng sẽ được khắc sâu vào trí nhớ dài hạn mà không cần phải nhồi nhét cực khổ.',
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

const CEFR_DATA: Record<
  string,
  {
    name: string;
    level: string;
    tagline: string;
    targetBand: string;
    wordsCount: string;
    color: string;
    gaugePercent: number;
    skills: string[];
    sampleVocab: { word: string; ipa: string; meaning: string; example: string }[];
  }
> = {
  A1: {
    level: 'A1',
    name: 'Khởi Động',
    tagline: 'Làm quen bảng phiên âm 44 âm IPA & câu chào hỏi cơ bản',
    targetBand: 'IELTS 3.0 - 3.5',
    wordsCount: '2,450+ Từ vựng',
    color: 'teal',
    gaugePercent: 20,
    skills: [
      'Nắm vững 44 âm IPA quốc tế & trọng âm từ',
      'Chào hỏi, giới thiệu bản thân và hỏi đường đơn giản',
      'Đọc hiểu biển báo, hóa đơn và thực đơn nhà hàng',
    ],
    sampleVocab: [
      { word: 'Hello', ipa: '/həˈləʊ/', meaning: 'Xin chào', example: 'Hello, nice to meet you!' },
      { word: 'Family', ipa: '/ˈfæməli/', meaning: 'Gia đình', example: 'I love spending time with my family.' },
      { word: 'Travel', ipa: '/ˈtrævl/', meaning: 'Du lịch', example: 'We travel to Da Nang every summer.' },
    ],
  },
  A2: {
    level: 'A2',
    name: 'Cơ Bản',
    tagline: 'Xây dựng vốn từ đời sống, diễn đạt thói quen và sở thích',
    targetBand: 'IELTS 4.0 - 4.5',
    wordsCount: '3,126+ Từ vựng',
    color: 'emerald',
    gaugePercent: 38,
    skills: [
      'Mô tả thói quen hàng ngày, công việc và kỳ nghỉ',
      'Mua sắm, đặt phòng khách sạn và xử lý tình huống du lịch',
      'Viết email ngắn và tin nhắn giao tiếp thân mật',
    ],
    sampleVocab: [
      { word: 'Routine', ipa: '/ruːˈtiːn/', meaning: 'Thói quen', example: 'Morning running is my daily routine.' },
      { word: 'Schedule', ipa: '/ˈskedʒuːl/', meaning: 'Lịch trình', example: 'I have a busy meeting schedule today.' },
      { word: 'Convenient', ipa: '/kənˈviːniənt/', meaning: 'Thuận tiện', example: 'Living near the subway is very convenient.' },
    ],
  },
  B1: {
    level: 'B1',
    name: 'Tự Tin',
    tagline: 'Làm chủ giao tiếp độc lập, xem video tin tức và trao đổi công việc',
    targetBand: 'IELTS 5.0 - 5.5',
    wordsCount: '4,850+ Từ vựng',
    color: 'amber',
    gaugePercent: 55,
    skills: [
      'Tranh luận quan điểm, giải thích lý do và kế hoạch tương lai',
      'Nghe hiểu các bài thuyết trình TED Talk và Podcast trung cấp',
      'Viết bài luận ngắn mạch lạc với liên từ liên kết câu',
    ],
    sampleVocab: [
      { word: 'Environment', ipa: '/ɪnˈvaɪrənmənt/', meaning: 'Môi trường', example: 'Protecting the environment is essential.' },
      { word: 'Contribute', ipa: '/kənˈtrɪbjuːt/', meaning: 'Đóng góp', example: 'We all contribute to community projects.' },
      { word: 'Opportunity', ipa: '/ˌɒpəˈtjuːnəti/', meaning: 'Cơ hội', example: 'This internship is a golden opportunity.' },
    ],
  },
  B2: {
    level: 'B2',
    name: 'Trôi Chảy',
    tagline: 'Bứt phá điểm số IELTS 6.5+, phản xạ tự nhiên không cần dịch nhẩm',
    targetBand: 'IELTS 6.5 - 7.0',
    wordsCount: '6,160+ Từ vựng',
    color: 'orange',
    gaugePercent: 72,
    skills: [
      'Giao tiếp trôi chảy với người bản xứ với tốc độ tự nhiên',
      'Xử lý bài đọc học thuật phức tạp và phân tích biểu đồ Task 1',
      'Sử dụng thành ngữ (Idioms) và Collocations tự nhiên',
    ],
    sampleVocab: [
      { word: 'Substantial', ipa: '/səbˈstænʃl/', meaning: 'Đáng kể', example: 'They achieved substantial progress in AI.' },
      { word: 'Collaborate', ipa: '/kəˈlæbəreɪt/', meaning: 'Hợp tác', example: 'Engineers collaborate on renewable energy.' },
      { word: 'Perspective', ipa: '/pəˈspektɪv/', meaning: 'Góc nhìn', example: 'Different cultures offer fresh perspectives.' },
    ],
  },
  C1: {
    level: 'C1',
    name: 'Học Thuật',
    tagline: 'Chinh phục Academic Word List (AWL), viết luận học thuật IELTS 7.5+',
    targetBand: 'IELTS 7.5 - 8.0',
    wordsCount: '5,600+ Từ vựng',
    color: 'purple',
    gaugePercent: 88,
    skills: [
      'Hiểu sâu sắc các văn bản trừu tượng, ẩn dụ và hàm ý tinh tế',
      'Viết luận nghiên cứu khoa học, phản biện luận điểm đa chiều',
      'Diễn đạt ý tưởng uyển chuyển không bị vấp hay tìm từ',
    ],
    sampleVocab: [
      { word: 'Perseverance', ipa: '/ˌpɜːsəˈvɪərəns/', meaning: 'Kiên trì', example: 'Perseverance guarantees long-term mastery.' },
      { word: 'Ubiquitous', ipa: '/juːˈbɪkwɪtəs/', meaning: 'Phổ biến khắp nơi', example: 'Digital payments have become ubiquitous.' },
      { word: 'Eloquent', ipa: '/ˈeləkwənt/', meaning: 'Lưu loát / Hùng biện', example: 'She gave an eloquent keynote address.' },
    ],
  },
  C2: {
    level: 'C2',
    name: 'Bản Xứ',
    tagline: 'Làm chủ ngôn ngữ như người bản xứ có học vấn cao, phản xạ trực giác',
    targetBand: 'IELTS 8.5 - 9.0',
    wordsCount: '4,325+ Từ vựng',
    color: 'cyan',
    gaugePercent: 100,
    skills: [
      'Đọc hiểu tài liệu triết học, văn học cổ điển và nghiên cứu chuyên sâu',
      'Nắm bắt các sắc thái hài hước, châm biếm và ngữ điệu tinh vi',
      'Đạt chuẩn giám khảo khảo thí quốc tế IELTS/Cambridge',
    ],
    sampleVocab: [
      { word: 'Serendipity', ipa: '/ˌserənˈdɪpəti/', meaning: 'Cơ duyên bất ngờ', example: 'Meeting my co-founder was pure serendipity.' },
      { word: 'Ephemeral', ipa: '/ɪˈfemərəl/', meaning: 'Phù du / Thoáng qua', example: 'Trends in social media are often ephemeral.' },
      { word: 'Quintessential', ipa: '/ˌkwɪntɪˈsenʃl/', meaning: 'Tinh túy / Điển hình', example: 'It was the quintessential Cambridge library.' },
    ],
  },
};

export default function LandingPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const router = useRouter();
  const particleRef = useRef<ParticleCanvasRef>(null);

  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('beginner');

  // Parallax 3D Tilt for Landing Flashcard Demo
  const [landingCardTilt, setLandingCardTilt] = useState({ x: 0, y: 0 });
  const [landingCardGlow, setLandingCardGlow] = useState({ x: 50, y: 50 });

  const handleLandingCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setLandingCardTilt({ x: (y - 0.5) * -16, y: (x - 0.5) * 16 });
    setLandingCardGlow({ x: Math.round(x * 100), y: Math.round(y * 100) });
  };

  const handleLandingCardMouseLeave = () => {
    setLandingCardTilt({ x: 0, y: 0 });
  };

  // Product Studio Spotlight Glow tracking
  const [studioGlow, setStudioGlow] = useState({ x: 50, y: 20 });
  const handleStudioMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setStudioGlow({ x: Math.round(x), y: Math.round(y) });
  };

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

  // Live IELTS Simulator HUD Countdown Timer (Ticking dynamically)
  const [mockTimerSeconds, setMockTimerSeconds] = useState(3504); // 58:24
  React.useEffect(() => {
    const timer = setInterval(() => {
      setMockTimerSeconds((prev) => (prev > 0 ? prev - 1 : 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // FAQ open index
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // =========================================================================
  // DYNAMIC PLAYGROUND & INTERACTIVE STUDIO STATE
  // =========================================================================
  const [studioTab, setStudioTab] = useState<'speaking' | 'ielts' | 'srs' | 'arcade'>('speaking');

  // Tab 1: Speaking Lab State
  const [speakingState, setSpeakingState] = useState<'idle' | 'recording' | 'analyzing' | 'scored'>('idle');
  const [activeSyllable, setActiveSyllable] = useState<number | null>(null);

  const handleSimulateSpeaking = () => {
    soundFx.playClick();
    setSpeakingState('recording');
    setTimeout(() => {
      setSpeakingState('analyzing');
      setTimeout(() => {
        setSpeakingState('scored');
        soundFx.playSuccess();
        setDemoXP((prev) => prev + 20);
      }, 1200);
    }, 1400);
  };

  const playSyllable = (syllableIpa: string, index: number) => {
    soundFx.playClick();
    setActiveSyllable(index);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanSound = syllableIpa.replace(/[\/ˈˌ]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanSound);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Tab 2: IELTS Cambridge Question Simulator State
  const [ieltsSelectedOption, setIeltsSelectedOption] = useState<number | null>(null);
  const [ieltsFeedback, setIeltsFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');

  const handleIeltsSelect = (index: number) => {
    setIeltsSelectedOption(index);
    if (index === 1) {
      setIeltsFeedback('correct');
      soundFx.playSuccess();
      setDemoXP((prev) => prev + 25);
      particleRef.current?.spawnConfetti();
    } else {
      setIeltsFeedback('incorrect');
      soundFx.playError();
    }
  };

  // Tab 3: SRS Memory Curve Slider
  const [srsDays, setSrsDays] = useState<number>(7);

  // Tab 4: Arcade Typing Challenge
  const [typingInput, setTypingInput] = useState('');
  const [typingStreak, setTypingStreak] = useState(0);
  const [typingSuccess, setTypingSuccess] = useState(false);
  const targetTypingWord = 'RESILIENCE';

  const handleTypingChange = (val: string) => {
    setTypingInput(val);
    if (val.trim().toUpperCase() === targetTypingWord) {
      setTypingSuccess(true);
      setTypingStreak((prev) => prev + 1);
      soundFx.playSuccess();
      setDemoXP((prev) => prev + 30);
      particleRef.current?.spawnConfetti();
    }
  };

  const handleResetTyping = () => {
    soundFx.playClick();
    setTypingInput('');
    setTypingSuccess(false);
  };

  // CEFR Explorer Interactive State
  const [activeCefr, setActiveCefr] = useState('B2');

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
    <div className="flex flex-col items-center justify-center py-6 sm:py-10 space-y-24 w-full relative">
      {/* Confetti & Particle FX Canvas */}
      <ParticleCanvas ref={particleRef} />

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
          className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-tight"
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
          Đột phá khả năng ngôn ngữ với phương pháp <strong className="text-white font-semibold">ôn tập chống quên thông minh</strong>, phòng luyện thi <strong className="text-white font-semibold">IELTS mô phỏng chuẩn Cambridge</strong>, đấu trường <strong className="text-white font-semibold">6 trò chơi phản xạ</strong>, và gia sư <strong className="text-amber-300 font-semibold">AI LingLing</strong> đồng hành 24/7.
        </motion.p>

        {/* Dual Primary Call-To-Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 pt-2 relative z-20"
        >
          <MagneticButton magneticPull={0.35} maxOffset={12}>
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
          </MagneticButton>

          <MagneticButton magneticPull={0.35} maxOffset={12}>
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
          </MagneticButton>
        </motion.div>

        {/* ===================================================================== */}
        {/* INTERACTIVE 3D ORBITING VOCAB SCENE (Beloved 3D Physics Experience) */}
        {/* ===================================================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="w-full pt-2 pb-2 relative z-20"
        >
          <Hero3DVisual />
        </motion.div>

        {/* Interactive Live Search Bar Preview (Instant Aha Moment) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="max-w-2xl mx-auto pt-8 relative overflow-visible"
        >
          {/* Breaking the Box Mascot Leaning on Search Bar */}
          <div className="absolute -top-6 right-6 sm:right-10 w-16 sm:w-20 h-16 sm:h-20 z-20 pointer-events-none transition-transform duration-300 hover:scale-110">
            <img
              src="/mascot/lingling_waving_bubble.png"
              alt="Mascot LingLing Waving"
              className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
            />
          </div>

          <div className="p-2.5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl relative z-10">
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
                  <DecoderText text={activeWord.word} durationMs={320} className="text-lg font-black text-white" />
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

      </section>

      {/* ===================================================================== */}
      {/* 2. REAL-TIME ACTIVITY TICKER & METRIC MATRIX                          */}
      {/* ===================================================================== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={sectionVariants}
        className="w-full max-w-6xl space-y-4"
      >
        {/* Live Activity Marquee Ticker */}
        <div className="p-3 px-4 rounded-2xl bg-slate-900/80 border border-teal-500/30 backdrop-blur-xl shadow-lg flex items-center justify-between gap-3 overflow-hidden text-xs">
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] hidden sm:inline">
              Trực Tiếp
            </span>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="text-amber-400 font-bold">⚡ Duy Vỹ</span> vừa hoàn thành bài học "Greetings" (+20 XP)
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="text-teal-400 font-bold">🎯 Thu Giang</span> vừa đạt Band 7.5 IELTS Academic Reading
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="text-orange-400 font-bold">🔥 Bản Lưu Thị</span> đạt mốc 45 Ngày Streak liên tục
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="text-purple-400 font-bold">🧠 Nhân Nguyễn</span> vừa ôn tập 50 thẻ ghi nhớ thông minh
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="text-cyan-400 font-bold">🎙️ Minh Quân</span> đạt 98% điểm phát âm IPA
              </span>
              <span className="text-slate-600">•</span>
              {/* Duplicate track for seamless infinite scroll */}
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="text-amber-400 font-bold">⚡ Duy Vỹ</span> vừa hoàn thành bài học "Greetings" (+20 XP)
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="text-teal-400 font-bold">🎯 Thu Giang</span> vừa đạt Band 7.5 IELTS Academic Reading
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="text-orange-400 font-bold">🔥 Bản Lưu Thị</span> đạt mốc 45 Ngày Streak liên tục
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="text-purple-400 font-bold">🧠 Nhân Nguyễn</span> vừa ôn tập 50 thẻ ghi nhớ thông minh
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="text-cyan-400 font-bold">🎙️ Minh Quân</span> đạt 98% điểm phát âm IPA
              </span>
            </div>
          </div>

          <div className="shrink-0 text-slate-400 font-mono text-[11px] hidden md:block">
            <span className="text-teal-300 font-bold">2,840</span> người đang online
          </div>
        </div>

        {/* 4 Interactive Dynamic Metric Cards with Breaking the Box Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-7 pt-7 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-2xl backdrop-blur-xl overflow-visible">
          <div className="relative p-5 pt-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-teal-500/60 hover:bg-slate-900/90 transition-all duration-300 group overflow-visible shadow-xl">
            <div className="absolute -top-3.5 -right-2 w-9 h-9 rounded-xl bg-slate-900 border border-teal-500/40 flex items-center justify-center shadow-lg group-hover:-translate-y-1.5 group-hover:scale-120 group-hover:rotate-6 transition-all duration-300 z-10">
              <BookOpen className="w-4 h-4 text-teal-400" />
            </div>
            <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block mb-1">Từ Vựng Chuẩn</span>
            <span className="block text-2xl sm:text-3xl font-display font-extrabold text-white group-hover:text-teal-300 transition-colors">
              26,500+
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Oxford & AWL A1-C2</span>
          </div>

          <div className="relative p-5 pt-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/60 hover:bg-slate-900/90 transition-all duration-300 group overflow-visible shadow-xl">
            <div className="absolute -top-3.5 -right-2 w-9 h-9 rounded-xl bg-slate-900 border border-amber-500/40 flex items-center justify-center shadow-lg group-hover:-translate-y-1.5 group-hover:scale-120 group-hover:rotate-6 transition-all duration-300 z-10">
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">Phòng Thi Thử IELTS</span>
            <span className="block text-2xl sm:text-3xl font-display font-extrabold text-white group-hover:text-amber-300 transition-colors">
              100+ Đề
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Cambridge 4 Kỹ Năng</span>
          </div>

          <div className="relative p-5 pt-6 rounded-2xl bg-slate-950/70 border border-emerald-500/60 hover:bg-slate-900/90 transition-all duration-300 group overflow-visible shadow-xl">
            <div className="absolute -top-3.5 -right-2 w-9 h-9 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-center shadow-lg group-hover:-translate-y-1.5 group-hover:scale-120 group-hover:rotate-6 transition-all duration-300 z-10">
              <Brain className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">Tỷ Lệ Nhớ Từ</span>
            <span className="block text-2xl sm:text-3xl font-display font-extrabold text-white group-hover:text-emerald-300 transition-colors">
              99.4%
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Nhắc Ôn Tập Đúng Lúc</span>
          </div>

          <div className="relative p-5 pt-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/60 hover:bg-slate-900/90 transition-all duration-300 group overflow-visible shadow-xl">
            <div className="absolute -top-3.5 -right-2 w-9 h-9 rounded-xl bg-slate-900 border border-purple-500/40 flex items-center justify-center shadow-lg group-hover:-translate-y-1.5 group-hover:scale-120 group-hover:rotate-6 transition-all duration-300 z-10">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block mb-1">AI Tutor 24/7</span>
            <span className="block text-2xl sm:text-3xl font-display font-extrabold text-white group-hover:text-purple-300 transition-colors">
              0.5 Giây
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Phản hồi & Sửa bài tức thì</span>
          </div>
        </div>
      </motion.section>

      {/* ===================================================================== */}
      {/* 3. INTERACTIVE PRODUCT EXPERIENCE STUDIO                              */}
      {/* ===================================================================== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={sectionVariants}
        className="w-full max-w-6xl space-y-8"
      >
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span>Phòng Trải Nghiệm Tương Tác Trực Tiếp</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Thử Nghiệm Mọi Tính Năng Ngay Trên Trang Chủ
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Không chỉ là lời giới thiệu. Hãy bấm vào các công cụ bên dưới để trực tiếp trải nghiệm sự vượt trội của LinguaFlow!
          </p>
        </div>

        {/* Interactive Studio Container with Dynamic Spotlight Glow */}
        <div
          onMouseMove={handleStudioMouseMove}
          className="relative rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-2xl overflow-hidden p-5 sm:p-8 space-y-6 group"
        >
          {/* Dynamic Spotlight Glow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-40 transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${studioGlow.x}% ${studioGlow.y}%, rgba(20, 184, 166, 0.2), transparent 70%)`,
            }}
          />
          {/* Segmented Tab Switcher */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 overflow-x-auto">
            {[
              { id: 'speaking', label: 'Luyện Phát Âm & IPA', icon: <Mic className="w-4 h-4" /> },
              { id: 'ielts', label: 'Thi Thử IELTS Cambridge', icon: <Trophy className="w-4 h-4" /> },
              { id: 'srs', label: 'Ôn Tập Chống Quên Thông Minh', icon: <Brain className="w-4 h-4" /> },
              { id: 'arcade', label: 'Đấu Trường Game Phản Xạ', icon: <Gamepad2 className="w-4 h-4" /> },
            ].map((tab) => {
              const isActive = studioTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundFx.playClick();
                    setStudioTab(tab.id as any);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-lg shadow-teal-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: AI SPEAKING & IPA LAB */}
          {studioTab === 'speaking' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Radio className="w-4 h-4" /> Câu Luyện Âm Mẫu:
                  </span>
                  <p className="text-lg sm:text-xl font-display font-bold text-white">
                    "Perseverance is key to mastering English."
                  </p>
                  <p className="text-xs text-slate-400">
                    Sự kiên trì là chìa khóa để làm chủ tiếng Anh.
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => playWordAudio('Perseverance is key to mastering English')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold transition-all shadow-md"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Nghe Giọng Bản Xứ</span>
                  </button>
                  <button
                    onClick={handleSimulateSpeaking}
                    disabled={speakingState === 'recording' || speakingState === 'analyzing'}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg hover:shadow-teal-500/30 disabled:opacity-50"
                  >
                    <Mic className="w-4 h-4" />
                    <span>
                      {speakingState === 'recording'
                        ? 'Đang lắng nghe...'
                        : speakingState === 'analyzing'
                        ? 'AI đang chấm điểm...'
                        : 'Bấm Để Nói Thử'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Syllable-by-syllable Interactive IPA Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Chạm vào từng âm tiết để nghe phát âm riêng biệt & xem trọng âm:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { text: 'Per', ipa: '/pɜː/', tip: 'Nguyên âm dài, giữ khẩu hình tròn nhẹ', stress: false },
                    { text: 'se', ipa: '/sɪ/', tip: 'Âm nhẹ lướt nhanh, hạ thấp giọng', stress: false },
                    { text: 've', ipa: '/ˈvɪə/', tip: 'TRỌNG ÂM CHÍNH: Nhấn mạnh & ngân cao', stress: true },
                    { text: 'rance', ipa: '/rəns/', tip: 'Âm đuôi /s/ xì nhẹ gió qua kẽ răng', stress: false },
                  ].map((syl, i) => (
                    <button
                      key={i}
                      onClick={() => playSyllable(syl.ipa, i)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        activeSyllable === i
                          ? 'bg-teal-500/20 border-teal-400 ring-2 ring-teal-400/30 shadow-lg'
                          : syl.stress
                          ? 'bg-amber-500/10 border-amber-500/40 hover:bg-amber-500/20'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-extrabold text-white">{syl.text}</span>
                        <span className={`text-xs font-mono font-bold ${syl.stress ? 'text-amber-400' : 'text-teal-400'}`}>
                          {syl.ipa}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{syl.tip}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Sound Wave Visualizer & AI Score */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 h-12 overflow-hidden flex-1 justify-center sm:justify-start">
                  {[35, 60, 85, 40, 95, 70, 50, 90, 65, 80, 40, 75, 95, 55, 60, 45, 80, 65, 50, 90, 40, 75, 60, 35].map(
                    (h, i) => (
                      <div
                        key={i}
                        className={`w-1.5 rounded-full transition-all duration-300 ${
                          speakingState === 'recording'
                            ? 'bg-gradient-to-t from-rose-500 to-amber-400 animate-pulse'
                            : 'bg-gradient-to-t from-purple-500 to-teal-400'
                        }`}
                        style={{
                          height: speakingState === 'recording' ? `${Math.max(25, (h * 1.3) % 100)}%` : `${h}%`,
                        }}
                      />
                    )
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {speakingState === 'scored' ? (
                    <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl">
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-400 block">AI Score: 96/100</span>
                        <span className="text-[10px] text-slate-300">Chuẩn ngữ điệu bản xứ!</span>
                      </div>
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">
                      {speakingState === 'recording'
                        ? '🎙️ Đang thu âm giọng bạn...'
                        : speakingState === 'analyzing'
                        ? '⚡ AI đang phân tích từng âm vị IPA...'
                        : 'Nhấn "Bấm Để Nói Thử" để trải nghiệm'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IELTS CAMBRIDGE EXAM SIMULATOR */}
          {studioTab === 'ielts' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Simulator Exam Bar */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-white font-bold">Cambridge IELTS 19 Academic • Reading Section 3</span>
                </div>
                <div className="text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30">
                  ⏱️ {formatTimer(mockTimerSeconds)} Còn lại
                </div>
              </div>

              {/* Reading Passage & Interactive Question */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block">
                    Đoạn Văn Bài Đọc (Reading Excerpt):
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif">
                    "...Cognitive neuroscience proves that memory consolidation is fundamentally enhanced when review intervals are strategically spaced. Unlike massed repetition (cramming), which induces rapid cognitive fatigue and poor retrieval strength, the <strong>Spaced Repetition System (SRS)</strong> prompts the brain to retrieve information right as memory decay begins, thereby triggering deep synaptic reinforcement..."
                  </p>
                </div>

                <div className="lg:col-span-6 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                    Câu Hỏi Trắc Nghiệm:
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white">
                    According to the text, why does spaced repetition outperform cramming?
                  </p>

                  <div className="space-y-2 pt-1">
                    {[
                      'A. It allows students to study 10 hours continuously without breaks.',
                      'B. It stimulates synaptic reinforcement right as memory decay begins.',
                      'C. It directly translates English sentences into native languages.',
                      'D. It replaces listening and speaking practice entirely.',
                    ].map((opt, idx) => {
                      const isSelected = ieltsSelectedOption === idx;
                      const isCorrect = idx === 1;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleIeltsSelect(idx)}
                          className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? isCorrect
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                                : 'bg-rose-500/20 border-rose-400 text-rose-200'
                              : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <span>{opt}</span>
                          {isSelected && (
                            <span>{isCorrect ? <Check className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {ieltsFeedback === 'correct' && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                      <span>🎉 Chính Xác! Bạn vừa kiếm được <strong>+25 XP</strong> chuẩn Cambridge!</span>
                      <span className="font-mono font-bold">Band 8.0</span>
                    </div>
                  )}
                  {ieltsFeedback === 'incorrect' && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                      Chưa đúng. Gợi ý: Hãy đọc lại câu cuối của đoạn văn mẫu bên trái!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SMART MEMORY & REVIEW MATRIX */}
          {studioTab === 'srs' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base sm:text-lg font-display font-bold text-white">
                    Bí Quyết Ghi Nhớ Sâu: Tự Động Nhắc Nhở Đúng "Thời Điểm Vàng"
                  </h4>
                  <p className="text-xs text-slate-400">
                    Bấm chọn mốc thời gian bên dưới để so sánh sự khác biệt giữa cách học thông thường và công nghệ nhắc từ thông minh của LinguaFlow:
                  </p>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold shrink-0">
                  Mốc Thời Gian: Sau {srsDays} Ngày
                </div>
              </div>

              {/* Interactive Day Stepper */}
              <div className="flex items-center gap-2">
                {[1, 3, 7, 30, 90].map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      soundFx.playClick();
                      setSrsDays(d);
                    }}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      srsDays === d
                        ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                        : 'bg-slate-950/70 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {d === 1 ? '1 Ngày' : d === 3 ? '3 Ngày' : d === 7 ? '7 Ngày' : d === 30 ? '1 Tháng' : '3 Tháng'}
                  </button>
                ))}
              </div>

              {/* Comparison Meters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-rose-500/30 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-rose-400 font-bold">❌ Cách Học Thông Thường (Không có nhắc nhở)</span>
                    <span className="font-mono text-rose-300 font-bold">
                      {srsDays === 1 ? '54%' : srsDays === 3 ? '35%' : srsDays === 7 ? '26%' : srsDays === 30 ? '18%' : '10%'}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-rose-500 transition-all duration-500"
                      style={{
                        width: `${srsDays === 1 ? 54 : srsDays === 3 ? 35 : srsDays === 7 ? 26 : srsDays === 30 ? 18 : 10}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">Không có lịch nhắc ôn tập, não bộ nhanh chóng quên dần phần lớn từ vựng.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-teal-500/40 space-y-2 shadow-lg shadow-teal-500/5">
                  <div className="flex justify-between text-xs">
                    <span className="text-teal-400 font-bold">✅ Ôn Tập Thông Minh Cùng LinguaFlow</span>
                    <span className="font-mono text-teal-300 font-bold">
                      {srsDays === 1 ? '99%' : srsDays === 3 ? '98%' : srsDays === 7 ? '97%' : srsDays === 30 ? '95%' : '94%'}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-500"
                      style={{
                        width: `${srsDays === 1 ? 99 : srsDays === 3 ? 98 : srsDays === 7 ? 97 : srsDays === 30 ? 95 : 94}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">Tự động nhắc bạn xem lại đúng lúc sắp quên, giúp từ vựng ngấm sâu vào trí nhớ dài hạn.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ARCADE SPEED TYPING ARENA */}
          {studioTab === 'arcade' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-2">
                    <span>Thử Thách Đua Gõ Phím Phản Xạ Thần Tốc</span>
                    <span className="px-2 py-0.5 rounded-md bg-coral-500/20 text-coral-300 text-[10px] font-mono">
                      Speed Typing WPM
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Gõ chính xác các ký tự của từ tiếng Anh bên dưới để ghi điểm combo:
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30">
                    🔥 COMBO x{typingStreak}
                  </span>
                  <button
                    onClick={handleResetTyping}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Đổi từ khác"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Target Word Display with Letter Matching */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
                <div className="flex justify-center items-center gap-1.5 sm:gap-2 text-2xl sm:text-4xl font-mono font-black tracking-widest">
                  {targetTypingWord.split('').map((char, i) => {
                    const typedChar = typingInput[i]?.toUpperCase();
                    const isMatched = typedChar === char;
                    const isWrong = typedChar && typedChar !== char;
                    return (
                      <span
                        key={i}
                        className={`w-8 sm:w-12 h-12 sm:h-16 rounded-xl border flex items-center justify-center transition-all ${
                          isMatched
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20 scale-105'
                            : isWrong
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                            : 'bg-slate-900 border-slate-800 text-slate-600'
                        }`}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>

                <div className="max-w-sm mx-auto">
                  <input
                    type="text"
                    value={typingInput}
                    onChange={(e) => handleTypingChange(e.target.value)}
                    disabled={typingSuccess}
                    placeholder="Gõ chữ cái ở đây (ví dụ: RESILIENCE)..."
                    className="w-full text-center px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 font-bold"
                    autoFocus
                  />
                </div>

                {typingSuccess && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold text-xs animate-bounce">
                    <span>🎉 HOÀN THÀNH XUẤT SẮC! +30 XP</span>
                    <button
                      onClick={handleResetTyping}
                      className="underline ml-2 text-white hover:text-emerald-200"
                    >
                      Thử lại từ mới
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.section>

      {/* ===================================================================== */}
      {/* 4. INTERACTIVE FLASHCARD STUDIO DEMO (THỬ LẬT THẺ NGAY TRÊN WEB)       */}
      {/* ===================================================================== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={sectionVariants}
        className="w-full max-w-4xl space-y-6 text-center"
      >
        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            ✨ Trải Nghiệm Thực Tế
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Thử Nghiệm Thẻ Flashcard 3D Tương Tác
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
            Nhấp chuột vào thẻ bài dưới đây để lật mặt sau và đánh giá mức độ ghi nhớ:
          </p>
        </div>

        {/* 3D Flip Card Container with Parallax 3D Tilt & Dynamic Spotlight */}
        <div
          className="relative mx-auto w-full max-w-md h-72 cursor-pointer select-none"
          style={{ perspective: 1200 }}
          onMouseMove={handleLandingCardMouseMove}
          onMouseLeave={handleLandingCardMouseLeave}
          onClick={() => {
            soundFx.playWoosh();
            setIsFlipped(!isFlipped);
          }}
        >
          <motion.div
            className="w-full h-full relative rounded-3xl"
            style={{ transformStyle: 'preserve-3d' }}
            initial={false}
            animate={{
              rotateX: landingCardTilt.x,
              rotateY: (isFlipped ? 180 : 0) + (isFlipped ? -landingCardTilt.y : landingCardTilt.y),
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            {/* FRONT OF FLASHCARD */}
            <div
              className="absolute inset-0 p-8 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-900/90 to-slate-800 border-2 border-teal-500/40 shadow-2xl flex flex-col justify-between items-center text-center select-none overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(0deg)',
                transformStyle: 'preserve-3d',
                pointerEvents: isFlipped ? 'none' : 'auto',
              }}
            >
              {/* Dynamic Cursor Spotlight Glow */}
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-60 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(350px circle at ${landingCardGlow.x}% ${landingCardGlow.y}%, rgba(20, 184, 166, 0.25), transparent 70%)`,
                }}
              />

              <div
                className="w-full flex items-center justify-between text-xs font-mono relative z-10"
                style={{ transform: 'translateZ(20px)' }}
              >
                <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 font-bold">
                  Oxford 3000 • C1
                </span>
                <span className="text-slate-400">Click để lật 🔄</span>
              </div>

              <div
                className="space-y-2 relative z-10"
                style={{ transform: 'translateZ(35px)' }}
              >
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide drop-shadow-md">
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

              <span
                className="text-xs text-slate-500 font-medium relative z-10"
                style={{ transform: 'translateZ(15px)' }}
              >
                Chạm vào thẻ để xem dịch nghĩa và câu ví dụ
              </span>
            </div>

            {/* BACK OF FLASHCARD */}
            <div
              className="absolute inset-0 p-8 rounded-3xl bg-gradient-to-tr from-slate-950 via-teal-950/40 to-slate-900 border-2 border-teal-400 shadow-2xl flex flex-col justify-between items-center text-center select-none overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                transformStyle: 'preserve-3d',
                pointerEvents: isFlipped ? 'auto' : 'none',
              }}
            >
              {/* Dynamic Cursor Spotlight Glow Back */}
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-60 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(350px circle at ${landingCardGlow.x}% ${landingCardGlow.y}%, rgba(20, 184, 166, 0.25), transparent 70%)`,
                }}
              />

              <div
                className="w-full flex items-center justify-between text-xs font-mono relative z-10"
                style={{ transform: 'translateZ(20px)' }}
              >
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  Danh từ (Noun)
                </span>
                <span className="text-teal-400 font-bold">Đã lật thẻ ✨</span>
              </div>

              <div
                className="space-y-3 relative z-10"
                style={{ transform: 'translateZ(30px)' }}
              >
                <p className="text-xl font-bold text-white drop-shadow-md">
                  Sự kiên trì, bền bỉ, không nản lòng trước khó khăn.
                </p>
                <p className="text-xs text-slate-300 font-mono italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  "Through perseverance and hard work, he achieved his goal of Band 8.0."
                </p>
              </div>

              {/* Fake SRS Action Buttons */}
              <div
                className="flex items-center gap-2 w-full pt-1 relative z-10"
                style={{ transform: 'translateZ(25px)' }}
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
      </motion.section>

      {/* ===================================================================== */}
      {/* 5. INTERACTIVE CEFR MASTERY JOURNEY (A1 → C2)                         */}
      {/* ===================================================================== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={sectionVariants}
        className="w-full max-w-6xl space-y-8"
      >
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Lộ Trình Từng Bước Chuẩn Châu Âu</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Khám Phá Hành Trình Chinh Phục Từng Cấp Độ
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Không học dàn trải vô định. Hãy bấm vào từng cấp độ bên dưới để xem chi tiết từ vựng mẫu, mục tiêu IELTS và kỹ năng đạt được:
          </p>
        </div>

        {/* Level Selector Pills */}
        <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-2xl mx-auto overflow-x-auto">
          {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => {
            const isCurrent = activeCefr === lvl;
            return (
              <button
                key={lvl}
                onClick={() => {
                  soundFx.playClick();
                  setActiveCefr(lvl);
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                  isCurrent
                    ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black shadow-lg shadow-teal-500/25 scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Cấp Độ {lvl}
              </button>
            );
          })}
        </div>

        {/* Dynamic Level Showcase Card */}
        {(() => {
          const data = CEFR_DATA[activeCefr] || CEFR_DATA.B2;
          return (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-teal-500/30 shadow-2xl backdrop-blur-2xl space-y-6">
              {/* Header Split */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-xl bg-teal-500/20 text-teal-300 font-mono font-extrabold text-xs">
                      CEFR {data.level}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                      {data.name}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    {data.tagline}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-amber-500/30 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Mục Tiêu</span>
                    <span className="text-sm font-extrabold text-amber-400 font-mono">{data.targetBand}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-teal-500/30 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Quy Mô</span>
                    <span className="text-sm font-extrabold text-teal-300 font-mono">{data.wordsCount}</span>
                  </div>
                </div>
              </div>

              {/* Body: Skills Checklist (Left) & Sample Vocab Chips (Right) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-6 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block">
                    Kỹ Năng Đạt Được Ở Cấp Độ Này:
                  </span>
                  <ul className="space-y-2.5">
                    {data.skills.map((skill, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <Link href={`/${locale}/vocabulary`}>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<ArrowRight className="w-4 h-4" />}
                        className="text-xs font-bold"
                      >
                        Khám Phá Kho Từ {data.level}
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="md:col-span-6 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                    3 Từ Vựng Tiêu Biểu (Chạm để nghe):
                  </span>
                  <div className="space-y-2">
                    {data.sampleVocab.map((v, vIdx) => (
                      <div
                        key={vIdx}
                        onClick={() => playWordAudio(v.word)}
                        className="p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-teal-500/40 transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white text-sm group-hover:text-teal-300 transition-colors">
                              {v.word}
                            </span>
                            <span className="text-xs font-mono text-cyan-400">{v.ipa}</span>
                          </div>
                          <p className="text-xs text-slate-400">{v.meaning}</p>
                          <p className="text-[11px] text-slate-500 italic truncate max-w-sm">"{v.example}"</p>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-900 group-hover:bg-teal-500/20 text-slate-400 group-hover:text-teal-300 transition-colors shrink-0">
                          <Volume2 className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </motion.section>

      {/* ===================================================================== */}
      {/* 6. COMMUNITY & SOCIAL PROOF (HỌC VIÊN NÓI GÌ)                        */}
      {/* ===================================================================== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={sectionVariants}
        className="w-full max-w-6xl space-y-8"
      >
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            ⭐ Đánh Giá Thực Tế
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
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
                'Tính năng nhắc từ thông minh đúng lúc sắp quên giúp mình nạp được hơn 3,000 từ vựng chuyên ngành trong 2 tháng mà không hề bị căng thẳng hay quá tải.',
              streak: 'Streak 89 ngày 🔥',
            },
            {
              name: 'Lê Minh Quân',
              role: 'Lập trình viên Software Engineer',
              comment:
                'Giao diện không gian vũ trụ và hiệu ứng âm thanh quá đỉnh! Vừa chơi game gõ phím vừa học từ vựng giúp mình tạo thói quen học tiếng Anh mỗi sáng.',
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
      </motion.section>

      {/* ===================================================================== */}
      {/* 7. FREQUENTLY ASKED QUESTIONS (ACCORDION FAQ)                          */}
      {/* ===================================================================== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={sectionVariants}
        className="w-full max-w-4xl space-y-6"
      >
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            💡 Giải Đáp Thắc Mắc
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
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
      </motion.section>

      {/* ===================================================================== */}
      {/* 8. FINAL CALL TO ACTION (CTA BANNER)                                   */}
      {/* ===================================================================== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={sectionVariants}
        className="w-full max-w-6xl"
      >
        <div className="relative overflow-hidden p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border-2 border-teal-500/40 text-center space-y-6 shadow-2xl shadow-teal-500/10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-coral-500/20 rounded-full blur-[100px] pointer-events-none" />

          <span className="px-4 py-1.5 rounded-full bg-slate-950/80 border border-teal-400/40 text-teal-300 font-mono font-bold text-xs">
            🚀 Khởi Đầu Ngay Hôm Nay
          </span>

          <h2 className="text-2xl sm:text-4xl font-display font-bold text-white max-w-2xl mx-auto leading-tight">
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
      </motion.section>

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
