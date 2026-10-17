'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { MASTER_READING_ARTICLES } from '@/lib/reading/sampleData';
import ReadingPracticeShell from '@/components/reading/ReadingPracticeShell';
import { Badge } from '@linguaflow/ui';

export default function ReadingPracticePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params?.locale as string) || 'vi';
  const articleId = params?.articleId as string;
  const elapsed = Number(searchParams?.get('elapsed')) || 60;
  const mode = searchParams?.get('mode') || 'standard';

  const article = MASTER_READING_ARTICLES.find((a) => a.id === articleId) || MASTER_READING_ARTICLES[0];

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-4xl mx-auto space-y-6 pointer-events-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/${locale}/reading/${articleId}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại bài đọc</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="teal" className="text-xs font-extrabold uppercase">
            {article.level}
          </Badge>
          <span className="text-xs font-semibold text-slate-400">{article.topic}</span>
        </div>
      </div>

      <div className="text-center space-y-1 pb-2">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
          Bài Tập Đọc Hiểu: {article.title}
        </h1>
        <p className="text-xs text-slate-400">
          Hãy chọn đáp án chính xác nhất dựa trên nội dung bài đọc
        </p>
      </div>

      {/* Practice Shell */}
      <ReadingPracticeShell
        article={article}
        mode={mode}
        elapsedSeconds={elapsed}
        locale={locale}
      />
    </main>
  );
}
