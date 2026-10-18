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
  Edit3
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

export default function ListeningPracticePage() {
  const [mode, setMode] = useState<'lined' | 'free'>('lined');
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

  // Xử lý gõ ô từ chính tả dòng kẻ
  const handleWordChange = (idx: number, val: string) => {
    // Nếu gõ chứa space thì chuyển focus sang ô tiếp theo
    if (val.includes(' ')) {
      const clean = val.replace(/\s+/g, '');
      setLinedInputs((prev) => ({ ...prev, [idx]: clean }));
      if (idx < rawTokens.length - 1) {
        inputRefs.current[idx + 1]?.focus();
      }
      return;
    }

    setLinedInputs((prev) => ({ ...prev, [idx]: val }));
    if (linedValidation) {
      setLinedValidation(null);
    }
  };

  const handleKeyDownWord = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      if (idx < rawTokens.length - 1) {
        inputRefs.current[idx + 1]?.focus();
      }
    } else if (e.key === 'Backspace') {
      if (!linedInputs[idx] && idx > 0) {
        e.preventDefault();
        inputRefs.current[idx - 1]?.focus();
      }
    } else if (e.key === 'ArrowRight' && idx < rawTokens.length - 1) {
      inputRefs.current[idx + 1]?.focus();
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleCheckLined();
    }
  };

  // Chấm điểm Chính tả dòng kẻ
  const handleCheckLined = () => {
    let allRight = true;
    const statusMap: Record<number, boolean> = {};

    rawTokens.forEach((token, idx) => {
      const cleanTarget = token.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const cleanTyped = (linedInputs[idx] || '').trim().toLowerCase();
      const isWordMatch = cleanTyped === cleanTarget;
      statusMap[idx] = isWordMatch;
      if (!isWordMatch) allRight = false;
    });

    setLinedValidation({
      checked: true,
      allCorrect: allRight,
      statusMap,
    });
  };

  const handleNext = () => {
    setUserInput('');
    setLinedInputs({});
    setRevealedAnswers({});
    setLinedValidation(null);
    setResult(null);
    setShowHint(false);
    setCurrentIdx((prev) => (prev + 1) % DICTATION_ITEMS.length);
  };

  const handleCheck = () => {
    const cleanUser = userInput.trim().toLowerCase().replace(/[.,!?'"]/g, '');
    const cleanTarget = currentItem.audioText.trim().toLowerCase().replace(/[.,!?'"]/g, '');

    const targetWords = cleanTarget.split(/\s+/).filter(Boolean);
    const userWords = cleanUser.split(/\s+/).filter(Boolean);

    let matchCount = 0;
    const diffWords = targetWords.map((tWord) => {
      if (userWords.includes(tWord)) {
        matchCount++;
        return { word: tWord, status: 'correct' as const };
      }
      return { word: tWord, status: 'missing' as const };
    });

    const accuracy = Math.round((matchCount / Math.max(targetWords.length, 1)) * 100);
    const isCorrect = cleanUser === cleanTarget || accuracy >= 95;

    setResult({
      checked: true,
      isCorrect,
      accuracy,
      diffWords,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8 pb-28 sm:pb-20 text-left">
      {/* Breadcrumb mực */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/listening"
          className="inline-flex items-center gap-2 text-sm font-black text-ink hover:text-red transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại Phòng Luyện Nghe</span>
        </Link>

        {/* Chuyển chế độ luyện nghe */}
        <div className="flex items-center gap-1.5 bg-paper-2 border-2 border-ink rounded-xl p-1 shadow-brutal-sm">
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
        {/* Nhãn máy cassette cổ điển */}
        <div className="flex items-center justify-between border-b-2 border-ink/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red border border-ink" />
            <span className="font-mono text-xs font-black uppercase tracking-widest text-ink">
              STEREO CASSETTE · BĂNG 0{currentIdx + 1}
            </span>
          </div>

          {/* Chọn Tốc độ nút giấy ghép (0.75x / 1x / 1.25x) */}
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

        {/* Cửa sổ cuộn băng cassette (Cassette Window, Spools & Mechanical Counter) */}
        <div className="cassette-window p-4 sm:p-6 flex items-center justify-around relative">
          {/* Trục bánh răng trái */}
          <div className={`cassette-spool ${isPlaying ? 'animate-spool-spin' : ''}`}>
            <Disc className="w-6 h-6 text-ink/70" />
          </div>

          {/* Cụm giữa: Thước đo băng mực & Bộ đếm số chạy cơ học (Mechanical Counter) */}
          <div className="flex flex-col items-center gap-2 mx-3 flex-1 max-w-[170px]">
            {/* Bộ đếm cơ học 3 chữ số chạy khi phát */}
            <div className="flex items-center gap-1.5 bg-ink text-paper px-2.5 py-0.5 rounded border border-ink shadow-inner font-mono text-xs font-black tracking-widest select-none" title="Bộ đếm số cassette chạy khi phát">
              <span className="text-[9px] text-paper-2/60">TAPE</span>
              <span>{String(tapeCounter).padStart(3, '0')}</span>
            </div>

            {/* Thước đo băng mực */}
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

          {/* Trục bánh răng phải */}
          <div className={`cassette-spool ${isPlaying ? 'animate-spool-spin' : ''}`}>
            <Disc className="w-6 h-6 text-ink/70" />
          </div>
        </div>

        {/* Nút điều khiển phát âm thanh: Nút Play ĐỎ TO ở giữa */}
        <div className="flex items-center justify-center gap-6 pt-2">
          {/* Nút tua lùi / Nghe lại từng câu */}
          <button
            onClick={handlePlayAudio}
            className="w-11 h-11 rounded-xl bg-card hover:bg-paper-2 border-2 border-ink text-ink flex items-center justify-center shadow-brutal-sm hover:translate-y-0.5 transition-all cursor-pointer"
            title="Nghe lại câu này"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* NÚT PLAY ĐỎ TO TRUNG TÂM */}
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

          {/* Nút gợi ý */}
          <button
            onClick={() => setShowHint(!showHint)}
            className="w-11 h-11 rounded-xl bg-card hover:bg-paper-2 border-2 border-ink text-ink flex items-center justify-center shadow-brutal-sm hover:translate-y-0.5 transition-all cursor-pointer"
            title="Gợi ý nghĩa"
          >
            <Lightbulb className={`w-5 h-5 ${showHint ? 'text-amber fill-amber' : ''}`} />
          </button>
        </div>

        {/* Gợi ý nếu bật */}
        {showHint && (
          <div className="bg-amber-soft border-2 border-ink rounded-xl p-3 text-xs font-bold text-ink space-y-1 shadow-brutal-sm">
            <span className="text-red font-black">Gợi ý nghĩa tiếng Việt: </span>
            <span>{currentItem.vietnamese}</span>
          </div>
        )}
      </div>

      {/* CHẾ ĐỘ 1: CHÍNH TẢ DÒNG KẺ (WORD BY WORD NOTEBOOK BLANKS) */}
      {mode === 'lined' ? (
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
            <button
              onClick={handlePlayAudio}
              className="btn btn-paper text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-brutal-sm cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-teal" />
              <span>Nghe lại câu này</span>
            </button>
          </div>

          {/* Vở Dòng Kẻ Chứa Từng Ô Từ */}
          <div className="lined-paper border-2 border-ink bg-card rounded-2xl p-6 sm:p-8 shadow-brutal-lg space-y-6">
            <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3.5 gap-y-6 font-mono text-base sm:text-lg leading-loose">
              {rawTokens.map((token, idx) => {
                const cleanTarget = token.replace(/[^a-zA-Z0-9]/g, '');
                const punctuation = token.replace(/[a-zA-Z0-9]/g, '');
                const val = linedInputs[idx] || '';
                const isChecked = linedValidation?.checked;
                const isWordCorrect = linedValidation?.statusMap[idx];
                const isWordWrong = isChecked && !isWordCorrect;
                const isRevealed = revealedAnswers[idx];

                return (
                  <div key={idx} className="relative inline-flex items-baseline">
                    {/* Popover hiển thị đáp án khi gõ sai và click vào */}
                    {isWordWrong && isRevealed && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-ink text-paper text-[11px] font-black uppercase font-mono shadow-brutal-sm z-30 whitespace-nowrap animate-in fade-in">
                        Đáp án: <span className="text-amber underline">{cleanTarget}</span>
                      </div>
                    )}

                    <div className="relative inline-flex items-center">
                      <input
                        ref={(el) => {
                          inputRefs.current[idx] = el;
                        }}
                        type="text"
                        value={val}
                        disabled={linedValidation?.allCorrect}
                        onChange={(e) => handleWordChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDownWord(e, idx)}
                        style={{ width: `${Math.max(cleanTarget.length + 1, 4)}ch` }}
                        className={`text-center font-mono font-black border-b-2 transition-all px-1 py-0.5 focus:outline-none ${
                          isWordCorrect
                            ? 'border-teal text-teal bg-teal/15 font-black'
                            : isWordWrong
                            ? 'border-red text-red line-through bg-red/10 cursor-pointer'
                            : 'border-ink focus:border-red bg-paper/60 text-ink'
                        }`}
                        placeholder="____"
                        title={isWordWrong ? 'Bấm vào để xem đáp án đúng' : undefined}
                        onClick={() => {
                          if (isWordWrong) {
                            setRevealedAnswers((prev) => ({ ...prev, [idx]: !prev[idx] }));
                          }
                        }}
                      />
                      {punctuation && (
                        <span className="font-serif font-black text-ink select-none ml-0.5">
                          {punctuation}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-ink/15">
              <button
                onClick={() => {
                  setLinedInputs({});
                  setRevealedAnswers({});
                  setLinedValidation(null);
                }}
                className="btn btn-paper text-xs font-black shadow-brutal-sm cursor-pointer"
              >
                Xóa làm lại từ đầu
              </button>

              <button
                onClick={handleCheckLined}
                className="btn btn-red text-sm font-black shadow-brutal cursor-pointer"
              >
                Kiểm tra chính tả →
              </button>
            </div>
          </div>

          {/* Kết quả kiểm tra Chính tả dòng kẻ */}
          {linedValidation && (
            <div
              className={`border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-lg space-y-4 animate-in fade-in duration-150 ${
                linedValidation.allCorrect ? 'bg-teal/10 border-teal' : 'bg-card border-red'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {linedValidation.allCorrect ? (
                      <LingLing reaction="thumbsup" size={96} />
                    ) : (
                      <LingLing reaction="thinking" size={96} />
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-ink font-sans">
                      {linedValidation.allCorrect
                        ? 'Chính xác hoàn hảo từng từ! 🎉'
                        : 'Vẫn còn từ chưa chuẩn xác!'}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-soft font-semibold font-sans">
                      {linedValidation.allCorrect
                        ? 'Bạn đã nghe và gõ đúng 100% các từ trên dòng kẻ.'
                        : 'Các từ gạch đỏ là chỗ sai. Bấm vào từ đó để xem đáp án hoặc nghe lại nhé!'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {linedValidation.allCorrect && (
                    <StampSlam text="CHÍNH XÁC" variant="badge" color="teal" size="md" />
                  )}
                  {!linedValidation.allCorrect && (
                    <button
                      onClick={handlePlayAudio}
                      className="btn btn-paper text-xs font-black shadow-brutal-sm flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Nghe lại</span>
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className="btn btn-ink text-xs font-black shadow-brutal-sm cursor-pointer"
                  >
                    Câu tiếp theo →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* CHẾ ĐỘ 2: CHÉP ĐOẠN TỰ DO (TEXTAREA FREE DICTATION) */
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-ink block">
              Ô chép chính tả (Gõ lại những gì bạn nghe được):
            </label>
            <span className="text-xs font-bold text-ink-muted">
              {userInput.trim().split(/\s+/).filter(Boolean).length} từ đã gõ
            </span>
          </div>

          <textarea
            rows={4}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Lắng nghe và chép lại câu tiếng Anh vào đây..."
            className="w-full lined-paper border-2 border-ink rounded-2xl p-5 text-base sm:text-lg font-bold text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-red shadow-brutal resize-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <Button variant="paper" size="sm" onClick={() => setUserInput('')}>
              Xóa gõ lại
            </Button>

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
              className={`border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-lg space-y-6 animate-in fade-in duration-150 mt-4 ${
                result.isCorrect ? 'bg-amber/15 border-teal' : 'bg-card border-red'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="flex-shrink-0">
                  {result.isCorrect ? (
                    <div className="flex flex-col items-center">
                      <LingLing reaction="thumbsup" size={105} />
                      <span className="text-xs font-black text-teal mt-1">Xuất sắc quá!</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <LingLing reaction="tear" size={105} />
                      <span className="text-xs font-black text-red mt-1">Gần trúng rồi!</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3 text-left w-full">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      {result.isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-teal" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-red" />
                      )}
                      <h3 className="text-xl font-black text-ink">
                        {result.isCorrect ? 'Chính xác hoàn hảo! 🎉' : 'Chưa chuẩn xác, thử lại nhé!'}
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-card border-2 border-ink rounded-xl text-xs font-black shadow-brutal-sm text-ink">
                      Độ chính xác: {result.accuracy}%
                    </span>
                  </div>

                  <div className="p-4 bg-paper-2 border-2 border-ink rounded-xl space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-ink-soft block">
                      Câu chuẩn bản xứ:
                    </span>
                    <p className="text-base sm:text-lg font-black text-ink leading-relaxed">
                      {currentItem.audioText}
                    </p>
                    <p className="text-xs font-bold text-teal">
                      Nghĩa: {currentItem.vietnamese}
                    </p>
                  </div>

                  <div className="text-xs font-bold text-ink-soft bg-card border border-ink/20 rounded-lg p-3">
                    <b>Mẹo nối âm: </b>{currentItem.phoneticsNote}
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
    </div>
  );
}
