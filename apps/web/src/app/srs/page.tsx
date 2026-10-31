'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Volume2,
  RotateCw,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  ArrowLeft,
  Calendar,
} from 'lucide-react';
import { api } from '../../lib/api';
import { LingLing } from '../../components/ui/LingLing';
import { StampSlam } from '../../components/ui/StampSlam';

// 6 mức đánh giá ghi nhớ (tương đương thang đo lặp lại ngắt quãng 0–5)
const MEMORY_RATINGS = [
  { level: 0, label: '0: Quên', desc: 'Không nhớ gì', color: 'hover:bg-red/20' },
  { level: 1, label: '1: Lờ mờ', desc: 'Nhớ sai đáp án', color: 'hover:bg-red/10' },
  { level: 2, label: '2: Vất vả', desc: 'Phải gợi ý', color: 'hover:bg-amber/20' },
  { level: 3, label: '3: Tạm ổn', desc: 'Nghĩ một lúc', color: 'hover:bg-amber/10' },
  { level: 4, label: '4: Rõ ràng', desc: 'Nhớ chuẩn', color: 'hover:bg-teal/10' },
  { level: 5, label: '5: Hoàn hảo', desc: 'Phản xạ ngay', color: 'hover:bg-teal/20 text-teal' },
];

export default function SrsPage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [stamped, setStamped] = useState(false);
  const [cardStamps, setCardStamps] = useState<Record<string, number>>({
    'card-1': 4, // 4 stamps initially so 1 review triggers 5 stamps and red border
    'card-2': 2,
    'card-3': 1,
  });

  // Fallback demo flashcard queue if API is offline
  const FALLBACK_QUEUE = [
    {
      id: 'card-1',
      libraryCode: 'LIB-VOC-0492',
      word: 'Perseverance',
      partOfSpeech: 'Danh từ (Noun)',
      ipa: '/ˌpɜː.sɪˈvɪə.rəns/',
      level: 'B2',
      meaning: 'Sự kiên trì, lòng bền bỉ, quyết tâm vượt qua mọi khó khăn thử thách.',
      exampleEn: 'Through hard work and perseverance, she achieved top scores.',
      exampleVi: 'Nhờ vào sự chăm chỉ và lòng kiên trì, cô ấy đã đạt được số điểm cao nhất.',
      synonyms: ['Persistence', 'Tenacity', 'Diligence'],
    },
    {
      id: 'card-2',
      libraryCode: 'LIB-VOC-0831',
      word: 'Substantial',
      partOfSpeech: 'Tính từ (Adjective)',
      ipa: '/səbˈstæn.ʃəl/',
      level: 'B2',
      meaning: 'Đáng kể, quan trọng, có số lượng lớn hoặc có giá trị thật sự.',
      exampleEn: 'A substantial amount of funding was allocated to green energy.',
      exampleVi: 'Một khoản tài trợ đáng kể đã được phân bổ cho năng lượng xanh.',
      synonyms: ['Significant', 'Considerable', 'Substantive'],
    },
    {
      id: 'card-3',
      libraryCode: 'LIB-VOC-1044',
      word: 'Eloquent',
      partOfSpeech: 'Tính từ (Adjective)',
      ipa: '/ˈel.ə.kwənt/',
      level: 'C1',
      meaning: 'Hùng biện, lưu loát, có tài ăn nói thuyết phục và truyền cảm.',
      exampleEn: 'He gave an eloquent speech that moved the entire audience.',
      exampleVi: 'Ông ấy đã có một bài phát biểu hùng hồn làm lay động toàn bộ người nghe.',
      synonyms: ['Articulate', 'Fluent', 'Expressive'],
    },
  ];

  useEffect(() => {
    async function loadCards() {
      try {
        const res = await api.getSrsQueue();
        if (res.queue && res.queue.length > 0) {
          const mapped = res.queue.map((item: any, idx: number) => ({
            id: item.id || `card-${idx + 1}`,
            libraryCode: `LIB-VOC-0${idx + 1}28`,
            word: item.targetText || item.word || 'Vocabulary',
            partOfSpeech: item.partOfSpeech || 'Từ vựng (Word)',
            ipa: item.phonetic || '/.../',
            level: item.cefrLevel || 'B1',
            meaning: item.translation || 'Nghĩa tiếng Việt',
            exampleEn: item.exampleSentence || 'Example sentence in English context.',
            exampleVi: item.exampleTranslation || 'Bản dịch ví dụ minh họa tiếng Việt.',
            synonyms: ['Key Word', 'Academic Context'],
          }));
          setQueue(mapped);
        } else {
          setQueue(FALLBACK_QUEUE);
        }
      } catch {
        setQueue(FALLBACK_QUEUE);
      } finally {
        setLoading(false);
      }
    }
    loadCards();
  }, []);

  const currentCard = queue[currentIndex] || FALLBACK_QUEUE[0];

  const handlePlayAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if ('speechSynthesis' in window && currentCard?.word) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentCard.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRating = async (ratingLevel: number) => {
    const cardId = currentCard?.id || `card-${currentIndex + 1}`;
    const nextStamps = (cardStamps[cardId] || 0) + 1;
    setCardStamps((prev) => ({ ...prev, [cardId]: nextStamps }));
    setStamped(true);
    setReviewedCount((prev) => prev + 1);

    try {
      if (currentCard?.id) {
        await api.reviewSrsWord(currentCard.id, ratingLevel);
      }
    } catch {}

    setTimeout(() => {
      setStamped(false);
      setIsFlipped(false);
      if (currentIndex + 1 < queue.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setSessionCompleted(true);
      }
    }, 320);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <LingLing reaction="thinking" size={90} animate={true} />
        <span className="text-sm font-black text-ink block">Đang mở hộp thẻ ghi nhớ...</span>
      </div>
    );
  }

  // MÀN HÌNH TỔNG KẾT: HÔM NAY ĐÃ ÔN X THẺ + BÒ CELEBRATING
  if (sessionCompleted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 pb-28 sm:pb-20">
        <div className="card-paper p-8 sm:p-12 space-y-6 bg-card border-4 border-ink shadow-brutal-xl relative">
          <div className="flex justify-center -mb-2">
            <StampSlam
              text="HOÀN THÀNH"
              subtext="PHIÊN ÔN TẬP"
              variant="badge"
              color="teal"
              size="lg"
            />
          </div>

          <LingLing reaction="party" size={130} animate={true} />

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-teal block">
              Hoàn thành phiên ôn tập
            </span>
            <h2 className="text-3xl font-black text-ink font-sans">
              Hôm nay đã ôn {reviewedCount} thẻ!
            </h2>
            <p className="text-sm text-ink-soft leading-relaxed max-w-sm mx-auto font-sans">
              Tuyệt vời! Toàn bộ thẻ đến hạn hôm nay đã được xếp lịch ôn thông minh vào những ngày tiếp theo.
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSessionCompleted(false);
                setIsFlipped(false);
              }}
              className="btn btn-paper text-xs font-black shadow-brutal"
            >
              Ôn lại một lượt nữa
            </button>
            <Link href="/vocabulary" className="btn btn-red text-xs font-black shadow-brutal">
              Về sổ tay từ vựng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 pb-28 sm:pb-20 text-left">
      {/* Breadcrumb text mực */}
      <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
        <Link
          href="/vocabulary"
          className="hover:text-red transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Sổ tay từ vựng</span>
        </Link>
        <span>/</span>
        <span className="text-ink">Lịch ôn thông minh</span>
      </div>

      {/* Header thanh tiến độ */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b-2 border-ink/20">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-teal block mb-1">
            Hộp thẻ ghi nhớ hàng ngày
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-ink font-sans">
            Thẻ ghi nhớ hôm nay
          </h1>
        </div>

        <span className="font-mono text-xs font-black px-3 py-1.5 rounded-xl border-2 border-ink bg-card shadow-brutal-sm text-ink">
          Thẻ {currentIndex + 1} / {queue.length}
        </span>
      </div>

      {/* THẺ TỪ VẼ NHƯ "THẺ THƯ VIỆN" GIẤY CÓ DÁN BĂNG KEO 2 GÓC VỚI HIỆU ỨNG LẬT 3D */}
      <div className="relative pt-3 select-none perspective-1000">
        {/* Băng dính 2 góc trên (Tape corners) */}
        <div className="tape-corner-tl" />
        <div className="tape-corner-tr" />

        {/* Khung thẻ thư viện cổ điển với 3D Flip */}
        {(() => {
          const currentCardStamps = cardStamps[currentCard?.id || `card-${currentIndex + 1}`] || 0;
          const isMastered = currentCardStamps >= 5;

          const cardBorderClass = isMastered
            ? 'border-4 border-red shadow-[0_0_0_2px_#D64027,8px_9px_0_#211A13]'
            : 'border-2 border-ink shadow-brutal hover:shadow-brutal-xl';

          return (
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className={`relative w-full min-h-[390px] sm:min-h-[430px] cursor-pointer flashcard-preserve-3d ${
                isFlipped ? 'flashcard-flipped' : ''
              }`}
            >
              {/* Hiệu ứng con dấu ĐÃ ÔN đóng xuống khi vừa đánh giá */}
              {stamped && (
                <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                  <StampSlam
                    text="ĐÃ ÔN"
                    subtext={`DẤU ${currentCardStamps}/5`}
                    variant="circle"
                    color="red"
                    size="lg"
                  />
                </div>
              )}

              {/* ==================== MẶT TRƯỚC (FRONT FACE) ==================== */}
              <div
                className={`flashcard-face absolute inset-0 w-full h-full p-6 sm:p-10 rounded-2xl flex flex-col justify-between bg-card ${cardBorderClass} ${
                  isFlipped ? 'pointer-events-none' : 'pointer-events-auto'
                }`}
              >
                {/* Header thẻ thư viện */}
                <div className="flex items-center justify-between border-b-2 border-ink/20 pb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-black text-ink-muted">
                      {currentCard.libraryCode}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-card border border-ink px-2 py-0.5 rounded text-teal">
                      Cấp độ {currentCard.level}
                    </span>

                    {/* 5 Hộp con dấu tiến độ ôn */}
                    <div
                      className="flex items-center gap-1 ml-2 bg-paper-2 border border-ink/30 px-2 py-0.5 rounded-md"
                      title={`${currentCardStamps}/5 dấu ôn tập`}
                    >
                      {[1, 2, 3, 4, 5].map((idx) => (
                        <span
                          key={idx}
                          className={`w-3.5 h-3.5 rounded-sm border text-[8px] font-black flex items-center justify-center ${
                            idx <= currentCardStamps
                              ? 'bg-red border-red text-white'
                              : 'border-ink/30 text-ink/30'
                          }`}
                        >
                          {idx <= currentCardStamps ? '✓' : idx}
                        </span>
                      ))}
                      {isMastered && (
                        <span className="text-[9px] font-black uppercase text-red ml-1">Đủ 5 dấu</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(true);
                    }}
                    className="flex items-center gap-1.5 text-xs font-black text-red hover:underline cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Lật mặt sau</span>
                  </button>
                </div>

                {/* Nội dung Mặt Trước: Từ vựng + Phiên âm + Nút nghe */}
                <div className="py-6 sm:py-8 text-center space-y-4 my-auto">
                  <span className="text-xs font-bold text-ink-muted italic block">
                    {currentCard.partOfSpeech}
                  </span>

                  <h2 className="text-4xl sm:text-6xl font-black text-ink tracking-tight font-serif">
                    {currentCard.word}
                  </h2>

                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg sm:text-xl font-mono text-teal font-extrabold">
                      {currentCard.ipa}
                    </span>
                    <button
                      type="button"
                      onClick={handlePlayAudio}
                      className="w-8 h-8 rounded-full bg-paper-2 hover:bg-amber border border-ink flex items-center justify-center text-ink shadow-brutal-sm transition-all cursor-pointer"
                      title="Phát âm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-ink-soft pt-4 font-semibold flex items-center justify-center gap-1.5">
                    <span>↻</span>
                    <span>Bấm vào thẻ hoặc nút &ldquo;Lật mặt sau&rdquo; để xem nghĩa & ví dụ</span>
                  </p>
                </div>

                {/* Footer thẻ thư viện */}
                <div className="border-t-2 border-ink/20 pt-3 flex items-center justify-between text-[11px] font-black text-ink-muted">
                  <span>SỔ TAY TỪ VỰNG</span>
                  <span>HỆ THỐNG THẺ GHI NHỚ LINGUAL</span>
                </div>
              </div>

              {/* ==================== MẶT SAU (BACK FACE) ==================== */}
              <div
                className={`flashcard-face flashcard-face-back absolute inset-0 w-full h-full p-6 sm:p-10 rounded-2xl flex flex-col justify-between bg-paper-2 ${cardBorderClass} ${
                  !isFlipped ? 'pointer-events-none' : 'pointer-events-auto'
                }`}
              >
                {/* Header thẻ thư viện */}
                <div className="flex items-center justify-between border-b-2 border-ink/20 pb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-black text-ink-muted">
                      {currentCard.libraryCode}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-card border border-ink px-2 py-0.5 rounded text-teal">
                      Cấp độ {currentCard.level}
                    </span>

                    {/* 5 Hộp con dấu tiến độ ôn */}
                    <div
                      className="flex items-center gap-1 ml-2 bg-card border border-ink/30 px-2 py-0.5 rounded-md"
                      title={`${currentCardStamps}/5 dấu ôn tập`}
                    >
                      {[1, 2, 3, 4, 5].map((idx) => (
                        <span
                          key={idx}
                          className={`w-3.5 h-3.5 rounded-sm border text-[8px] font-black flex items-center justify-center ${
                            idx <= currentCardStamps
                              ? 'bg-red border-red text-white'
                              : 'border-ink/30 text-ink/30'
                          }`}
                        >
                          {idx <= currentCardStamps ? '✓' : idx}
                        </span>
                      ))}
                      {isMastered && (
                        <span className="text-[9px] font-black uppercase text-red ml-1">Đủ 5 dấu</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(false);
                    }}
                    className="flex items-center gap-1.5 text-xs font-black text-red hover:underline cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Lật mặt trước</span>
                  </button>
                </div>

                {/* Nội dung Mặt Sau: Định nghĩa + Câu ví dụ song ngữ + Từ đồng nghĩa */}
                <div className="py-2 sm:py-4 space-y-4 text-left my-auto">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-teal block">
                      Định nghĩa tiếng Việt:
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-ink font-sans">
                      {currentCard.meaning}
                    </h3>
                  </div>

                  {/* Câu ví dụ song ngữ */}
                  <div className="lined-paper border-2 border-ink rounded-xl p-3 sm:p-4 space-y-1.5 shadow-brutal-sm">
                    <span className="text-[11px] font-black uppercase tracking-wider text-ink-soft block">
                      Ví dụ ngữ cảnh:
                    </span>
                    <p className="text-sm sm:text-base font-bold text-ink leading-relaxed font-serif">
                      &ldquo;{currentCard.exampleEn}&rdquo;
                    </p>
                    <p className="text-xs font-semibold text-teal italic">
                      {currentCard.exampleVi}
                    </p>
                  </div>

                  {/* Từ đồng nghĩa */}
                  {currentCard.synonyms && currentCard.synonyms.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-bold text-ink-soft">Từ đồng nghĩa:</span>
                      {currentCard.synonyms.map((s: string) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 bg-card border border-ink rounded-md font-mono font-bold text-ink"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer thẻ thư viện */}
                <div className="border-t-2 border-ink/20 pt-3 flex items-center justify-between text-[11px] font-black text-ink-muted">
                  <span>SỔ TAY TỪ VỰNG</span>
                  <span>HỆ THỐNG THẺ GHI NHỚ LINGUAL</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* CỤM NÚT CHẤM ĐIỂM NHỚ 0–5 DẠNG NÚT GIẤY */}
      <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-ink block">
            Mức độ ghi nhớ của bạn:
          </span>
          <span className="text-[11px] font-bold text-ink-muted">0: Quên → 5: Hoàn hảo</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {MEMORY_RATINGS.map((rating) => (
            <button
              key={rating.level}
              onClick={() => handleRating(rating.level)}
              className={`p-2.5 rounded-xl border-2 border-ink bg-card text-center transition-all cursor-pointer shadow-brutal-sm ${rating.color}`}
            >
              <span className="font-mono text-sm font-black block text-ink">
                {rating.level}
              </span>
              <span className="text-[10px] font-black uppercase text-ink-muted block line-clamp-1">
                {rating.desc}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
