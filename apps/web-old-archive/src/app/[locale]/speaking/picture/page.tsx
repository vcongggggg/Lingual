'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import SpeakingPracticeShell from '@/components/speaking/SpeakingPracticeShell';
import { SAMPLE_SPEAKING_PROMPTS } from '@/lib/speaking/sampleData';

export default function PictureSpeakingPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const defaultPrompt = SAMPLE_SPEAKING_PROMPTS.find((p) => p.mode === 'picture');

  return (
    <SpeakingPracticeShell
      mode="picture"
      defaultPrompt={defaultPrompt}
      locale={locale}
    />
  );
}
