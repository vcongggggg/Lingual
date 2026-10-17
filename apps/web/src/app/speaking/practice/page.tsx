'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { LingLing } from '../../../components/ui/LingLing';
import { 
  ArrowLeft, 
  Mic, 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Radio,
  Sliders
} from 'lucide-react';

interface WordPair {
  id: string;
  word: string;
  ipa: string;
  meaning: string;
  pairWord: string;
  pairIpa: string;
  soundFocus: string;
  privateNote: string;
}

const WORD_ITEMS: WordPair[] = [
  {
    id: 'sheep',
    word: 'sheep',
    ipa: '/ʃiːp/',
    meaning: 'con cừu (nguyên âm dài /i:/)',
    pairWord: 'ship',
    pairIpa: '/ʃɪp/',
    soundFocus: 'Âm /iː/ kéo dài khóe miệng cười',
    privateNote: 'Ghi chú riêng: Chú ý kéo dài nguyên âm /iː/ trong sheep (căng mép) so với âm ngắn giật bụng /ɪ/ trong ship.',
  },
  {
    id: 'ship',
    word: 'ship',
    ipa: '/ʃɪp/',
    meaning: 'tàu thủy (nguyên âm ngắn /ɪ/)',
    pairWord: 'sheep',
    pairIpa: '/ʃiːp/',
    soundFocus: 'Âm /ɪ/ thả lỏng, phát âm dứt khoát',
    privateNote: 'Ghi chú riêng: Đừng phát âm thành chữ "síp" tiếng Việt. Giữ khẩu hình tự nhiên, phát âm ngắn khoảng 0.3s.',
  },
  {
    id: 'feet',
    word: 'feet',
    ipa: '/fiːt/',
    meaning: 'đôi bàn chân (nguyên âm dài /i:/)',
    pairWord: 'fit',
    pairIpa: '/fɪt/',
    soundFocus: 'Âm /iː/ kết hợp chặn âm đuôi /t/',
    privateNote: 'Ghi chú riêng: Nhớ bật âm /t/ nhẹ ở cuối từ, không nuốt âm.',
  },
  {
    id: 'fit',
    word: 'fit',
    ipa: '/fɪt/',
    meaning: 'vừa vặn, khỏe khoắn (nguyên âm ngắn /ɪ/)',
    pairWord: 'feet',
    pairIpa: '/fiːt/',
    soundFocus: 'Âm /ɪ/ ngắn gọn dứt khoát',
    privateNote: 'Ghi chú riêng: Khẩu hình miệng mở rộng hơn một chút so với âm /i:/, bụng giật nhẹ khi phát âm.',
  },
];

export default function SpeakingPracticePage() {
  const [selectedWordId, setSelectedWordId] = useState('sheep');
  const [accent, setAccent] = useState<'US' | 'UK'>('US');
  const [speed, setSpeed] = useState<0.8 | 1>(1);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    recognized: string;
    passed: boolean;
    feedback: string;
  } | null>(null);

  const currentItem = WORD_ITEMS.find((w) => w.id === selectedWordId) || WORD_ITEMS[0];

  const handlePlayModel = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentItem.word);
      utterance.lang = accent === 'US' ? 'en-US' : 'en-GB';
      utterance.rate = speed;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      // Dừng ghi âm và chấm điểm mô phỏng
      setIsRecording(false);
      const randomScore = Math.floor(Math.random() * 20) + 82; // 82-100
      const passed = randomScore >= 85;
      setEvaluation({
        score: randomScore,
        recognized: currentItem.word,
        passed,
        feedback: passed
          ? `Xuất sắc! Bạn đã phát âm chuẩn xác nguyên âm ${currentItem.soundFocus.split(' ')[1] || 'chuẩn'}.`
          : `Gần được rồi! Âm của bạn hơi ngắn, hãy kéo dài và mở khóe miệng thêm một chút nhé.`,
      });
    } else {
      // Bắt đầu ghi âm
      setEvaluation(null);
      setIsRecording(true);
      setRecordingTime(0);
      const timer = setInterval(() => {
        setRecordingTime((t) => {
          if (t >= 3) {
            clearInterval(timer);
            return 3;
          }
          return t + 1;
        });
      }, 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8 pb-28 sm:pb-20">
      {/* Breadcrumb mực */}
      <div className="flex items-center justify-between">
        <Link
          href="/speaking"
          className="inline-flex items-center gap-2 text-sm font-black text-ink hover:text-red transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại Phòng Luyện Nói</span>
        </Link>

        <span className="px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black text-red uppercase tracking-wider">
          Phát âm cặp âm
        </span>
      </div>

      {/* Danh sách từ vựng dạng Tag Giấy (ship / sheep / fit / feet) */}
      <div className="bg-card border-2 border-ink rounded-2xl p-4 sm:p-5 shadow-brutal-sm space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-ink block">
          Chọn từ hoặc cặp âm để luyện tập:
        </span>
        <div className="flex flex-wrap gap-2.5">
          {WORD_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedWordId(item.id);
                setEvaluation(null);
                setIsRecording(false);
              }}
              className={`px-4 py-2 rounded-xl border-2 border-ink text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
                item.id === selectedWordId
                  ? 'bg-ink text-paper shadow-brutal-sm -translate-y-0.5'
                  : 'bg-paper text-ink hover:bg-paper-2'
              }`}
            >
              <span>{item.word}</span>
              <span className="text-xs font-normal opacity-80">{item.ipa}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Khối Luyện Phát Âm Trực Quan */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl space-y-8 text-center relative overflow-hidden">
        {/* Header từ vựng lớn */}
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 bg-amber-soft border border-ink rounded-full text-xs font-extrabold text-ink mb-1">
            {currentItem.soundFocus}
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-ink tracking-tight">
            {currentItem.word}
          </h2>
          <div className="text-xl sm:text-2xl font-mono text-teal font-extrabold">
            {currentItem.ipa}
          </div>
          <p className="text-sm text-ink-soft font-semibold max-w-md mx-auto">
            Ý nghĩa: {currentItem.meaning}
          </p>
        </div>

        {/* Thanh Controls Giấy: Phát âm mẫu, Tốc độ, Chọn giọng */}
        <div className="flex flex-wrap items-center justify-center gap-3 py-2">
          {/* Nút phát âm mẫu */}
          <button
            onClick={handlePlayModel}
            className="btn btn-paper text-xs sm:text-sm font-black flex items-center gap-2 shadow-brutal-sm"
          >
            <Volume2 className="w-4 h-4 text-teal" />
            <span>Phát âm mẫu ({accent})</span>
          </button>

          {/* Chọn giọng US / UK */}
          <div className="flex items-center gap-1 bg-paper-2 border-2 border-ink rounded-xl p-1 shadow-brutal-sm">
            {(['US', 'UK'] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAccent(a)}
                className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  accent === a ? 'bg-ink text-paper' : 'text-ink hover:text-red'
                }`}
              >
                {a}
              </button>
            ))}
          </div>

          {/* Chọn tốc độ 0.8x / 1x */}
          <div className="flex items-center gap-1 bg-paper-2 border-2 border-ink rounded-xl p-1 shadow-brutal-sm">
            {([0.8, 1] as const).map((sp) => (
              <button
                key={sp}
                onClick={() => setSpeed(sp)}
                className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  speed === sp ? 'bg-ink text-paper' : 'text-ink hover:text-red'
                }`}
              >
                {sp}x
              </button>
            ))}
          </div>
        </div>

        {/* NÚT THU ÂM MIC ĐỎ TO Ở GIỮA */}
        <div className="py-4 flex flex-col items-center justify-center space-y-3">
          <button
            onClick={handleToggleRecord}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 border-ink flex items-center justify-center transition-all cursor-pointer ${
              isRecording
                ? 'bg-red text-white shadow-brutal-xl animate-pulse scale-105'
                : 'bg-red hover:bg-red-dark text-white shadow-brutal-lg hover:scale-105 active:scale-95'
            }`}
            title={isRecording ? 'Bấm để dừng và chấm điểm' : 'Bấm để bắt đầu thu âm'}
          >
            <Mic className={`w-10 h-10 stroke-[2.5] ${isRecording ? 'animate-bounce' : ''}`} />
          </button>

          <span className="text-xs font-black uppercase tracking-wider text-ink">
            {isRecording ? (
              <span className="text-red animate-pulse flex items-center gap-1.5 justify-center">
                <Radio className="w-4 h-4" /> Đang thu âm... ({recordingTime}s) - Bấm lại để dừng
              </span>
            ) : (
              'Bấm vào micro đỏ để bắt đầu nói'
            )}
          </span>
        </div>

        {/* Ô Transcript Giấy Kẻ Dòng */}
        <div className="text-left space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-ink block">
            Bản ghi nhận diện giọng nói (Transcript):
          </span>
          <div className="lined-paper border-2 border-ink rounded-2xl p-4 sm:p-5 shadow-brutal-sm text-center">
            {isRecording ? (
              <p className="text-base font-bold text-red italic animate-pulse">
                Đang nghe khẩu hình của bạn... hãy phát âm rõ &quot;{currentItem.word}&quot;
              </p>
            ) : evaluation ? (
              <div className="space-y-1">
                <p className="text-xl font-black text-ink">
                  AI nhận diện được: <span className="text-teal underline">&quot;{evaluation.recognized}&quot;</span>
                </p>
                <p className="text-xs font-bold text-ink-soft">
                  Điểm phát âm: <b className="text-red text-sm">{evaluation.score}/100</b>
                </p>
              </div>
            ) : (
              <p className="text-sm font-semibold text-ink-muted italic">
                Chưa có dữ liệu thu âm. Bấm micro đỏ để AI phân tích khẩu hình và sóng âm.
              </p>
            )}
          </div>
        </div>

        {/* Dòng Ghi Chú Riêng Tư Dạng Giấy Nhỏ Dễ Đọc */}
        <div className="bg-amber-soft border-2 border-ink rounded-xl p-4 text-left shadow-brutal-sm relative">
          <div className="flex items-start gap-2.5">
            <div className="space-y-1 w-full">
              <span className="text-xs font-black uppercase tracking-wider text-ink block">
                Mảnh ghi chú phát âm:
              </span>
              <p className="text-xs sm:text-sm font-bold text-ink-soft leading-relaxed">
                {currentItem.privateNote}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Phản Ứng Bò LingLing Khi Đúng / Sai */}
      {evaluation && (
        <div
          className={`border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-lg animate-in fade-in duration-150 ${
            evaluation.passed ? 'bg-amber/15 border-teal' : 'bg-card border-red'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-left">
            <div className="flex-shrink-0 flex flex-col items-center">
              {evaluation.passed ? (
                <>
                  <LingLing reaction="greet" size={105} />
                  <span className="text-xs font-black text-teal mt-1">Chuẩn bản xứ!</span>
                </>
              ) : (
                <>
                  <LingLing reaction="cry" size={105} />
                  <span className="text-xs font-black text-red mt-1">Cố lên nhé!</span>
                </>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                {evaluation.passed ? (
                  <CheckCircle2 className="w-6 h-6 text-teal" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red" />
                )}
                <h3 className="text-xl font-black text-ink">
                  {evaluation.passed ? 'Khẩu hình rất chuẩn xác!' : 'Cần điều chỉnh độ dài âm'}
                </h3>
              </div>

              <p className="text-sm font-bold text-ink-soft leading-relaxed">
                {evaluation.feedback}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <Button variant="paper" size="sm" onClick={handlePlayModel}>
                  Nghe lại mẫu
                </Button>
                <Button
                  variant="ink"
                  size="sm"
                  onClick={() => {
                    const currentIndex = WORD_ITEMS.findIndex((w) => w.id === selectedWordId);
                    const nextWord = WORD_ITEMS[(currentIndex + 1) % WORD_ITEMS.length];
                    setSelectedWordId(nextWord.id);
                    setEvaluation(null);
                  }}
                >
                  Luyện từ tiếp theo →
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
