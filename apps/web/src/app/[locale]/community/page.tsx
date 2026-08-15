'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Trophy,
  BookOpen,
  Award,
  Plus,
  Flame,
  ArrowRight,
  Sparkles,
  Shield,
  Search,
} from 'lucide-react';
import { SAMPLE_ACTIVITIES, SAMPLE_STUDY_NOTES } from '@/lib/community/sampleData';
import { communityApi } from '@/lib/community/api';
import CommunityHero from '@/components/community/CommunityHero';
import ActivityFeed from '@/components/community/ActivityFeed';
import StudyNoteCard from '@/components/community/StudyNoteCard';
import StudyNoteComposer from '@/components/community/StudyNoteComposer';
import CommunityNotificationBell from '@/components/community/CommunityNotificationBell';
import { Button, Card, Badge } from '@linguaflow/ui';

export default function CommunityHubPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const isVi = locale === 'vi';

  const [activities, setActivities] = useState<any[]>(SAMPLE_ACTIVITIES);
  const [notes, setNotes] = useState<any[]>(SAMPLE_STUDY_NOTES);
  const [composerOpen, setComposerOpen] = useState(false);
  const [stats, setStats] = useState({
    friendsCount: 2,
    followingCount: 2,
    weeklySocialXP: 45,
    currentStreak: 5,
  });

  useEffect(() => {
    communityApi
      .getFeed()
      .then((res: any) => {
        if (res?.activities && res.activities.length > 0) {
          setActivities(res.activities);
        }
      })
      .catch(() => {});

    communityApi
      .getNotes()
      .then((res: any) => {
        if (res?.notes && res.notes.length > 0) {
          setNotes(res.notes);
        }
      })
      .catch(() => {});
  }, []);

  const handleNoteCreated = (newNote: any) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 pointer-events-auto">
      {/* Top Bar with Search and Notifications */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Link href={`/${locale}/community/leaderboard`}>
            <Button variant="outline" size="sm" icon={<Trophy className="w-4 h-4 text-amber-400" />}>
              {isVi ? 'Bảng xếp hạng' : 'Leaderboard'}
            </Button>
          </Link>
          <Link href={`/${locale}/community/groups`}>
            <Button variant="outline" size="sm" icon={<Shield className="w-4 h-4 text-teal-400" />}>
              {isVi ? 'Nhóm học tập' : 'Study Groups'}
            </Button>
          </Link>
          <Link href={`/${locale}/community/notes`}>
            <Button variant="outline" size="sm" icon={<BookOpen className="w-4 h-4 text-purple-400" />}>
              {isVi ? 'Kho ghi chú' : 'Study Notes'}
            </Button>
          </Link>
          <Link href={`/${locale}/community/achievements`}>
            <Button variant="outline" size="sm" icon={<Award className="w-4 h-4 text-amber-300" />}>
              {isVi ? 'Thành tích' : 'Achievements'}
            </Button>
          </Link>
          <Link href={`/${locale}/community/friends`}>
            <Button variant="outline" size="sm" icon={<Users className="w-4 h-4 text-teal-300" />}>
              {isVi ? 'Bạn bè' : 'Friends'}
            </Button>
          </Link>
        </div>

        <CommunityNotificationBell locale={locale} />
      </div>

      {/* Hero Banner */}
      <CommunityHero
        stats={stats}
        onCreateNote={() => setComposerOpen(true)}
        locale={locale}
      />

      {/* Main Two-Column Community Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Learning Activity Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-lg text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <span>{isVi ? 'Dòng Hoạt Động Học Tập' : 'Learning Activity Feed'}</span>
            </h3>
            <span className="text-xs text-slate-400">
              {isVi ? 'Cập nhật trực tiếp' : 'Live updates'}
            </span>
          </div>

          <ActivityFeed activities={activities} locale={locale} />
        </div>

        {/* Right Column: Trending Study Notes */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-lg text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <span>{isVi ? 'Ghi Chú Nổi Bật' : 'Featured Notes'}</span>
            </h3>
            <Link
              href={`/${locale}/community/notes`}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1"
            >
              <span>{isVi ? 'Xem tất cả' : 'View all'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {notes.slice(0, 3).map((note) => (
              <StudyNoteCard key={note.id} note={note} locale={locale} />
            ))}
          </div>
        </div>
      </div>

      {/* Create Note Dialog Modal */}
      <StudyNoteComposer
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        onNoteCreated={handleNoteCreated}
        locale={locale}
      />
    </main>
  );
}
