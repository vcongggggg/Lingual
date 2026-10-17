'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { TutorContext, AdaptiveLearningPlanItem } from '@linguaflow/domain';
import { tutorApi } from '@/lib/tutor/tutorApi';
import TutorHero from '@/components/tutor/TutorHero';
import TutorChat from '@/components/tutor/TutorChat';
import TutorContextPanel from '@/components/tutor/TutorContextPanel';

export default function TutorPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  const [context, setContext] = useState<TutorContext | null>(null);
  const [planItems, setPlanItems] = useState<AdaptiveLearningPlanItem[]>([]);

  useEffect(() => {
    tutorApi
      .getContext()
      .then((res) => {
        if (res?.context) setContext(res.context);
      })
      .catch(() => {});

    tutorApi
      .getPlan('u-demo-1', locale)
      .then((res) => {
        if (res?.plan?.todayItems) setPlanItems(res.plan.todayItems);
      })
      .catch(() => {});
  }, [locale]);

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 pointer-events-auto">
      {/* Hero Header */}
      <TutorHero
        cefrEstimate={context?.user?.cefrEstimate || 'B2'}
        overallScore={context?.overallScore || 78}
        currentStreak={context?.user?.currentStreak || 5}
        srsDueCount={context?.srsDueCount || 14}
        locale={locale}
      />

      {/* Main Layout: Chat (Left / Main) + Context Snapshot (Right / Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <TutorChat initialContext={context || undefined} locale={locale} />
        </div>

        <div className="lg:col-span-4">
          {context && <TutorContextPanel context={context} planItems={planItems} locale={locale} />}
        </div>
      </div>
    </main>
  );
}
