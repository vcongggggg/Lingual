'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Volume2,
  Bookmark,
  Check,
  Plus,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { LingLing } from '../../../components/ui/LingLing';

export default function WordDetailPage() {
  const params = useParams();
  const wordId = params?.wordId ? String(params.wordId) : 'resilience';
  const [isSaved, setIsSaved] = useState(false);

  const wordData = {
    word: wordId,
    ipa: '/rɪˈzɪl.jəns/',
    partOfSpeech: 'Danh từ (noun)',
    cefr: 'C1',
    meaning: 'Khả năng phục hồi nhanh chóng sau khó khăn, nghịch cảnh hoặc chấn thương tâm lý.',
    example: 'The local community showed incredible resilience in the face of natural disaster.',
    exampleVi: 'Cộng đồng địa phương đã thể hiện sự kiên cường đáng kinh ngạc trước thảm họa thiên tai.',
    collocations: ['Emotional resilience', 'Show resilience', 'Build resilience'],
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(wordData.word);
      u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 pb-28 sm:pb-20 text-left">
      <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
        <Link
          href="/vocabulary"
          className="hover:text-red transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Kho Từ Vựng</span>
        </Link>
        <span>/</span>
        <span className="text-ink">Mục từ: {wordData.word}</span>
      </div>

      <Card className="p-6 sm:p-10 bg-card border-2 border-ink rounded-3xl shadow-brutal-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-ink/20 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded border border-ink/30 bg-paper-2 text-ink">
                {wordData.partOfSpeech}
              </span>
              <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded border border-ink bg-teal/10 text-teal">
                Bậc {wordData.cefr}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <h1 className="text-3xl sm:text-5xl font-serif font-black text-ink">
                {wordData.word}
              </h1>
              <button
                onClick={handleSpeak}
                className="w-10 h-10 rounded-full border-2 border-ink bg-paper flex items-center justify-center shadow-brutal-sm hover:scale-105 active:scale-95 transition-all text-ink hover:text-red cursor-pointer"
                title="Phát âm chuẩn"
              >
                <Volume2 className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
            <div className="font-mono text-sm font-bold text-teal">{wordData.ipa}</div>
          </div>

          <Button
            onClick={() => setIsSaved(!isSaved)}
            className={`text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer self-start sm:self-auto ${
              isSaved ? 'btn-paper' : 'btn-red'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4 text-teal" /> : <Plus className="w-4 h-4 stroke-[3]" />}
            <span>{isSaved ? 'Đã lưu vào thẻ' : '+ Thêm vào thẻ ghi nhớ'}</span>
          </Button>
        </div>

        {/* Định nghĩa đánh số */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-ink-muted block">
            1. Định nghĩa chi tiết:
          </span>
          <p className="text-base sm:text-lg font-bold text-ink leading-relaxed font-sans">
            {wordData.meaning}
          </p>
        </div>

        {/* Ví dụ in nghiêng */}
        <div className="lined-paper p-5 rounded-2xl border-2 border-ink space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-ink-muted block">
            Ví dụ ngữ cảnh thực tế:
          </span>
          <p className="text-sm sm:text-base font-serif italic font-bold text-ink">
            &ldquo;{wordData.example}&rdquo;
          </p>
          <p className="text-xs sm:text-sm text-teal font-sans font-semibold">
            {wordData.exampleVi}
          </p>
        </div>

        {/* Cụm từ thông dụng (Collocations) */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-black uppercase tracking-wider text-ink-muted block">
            Cụm từ đi kèm phổ biến:
          </span>
          <div className="flex flex-wrap gap-2">
            {wordData.collocations.map((col) => (
              <span
                key={col}
                className="text-xs font-bold px-3 py-1 bg-paper border border-ink/30 rounded-lg text-ink"
              >
                {col}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
