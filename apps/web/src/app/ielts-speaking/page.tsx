'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mic, Sparkles } from 'lucide-react';
import { LingLing } from '../../components/ui/LingLing';
import { IeltsSpeakingModelsSection } from '../../components/ielts/IeltsSpeakingModelsSection';

export default function IeltsSpeakingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 pb-28 sm:pb-20 text-left">
      {/* Breadcrumb text mực */}
      <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
        <Link
          href="/ielts"
          className="hover:text-red transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Trung tâm IELTS</span>
        </Link>
        <span>/</span>
        <span className="text-ink">IELTS Speaking & Tuyển tập Đề mẫu Band 8.0</span>
      </div>

      {/* Main Section */}
      <IeltsSpeakingModelsSection />
    </div>
  );
}
