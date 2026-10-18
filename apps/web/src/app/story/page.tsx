'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CowsTale } from '../../components/practice/CowsTale';

export default function StoryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-6 pb-28 text-left select-none">
      {/* Breadcrumb quay về practice */}
      <div className="flex items-center justify-between border-b-2 border-ink pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
          <Link
            href="/practice"
            className="hover:text-red transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Góc Luyện Tập</span>
          </Link>
          <span>/</span>
          <span className="text-ink">Chuyện Bò Kể (Mad-Libs Story)</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/eavesdrop"
            className="px-3 py-1 bg-paper-2 border border-ink rounded-lg text-xs font-bold text-ink hover:text-red transition-colors"
          >
            Bò đọc trộm (Nghe lén) →
          </Link>
        </div>
      </div>

      <CowsTale />
    </div>
  );
}
