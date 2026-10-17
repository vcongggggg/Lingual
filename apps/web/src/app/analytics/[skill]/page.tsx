'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ReadingAnalyticsPage from '../reading/page';
import ListeningAnalyticsPage from '../listening/page';

export default function DynamicSkillAnalyticsPage() {
  const params = useParams();
  const skill = params?.skill ? String(params.skill).toLowerCase() : '';

  if (skill === 'listening') {
    return <ListeningAnalyticsPage />;
  }

  return <ReadingAnalyticsPage />;
}
