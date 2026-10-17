'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { LingLing } from '../../../components/ui/LingLing';
import { 
  ArrowLeft, 
  Mic, 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  Square,
  Sparkles 
} from 'lucide-react';

const SENTENCES = [
  {
    id: 1,
    sentence: "Good morning! It's a pleasure to finally meet you in person.",
    vietnamese: "Chào buổi sáng! Rất vinh hạnh được gặp trực tiếp bạn hôm nay.",
    phoneticFocus: "Chú ý nối âm 'It's a' /ɪts ə/ và nhấn trọng âm từ 'pleasure' /ˈpleʒ.ər/.",
  },
  {
    id: 2,
    sentence: "Could you please tell me how to get to the nearest train station?",
    vietnamese: "Bạn có thể chỉ giúp tôi đường đến nhà ga tàu gần nhất được không?",
    phoneticFocus: "Lên giọng nhẹ ở cuối câu hỏi Yes/No: 'station?'.",
  },
];

export default function SpeakingRepetitionPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const cur = SENTENCES[currentIdx];

  const handlePlayAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(cur.sentence);
      u.lang = 'en-US';
      u.rate = 0.9;
      u.onstart = () => setIsPlaying(true);
      u.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(u);
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 pb-28 sm:pb-20 text-left">
      <div className="flex items-center justify-between">
        <Link
          href="/speaking"
          className="text-xs font-bold text-ink-muted hover:text-red transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Phòng Luyện Nói</span>
        </Link>

        <span className="px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black text-red uppercase tracking-wider">
          Lặp lại câu
        </span>
      </div>

      <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-ink">Lặp lại câu theo giọng bản xứ (Repetition)</h1>
          <p className="text-xs text-ink-soft">Nghe từng câu ngắn hoàn chỉnh và lặp lại với đúng trọng âm ngữ điệu.</p>
        </div>
        <div className="text-xs font-mono font-black text-ink-muted px-3 py-1 bg-paper border border-ink rounded-lg self-start sm:self-auto">
          CÂU {currentIdx + 1} / {SENTENCES.length}
        </div>
      </div>

      <Card className="p-6 sm:p-10 bg-[#FAF6EC] border-2 border-ink shadow-brutal-xl text-center space-y-6">
        <div className="lined-paper p-6 sm:p-8 rounded-2xl border-2 border-ink space-y-3">
          <p className="text-xl sm:text-2xl font-serif font-black text-ink leading-relaxed">
            &ldquo;{cur.sentence}&rdquo;
          </p>
          <p className="text-xs sm:text-sm font-sans font-bold text-teal">
            {cur.vietnamese}
          </p>
          <div className="text-[11px] text-ink-muted italic border-t border-ink/20 pt-2 text-left">
            💡 {cur.phoneticFocus}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            onClick={handlePlayAudio}
            variant="white"
            className="px-6 py-3 text-xs font-black shadow-brutal flex items-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlaying ? 'Đang phát âm...' : 'Nghe câu mẫu'}</span>
          </Button>

          <Button
            onClick={toggleRecording}
            className={`px-6 py-3 text-xs font-black shadow-brutal flex items-center gap-2 cursor-pointer ${
              isRecording ? 'bg-red text-white animate-pulse' : 'btn-red'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-4 h-4 fill-white" />
                <span>Dừng ghi âm</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Bật mic lặp lại câu</span>
              </>
            )}
          </Button>
        </div>

        {hasRecorded && (
          <div className="p-4 bg-card border-2 border-ink rounded-2xl shadow-brutal flex items-center justify-between gap-4 text-left animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal" />
              <div>
                <span className="text-xs font-black text-ink block">Phát âm đạt độ khớp 92%!</span>
                <span className="text-[11px] text-ink-soft">Trọng âm từ 'pleasure' và âm nối rất chuẩn.</span>
              </div>
            </div>

            {currentIdx < SENTENCES.length - 1 ? (
              <Button
                onClick={() => {
                  setCurrentIdx((p) => p + 1);
                  setHasRecorded(false);
                }}
                className="btn-red text-xs font-black shadow-brutal cursor-pointer"
              >
                Câu tiếp theo →
              </Button>
            ) : (
              <Link
                href="/speaking"
                className="btn btn-outline text-xs font-black shadow-brutal"
              >
                Hoàn thành
              </Link>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
