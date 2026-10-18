'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Volume2,
  Check,
  RotateCcw,
  Sparkles,
  Pin,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  BookOpen,
} from 'lucide-react';
import { LingLing } from '../../components/ui/LingLing';
import { StampSlam } from '../../components/ui/StampSlam';

/* =========================================================================
   DỮ LIỆU THỰC: 2 ĐOẠN VĂN CỤM TỪ (DÁN CỤM LÊN BẢNG)
   ========================================================================= */
interface CollocationItem {
  id: string;
  phrase: string;
  phonetic: string;
  translation: string;
  partBreakdown: string;
  hintSentence: string;
}

interface PassageBoard {
  id: string;
  title: string;
  topic: string;
  level: string;
  collocations: CollocationItem[];
  fullParagraphTemplate: string; // [c1], [c2], etc.
  translationParagraph: string;
}

const PASSAGE_BOARDS: PassageBoard[] = [
  {
    id: 'pb-1',
    title: 'Phát triển Đô thị Bền vững & Môi trường',
    topic: 'IELTS Writing & Reading Task 2',
    level: 'B2 – C1',
    collocations: [
      {
        id: 'c1',
        phrase: 'mitigate climate change',
        phonetic: '/ˈmɪt.ɪ.ɡeɪt ˈklaɪ.mət tʃeɪndʒ/',
        translation: 'giảm thiểu biến đổi khí hậu',
        partBreakdown: 'Động từ (mitigate) + Cụm danh từ (climate change)',
        hintSentence: 'Biện pháp nhằm giảm nhẹ những tác động tiêu cực của biến đổi khí hậu toàn cầu.',
      },
      {
        id: 'c2',
        phrase: 'sustainable urban development',
        phonetic: '/səˈsteɪ.nə.bəl ˈɜː.bən dɪˈvel.əp.mənt/',
        translation: 'phát triển đô thị bền vững',
        partBreakdown: 'Tính từ (sustainable) + Tính từ (urban) + Danh từ (development)',
        hintSentence: 'Quy hoạch đô thị vừa đáp ứng nhu cầu hiện tại vừa không làm tổn hại tương lai.',
      },
      {
        id: 'c3',
        phrase: 'play a pivotal role',
        phonetic: '/pleɪ ə ˈpɪv.ə.təl rəʊl/',
        translation: 'đóng một vai trò nòng cốt',
        partBreakdown: 'Động từ (play) + Mạo từ (a) + Tính từ (pivotal) + Danh từ (role)',
        hintSentence: 'Giữ vai trò mấu chốt, mang tính chất quyết định đối với cả hệ thống.',
      },
      {
        id: 'c4',
        phrase: 'preserve natural habitats',
        phonetic: '/prɪˈzɜːv ˈnætʃ.ər.əl ˈhæb.ɪ.tæts/',
        translation: 'bảo tồn môi trường sống tự nhiên',
        partBreakdown: 'Động từ (preserve) + Tính từ (natural) + Danh từ số nhiều (habitats)',
        hintSentence: 'Bảo vệ nơi sinh sống tự nhiên của các loài động thực vật hoang dã.',
      },
    ],
    fullParagraphTemplate:
      'In order to [c1], city planners must prioritize [c2]. Green corridors and rooftop gardens [c3] in modern cities, ensuring that communities actively [c4] for urban wildlife.',
    translationParagraph:
      'Để giảm thiểu biến đổi khí hậu, các nhà quy hoạch phải ưu tiên phát triển đô thị bền vững. Các hành lang xanh và vườn trên mái đóng một vai trò nòng cốt tại các thành phố hiện đại, đảm bảo cộng đồng tích cực bảo tồn môi trường sống tự nhiên cho động vật hoang dã.',
  },
  {
    id: 'pb-2',
    title: 'Công nghệ Số & Phương pháp Học Tập',
    topic: 'Giáo trình Học thuật LinguaFlow',
    level: 'B1 – B2',
    collocations: [
      {
        id: 'c1',
        phrase: 'acquire new knowledge',
        phonetic: '/əˈkwaɪər njuː ˈnɒl.ɪdʒ/',
        translation: 'tiếp thu kiến thức mới',
        partBreakdown: 'Động từ (acquire) + Tính từ (new) + Danh từ không đếm được (knowledge)',
        hintSentence: 'Học hỏi và thu nhận thêm tri thức mới trong quá trình nghiên cứu.',
      },
      {
        id: 'c2',
        phrase: 'foster critical thinking',
        phonetic: '/ˈfɒs.tər ˈkrɪt.ɪ.kəl ˈθɪŋ.kɪŋ/',
        translation: 'nuôi dưỡng tư duy phản biện',
        partBreakdown: 'Động từ (foster) + Tính từ (critical) + Danh từ (thinking)',
        hintSentence: 'Kích thích và phát triển khả năng suy xét độc lập, khách quan.',
      },
      {
        id: 'c3',
        phrase: 'overcome language barriers',
        phonetic: '/ˌəʊ.vəˈkʌm ˈlæŋ.ɡwɪdʒ ˈbær.i.əz/',
        translation: 'vượt qua rào cản ngôn ngữ',
        partBreakdown: 'Động từ (overcome) + Danh từ (language) + Danh từ số nhiều (barriers)',
        hintSentence: 'Vượt qua những khó khăn về trở ngại giao tiếp giữa các quốc gia.',
      },
      {
        id: 'c4',
        phrase: 'broaden academic horizons',
        phonetic: '/ˈbrɔː.dən ˌæk.əˈdem.ɪk həˈraɪ.zənz/',
        translation: 'mở rộng chân trời học thuật',
        partBreakdown: 'Động từ (broaden) + Tính từ (academic) + Danh từ số nhiều (horizons)',
        hintSentence: 'Mở rộng tầm hiểu biết và triển vọng nghiên cứu khoa học chuyên sâu.',
      },
    ],
    fullParagraphTemplate:
      'Online educational tools empower students to [c1] independently, while interactive seminars [c2]. By leveraging smart AI guidance, learners can effortlessly [c3] and [c4] across international boundaries.',
    translationParagraph:
      'Các công cụ giáo dục trực tuyến giúp sinh viên tiếp thu kiến thức mới một cách độc lập, trong khi các hội thảo tương tác nuôi dưỡng tư duy phản biện. Bằng việc tận dụng trợ giảng AI thông minh, người học có thể dễ dàng vượt qua rào cản ngôn ngữ và mở rộng chân trời học thuật xuyên biên giới.',
  },
];

/* =========================================================================
   DỮ LIỆU THỰC: 5 CÂU BÀI KIỂM TRA (KHOANH LỖI SAI)
   ========================================================================= */
interface ErrorQuestion {
  id: string;
  sourceExam: string;
  prompt: string;
  segments: {
    id: string;
    text: string;
    isError: boolean;
  }[];
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  teacherAdvice: string;
  memoryTip: string;
}

const ERROR_QUESTIONS: ErrorQuestion[] = [
  {
    id: 'err-1',
    sourceExam: 'Đề thi THPTQG & Tốt nghiệp Chuẩn B2',
    prompt: 'Chạm vào 1 chỗ sai trong câu kiểm tra bên dưới, sau đó chọn mẩu giấy sửa đúng nhất:',
    segments: [
      { id: 's1', text: 'Despite of', isError: true },
      { id: 's2', text: 'the heavy torrential rain,', isError: false },
      { id: 's3', text: 'all students arrived', isError: false },
      { id: 's4', text: 'on time for the examination.', isError: false },
    ],
    options: [
      { id: 'opt-a', text: 'Despite', isCorrect: true },
      { id: 'opt-b', text: 'Although of', isCorrect: false },
      { id: 'opt-c', text: 'In spite', isCorrect: false },
    ],
    teacherAdvice:
      'Quy tắc ngữ pháp: "Despite" bản thân nó đã là một giới từ, theo sau là Danh từ hoặc V-ing (KHÔNG bao giờ có "of"). Chỉ có cụm "In spite of" mới đi với "of".',
    memoryTip: 'Mẹo nhớ nhanh: "Despite" đứng một mình — "In spite" phải có "of" đi cùng!',
  },
  {
    id: 'err-2',
    sourceExam: 'TOEIC Part 5 Grammar Master',
    prompt: 'Chạm vào 1 chỗ sai trong câu kiểm tra bên dưới, sau đó chọn mẩu giấy sửa đúng nhất:',
    segments: [
      { id: 's1', text: 'The number of', isError: false },
      { id: 's2', text: 'international applicants', isError: false },
      { id: 's3', text: 'have increased', isError: true },
      { id: 's4', text: 'drastically this semester.', isError: false },
    ],
    options: [
      { id: 'opt-a', text: 'has increased', isCorrect: true },
      { id: 'opt-b', text: 'had been increased', isCorrect: false },
      { id: 'opt-c', text: 'are increasing', isCorrect: false },
    ],
    teacherAdvice:
      'Hòa hợp chủ vị: Khi chủ ngữ là "The number of + Danh từ số nhiều", động từ PHẢI chia ở ngôi thứ 3 số ít ("has increased"). Ngược lại, "A number of + N số nhiều" mới chia động từ số nhiều.',
    memoryTip: 'Mẹo nhớ nhanh: "The number" là số lượng duy nhất (chia SỐ ÍT) — "A number" là nhiều người (chia SỐ NHIỀU).',
  },
  {
    id: 'err-3',
    sourceExam: 'IELTS Academic Writing & Speaking Foundation',
    prompt: 'Chạm vào 1 chỗ sai trong câu kiểm tra bên dưới, sau đó chọn mẩu giấy sửa đúng nhất:',
    segments: [
      { id: 's1', text: 'We are truly looking forward', isError: false },
      { id: 's2', text: 'to meet', isError: true },
      { id: 's3', text: 'the visiting professor', isError: false },
      { id: 's4', text: 'at the university colloquium.', isError: false },
    ],
    options: [
      { id: 'opt-a', text: 'to meeting', isCorrect: true },
      { id: 'opt-b', text: 'for meet', isCorrect: false },
      { id: 'opt-c', text: 'to be meet', isCorrect: false },
    ],
    teacherAdvice:
      'Cấu trúc cố định: "Look forward to + V-ING / Noun". Từ "to" ở đây là GIỚI TỪ, không phải to-infinitive, nên động từ theo sau bắt buộc phải thêm đuôi -ing.',
    memoryTip: 'Mẹo nhớ nhanh: Sau cụm "look forward to" luôn là V-ING háo hức mong chờ!',
  },
  {
    id: 'err-4',
    sourceExam: 'Đề thi Học sinh giỏi & Chuyên Anh',
    prompt: 'Chạm vào 1 chỗ sai trong câu kiểm tra bên dưới, sau đó chọn mẩu giấy sửa đúng nhất:',
    segments: [
      { id: 's1', text: 'Hardly had the scientist', isError: false },
      { id: 's2', text: 'completed the experiment', isError: false },
      { id: 's3', text: 'than', isError: true },
      { id: 's4', text: 'the power went out completely.', isError: false },
    ],
    options: [
      { id: 'opt-a', text: 'when', isCorrect: true },
      { id: 'opt-b', text: 'then', isCorrect: false },
      { id: 'opt-c', text: 'as', isCorrect: false },
    ],
    teacherAdvice:
      'Cấu trúc đảo ngữ chỉ thời gian: "Hardly / Scarcely + had + S + V3/ed + WHEN + S + V2/ed" (Vừa mới... thì...). Cặp liên từ đi với "than" chỉ dùng cho "No sooner... than".',
    memoryTip: 'Mẹo nhớ nhanh: "Hardly" đi với "WHEN" — "No sooner" mới đi với "THAN"!',
  },
  {
    id: 'err-5',
    sourceExam: 'IELTS Academic Reading & Writing Grammar Check',
    prompt: 'Chạm vào 1 chỗ sai trong câu kiểm tra bên dưới, sau đó chọn mẩu giấy sửa đúng nhất:',
    segments: [
      { id: 's1', text: 'Modern economic expansion', isError: false },
      { id: 's2', text: 'must be coordinated with', isError: false },
      { id: 's3', text: 'environment protection', isError: true },
      { id: 's4', text: 'for our future generations.', isError: false },
    ],
    options: [
      { id: 'opt-a', text: 'environmental protection', isCorrect: true },
      { id: 'opt-b', text: 'environmentally protect', isCorrect: false },
      { id: 'opt-c', text: 'protective environment', isCorrect: false },
    ],
    teacherAdvice:
      'Trật tự từ loại: Trước danh từ "protection" (sự bảo vệ), ta cần một TÍNH TỪ "environmental" để bổ nghĩa thành cụm danh từ chuẩn xác: "environmental protection" (bảo vệ môi trường).',
    memoryTip: 'Mẹo nhớ nhanh: Bổ nghĩa cho danh từ, hãy dùng Tính từ (adj + noun)!',
  },
];

/* =========================================================================
   COMPONENTS CHÍNH: TRANG /practice
   ========================================================================= */
export default function PracticeHubPage() {
  const [activeMode, setActiveMode] = useState<'collocation' | 'error_hunt'>('collocation');

  /* -------------------------------------------------------------
     STATE CHO MODE 1: DÁN CỤM LÊN BẢNG
     ------------------------------------------------------------- */
  const [currentBoardIndex, setCurrentBoardIndex] = useState(0);
  const currentBoard = PASSAGE_BOARDS[currentBoardIndex];
  const [activeCollocIndex, setActiveCollocIndex] = useState(0);
  const activeColloc = currentBoard.collocations[activeCollocIndex];

  // 3 bước trong mỗi mẩu note: 1 (Đọc+nghe), 2 (Gõ viết lại), 3 (Ghim lên bảng)
  const [collocStep, setCollocStep] = useState<1 | 2 | 3>(1);
  const [typedInput, setTypedInput] = useState('');
  const [pinnedCollocIds, setPinnedCollocIds] = useState<string[]>([]);
  const [isBoardCompleted, setIsBoardCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Phát âm TTS
  const speakText = (text: string, lang: 'en-US' | 'en-GB' = 'en-US') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  // Reset khi đổi bài
  const handleSwitchBoard = (index: number) => {
    setCurrentBoardIndex(index);
    setActiveCollocIndex(0);
    setCollocStep(1);
    setTypedInput('');
    setPinnedCollocIds([]);
    setIsBoardCompleted(false);
  };

  // Focus khi qua bước 2
  useEffect(() => {
    if (collocStep === 2) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [collocStep, activeCollocIndex]);

  // Kiểm tra từng từ theo thời gian thực (real-time word matching)
  const targetWords = activeColloc ? activeColloc.phrase.toLowerCase().trim().split(/\s+/) : [];
  const typedWords = typedInput.toLowerCase().trim().split(/\s+/).filter(Boolean);

  const isExactMatch =
    typedInput.toLowerCase().trim().replace(/[.,!?;:]/g, '') ===
    activeColloc.phrase.toLowerCase().trim();

  // Ghim cụm đã học lên bảng
  const handlePinCollocation = () => {
    if (!pinnedCollocIds.includes(activeColloc.id)) {
      const nextPinned = [...pinnedCollocIds, activeColloc.id];
      setPinnedCollocIds(nextPinned);

      if (nextPinned.length === currentBoard.collocations.length) {
        setIsBoardCompleted(true);
      } else {
        // Chuyển sang cụm tiếp theo
        const nextIdx = activeCollocIndex + 1;
        setActiveCollocIndex(nextIdx);
        setCollocStep(1);
        setTypedInput('');
      }
    }
  };

  /* -------------------------------------------------------------
     STATE CHO MODE 2: KHOANH LỖI SAI
     ------------------------------------------------------------- */
  const [questionIdx, setQuestionIdx] = useState(0);
  const currentQuestion = ERROR_QUESTIONS[questionIdx];
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submittedAnswer, setSubmittedAnswer] = useState<{
    isSuccess: boolean;
    hasChecked: boolean;
  } | null>(null);

  // Chạm để khoanh tròn vị trí nghi sai (tối đa 1 chỗ)
  const handleTouchSegment = (segId: string) => {
    if (submittedAnswer?.hasChecked) return;
    if (selectedSegmentId === segId) {
      setSelectedSegmentId(null);
      setSelectedOptionId(null);
    } else {
      setSelectedSegmentId(segId);
      setSelectedOptionId(null);
    }
  };

  // Chọn mẩu giấy đáp án và nộp
  const handleSelectOption = (optId: string) => {
    if (submittedAnswer?.hasChecked) return;
    setSelectedOptionId(optId);

    const chosenSeg = currentQuestion.segments.find((s) => s.id === selectedSegmentId);
    const chosenOpt = currentQuestion.options.find((o) => o.id === optId);

    const isSuccess = Boolean(chosenSeg?.isError && chosenOpt?.isCorrect);

    setSubmittedAnswer({
      isSuccess,
      hasChecked: true,
    });
  };

  const handleNextErrorQuestion = () => {
    const next = (questionIdx + 1) % ERROR_QUESTIONS.length;
    setQuestionIdx(next);
    setSelectedSegmentId(null);
    setSelectedOptionId(null);
    setSubmittedAnswer(null);
  };

  const handleRetryErrorQuestion = () => {
    setSelectedSegmentId(null);
    setSelectedOptionId(null);
    setSubmittedAnswer(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-6 pb-28 text-left select-none">
      {/* HEADER & THANH CHUYỂN MODE GIẤY */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-ink pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
            <Link
              href="/dashboard"
              className="hover:text-red transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Bàn Học</span>
            </Link>
            <span>/</span>
            <span className="text-ink">Góc Luyện Tập Giấy</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-ink font-serif tracking-tight">
            GÓC LUYỆN TẬP ĐẶC BIỆT
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft">
            Chữ mực trên nền giấy — Tương tác trực quan không màn hình phẳng rập khuôn
          </p>
        </div>

        {/* 2 Tab Mode Luyện Tập */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl border-2 border-ink bg-paper-2 shadow-brutal-sm">
          <button
            onClick={() => setActiveMode('collocation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'collocation'
                ? 'bg-ink text-paper shadow-brutal-sm'
                : 'text-ink hover:bg-paper'
            }`}
          >
            <Pin className="w-3.5 h-3.5 text-red" />
            <span>1. Dán cụm lên bảng</span>
          </button>

          <button
            onClick={() => setActiveMode('error_hunt')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'error_hunt'
                ? 'bg-ink text-paper shadow-brutal-sm'
                : 'text-ink hover:bg-paper'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-full border border-red text-red flex items-center justify-center text-[10px] font-black">
              ⭕
            </span>
            <span>2. Khoanh lỗi sai</span>
          </button>
        </div>
      </div>

      {/* ===================================================================
          MODE 1: DÁN CỤM LÊN BẢNG (COLLOCATION MEMO NOTICE BOARD)
          =================================================================== */}
      {activeMode === 'collocation' && (
        <div className="space-y-6 animate-message-slide">
          {/* Thanh chọn bài văn mẫu */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-ink-muted">Bài văn mẫu:</span>
              {PASSAGE_BOARDS.map((b, idx) => (
                <button
                  key={b.id}
                  onClick={() => handleSwitchBoard(idx)}
                  className={`px-3 py-1 rounded-lg border-2 border-ink text-xs font-black transition-all cursor-pointer ${
                    currentBoardIndex === idx
                      ? 'bg-red text-white shadow-brutal-sm'
                      : 'bg-paper text-ink hover:bg-paper-2'
                  }`}
                >
                  Đoạn {idx + 1}: {b.title.split('&')[0]}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-teal bg-teal/10 text-teal">
              Đã ghim: {pinnedCollocIds.length} / {currentBoard.collocations.length} cụm
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* CỘT TRÁI: MẨU GIẤY NOTE CỤM ĐANG HỌC (3 BƯỚC) */}
            <div className="lg:col-span-5 space-y-4">
              {!isBoardCompleted ? (
                <div className="relative bg-[#FAF5EB] border-2 border-ink rounded-2xl p-5 sm:p-6 shadow-brutal-md space-y-4">
                  {/* Băng keo dán giấy ở mép trên */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber/40 border border-ink/40 rotate-[-1deg] shadow-sm pointer-events-none" />

                  {/* Header mẩu note: Cụm số mấy + Tiến độ 3 bước */}
                  <div className="flex items-center justify-between border-b border-ink/20 pb-2.5 pt-1">
                    <span className="text-xs font-mono font-black text-red uppercase">
                      MẨU NOTE #{activeCollocIndex + 1}: {activeColloc.id.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-bold text-ink-muted">
                      Bước {collocStep}/3
                    </span>
                  </div>

                  {/* Thanh hiển thị 3 bước tiến trình */}
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-black uppercase">
                    <div
                      className={`p-1 rounded border border-ink ${
                        collocStep === 1 ? 'bg-amber text-ink' : 'bg-paper text-ink-muted'
                      }`}
                    >
                      1. Đọc & Nghe
                    </div>
                    <div
                      className={`p-1 rounded border border-ink ${
                        collocStep === 2 ? 'bg-amber text-ink' : 'bg-paper text-ink-muted'
                      }`}
                    >
                      2. Viết lại
                    </div>
                    <div
                      className={`p-1 rounded border border-ink ${
                        collocStep === 3 ? 'bg-amber text-ink' : 'bg-paper text-ink-muted'
                      }`}
                    >
                      3. Dán bảng
                    </div>
                  </div>

                  {/* BƯỚC 1: ĐỌC & NGHE CỤM */}
                  {collocStep === 1 && (
                    <div className="space-y-4 pt-1">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-serif font-black text-ink">
                            {activeColloc.phrase}
                          </h3>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => speakText(activeColloc.phrase, 'en-US')}
                              className="px-2 py-1 rounded border border-ink bg-paper hover:bg-amber text-xs font-mono font-black text-ink shadow-brutal-sm flex items-center gap-1 cursor-pointer"
                              title="Nghe giọng Mỹ"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-red" />
                              <span>US</span>
                            </button>
                            <button
                              onClick={() => speakText(activeColloc.phrase, 'en-GB')}
                              className="px-2 py-1 rounded border border-ink bg-paper hover:bg-teal/20 text-xs font-mono font-black text-ink shadow-brutal-sm flex items-center gap-1 cursor-pointer"
                              title="Nghe giọng Anh"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-teal" />
                              <span>UK</span>
                            </button>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-teal block">
                          {activeColloc.phonetic}
                        </span>
                      </div>

                      <div className="p-3 bg-paper rounded-xl border border-ink/20 space-y-1">
                        <span className="text-[10px] font-black uppercase text-ink-muted block">
                          Nghĩa tiếng Việt:
                        </span>
                        <p className="text-sm font-black text-red font-sans">
                          {activeColloc.translation}
                        </p>
                      </div>

                      <div className="p-2.5 bg-paper-2 rounded-lg border border-ink/15 text-xs text-ink-soft space-y-1">
                        <span className="font-bold text-ink block">Cấu tạo ngữ pháp:</span>
                        <p>{activeColloc.partBreakdown}</p>
                      </div>

                      <button
                        onClick={() => setCollocStep(2)}
                        className="w-full btn btn-red text-xs font-black shadow-brutal flex items-center justify-center gap-2 cursor-pointer pt-2"
                      >
                        <span>Sẵn sàng viết lại cụm →</span>
                      </button>
                    </div>
                  )}

                  {/* BƯỚC 2: VIẾT LẠI CỤM TỪ GỢI Ý NGHĨA (CHẤM KHỚP TỪNG TỪ) */}
                  {collocStep === 2 && (
                    <div className="space-y-4 pt-1">
                      <div className="p-3 bg-amber/20 border border-ink rounded-xl space-y-1">
                        <span className="text-[10px] font-black uppercase text-ink-muted block">
                          Gợi ý nghĩa tiếng Việt:
                        </span>
                        <p className="text-sm font-black text-ink font-sans">
                          &ldquo;{activeColloc.translation}&rdquo;
                        </p>
                        <p className="text-[11px] text-ink-soft italic">
                          ({activeColloc.hintSentence})
                        </p>
                      </div>

                      {/* Vùng gõ văn bản dòng kẻ vở */}
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-ink block">
                          Gõ lại cụm tiếng Anh:
                        </label>
                        <input
                          ref={inputRef}
                          type="text"
                          value={typedInput}
                          onChange={(e) => setTypedInput(e.target.value)}
                          placeholder="Gõ chính xác từng từ của cụm..."
                          className="w-full lined-paper p-3 text-base font-bold text-ink border-2 border-ink rounded-xl focus:outline-none focus:border-red shadow-inner font-sans"
                        />
                      </div>

                      {/* Bảng so khớp từng từ thời gian thực */}
                      <div className="space-y-1.5 p-3 bg-paper rounded-xl border border-ink/30">
                        <span className="text-[10px] font-black uppercase text-ink-muted block">
                          So khớp từng từ:
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                          {targetWords.map((word, wIdx) => {
                            const userWord = typedWords[wIdx];
                            const isMatch = userWord === word;
                            const isMismatch = userWord && userWord !== word;

                            return (
                              <div
                                key={wIdx}
                                className={`px-2.5 py-1 rounded-md border text-xs font-mono font-bold transition-all ${
                                  isMatch
                                    ? 'border-teal bg-teal/15 text-teal'
                                    : isMismatch
                                    ? 'border-red bg-red/10 text-red line-through'
                                    : 'border-ink/30 bg-paper-2 text-ink-muted'
                                }`}
                              >
                                {isMatch ? `✓ ${word}` : isMismatch ? `✗ ${userWord}` : word}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Nút hành động */}
                      <div className="pt-2">
                        {isExactMatch ? (
                          <button
                            onClick={() => setCollocStep(3)}
                            className="w-full btn btn-ink text-xs font-black shadow-brutal flex items-center justify-center gap-2 cursor-pointer animate-bounce"
                          >
                            <Sparkles className="w-4 h-4 text-amber" />
                            <span>Chính xác! Chuẩn bị dán lên bảng →</span>
                          </button>
                        ) : (
                          <div className="text-center text-xs font-bold text-ink-muted">
                            Hãy gõ đúng hoàn toàn {targetWords.length} từ để mở khóa dán bảng
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* BƯỚC 3: DÁN CỤM LÊN BẢNG TỔNG HỢP */}
                  {collocStep === 3 && (
                    <div className="space-y-4 pt-1 text-center">
                      <div className="p-4 bg-teal/15 border-2 border-teal rounded-xl space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal text-white text-xs font-black">
                          <Check className="w-3.5 h-3.5" />
                          <span>Thuộc lòng cụm từ!</span>
                        </div>
                        <h4 className="text-xl font-serif font-black text-ink">
                          {activeColloc.phrase}
                        </h4>
                        <p className="text-xs text-teal font-bold font-sans">
                          {activeColloc.translation}
                        </p>
                      </div>

                      <button
                        onClick={handlePinCollocation}
                        className="w-full btn btn-red text-xs font-black shadow-brutal flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Pin className="w-4 h-4" />
                        <span>Dán mẩu note này lên Bảng tổng hợp 📌</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* KHI ĐÃ HOÀN THÀNH TOÀN BỘ ĐOẠN */
                <div className="bg-[#FAF5EB] border-2 border-ink rounded-2xl p-6 shadow-brutal-md space-y-4 text-center">
                  <div className="flex justify-center">
                    <LingLing
                      reaction="flex"
                      size={100}
                      bubbleText="Bạn đã dán thành công tất cả cụm vào đoạn văn!"
                    />
                  </div>
                  <h3 className="text-xl font-black text-ink font-serif">
                    HOÀN THÀNH ĐOẠN VĂN!
                  </h3>
                  <p className="text-xs text-ink-soft">
                    Tất cả các mẩu note đã được ghim trọn vẹn vào văn bản học thuật trên bảng.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => handleSwitchBoard((currentBoardIndex + 1) % PASSAGE_BOARDS.length)}
                      className="btn btn-red text-xs font-black shadow-brutal cursor-pointer"
                    >
                      Học đoạn tiếp theo →
                    </button>
                    <button
                      onClick={() => handleSwitchBoard(currentBoardIndex)}
                      className="btn btn-paper text-xs font-black shadow-brutal cursor-pointer"
                    >
                      Làm lại đoạn này
                    </button>
                  </div>
                </div>
              )}

              {/* Lời khuyên của LingLing */}
              <div className="p-3 bg-paper-2 rounded-xl border border-ink/20 flex items-center gap-3">
                <LingLing reaction="studying" size={44} animate={false} />
                <p className="text-xs text-ink-soft font-medium leading-relaxed">
                  <strong className="text-ink">Mẹo học cụm:</strong> Đừng học từng từ đơn lẻ. Khi
                  dán từng cụm vào một đoạn văn hoàn chỉnh, não bộ sẽ ghi nhớ cả ngữ cảnh tự nhiên.
                </p>
              </div>
            </div>

            {/* CỘT PHẢI: BẢNG TỔNG HỢP (CORKBOARD / GIẤY KRAFT GHIM ĐINH) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative bg-[#EBDDBF] border-4 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl overflow-hidden min-h-[460px] flex flex-col justify-between">
                {/* 4 Đinh ghim ở 4 góc bảng */}
                <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-red border-2 border-ink shadow-brutal-sm" />
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-red border-2 border-ink shadow-brutal-sm" />
                <div className="absolute bottom-3 left-3 w-4 h-4 rounded-full bg-red border-2 border-ink shadow-brutal-sm" />
                <div className="absolute bottom-3 right-3 w-4 h-4 rounded-full bg-red border-2 border-ink shadow-brutal-sm" />

                <div className="space-y-4 relative z-10">
                  {/* Tiêu đề Bảng */}
                  <div className="flex items-center justify-between border-b-2 border-ink/30 pb-3">
                    <div className="flex items-center gap-2">
                      <Pin className="w-5 h-5 text-red" />
                      <span className="text-sm font-black uppercase tracking-wider text-ink font-mono">
                        BẢNG TỔNG HỢP CỤM TỪ (NOTICE BOARD)
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-ink-muted">
                      {currentBoard.topic}
                    </span>
                  </div>

                  {/* Tờ giấy văn bản học thuật đính giữa bảng */}
                  <div className="relative bg-paper border-2 border-ink rounded-xl p-5 sm:p-6 shadow-brutal-md space-y-4">
                    <div className="flex items-center justify-between border-b border-ink/15 pb-2">
                      <span className="text-xs font-black uppercase text-red font-mono">
                        Đoạn văn hoàn chỉnh:
                      </span>
                      <button
                        onClick={() =>
                          speakText(
                            currentBoard.fullParagraphTemplate.replace(/\[c\d\]/g, (match) => {
                              const cid = match.replace(/[\[\]]/g, '');
                              const c = currentBoard.collocations.find((item) => item.id === cid);
                              return c ? c.phrase : '';
                            }),
                            'en-US'
                          )
                        }
                        className="px-2 py-0.5 rounded border border-ink/40 bg-paper-2 hover:bg-amber text-[10px] font-mono font-black text-ink flex items-center gap-1 cursor-pointer"
                        title="Nghe toàn bộ đoạn văn"
                      >
                        <Volume2 className="w-3 h-3 text-red" />
                        <span>Nghe cả đoạn</span>
                      </button>
                    </div>

                    {/* Văn bản hiển thị cụm: Cụm đã ghim bừng sáng, cụm chưa ghim mờ gạch chân */}
                    <p className="text-base sm:text-lg font-serif text-ink leading-relaxed font-normal">
                      {(() => {
                        const parts = currentBoard.fullParagraphTemplate.split(/(\[c\d\])/g);
                        return parts.map((part, pIdx) => {
                          const match = part.match(/^\[(c\d)\]$/);
                          if (match) {
                            const cid = match[1];
                            const cItem = currentBoard.collocations.find((c) => c.id === cid);
                            const isPinned = pinnedCollocIds.includes(cid);

                            if (isPinned && cItem) {
                              return (
                                <span
                                  key={pIdx}
                                  className="inline-block px-2 py-0.5 mx-1 rounded bg-teal/20 border-b-2 border-teal text-teal font-black animate-scale-up"
                                  title={`Đã ghim: ${cItem.translation}`}
                                >
                                  {cItem.phrase}
                                </span>
                              );
                            } else if (cItem) {
                              return (
                                <span
                                  key={pIdx}
                                  className="inline-block px-2 py-0.5 mx-1 rounded bg-paper-2 border-b-2 border-dashed border-ink/40 text-ink-muted font-bold"
                                  title="Chờ hoàn thành để ghim"
                                >
                                  [ ... ? ... ]
                                </span>
                              );
                            }
                          }
                          return <span key={pIdx}>{part}</span>;
                        });
                      })()}
                    </p>

                    {/* Dịch nghĩa tiếng Việt phía dưới */}
                    <div className="pt-3 border-t border-ink/15 text-xs text-ink-soft italic font-sans leading-relaxed">
                      <strong className="text-ink not-italic">Dịch nghĩa học thuật: </strong>
                      {currentBoard.translationParagraph}
                    </div>
                  </div>

                  {/* Các mẩu note đã dán ghim dồn lên chân bảng */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-black uppercase text-ink-muted block">
                      Các mẩu note đã ghim ({pinnedCollocIds.length}/{currentBoard.collocations.length}):
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {currentBoard.collocations.map((c, idx) => {
                        const isPinned = pinnedCollocIds.includes(c.id);
                        const rotationClass =
                          idx % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1.5deg]';

                        return (
                          <div
                            key={c.id}
                            className={`p-2.5 rounded-lg border-2 border-ink transition-all ${rotationClass} ${
                              isPinned
                                ? 'bg-paper shadow-brutal-sm opacity-100'
                                : 'bg-paper-2 border-dashed border-ink/30 opacity-40'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-black text-red">
                                #{idx + 1}
                              </span>
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  isPinned ? 'bg-teal' : 'bg-ink/20'
                                }`}
                              />
                            </div>
                            <div className="text-xs font-serif font-black text-ink truncate mt-0.5">
                              {c.phrase}
                            </div>
                            <div className="text-[10px] text-teal font-bold truncate">
                              {c.translation}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ĐÓNG DẤU HOÀN THÀNH KHI TOÀN BỘ CỤM ĐÃ DÁN XONG */}
                {isBoardCompleted && (
                  <div className="absolute inset-0 bg-ink/10 flex items-center justify-center pointer-events-none z-30">
                    <StampSlam
                      text="HOÀN THÀNH"
                      subtext="Đoạn văn đã được dán trọn vẹn"
                      variant="circle"
                      color="red"
                      size="lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODE 2: KHOANH LỖI SAI (TOUCH TO CIRCLE ERROR EXAM PAPER)
          =================================================================== */}
      {activeMode === 'error_hunt' && (
        <div className="space-y-6 animate-message-slide">
          {/* Header Đề thi */}
          <div className="flex items-center justify-between border-b-2 border-ink pb-3">
            <div>
              <span className="text-xs font-mono font-black text-red uppercase block">
                BÀI KIỂM TRA NGỮ PHÁP & DỤNG TỪ — CÂU {questionIdx + 1}/{ERROR_QUESTIONS.length}
              </span>
              <span className="text-xs font-bold text-ink-muted">
                Nguồn: {currentQuestion.sourceExam}
              </span>
            </div>

            <span className="text-xs font-mono font-black px-2.5 py-1 rounded border border-ink bg-paper-2 text-ink">
              Mã đề: #ERR-80{questionIdx + 1}
            </span>
          </div>

          {/* TỜ GIẤY BÀI KIỂM TRA (RULED TEST PAPER WITH RED MARGIN LINE) */}
          <div className="relative bg-[#FAF6ED] border-2 border-ink rounded-2xl shadow-brutal-lg overflow-hidden">
            {/* Lề vở vạch đỏ son bên trái */}
            <div className="absolute top-0 bottom-0 left-8 sm:left-12 w-0.5 bg-red/40 pointer-events-none" />

            <div className="p-6 sm:p-8 pl-12 sm:pl-16 space-y-6">
              {/* Hướng dẫn làm bài */}
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase text-ink-muted tracking-wider block">
                  Hướng dẫn bài thi:
                </span>
                <p className="text-xs sm:text-sm font-bold text-ink">
                  {currentQuestion.prompt}
                </p>
              </div>

              {/* DÒNG CÂU HỎI VỚI CÁC PHẦN CHẠM ĐỂ KHOANH TRÒN */}
              <div className="lined-paper p-5 sm:p-6 rounded-xl border-2 border-ink space-y-3 bg-paper">
                <span className="text-[10px] font-mono font-black text-ink-muted block uppercase">
                  Câu hỏi #{questionIdx + 1}:
                </span>

                <div className="text-lg sm:text-xl font-serif text-ink leading-loose flex items-center flex-wrap gap-2">
                  {currentQuestion.segments.map((seg) => {
                    const isCircled = selectedSegmentId === seg.id;

                    return (
                      <button
                        key={seg.id}
                        onClick={() => handleTouchSegment(seg.id)}
                        className={`relative cursor-pointer transition-all duration-150 inline-block px-2 py-1 rounded-lg ${
                          isCircled
                            ? 'border-2 border-red rounded-full text-red font-black shadow-[0_0_0_2px_rgba(214,64,39,0.2)] scale-105'
                            : 'hover:bg-paper-2 border border-transparent'
                        }`}
                        title="Chạm để khoanh tròn vị trí này"
                      >
                        {seg.text}
                        {isCircled && (
                          <span className="absolute -top-3 -right-2 text-[10px] font-mono font-black px-1.5 py-0.2 rounded-full bg-red text-white">
                            Khoanh
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3 MẨU GIẤY ĐÁP ÁN XÉ GÓC (PAPER SCRAPS) — HIỆN KHI ĐÃ KHOANH 1 CHỖ */}
              {selectedSegmentId && !submittedAnswer?.hasChecked && (
                <div className="space-y-3 animate-message-slide">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-ink">
                      Chọn cách sửa trong 3 mẩu giấy đáp án dưới đây:
                    </span>
                    <span className="text-[11px] font-mono text-red font-bold">
                      (Bấm 1 mẩu giấy để nộp bài)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentQuestion.options.map((opt, oIdx) => (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        className="p-4 bg-paper hover:bg-paper-2 border-2 border-ink rounded-xl shadow-brutal-sm hover:-translate-y-1 transition-all text-left space-y-1.5 cursor-pointer"
                        style={{
                          transform: `rotate(${oIdx === 0 ? '-1deg' : oIdx === 1 ? '0.5deg' : '-0.5deg'})`,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-black text-red uppercase">
                            MẨU GIẤY #{String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="text-xs">✂️</span>
                        </div>
                        <p className="text-base font-black text-ink font-serif">
                          {opt.text}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* KẾT QUẢ: ĐÚNG THÌ ĐÓNG DẤU "BẮT ĐƯỢC LỖI", SAI THÌ HIỆN LỜI CÔ GIÁO */}
              {submittedAnswer?.hasChecked && (
                <div className="space-y-4 animate-message-slide">
                  {submittedAnswer.isSuccess ? (
                    <div className="p-5 bg-teal/10 border-2 border-teal rounded-xl space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-6 h-6 text-teal flex-shrink-0" />
                          <div>
                            <h4 className="text-base font-black text-ink font-serif">
                              Chính xác! Bạn đã khoanh đúng vị trí và chọn đúng cách sửa.
                            </h4>
                            <p className="text-xs text-teal font-bold font-sans">
                              {currentQuestion.teacherAdvice}
                            </p>
                          </div>
                        </div>

                        <StampSlam
                          text="BẮT ĐƯỢC LỖI"
                          variant="badge"
                          color="teal"
                          size="md"
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-teal/30">
                        <LingLing
                          reaction="proud"
                          size={54}
                          bubbleText="Bắt lỗi quá chuẩn! Giữ vững phong độ nhé."
                        />
                        <button
                          onClick={handleNextErrorQuestion}
                          className="btn btn-ink text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Câu tiếp theo →</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* LỜI CÔ GIÁO CHỮA BÀI & MẸO GHI NHỚ VIẾT TAY Ở LỀ VỞ */
                    <div className="p-5 bg-paper-2 border-2 border-red rounded-xl space-y-4">
                      <div className="flex items-start gap-3">
                        <XCircle className="w-6 h-6 text-red flex-shrink-0 mt-0.5" />
                        <div className="space-y-2">
                          <h4 className="text-base font-black text-red font-serif">
                            Chưa chính xác! Xem lời cô giáo dặn ở lề vở:
                          </h4>

                          {/* Lời cô giáo */}
                          <div className="p-3 bg-paper rounded-lg border border-ink/20 space-y-1">
                            <span className="text-[11px] font-black uppercase text-red font-mono block">
                              ① Lời cô giáo dặn:
                            </span>
                            <p className="text-xs sm:text-sm font-bold text-ink leading-relaxed">
                              {currentQuestion.teacherAdvice}
                            </p>
                          </div>

                          {/* Mẹo ghi nhớ */}
                          <div className="p-3 bg-amber/20 rounded-lg border border-ink/30 space-y-1">
                            <span className="text-[11px] font-black uppercase text-ink font-mono block">
                              ② Mẹo ghi nhớ bỏ túi:
                            </span>
                            <p className="text-xs sm:text-sm font-black text-red font-serif">
                              {currentQuestion.memoryTip}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-ink/20">
                        <LingLing
                          reaction="thinking"
                          size={54}
                          bubbleText="Đừng buồn nhé, đọc kỹ mẹo ghi nhớ để không lặp lại lỗi!"
                        />

                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleRetryErrorQuestion}
                            className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Thử lại câu này</span>
                          </button>
                          <button
                            onClick={handleNextErrorQuestion}
                            className="btn btn-ink text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Bỏ qua & Qua câu sau →</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
