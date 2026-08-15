'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import SpeakingPracticeShell from '@/components/speaking/SpeakingPracticeShell';
import { SAMPLE_SPEAKING_PROMPTS } from '@/lib/speaking/sampleData';

export default function GuidedSpeakingPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const defaultPrompt = SAMPLE_SPEAKING_PROMPTS.find((p) => p.mode === 'guided');

  return (
    <SpeakingPracticeShell
      mode="guided"
      defaultPrompt={defaultPrompt}
      locale={locale}
    />
  );
}
