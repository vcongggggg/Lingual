'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LingLing } from '../../components/ui/LingLing';
import { EmptyState } from '../../components/ui/EmptyState';
import { api } from '../../lib/api';
import { Volume2, RotateCw, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export default function SrsPage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({ dueToday: 0, learning: 0, mastered: 0 });
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [lastReviewFeedback, setLastReviewFeedback] = useState<any>(null);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = () => {
    setLoading(true);
    api.getSrsQueue()
      .then((res) => {
        if (res.queue && res.queue.length > 0) {
          setQueue(res.queue);
          setStats(res.stats || {});
        } else {
          // Fallback thẻ mẫu nếu queue rỗng
          const sampleCards = [
            { id: 'v1', wordId: 'vocab-u1-l1-1', targetText: 'Hello', phonetic: '/həˈləʊ/', translation: 'Xin chào', cefrLevel: 'A1', exampleSentence: 'Hello, nice to meet you!' },
            { id: 'v2', wordId: 'vocab-u1-l1-2', targetText: 'Perseverance', phonetic: '/ˌpɜːsɪˈvɪərəns/', translation: 'Sự kiên trì, bền bỉ', cefrLevel: 'B2', exampleSentence: 'Success requires perseverance and patience.' },
            { id: 'v3', wordId: 'vocab-u1-l1-3', targetText: 'Substantial', phonetic: '/səbˈstænʃl/', translation: 'Đáng kể, quan trọng', cefrLevel: 'B2', exampleSentence: 'A substantial amount of progress was made.' },
          ];
          setQueue(sampleCards);
        }
      })
      .catch(() => {
        setQueue([]);
      })
      .finally(() => setLoading(false));
  };

  const currentCard = queue[currentIndex];

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleReviewQuality = async (quality: number) => {
    if (!currentCard) return;

    try {
      const res = await api.reviewSrsWord(currentCard.wordId || currentCard.id, quality);
      setLastReviewFeedback(res);
    } catch {
      // Offline fallback
      setLastReviewFeedback({ nextInterval: quality >= 3 ? 2 : 1, xpEarned: quality >= 3 ? 10 : 2 });
    }

    setIsFlipped(false);

    if (currentIndex + 1 < queue.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSessionCompleted(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <LingLing reaction="greet" size={80} animate={true} />
        <span className="text-sm font-black text-ink">Đang mở hộp thẻ ghi nhớ...</span>
      </div>
    );
  }

  if (sessionCompleted || !currentCard) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="bg-card border-2 border-ink rounded-3xl shadow-brutal-2xl p-8 sm:p-12 space-y-6">
          <LingLing reaction="wink" size={120} animate={true} />
          <h2 className="text-3xl font-black text-ink">Hoàn thành phiên ôn tập!</h2>
          <p className="text-sm text-ink-soft leading-relaxed max-w-sm mx-auto">
            Bạn đã ôn tập xong toàn bộ các từ đến hạn hôm nay. Hệ thống đã tự động xếp lịch nhắc nhở thông minh vào những ngày tiếp theo!
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <Button variant="red" size="md" onClick={() => { setCurrentIndex(0); setSessionCompleted(false); }}>
              Ôn lại một lượt nữa
            </Button>
            <Link href="/dashboard">
              <Button variant="white" size="md">
                Về bàn làm việc
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12 text-left space-y-8">
      {/* Header thanh tiến độ */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b-2 border-ink/20">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-red block mb-0.5">
            Lịch ôn tập thông minh
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-ink">Thẻ Ghi Nhớ Hôm Nay</h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-ink bg-card border-2 border-ink rounded-xl px-3 py-1.5 shadow-brutal-sm">
            {currentIndex + 1} / {queue.length} thẻ
          </span>
        </div>
      </div>

      {/* Thẻ Lật Sổ Tay (Flashcard Container) */}
      <div className="relative select-none">
        {/* Dải Băng Dính Vàng */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-amber/70 border-l-2 border-r-2 border-dashed border-ink/40 -rotate-2 z-20 pointer-events-none" />

        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative bg-card border-2 border-ink rounded-3xl shadow-brutal-2xl p-8 sm:p-14 min-h-[360px] flex flex-col justify-between text-center cursor-pointer transition-all duration-200 hover:-translate-y-1 ${
            isFlipped ? 'bg-[#FFFDF8]' : ''
          }`}
        >
          {/* Hàng nhãn trên thẻ */}
          <div className="flex items-center justify-between">
            <Badge variant="teal">{currentCard.cefrLevel || 'B1'}</Badge>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSpeak(currentCard.targetText);
              }}
              className="w-9 h-9 rounded-xl border-2 border-ink bg-paper hover:bg-paper-2 flex items-center justify-center text-ink shadow-brutal-sm cursor-pointer"
              title="Nghe phát âm"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Nội dung Mặt Trước / Mặt Sau */}
          {!isFlipped ? (
            <div className="py-8 space-y-3">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-ink tracking-tight">
                {currentCard.targetText}
              </h2>
              <p className="text-base font-mono text-ink-soft">{currentCard.phonetic || '/.../'}</p>
              <span className="inline-block text-xs font-bold text-ink-soft bg-paper-2 border border-ink/20 rounded-full px-4 py-1.5 mt-4">
                Chạm vào thẻ để lật mặt sau ↩
              </span>
            </div>
          ) : (
            <div className="py-6 space-y-4 animate-in fade-in duration-100">
              <h2 className="text-3xl sm:text-4xl font-black text-teal tracking-tight">
                {currentCard.translation}
              </h2>
              <p className="text-base font-black text-ink">{currentCard.targetText}</p>
              {currentCard.exampleSentence && (
                <div className="p-4 bg-paper-2 border border-ink/20 rounded-xl text-xs sm:text-sm text-ink-soft italic leading-relaxed max-w-md mx-auto">
                  "{currentCard.exampleSentence}"
                </div>
              )}
            </div>
          )}

          {/* Chân Thẻ */}
          <div className="text-xs font-bold text-ink-soft">
            {isFlipped ? 'Đánh giá mức độ nhớ của bạn ở bên dưới:' : 'Hệ thống thẻ ghi nhớ ngắt quãng'}
          </div>
        </div>
      </div>

      {/* 6 Nút Đánh Giá Mức Độ Ghi Nhớ */}
      {isFlipped ? (
        <div className="space-y-3 text-center">
          <span className="text-xs font-black uppercase tracking-wider text-ink block">
            Bạn nhớ từ này như thế nào?
          </span>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            <button
              onClick={() => handleReviewQuality(0)}
              className="p-3 bg-red/10 hover:bg-red hover:text-white border-2 border-ink rounded-xl text-center shadow-brutal-sm hover:shadow-brutal transition-all cursor-pointer font-black text-xs"
            >
              <span className="block text-base">0</span>
              <span>Quên hẳn</span>
            </button>

            <button
              onClick={() => handleReviewQuality(1)}
              className="p-3 bg-red/10 hover:bg-red hover:text-white border-2 border-ink rounded-xl text-center shadow-brutal-sm hover:shadow-brutal transition-all cursor-pointer font-black text-xs"
            >
              <span className="block text-base">1</span>
              <span>Rất mơ hồ</span>
            </button>

            <button
              onClick={() => handleReviewQuality(2)}
              className="p-3 bg-amber/20 hover:bg-amber hover:text-ink border-2 border-ink rounded-xl text-center shadow-brutal-sm hover:shadow-brutal transition-all cursor-pointer font-black text-xs"
            >
              <span className="block text-base">2</span>
              <span>Nhớ khó</span>
            </button>

            <button
              onClick={() => handleReviewQuality(3)}
              className="p-3 bg-amber/20 hover:bg-amber hover:text-ink border-2 border-ink rounded-xl text-center shadow-brutal-sm hover:shadow-brutal transition-all cursor-pointer font-black text-xs"
            >
              <span className="block text-base">3</span>
              <span>Nhớ tạm</span>
            </button>

            <button
              onClick={() => handleReviewQuality(4)}
              className="p-3 bg-teal/15 hover:bg-teal hover:text-white border-2 border-ink rounded-xl text-center shadow-brutal-sm hover:shadow-brutal transition-all cursor-pointer font-black text-xs"
            >
              <span className="block text-base">4</span>
              <span>Nhớ tốt</span>
            </button>

            <button
              onClick={() => handleReviewQuality(5)}
              className="p-3 bg-teal/20 hover:bg-teal hover:text-white border-2 border-ink rounded-xl text-center shadow-brutal-sm hover:shadow-brutal transition-all cursor-pointer font-black text-xs"
            >
              <span className="block text-base">5</span>
              <span>Rất chuẩn</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button variant="red" size="lg" onClick={() => setIsFlipped(true)}>
            <RotateCw className="w-4 h-4" /> Lật Xem Mặt Sau
          </Button>
        </div>
      )}
    </div>
  );
}
