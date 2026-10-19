'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { LingLing } from '../../../components/ui/LingLing';
import { 
  ArrowLeft, 
  CheckCircle2, 
  BookOpen, 
  Send,
  RotateCcw,
  Sparkles 
} from 'lucide-react';

export default function WritingFreePage() {
  const [journalText, setJournalText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const wordCount = journalText.trim().length > 0 ? journalText.trim().split(/\s+/).length : 0;

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
          Nhật ký tự do
        </span>
      </div>

      <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-ink">Trang nhật ký tự do (Free Journal)</h1>
          <p className="text-xs text-ink-soft">Thoải mái viết về cảm xúc, công việc hoặc một kỷ niệm bất kỳ trong ngày hôm nay.</p>
        </div>
        <div className="text-xs font-mono font-black text-ink-muted px-3 py-1 bg-paper border border-ink rounded-lg self-start sm:self-auto">
          NGÀY 17/10/2026
        </div>
      </div>

      <Card className="p-6 sm:p-10 bg-[#FAF6EC] border-2 border-ink shadow-brutal-xl space-y-6">
        <div className="lined-paper p-6 sm:p-8 rounded-2xl border-2 border-ink space-y-4">
          <div className="flex items-center justify-between border-b border-ink/20 pb-3">
            <span className="text-xs font-serif italic text-ink-muted">
              Dear Journal, today was a day filled with...
            </span>
            <span className="font-mono text-xs text-ink-soft">
              Số từ: <strong className="text-ink">{wordCount}</strong> từ
            </span>
          </div>

          <textarea
            rows={10}
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Bắt đầu viết những dòng suy nghĩ của bạn bằng tiếng Anh tại đây..."
            className="w-full bg-transparent font-serif text-sm sm:text-base text-ink leading-relaxed outline-none resize-none placeholder:text-ink-muted/60"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => { setJournalText(''); setSubmitted(false); }}
            className="text-xs font-bold text-ink-muted hover:text-red flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa trang</span>
          </button>

          <Button
            onClick={() => setSubmitted(true)}
            disabled={wordCount < 10}
            className="btn-red text-xs font-black shadow-brutal flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Lưu trang nhật ký</span>
          </Button>
        </div>

        {submitted && (
          <div className="p-4 bg-card border-2 border-ink rounded-2xl shadow-brutal flex items-center justify-between gap-4 text-left animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal" />
              <div>
                <span className="text-xs font-black text-ink block">Đã lưu trang nhật ký thành công!</span>
                <span className="text-[11px] text-ink-soft">Bạn đã rèn luyện thêm {wordCount} từ vựng vào kho tư duy phản xạ.</span>
              </div>
            </div>

            <Link
              href="/writing"
              className="btn btn-outline text-xs font-black shadow-brutal"
            >
              Hoàn thành
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
