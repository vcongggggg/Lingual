'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { LingLing } from '../../../components/ui/LingLing';
import { 
  ArrowLeft, 
  Volume2, 
  RotateCw, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles,
  BookMarked,
  Layers,
  ArrowRight
} from 'lucide-react';

interface Flashcard {
  id: number;
  word: string;
  ipa: string;
  partOfSpeech: string;
  meaning: string;
  exampleEn: string;
  exampleVi: string;
  synonyms: string[];
  level: string;
  libraryCode: string;
}

const VOCAB_CARDS: Flashcard[] = [
  {
    id: 1,
    word: 'perseverance',
    ipa: '/ˌpɜː.sɪˈvɪə.rəns/',
    partOfSpeech: 'noun [U]',
    meaning: 'sự kiên trì, bền chí theo đuổi mục tiêu dù gặp nhiều khó khăn',
    exampleEn: 'Through hard work and perseverance, she finally achieved a 8.0 in the IELTS exam.',
    exampleVi: 'Nhờ sự chăm chỉ và lòng kiên trì, cô ấy cuối cùng đã đạt điểm 8.0 trong kỳ thi IELTS.',
    synonyms: ['persistence', 'tenacity', 'dedication'],
    level: 'B2',
    libraryCode: 'LF-VOCAB-B2-019',
  },
  {
    id: 2,
    word: 'resilience',
    ipa: '/rɪˈzɪl.jəns/',
    partOfSpeech: 'noun [U]',
    meaning: 'khả năng phục hồi nhanh chóng sau khó khăn, nghịch cảnh',
    exampleEn: 'The community showed remarkable resilience in rebuilding their neighborhood after the flood.',
    exampleVi: 'Cộng đồng đã thể hiện sự kiên cường đáng nể khi tái thiết lại khu phố sau trận lũ.',
    synonyms: ['toughness', 'adaptability', 'strength'],
    level: 'C1',
    libraryCode: 'LF-VOCAB-C1-042',
  },
  {
    id: 3,
    word: 'ubiquitous',
    ipa: '/juːˈbɪk.wɪ.təs/',
    partOfSpeech: 'adjective',
    meaning: 'có mặt ở khắp nơi, phổ biến cùng một lúc',
    exampleEn: 'Smartphones have become ubiquitous in modern urban society.',
    exampleVi: 'Điện thoại thông minh đã trở nên phổ biến ở khắp mọi nơi trong xã hội đô thị hiện đại.',
    synonyms: ['omnipresent', 'pervasive', 'universal'],
    level: 'C1',
    libraryCode: 'LF-VOCAB-C1-088',
  },
  {
    id: 4,
    word: 'mindful',
    ipa: '/ˈmaɪnd.fəl/',
    partOfSpeech: 'adjective',
    meaning: 'chánh niệm, chú ý cẩn thận và nhận thức rõ về hành động của mình',
    exampleEn: 'Be mindful of your pronunciation when practicing connected speech.',
    exampleVi: 'Hãy chú ý đến cách phát âm của bạn khi luyện tập các hiện tượng nối âm.',
    synonyms: ['attentive', 'conscious', 'aware'],
    level: 'B1',
    libraryCode: 'LF-VOCAB-B1-015',
  },
];

const SM2_RATINGS = [
  { grade: 0, label: '0 · Quên hẳn', color: 'hover:bg-red/10 hover:border-red hover:text-red' },
  { grade: 1, label: '1 · Rất khó', color: 'hover:bg-red/10 hover:border-red hover:text-red' },
  { grade: 2, label: '2 · Khó khăn', color: 'hover:bg-amber-soft hover:border-amber hover:text-ink' },
  { grade: 3, label: '3 · Nhớ vừa', color: 'hover:bg-amber-soft hover:border-amber hover:text-ink' },
  { grade: 4, label: '4 · Nhớ tốt', color: 'hover:bg-teal/10 hover:border-teal hover:text-teal' },
  { grade: 5, label: '5 · Hoàn hảo', color: 'hover:bg-teal/20 hover:border-teal hover:text-teal' },
];

export default function VocabularyPracticePage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [lastRated, setLastRated] = useState<number | null>(null);

  const card = VOCAB_CARDS[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / VOCAB_CARDS.length) * 100);

  const handlePlayAudio = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(card.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleGrade = (grade: number) => {
    setLastRated(grade);
    setTimeout(() => {
      setIsFlipped(false);
      setLastRated(null);
      setCurrentIdx((prev) => (prev + 1) % VOCAB_CARDS.length);
    }, 300);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8 text-left pb-28 sm:pb-20">
      {/* Breadcrumb mực */}
      <div className="flex items-center justify-between">
        <Link
          href="/vocabulary"
          className="inline-flex items-center gap-2 text-sm font-black text-ink hover:text-red transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại Kho Từ Vựng</span>
        </Link>

        <span className="px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black text-teal uppercase tracking-wider">
          Thẻ ghi nhớ
        </span>
      </div>

      {/* Tiến độ dạng thanh mực */}
      <div className="bg-card border-2 border-ink rounded-2xl p-4 sm:p-5 shadow-brutal-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-ink">
          <span>Thẻ thư viện: Từ {currentIdx + 1} / {VOCAB_CARDS.length}</span>
          <span className="text-teal font-extrabold">{progressPercent}% hoàn thành</span>
        </div>
        <div className="ink-progress-track">
          <div className="ink-progress-fill bg-teal" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* THẺ TỪ VẼ NHƯ "THẺ THƯ VIỆN" GIẤY CÓ DÁN BĂNG KEO 2 GÓC */}
      <div className="relative pt-3">
        {/* Băng dính 2 góc trên (Tape corners) */}
        <div className="tape-corner-tl" />
        <div className="tape-corner-tr" />

        {/* Khung thẻ thư viện cổ điển */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`card-paper p-8 sm:p-12 min-h-[380px] sm:min-h-[420px] flex flex-col justify-between cursor-pointer select-none relative transition-all duration-300 hover:shadow-brutal-xl ${
            isFlipped ? 'bg-paper-2' : 'bg-card'
          }`}
        >
          {/* Header thẻ thư viện */}
          <div className="flex items-center justify-between border-b-2 border-ink/20 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-ink-muted">
                {card.libraryCode}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-card border border-ink px-2 py-0.5 rounded text-teal">
                Cấp độ {card.level}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(!isFlipped);
              }}
              className="flex items-center gap-1.5 text-xs font-black text-red hover:underline"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{isFlipped ? 'Xem mặt trước' : 'Lật mặt sau'}</span>
            </button>
          </div>

          {/* Nội dung Mặt Trước / Mặt Sau */}
          {!isFlipped ? (
            /* MẶT TRƯỚC: Từ vựng + Phiên âm + Nút nghe */
            <div className="py-8 text-center space-y-4">
              <span className="text-xs font-bold text-ink-muted italic">
                {card.partOfSpeech}
              </span>

              <h2 className="text-4xl sm:text-6xl font-black text-ink tracking-tight font-serif">
                {card.word}
              </h2>

              <div className="flex items-center justify-center gap-2">
                <span className="text-lg sm:text-xl font-mono text-teal font-extrabold">
                  {card.ipa}
                </span>
                <button
                  onClick={handlePlayAudio}
                  className="w-8 h-8 rounded-full bg-paper-2 hover:bg-amber border border-ink flex items-center justify-center text-ink shadow-brutal-sm transition-all"
                  title="Phát âm"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-ink-soft pt-4 font-semibold">
                Bấm vào thẻ để lật xem nghĩa & câu ví dụ
              </p>
            </div>
          ) : (
            /* MẶT SAU: Nghĩa + Câu ví dụ song ngữ + Từ đồng nghĩa */
            <div className="py-4 space-y-5 text-left">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-teal block">
                  Định nghĩa tiếng Việt:
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-ink">
                  {card.meaning}
                </h3>
              </div>

              {/* Câu ví dụ song ngữ */}
              <div className="lined-paper border-2 border-ink rounded-xl p-4 space-y-1.5 shadow-brutal-sm">
                <span className="text-[11px] font-black uppercase tracking-wider text-ink-soft block">
                  Ví dụ ngữ cảnh:
                </span>
                <p className="text-sm sm:text-base font-bold text-ink leading-relaxed font-serif">
                  &ldquo;{card.exampleEn}&rdquo;
                </p>
                <p className="text-xs font-semibold text-teal italic">
                  {card.exampleVi}
                </p>
              </div>

              {/* Từ đồng nghĩa */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-bold text-ink-soft">Từ đồng nghĩa:</span>
                {card.synonyms.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-card border border-ink rounded-md font-mono font-bold text-ink">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer thẻ thư viện */}
          <div className="border-t-2 border-ink/20 pt-3 flex items-center justify-between text-[11px] font-black text-ink-muted">
            <span>SỔ TAY TỪ VỰNG</span>
            <span>HỆ THỐNG THẺ GHI NHỚ LINGUAL</span>
          </div>
        </div>
      </div>

      {/* Cụm Nút Chấm Điểm Nhớ 0–5 Dạng Nút Giấy */}
      <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-ink block">
            Mức độ ghi nhớ của bạn:
          </span>
          <span className="text-[11px] font-bold text-ink-muted">0: Quên → 5: Hoàn hảo</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {SM2_RATINGS.map((rating) => (
            <button
              key={rating.grade}
              onClick={() => handleGrade(rating.grade)}
              className={`p-2.5 rounded-xl border-2 border-ink text-xs font-black transition-all cursor-pointer bg-paper text-ink shadow-brutal-sm ${rating.color}`}
            >
              {rating.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
