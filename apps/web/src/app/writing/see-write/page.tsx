'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { LingLing } from '../../../components/ui/LingLing';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Lightbulb, 
  Sparkles,
  Image as ImageIcon,
  Send,
  RotateCcw
} from 'lucide-react';

export default function WritingSeeWritePage() {
  const [essayText, setEssayText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const wordCount = essayText.trim().length > 0 ? essayText.trim().split(/\s+/).length : 0;

  const handleInsertConnector = (conn: string) => {
    setEssayText((prev) => (prev ? `${prev} ${conn}` : conn));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 pb-28 sm:pb-20 text-left">
      <div className="flex items-center justify-between">
        <Link
          href="/writing"
          className="text-xs font-bold text-ink-muted hover:text-red transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Phòng Luyện Viết</span>
        </Link>

        <span className="px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black text-red uppercase tracking-wider">
          Quan sát & Viết
        </span>
      </div>

      <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-ink">Quan sát & Viết đoạn văn (See & Write)</h1>
          <p className="text-xs text-ink-soft">Quan sát ngữ cảnh hình ảnh và diễn đạt thành đoạn văn hoàn chỉnh từ 40 - 80 từ.</p>
        </div>
        <div className="text-xs font-mono font-black text-ink-muted px-3 py-1 bg-paper border border-ink rounded-lg self-start sm:self-auto">
          MỤC TIÊU: 50 TỪ
        </div>
      </div>

      <Card className="p-6 sm:p-8 bg-[#FAF6EC] border-2 border-ink shadow-brutal-xl space-y-6">
        {/* Khung Mô Tả Ngữ Cảnh */}
        <div className="p-5 bg-paper rounded-2xl border-2 border-ink space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-teal">
            <ImageIcon className="w-4 h-4" />
            <span>Ngữ cảnh quan sát: Thư viện cuối tuần</span>
          </div>
          <p className="text-sm font-serif font-black text-ink">
            &ldquo;A modern city library with students quietly reading books, taking notes with laptops, and sunlight streaming through tall glass windows.&rdquo;
          </p>
          <p className="text-xs font-sans text-ink-soft">
            Hãy viết một đoạn văn ngắn miêu tả không khí yên tĩnh, hành động của các bạn học sinh và cảm nhận của bạn.
          </p>
        </div>

        {/* Giấy Kẻ Dòng Viết Bài */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-ink-muted flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber" />
              <span>Gợi ý từ nối:</span>
            </span>
            <span className="font-mono text-ink">
              Số từ: <strong className={wordCount >= 40 ? 'text-teal font-black' : 'text-amber'}>{wordCount}</strong> / 50 từ
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {['In the foreground', 'Meanwhile', 'The atmosphere is', 'It creates a sense of'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleInsertConnector(c)}
                className="text-xs font-bold px-2.5 py-1 bg-card border border-ink/40 rounded-lg hover:border-ink hover:bg-paper-2 transition-colors cursor-pointer"
              >
                + {c}
              </button>
            ))}
          </div>

          <textarea
            rows={6}
            value={essayText}
            onChange={(e) => setEssayText(e.target.value)}
            placeholder="Viết đoạn văn miêu tả của bạn tại đây..."
            className="w-full p-4 bg-paper border-2 border-ink rounded-2xl font-serif text-sm text-ink leading-relaxed outline-none focus:border-red resize-none shadow-brutal-sm"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => { setEssayText(''); setSubmitted(false); }}
            className="text-xs font-bold text-ink-muted hover:text-red flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Viết lại</span>
          </button>

          <Button
            onClick={() => setSubmitted(true)}
            disabled={wordCount < 10}
            className="btn-red text-xs font-black shadow-brutal flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Nộp đoạn văn</span>
          </Button>
        </div>

        {submitted && (
          <div className="p-4 bg-card border-2 border-ink rounded-2xl shadow-brutal flex items-center justify-between gap-4 text-left animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal" />
              <div>
                <span className="text-xs font-black text-ink block">Đã ghi nhận đoạn văn ({wordCount} từ)!</span>
                <span className="text-[11px] text-ink-soft">Ngữ pháp mạch lạc, từ vựng miêu tả không gian rất sinh động.</span>
              </div>
            </div>

            <Link
              href="/writing"
              className="btn btn-outline text-xs font-black shadow-brutal"
            >
              Hoàn thành bài tập
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
