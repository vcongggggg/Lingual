'use client';

import React, { useState } from 'react';
import { Sparkles, Trophy, Zap, CheckCircle2, RotateCcw, Brain, ArrowRight } from 'lucide-react';
import VocabularyPracticeShell from './practice/VocabularyPracticeShell';
import { Button, Card } from '@linguaflow/ui';

interface QuickTestProps {
  locale: string;
}

export default function QuickTest({ locale }: QuickTestProps) {
  const [selectedCount, setSelectedCount] = useState<number>(10);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  if (isTesting) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setIsTesting(false)}
          className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800"
        >
          ← Dừng kiểm tra nhanh
        </button>

        <VocabularyPracticeShell limit={selectedCount} locale={locale} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-teal-500/30 backdrop-blur-2xl shadow-2xl space-y-6 text-center">
      <div className="inline-flex p-4 rounded-3xl bg-teal-500/15 border border-teal-500/30 text-teal-300 shadow-lg shadow-teal-500/20">
        <Zap className="w-8 h-8 fill-teal-400" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
          Kiểm Tra Nhanh Từ Vựng (Quick Test)
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Đánh giá tốc độ phản xạ và mức độ ghi nhớ từ vựng qua các câu hỏi trắc nghiệm nghĩa, điền từ và nghe viết.
        </p>
      </div>

      {/* Question Count Selector */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Chọn số lượng câu hỏi:
        </span>
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {[5, 10, 20].map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => setSelectedCount(count)}
              className={`py-3 rounded-2xl font-display font-extrabold text-base transition-all border ${
                selectedCount === count
                  ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-lg shadow-teal-500/30'
                  : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              {count} Câu
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-4">
        <Button
          variant="primary"
          size="lg"
          onClick={() => setIsTesting(true)}
          className="w-full max-w-sm mx-auto shadow-xl shadow-teal-500/25"
          icon={<Zap className="w-4 h-4 fill-slate-950" />}
        >
          Bắt đầu kiểm tra ({selectedCount} câu)
        </Button>
      </div>
    </div>
  );
}
