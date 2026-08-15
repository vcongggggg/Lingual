'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SAMPLE_PROFILES } from '@/lib/community/sampleData';
import { communityApi } from '@/lib/community/api';
import SocialProfileView from '@/components/community/SocialProfile';
import { SocialProfile } from '@linguaflow/domain';

export default function UserProfilePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const userId = params?.userId as string;
  const isVi = locale === 'vi';

  const [profile, setProfile] = useState<SocialProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = SAMPLE_PROFILES.find((p) => p.userId === userId) || SAMPLE_PROFILES[0];
    setProfile(found);

    communityApi
      .getProfile(userId)
      .then((res: any) => {
        if (res?.profile) {
          setProfile(res.profile);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        <p>{isVi ? 'Đang tải hồ sơ...' : 'Loading profile...'}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-4xl mx-auto space-y-6 pointer-events-auto">
      <Link
        href={`/${locale}/community`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isVi ? 'Quay lại Cộng Đồng' : 'Back to Community'}</span>
      </Link>

      <SocialProfileView
        profile={profile}
        isOwner={userId === 'demo-user-id-001'}
        locale={locale}
      />
    </main>
  );
}
