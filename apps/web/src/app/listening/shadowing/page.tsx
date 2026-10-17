'use client';

import React, { useState } from 'react';
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
  Volume2, 
  Mic,
  Square,
  CheckCircle2, 
  Disc,
  Sparkles
} from 'lucide-react';

interface ShadowingItem {
  id: number;
  audioText: string;
  vietnamese: string;
  phoneticsNote: string;
}

const SHADOWING_ITEMS: ShadowingItem[] = [
  {
    id: 1,
    audioText: "Every morning, I drink a cup of warm water and plan my work for the day.",
    vietnamese: "Mỗi buổi sáng, tôi uống một cốc nước ấm và lên kế hoạch làm việc trong ngày.",
    phoneticsNote: "Chú ý nhại ngữ điệu đi xuống cuối câu và lướt âm nhẹ ở 'and plan my'.",
  },
  {
    id: 2,
    audioText: "Consistency and perseverance are more crucial than natural talent when mastering a new skill.",
    vietnamese: "Sự đều đặn và kiên trì quan trọng hơn năng khiếu bẩm sinh khi làm chủ một kỹ năng mới.",
    phoneticsNote: "Nhấn mạnh vào các từ mang trọng âm: Consistency, perseverance, crucial, talent.",
  },
];

export default function ListeningShadowingPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [speed, setSpeed] = useState<0.75 | 1 | 1.25>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const currentItem = SHADOWING_ITEMS[currentIdx];

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
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
    } else {
      setIsRecording(true);
      setHasRecorded(false);
    }
  };

  const handleNext = () => {
    if (currentIdx < SHADOWING_ITEMS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setHasRecorded(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 pb-28 sm:pb-20 text-left">
      {/* Breadcrumb text mực */}
      <div className="flex items-center justify-between">
        <Link
          href="/listening"
          className="text-xs font-bold text-ink-muted hover:text-red transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Phòng Luyện Nghe</span>
        </Link>

        {/* Badge chế độ */}
        <span className="px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black text-teal uppercase tracking-wider">
          Nhại giọng
        </span>
      </div>

      {/* Header bar hướng dẫn */}
      <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-ink">
            Nhại giọng theo người bản xứ (Shadowing)
          </h1>
          <p className="text-xs text-ink-soft">
            Lắng nghe câu mẫu và bắt đầu nói theo ngay lập tức với độ trễ ngắn để rèn phản xạ nhịp điệu.
          </p>
        </div>

        <div className="text-xs font-mono font-black text-ink-muted px-3 py-1 bg-paper border border-ink rounded-lg self-start sm:self-auto">
          CÂU {currentIdx + 1} / {SHADOWING_ITEMS.length}
        </div>
      </div>

      {/* Máy phát Cassette trên giấy */}
      <Card className="p-6 sm:p-8 bg-[#FAF6EC] border-2 border-ink shadow-brutal-xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b-2 border-ink pb-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-ink">
            <Disc className={`w-4 h-4 text-red ${isPlaying ? 'animate-spin' : ''}`} />
            <span>MÁY NGHE · BĂNG NHẠI GIỌNG 01</span>
          </div>

          <div className="flex items-center gap-1.5">
            {[0.75, 1, 1.25].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s as any)}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded border transition-all cursor-pointer ${
                  speed === s
                    ? 'bg-ink text-paper border-ink shadow-brutal-sm'
                    : 'bg-paper text-ink border-ink/40 hover:border-ink'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Khối Câu Văn Bản Xứ */}
        <div className="lined-paper p-6 rounded-2xl border-2 border-ink mb-6 space-y-3">
          <p className="text-lg sm:text-xl font-serif font-black text-ink leading-relaxed">
            &ldquo;{currentItem.audioText}&rdquo;
          </p>
          <p className="text-xs sm:text-sm font-sans font-bold text-teal">
            {currentItem.vietnamese}
          </p>
          <div className="text-[11px] text-ink-muted italic border-t border-ink/20 pt-2">
            💡 {currentItem.phoneticsNote}
          </div>
        </div>

        {/* Nút Điều Khiển Nghe & Ghi Âm Nhại Giọng */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button
            onClick={handlePlayAudio}
            variant="white"
            className="w-full sm:w-auto px-6 py-3 text-xs font-black shadow-brutal flex items-center justify-center gap-2 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Đang phát mẫu...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-ink" />
                <span>Nghe câu mẫu</span>
              </>
            )}
          </Button>

          <Button
            onClick={toggleRecording}
            className={`w-full sm:w-auto px-6 py-3 text-xs font-black shadow-brutal flex items-center justify-center gap-2 cursor-pointer ${
              isRecording ? 'bg-red text-white animate-pulse' : 'btn-red'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-4 h-4 fill-white" />
                <span>Dừng nhại giọng</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Bật micro & Nhại giọng</span>
              </>
            )}
          </Button>
        </div>

        {/* Phản hồi sau khi nhại giọng */}
        {hasRecorded && (
          <div className="mt-6 p-4 bg-card border-2 border-ink rounded-2xl shadow-brutal flex items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal" />
              <div>
                <span className="text-xs font-black text-ink block">Đã ghi nhận phần nhại giọng!</span>
                <span className="text-[11px] text-ink-soft">Ngữ điệu và độ trễ nhịp đạt mức tốt.</span>
              </div>
            </div>

            {currentIdx < SHADOWING_ITEMS.length - 1 ? (
              <Button
                onClick={handleNext}
                className="btn-red text-xs font-black shadow-brutal cursor-pointer"
              >
                Câu tiếp theo →
              </Button>
            ) : (
              <Link
                href="/listening"
                className="btn btn-outline text-xs font-black shadow-brutal"
              >
                Hoàn thành buổi tập
              </Link>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
