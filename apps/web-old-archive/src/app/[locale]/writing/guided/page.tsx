'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MASTER_WRITING_PROMPTS } from '@/lib/writing/sampleData';
import GuidedWritingExercise from '@/components/writing/GuidedWritingExercise';

export default function GuidedWritingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params?.locale as string) || 'vi';
  const promptId = searchParams?.get('promptId');

  const selectedPrompt =
    MASTER_WRITING_PROMPTS.find((p) => p.id === promptId && p.mode === 'guided') ||
    MASTER_WRITING_PROMPTS.find((p) => p.mode === 'guided') ||
    MASTER_WRITING_PROMPTS[0];

  return (
    <main className="min-h-screen pb-20 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-6 pointer-events-auto">
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}/writing`}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Trở về Writing Lab</span>
        </Link>
      </div>

      <GuidedWritingExercise prompt={selectedPrompt} locale={locale} />
    </main>
  );
}
