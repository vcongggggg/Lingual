'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { LingLing } from '../../../components/ui/LingLing';
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
  Disc
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
  const [currentIdx, setCurrentIdx] = useState(0);
  const [speed, setSpeed] = useState<0.75 | 1 | 1.25>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<{
    checked: boolean;
    isCorrect: boolean;
    accuracy: number;
    diffWords: { word: string; status: 'correct' | 'missing' | 'extra' }[];
  } | null>(null);

  const currentItem = DICTATION_ITEMS[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / DICTATION_ITEMS.length) * 100);

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

  const handleNext = () => {
    setUserInput('');
    setResult(null);
    setShowHint(false);
    setCurrentIdx((prev) => (prev + 1) % DICTATION_ITEMS.length);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8">
      {/* Breadcrumb mực */}
      <div className="flex items-center justify-between">
        <Link
          href="/listening"
          className="inline-flex items-center gap-2 text-sm font-black text-ink hover:text-red transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại Phòng Luyện Nghe</span>
        </Link>

        {/* Badge chế độ */}
        <span className="px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black text-teal uppercase tracking-wider">
          Chép chính tả · Dictation
        </span>
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
              STEREO CASSETTE · SM-2 TAPE 0{currentIdx + 1}
            </span>
          </div>

          {/* Chọn Tốc độ nút giấy ghép (Segmented paper controls) */}
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

        {/* Cửa sổ cuộn băng cassette (Cassette Window & Spools) */}
        <div className="cassette-window p-4 sm:p-6 flex items-center justify-around">
          {/* Trục bánh răng trái */}
          <div className={`cassette-spool ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
            <Disc className="w-6 h-6 text-ink/70" />
          </div>

          {/* Thước đo băng mực */}
          <div className="h-6 flex-1 max-w-[160px] mx-4 bg-paper-2 border-2 border-ink rounded-md flex items-center px-2 justify-between">
            <span className="w-2 h-2 rounded-full bg-ink" />
            <div className="h-1 flex-1 mx-2 bg-ink/20 rounded" />
            <span className="w-2 h-2 rounded-full bg-red" />
          </div>

          {/* Trục bánh răng phải */}
          <div className={`cassette-spool ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
            <Disc className="w-6 h-6 text-ink/70" />
          </div>
        </div>

        {/* Nút điều khiển phát âm thanh: Nút Play ĐỎ TO ở giữa */}
        <div className="flex items-center justify-center gap-6 pt-2">
          {/* Nút tua lùi 5s */}
          <button
            onClick={handlePlayAudio}
            className="w-11 h-11 rounded-xl bg-card hover:bg-paper-2 border-2 border-ink text-ink flex items-center justify-center shadow-brutal-sm hover:translate-y-0.5 transition-all cursor-pointer"
            title="Nghe lại"
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
            title="Gợi ý"
          >
            <Lightbulb className={`w-5 h-5 ${showHint ? 'text-amber fill-amber' : ''}`} />
          </button>
        </div>

        {/* Gợi ý nếu bật */}
        {showHint && (
          <div className="bg-amber-soft border-2 border-ink rounded-xl p-3 text-xs font-bold text-ink space-y-1 shadow-brutal-sm">
            <span className="text-red font-black">💡 Gợi ý nghĩa tiếng Việt: </span>
            <span>{currentItem.vietnamese}</span>
          </div>
        )}
      </div>

      {/* Khung Gõ Đáp Án: Giấy Kẻ Dòng (Lined Paper) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-ink block">
            ✍️ Ô chép chính tả (Gõ lại những gì bạn nghe được):
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

          {/* Nút Kiểm tra kết quả màu đỏ */}
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
      </div>

      {/* Bò phản ứng & Kết quả (Celebrating / Apologetic) */}
      {result && (
        <div
          className={`border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-lg space-y-6 animate-in fade-in duration-150 ${
            result.isCorrect ? 'bg-amber/15 border-teal' : 'bg-card border-red'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Linh vật bò phản ứng có chủ đích */}
            <div className="flex-shrink-0">
              {result.isCorrect ? (
                <div className="flex flex-col items-center">
                  <LingLing reaction="greet" size={105} />
                  <span className="text-xs font-black text-teal mt-1">Xuất sắc quá!</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <LingLing reaction="cry" size={105} />
                  <span className="text-xs font-black text-red mt-1">Gần trúng rồi!</span>
                </div>
              )}
            </div>

            {/* Khối nhận xét chi tiết */}
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

              {/* So sánh câu gốc */}
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

              {/* Mẹo ngữ âm */}
              <div className="text-xs font-bold text-ink-soft bg-card border border-ink/20 rounded-lg p-3">
                🎧 <b>Mẹo nối âm: </b>{currentItem.phoneticsNote}
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
  );
}
