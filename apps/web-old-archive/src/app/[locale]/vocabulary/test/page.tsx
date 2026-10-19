'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import QuickTest from '@/components/vocabulary/QuickTest';

export default function VocabularyTestPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  return (
    <main className="min-h-screen pb-20 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-6 pointer-events-auto">
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}/vocabulary`}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Trở về Kho từ vựng</span>
        </Link>
      </div>

      <QuickTest locale={locale} />
    </main>
  );
}
