'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { LingLing } from '../../../components/ui/LingLing';
import { StampSlam } from '../../../components/ui/StampSlam';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  HelpCircle,
  VolumeX,
  Disc,
  BookOpen,
  Edit3,
  Sparkles,
  HelpCircle as QuestionIcon,
  Check,
  X
} from 'lucide-react';

interface SentenceItem {
  id: number;
  audioText: string;
  vietnamese: string;
  phoneticsNote: string;
}

const DICTATION_ITEMS: SentenceItem[] = [
  {
    id: 1,
    audioText: "Every morning, I drink a cup of warm water and plan my work for the day.",
    vietnamese: "Mỗi buổi sáng, tôi uống một cốc nước ấm và lên kế hoạch làm việc trong ngày.",
    phoneticsNote: "Chú ý nối âm tự nhiên giữa 'drink a' /drɪŋk ə/ và 'plan my' /plæn maɪ/.",
  },
  {
    id: 2,
    audioText: "Consistency and perseverance are more crucial than natural talent when mastering a new skill.",
    vietnamese: "Sự đều đặn và kiên trì quan trọng hơn năng khiếu bẩm sinh khi làm chủ một kỹ năng mới.",
    phoneticsNote: "Trọng âm từ 'Consistency' rơi vào âm tiết thứ hai /kənˈsɪs.tən.si/.",
  },
  {
    id: 3,
    audioText: "Protecting the local environment requires small and sustained actions from everyone in our community.",
    vietnamese: "Bảo vệ môi trường đòi hỏi những hành động nhỏ và bền bỉ từ tất cả mọi người trong cộng đồng.",
    phoneticsNote: "Phát âm rõ âm xát /s/ và /z/ ở đuôi từ 'requires' và 'actions'.",
  },
];

/* =========================================================================
   DỮ LIỆU QUIZ CÓ BẰNG CHỨNG (SINH TỪ TRANSCRIPT BÀI HỌC) (FEATURE 4)
   ========================================================================= */
interface EvidenceQuizItem {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank';
  typeLabel: string;
  question: string;
  options?: string[];
  correctAnswer: number | string;
  evidenceAudioSentence: string;
  evidenceTranscript: string;
  explanation: string;
}

const EVIDENCE_QUIZ_DATA: EvidenceQuizItem[] = [
  {
    id: 'eq-1',
    type: 'multiple_choice',
    typeLabel: 'Trắc nghiệm',
    question: '1. Thói quen buổi sáng được người nói nhắc đến trong bài là gì?',
    options: [
      'A. Uống cà phê đá và kiểm tra tin nhắn công việc',
      'B. Uống một cốc nước ấm và lên kế hoạch làm việc trong ngày',
      'C. Đi chạy bộ nhanh quanh công viên trước khi ăn',
      'D. Đọc sách triết học trong không gian tĩnh lặng',
    ],
    correctAnswer: 1,
    evidenceAudioSentence: 'Every morning, I drink a cup of warm water and plan my work for the day.',
    evidenceTranscript: 'Trích transcript: "Every morning, I drink a cup of warm water and plan my work for the day."',
    explanation: 'Người nói nêu rõ thói quen uống một cốc nước ấm và lên kế hoạch làm việc cho ngày mới.',
  },
  {
    id: 'eq-2',
    type: 'true_false',
    typeLabel: 'Đúng / Sai',
    question: '2. Đúng hay Sai: Theo người nói, năng khiếu bẩm sinh quan trọng hơn rất nhiều so với sự kiên trì bền bỉ.',
    options: [
      'A. True (Đúng)',
      'B. False (Sai - Sự đều đặn và kiên trì quan trọng hơn)',
    ],
    correctAnswer: 1,
    evidenceAudioSentence: 'Consistency and perseverance are more crucial than natural talent when mastering a new skill.',
    evidenceTranscript: 'Trích transcript: "Consistency and perseverance are more crucial than natural talent when mastering a new skill."',
    explanation: 'Người nói khẳng định sự đều đặn và kiên trì mới là yếu tố cốt lõi quan trọng hơn năng khiếu bẩm sinh.',
  },
  {
    id: 'eq-3',
    type: 'fill_blank',
    typeLabel: 'Điền từ',
    question: '3. Điền từ còn thiếu vào ô trống: "Protecting the local environment requires small and ________ actions from everyone in our community."',
    correctAnswer: 'sustained',
    evidenceAudioSentence: 'Protecting the local environment requires small and sustained actions from everyone in our community.',
    evidenceTranscript: 'Trích transcript: "...requires small and sustained actions from everyone in our community."',
    explanation: 'Từ còn thiếu chính xác trong đoạn nghe là "sustained" (hành động bền bỉ, được duy trì lâu dài).',
  },
  {
    id: 'eq-4',
    type: 'multiple_choice',
    typeLabel: 'Trắc nghiệm chi tiết',
    question: '4. Những hành động như thế nào là cần thiết để bảo vệ môi trường địa phương?',
    options: [
      'A. Những chiến dịch lớn tốn kém một lần duy nhất',
      'B. Những hành động nhỏ nhưng bền bỉ từ mọi người trong cộng đồng',
      'C. Di dời hoàn toàn các nhà máy ra nước ngoài',
      'D. Cấm tất cả phương tiện giao thông cá nhân',
    ],
    correctAnswer: 1,
    evidenceAudioSentence: 'Protecting the local environment requires small and sustained actions from everyone in our community.',
    evidenceTranscript: 'Trích transcript: "Protecting the local environment requires small and sustained actions from everyone in our community."',
    explanation: 'Bằng chứng ghi rõ: Những hành động nhỏ và bền bỉ từ mỗi cá nhân trong cộng đồng.',
  },
];

export default function ListeningPracticePage() {
  const [mode, setMode] = useState<'lined' | 'free' | 'quiz'>('lined');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [speed, setSpeed] = useState<0.75 | 1 | 1.25>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tapeCounter, setTapeCounter] = useState(24);
  const [userInput, setUserInput] = useState('');

  // Chính tả dòng kẻ: từng từ là 1 ô trống
  const [linedInputs, setLinedInputs] = useState<Record<number, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [linedValidation, setLinedValidation] = useState<{
    checked: boolean;
    allCorrect: boolean;
    statusMap: Record<number, boolean>;
  } | null>(null);

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  /* State cho Quiz Có Bằng Chứng */
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | string>>({});
  const [quizBlankInput, setQuizBlankInput] = useState<Record<string, string>>({});
  const [quizCheckedMap, setQuizCheckedMap] = useState<Record<string, boolean>>({});
  const [playingEvidenceId, setPlayingEvidenceId] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTapeCounter((c) => (c + 1) % 999);
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<{
    checked: boolean;
    isCorrect: boolean;
    accuracy: number;
    diffWords: { word: string; status: 'correct' | 'missing' | 'extra' }[];
  } | null>(null);

  const currentItem = DICTATION_ITEMS[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / DICTATION_ITEMS.length) * 100);
  const rawTokens = currentItem.audioText.split(/\s+/).filter(Boolean);

  // Phát âm thanh mô phỏng / SpeechSynthesis
  const handlePlayAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentItem.audioText);
      utterance.lang = 'en-US';
      utterance.rate = speed;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 2500);
    }
  };

  const handleStopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  // Phát đoạn audio chứng cứ
  const handlePlayEvidence = (audioText: string, qId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (playingEvidenceId === qId) {
      setPlayingEvidenceId(null);
      return;
    }

    const u = new SpeechSynthesisUtterance(audioText);
    u.lang = 'en-US';
    u.rate = 0.9;
    u.onstart = () => setPlayingEvidenceId(qId);
    u.onend = () => setPlayingEvidenceId(null);
    u.onerror = () => setPlayingEvidenceId(null);
    window.speechSynthesis.speak(u);
  };

  // Trả lời quiz có bằng chứng và chấm ngay
  const handleSelectQuizOption = (qId: string, optIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    setQuizCheckedMap((prev) => ({ ...prev, [qId]: true }));
  };

  const handleSubmitBlankAnswer = (qId: string) => {
    const userVal = (quizBlankInput[qId] || '').trim();
    if (!userVal) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: userVal }));
    setQuizCheckedMap((prev) => ({ ...prev, [qId]: true }));
  };

  // Xử lý gõ phím trong chế độ Chính tả dòng kẻ
  const handleLinedInputChange = (idx: number, val: string) => {
    setLinedInputs((prev) => ({ ...prev, [idx]: val }));
    if (linedValidation?.checked) {
      setLinedValidation(null);
    }
  };

  const handleLinedKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (idx < rawTokens.length - 1) {
        inputRefs.current[idx + 1]?.focus();
      }
    } else if (e.key === 'Backspace' && (!linedInputs[idx] || linedInputs[idx].length === 0)) {
      if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
      }
    } else if (e.key === 'ArrowRight' && idx < rawTokens.length - 1) {
      inputRefs.current[idx + 1]?.focus();
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  // Chấm câu dòng kẻ
  const handleCheckLined = () => {
    let allOk = true;
    const statusMap: Record<number, boolean> = {};

    rawTokens.forEach((token, idx) => {
      const cleanTarget = token.toLowerCase().replace(/[^a-z0-9]/g, '');
      const userVal = (linedInputs[idx] || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const isOk = userVal === cleanTarget;
      statusMap[idx] = isOk;
      if (!isOk) allOk = false;
    });

    setLinedValidation({
      checked: true,
      allCorrect: allOk,
      statusMap,
    });
  };

  // Chấm câu tự do (Free input)
  const handleCheck = () => {
    const targetWords = currentItem.audioText.toLowerCase().replace(/[.,!?;:]/g, '').split(/\s+/);
    const userWords = userInput.toLowerCase().replace(/[.,!?;:]/g, '').split(/\s+/).filter(Boolean);

    let matchCount = 0;
    const diff: { word: string; status: 'correct' | 'missing' | 'extra' }[] = [];

    targetWords.forEach((tw, index) => {
      if (userWords[index] === tw) {
        matchCount++;
        diff.push({ word: targetWords[index], status: 'correct' });
      } else {
        diff.push({ word: targetWords[index], status: 'missing' });
      }
    });

    const accuracy = Math.round((matchCount / targetWords.length) * 100);
    const isCorrect = accuracy >= 85;

    setResult({
      checked: true,
      isCorrect,
      accuracy,
      diffWords: diff,
    });
  };

  const handleNext = () => {
    if (currentIdx < DICTATION_ITEMS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setUserInput('');
      setLinedInputs({});
      setRevealedAnswers({});
      setLinedValidation(null);
      setResult(null);
      setShowHint(false);
      setTapeCounter((c) => c + 35);
    } else {
      // Khi hoàn thành cả 3 câu, tự động mở sang Quiz có bằng chứng
      setMode('quiz');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8 pb-28 sm:pb-20 text-left select-none">
      {/* Breadcrumb mực */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/listening"
          className="inline-flex items-center gap-2 text-sm font-black text-ink hover:text-red transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại Phòng Luyện Nghe</span>
        </Link>

        {/* Chuyển 3 chế độ: Chính tả dòng kẻ / Chép tự do / Quiz có bằng chứng */}
        <div className="flex items-center gap-1.5 bg-paper-2 border-2 border-ink rounded-xl p-1 shadow-brutal-sm flex-wrap">
          <button
            onClick={() => setMode('lined')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'lined'
                ? 'bg-teal text-white shadow-brutal-sm'
                : 'text-ink hover:text-teal'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Chính tả dòng kẻ</span>
          </button>
          <button
            onClick={() => setMode('free')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'free'
                ? 'bg-ink text-paper shadow-brutal-sm'
                : 'text-ink hover:text-red'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Chép đoạn tự do</span>
          </button>
          <button
            onClick={() => setMode('quiz')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'quiz'
                ? 'bg-red text-white shadow-brutal-sm'
                : 'text-ink hover:text-red'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quiz có bằng chứng</span>
          </button>
        </div>
      </div>

      {/* Tiến độ dạng thanh mực */}
      <div className="bg-card border-2 border-ink rounded-2xl p-4 sm:p-5 shadow-brutal-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-ink">
          <span>Tiến độ bài học: Câu {currentIdx + 1} / {DICTATION_ITEMS.length}</span>
          <span className="text-teal font-extrabold">{progressPercent}% hoàn thành</span>
        </div>
        <div className="ink-progress-track">
          <div className="ink-progress-fill bg-ink" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Máy Nghe Băng Cát-sét Sổ Tay (Cassette Player on Paper) */}
      <div className="cassette-player p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b-2 border-ink/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red border border-ink" />
            <span className="font-mono text-xs font-black uppercase tracking-widest text-ink">
              STEREO CASSETTE · BĂNG 0{currentIdx + 1}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-card border-2 border-ink rounded-xl p-1 shadow-brutal-sm">
            {([0.75, 1, 1.25] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  speed === s ? 'bg-ink text-paper shadow-sm' : 'text-ink hover:text-red'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <div className="cassette-window p-4 sm:p-6 flex items-center justify-around relative">
          <div className={`cassette-spool ${isPlaying ? 'animate-spool-spin' : ''}`}>
            <Disc className="w-6 h-6 text-ink/70" />
          </div>

          <div className="flex flex-col items-center gap-2 mx-3 flex-1 max-w-[170px]">
            <div className="flex items-center gap-1.5 bg-ink text-paper px-2.5 py-0.5 rounded border border-ink shadow-inner font-mono text-xs font-black tracking-widest select-none">
              <span className="text-[9px] text-paper-2/60">TAPE</span>
              <span>{String(tapeCounter).padStart(3, '0')}</span>
            </div>

            <div className="h-4 w-full bg-paper-2 border-2 border-ink rounded-md flex items-center px-2 justify-between">
              <span className="w-2 h-2 rounded-full bg-ink" />
              <div className="h-1 flex-1 mx-2 bg-ink/20 rounded overflow-hidden">
                <div
                  className="h-full bg-red transition-all duration-300"
                  style={{ width: `${(tapeCounter % 100)}%` }}
                />
              </div>
              <span className="w-2 h-2 rounded-full bg-red" />
            </div>
          </div>

          <div className={`cassette-spool ${isPlaying ? 'animate-spool-spin' : ''}`}>
            <Disc className="w-6 h-6 text-ink/70" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 pt-2">
          <button
            onClick={handlePlayAudio}
            className="w-11 h-11 rounded-xl bg-card hover:bg-paper-2 border-2 border-ink text-ink flex items-center justify-center shadow-brutal-sm hover:translate-y-0.5 transition-all cursor-pointer"
            title="Nghe lại câu này"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={isPlaying ? handleStopAudio : handlePlayAudio}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red hover:bg-red-dark text-white border-3 border-ink flex items-center justify-center shadow-brutal-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isPlaying ? 'Tạm dừng' : 'Bấm để nghe'}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current translate-x-1" />
            )}
          </button>

          <button
            onClick={() => setShowHint(!showHint)}
            className="w-11 h-11 rounded-xl bg-card hover:bg-paper-2 border-2 border-ink text-ink flex items-center justify-center shadow-brutal-sm hover:translate-y-0.5 transition-all cursor-pointer"
            title="Gợi ý nghĩa"
          >
            <Lightbulb className={`w-5 h-5 ${showHint ? 'text-amber fill-amber' : ''}`} />
          </button>
        </div>

        {showHint && (
          <div className="bg-amber-soft border-2 border-ink rounded-xl p-3 text-xs font-bold text-ink space-y-1 shadow-brutal-sm">
            <span className="text-red font-black">Gợi ý nghĩa tiếng Việt: </span>
            <span>{currentItem.vietnamese}</span>
          </div>
        )}
      </div>

      {/* ===================================================================
          CHẾ ĐỘ 1: CHÍNH TẢ DÒNG KẺ (WORD BY WORD NOTEBOOK BLANKS)
          =================================================================== */}
      {mode === 'lined' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-ink block">
                Chính tả dòng kẻ (Gõ từng từ trên dòng kẻ vở):
              </label>
              <span className="text-[11px] font-bold text-ink-muted">
                Dùng phím cách (Space) để qua ô tiếp theo, Backspace để lùi về
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-ink-soft">
              {rawTokens.length} từ
            </span>
          </div>

          <div className="lined-paper p-5 sm:p-7 rounded-2xl border-2 border-ink shadow-brutal-md bg-paper space-y-4">
            <div className="flex flex-wrap gap-2.5 items-center">
              {rawTokens.map((rawToken, idx) => {
                const userVal = linedInputs[idx] || '';
                const isChecked = linedValidation?.checked;
                const isCorrect = linedValidation?.statusMap[idx];
                const cleanTarget = rawToken.replace(/[.,!?;:]/g, '');
                const hasPunctuation = /[.,!?;:]$/.test(rawToken);
                const punctChar = hasPunctuation ? rawToken.slice(-1) : '';
                const isRevealed = revealedAnswers[idx];

                const inputWidth = Math.max(cleanTarget.length * 14 + 18, 52);

                return (
                  <div key={idx} className="relative inline-flex items-center my-1">
                    <input
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      value={userVal}
                      onChange={(e) => handleLinedInputChange(idx, e.target.value)}
                      onKeyDown={(e) => handleLinedKeyDown(idx, e)}
                      style={{ width: `${inputWidth}px` }}
                      placeholder="..."
                      className={`text-center font-mono font-bold text-base py-1 px-1.5 rounded-md border-b-2 bg-transparent focus:outline-none transition-all ${
                        isChecked
                          ? isCorrect
                            ? 'border-teal text-teal bg-teal/10 font-black'
                            : 'border-red text-red line-through bg-red/10 cursor-pointer'
                          : 'border-ink/60 text-ink focus:border-red focus:bg-paper-2'
                      }`}
                      onClick={() => {
                        if (isChecked && !isCorrect) {
                          setRevealedAnswers((prev) => ({ ...prev, [idx]: !prev[idx] }));
                        }
                      }}
                      title={isChecked && !isCorrect ? 'Bấm để xem đáp án đúng' : undefined}
                    />

                    {punctChar && (
                      <span className="font-mono text-base font-black text-ink select-none pl-0.5">
                        {punctChar}
                      </span>
                    )}

                    {isChecked && !isCorrect && isRevealed && (
                      <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-ink text-paper text-xs font-mono font-black px-2 py-0.5 rounded shadow-brutal-sm z-20 whitespace-nowrap">
                        {cleanTarget}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-ink-muted italic">
              * Khi gõ sai, bấm vào ô gạch đỏ để xem đáp án chuẩn.
            </span>

            <Button
              variant="red"
              size="md"
              onClick={handleCheckLined}
              className="shadow-brutal"
            >
              Kiểm tra dòng kẻ →
            </Button>
          </div>

          {linedValidation?.checked && (
            <div className="mt-4">
              {linedValidation.allCorrect ? (
                <div className="p-6 bg-teal/10 border-2 border-teal rounded-3xl space-y-4 shadow-brutal-md">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <LingLing reaction="thumbsup" size={80} />
                      <div>
                        <h4 className="text-xl font-serif font-black text-ink">
                          Chính xác tuyệt đối!
                        </h4>
                        <p className="text-xs text-teal font-bold">
                          Bạn đã nghe và viết đúng từng từ trên dòng kẻ vở.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <StampSlam
                        text="CHÍNH XÁC"
                        variant="badge"
                        color="teal"
                        size="md"
                      />
                      <Button variant="ink" size="sm" onClick={handleNext}>
                        Câu tiếp theo →
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-paper-2 border-2 border-red rounded-2xl flex items-center justify-between flex-wrap gap-3 shadow-brutal-sm">
                  <div className="flex items-center gap-3">
                    <LingLing reaction="thinking" size={54} />
                    <div>
                      <h4 className="text-sm font-black text-red">
                        Có từ chưa khớp chính tả!
                      </h4>
                      <p className="text-xs text-ink-soft">
                        Hãy bấm vào các từ có gạch đỏ để xem đáp án, sau đó bấm nút Nghe lại để luyện tai.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePlayAudio}
                      className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Nghe lại câu này</span>
                    </button>
                    <button
                      onClick={handleNext}
                      className="btn btn-ink text-xs font-black shadow-brutal"
                    >
                      Bỏ qua & Qua câu sau →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
          CHẾ ĐỘ 2: CHÉP TỰ DO (FREE TEXTAREA)
          =================================================================== */}
      {mode === 'free' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-ink block">
              Vở viết chính tả tự do:
            </label>
            <span className="text-xs font-mono font-bold text-ink-soft">
              {userInput.trim().split(/\s+/).filter(Boolean).length} / {rawTokens.length} từ
            </span>
          </div>

          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Lắng nghe băng cassette và gõ lại toàn bộ câu vào đây..."
            rows={4}
            className="w-full lined-paper p-5 sm:p-6 text-base sm:text-lg font-bold text-ink rounded-2xl border-2 border-ink focus:outline-none focus:border-red shadow-inner transition-all resize-none font-sans"
          />

          <div className="flex items-center justify-end pt-1">
            <Button
              variant="red"
              size="lg"
              onClick={handleCheck}
              disabled={!userInput.trim()}
              className="shadow-brutal"
            >
              Kiểm tra kết quả →
            </Button>
          </div>

          {result && (
            <div
              className={`border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-lg space-y-6 mt-4 ${
                result.isCorrect ? 'bg-amber/15 border-teal' : 'bg-card border-red'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="flex-shrink-0">
                  <LingLing reaction={result.isCorrect ? 'thumbsup' : 'thinking'} size={90} />
                </div>

                <div className="flex-1 space-y-3 text-left w-full">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-xl font-black text-ink">
                      {result.isCorrect ? 'Chính xác hoàn hảo! 🎉' : 'Chưa chuẩn xác, thử lại nhé!'}
                    </h3>
                    <span className="px-3 py-1 bg-card border-2 border-ink rounded-xl text-xs font-black shadow-brutal-sm text-ink font-mono">
                      Độ chính xác: {result.accuracy}%
                    </span>
                  </div>

                  <div className="p-4 bg-paper-2 border-2 border-ink rounded-xl space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-ink-soft block">
                      Câu chuẩn bản xứ:
                    </span>
                    <p className="text-base sm:text-lg font-black text-ink">
                      {currentItem.audioText}
                    </p>
                    <p className="text-xs font-bold text-teal">
                      Nghĩa: {currentItem.vietnamese}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <Button variant="paper" size="sm" onClick={handlePlayAudio}>
                      Nghe lại câu gốc
                    </Button>
                    <Button variant="ink" size="sm" onClick={handleNext}>
                      Luyện câu tiếp theo →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
          CHẾ ĐỘ 3 / PHẦN THỬ THÁCH: "QUIZ CÓ BẰNG CHỨNG" (FEATURE 4)
          =================================================================== */}
      <div className="space-y-6 pt-6 border-t-2 border-ink/20">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red border-2 border-ink" />
            <h3 className="text-xl sm:text-2xl font-black text-ink font-serif tracking-tight">
              Quiz Có Bằng Chứng (Evidence-Based Listening Quiz)
            </h3>
          </div>

          <span className="text-xs font-mono font-bold text-teal px-2.5 py-0.5 rounded border border-teal bg-teal/10">
            Sinh từ transcript bài học
          </span>
        </div>

        <p className="text-xs sm:text-sm text-ink-soft">
          Mỗi câu hỏi được trích xuất trực tiếp từ bài nghe vừa học. Bạn có thể bấm nút <strong>Nghe đoạn chứng cứ</strong> để phát lại chính xác đoạn audio chứa câu trả lời.
        </p>

        {/* Danh sách 4 câu hỏi Quiz */}
        <div className="space-y-5">
          {EVIDENCE_QUIZ_DATA.map((q, qIdx) => {
            const hasChecked = quizCheckedMap[q.id];
            const userAns = quizAnswers[q.id];
            const isPlayingThisEvidence = playingEvidenceId === q.id;

            const isCorrect =
              q.type === 'fill_blank'
                ? String(userAns || '').toLowerCase().trim() === String(q.correctAnswer).toLowerCase().trim()
                : userAns === q.correctAnswer;

            return (
              <div
                key={q.id}
                className={`p-5 sm:p-6 rounded-2xl border-2 transition-all space-y-4 ${
                  hasChecked
                    ? isCorrect
                      ? 'bg-teal/10 border-teal shadow-brutal-sm'
                      : 'bg-red/10 border-red shadow-brutal-sm'
                    : 'bg-card border-ink shadow-brutal-md'
                }`}
              >
                {/* Header câu hỏi: Dạng câu + Nút Loa nghe đoạn chứng cứ */}
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-ink/15 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded border border-ink/40 bg-paper-2 text-ink">
                      {q.typeLabel}
                    </span>
                    <span className="text-xs font-mono font-bold text-ink-muted">
                      Câu {qIdx + 1}
                    </span>
                  </div>

                  {/* NÚT "NGHE ĐOẠN CHỨNG CỨ" */}
                  <button
                    onClick={() => handlePlayEvidence(q.evidenceAudioSentence, q.id)}
                    className={`px-3 py-1 rounded-lg border-2 border-ink text-xs font-mono font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                      isPlayingThisEvidence
                        ? 'bg-red text-white shadow-brutal-sm'
                        : 'bg-paper text-ink hover:bg-amber'
                    }`}
                    title="Phát lại đoạn audio chứa bằng chứng đáp án"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-red" />
                    <span>{isPlayingThisEvidence ? 'Đang phát chứng cứ...' : 'Nghe đoạn chứng cứ'}</span>
                  </button>
                </div>

                <h4 className="text-base font-black text-ink font-serif leading-snug">
                  {q.question}
                </h4>

                {/* Các phương án trả lời tùy theo dạng câu */}
                {q.type === 'fill_blank' ? (
                  /* Dạng Điền từ */
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={quizBlankInput[q.id] || ''}
                        disabled={hasChecked}
                        onChange={(e) =>
                          setQuizBlankInput((prev) => ({ ...prev, [q.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSubmitBlankAnswer(q.id);
                        }}
                        placeholder="Gõ từ còn thiếu tại đây..."
                        className="px-3.5 py-2 rounded-xl border-2 border-ink bg-paper text-sm font-bold text-ink focus:outline-none focus:border-red shadow-inner flex-1 max-w-sm"
                      />
                      {!hasChecked && (
                        <button
                          onClick={() => handleSubmitBlankAnswer(q.id)}
                          disabled={!quizBlankInput[q.id]?.trim()}
                          className="btn btn-red text-xs font-black shadow-brutal py-2 px-3.5 cursor-pointer disabled:opacity-40"
                        >
                          Chấm điểm
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Dạng Trắc nghiệm & Đúng/Sai */
                  <div className="grid grid-cols-1 gap-2">
                    {q.options?.map((opt, oIdx) => {
                      let optClass = 'bg-paper hover:bg-paper-2 border border-ink/40 text-ink';
                      if (userAns === oIdx) {
                        optClass = 'bg-ink text-paper border-2 border-ink font-black shadow-brutal-sm';
                      }

                      if (hasChecked) {
                        if (oIdx === q.correctAnswer) {
                          optClass = 'bg-teal/20 border-2 border-teal text-teal font-black shadow-brutal-sm';
                        } else if (userAns === oIdx && !isCorrect) {
                          optClass = 'bg-red/15 border-2 border-red text-red line-through';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={hasChecked}
                          onClick={() => handleSelectQuizOption(q.id, oIdx)}
                          className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${optClass}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* KẾT QUẢ CHẤM NGAY + GIẢI THÍCH 1 DÒNG TRÍCH TRANSCRIPT */}
                {hasChecked && (
                  <div className="p-3 bg-paper rounded-xl border-2 border-ink space-y-1.5 animate-scale-up">
                    <div className="flex items-center gap-1.5 text-xs font-black">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-teal" />
                          <span className="text-teal">Chính xác tuyệt đối!</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-red" />
                          <span className="text-red">Chưa chính xác!</span>
                        </>
                      )}
                    </div>

                    {/* DÒNG TRÍCH NGUYÊN VĂN TỪ TRANSCRIPT */}
                    <div className="text-xs font-serif italic text-ink font-medium pl-5 border-l-2 border-red">
                      {q.evidenceTranscript}
                    </div>

                    <p className="text-xs text-ink-soft pl-5 font-sans">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
