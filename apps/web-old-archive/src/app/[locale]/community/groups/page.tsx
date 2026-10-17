'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, Plus, Shield, Search } from 'lucide-react';
import { SAMPLE_STUDY_GROUPS } from '@/lib/community/sampleData';
import { communityApi } from '@/lib/community/api';
import StudyGroupCard from '@/components/community/StudyGroupCard';
import CreateStudyGroupDialog from '@/components/community/CreateStudyGroupDialog';
import { Button } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';

export default function StudyGroupsHubPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const isVi = locale === 'vi';

  const [groups, setGroups] = useState<any[]>(SAMPLE_STUDY_GROUPS);
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>(['group-ielts-75']);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    communityApi
      .getGroups()
      .then((res: any) => {
        if (res?.groups) {
          setGroups(res.groups);
        }
      })
      .catch(() => {});
  }, []);

  const handleJoinGroup = async (groupId: string) => {
    sfx.playVictory();
    setJoinedGroupIds((prev) => [...prev, groupId]);
    await communityApi.joinGroup(groupId);
  };

  const filtered = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-5xl mx-auto space-y-6 pointer-events-auto">
      <Link
        href={`/${locale}/community`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isVi ? 'Quay lại Cộng Đồng' : 'Back to Community'}</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-teal-400" />
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              {isVi ? 'Nhóm Học Tập Cùng Tiến' : 'Study Groups'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {isVi ? 'Gia nhập các biệt đội luyện thi, cùng giải bài tập và tích lũy điểm Group XP' : 'Join study teams, discuss exercises and earn Group XP together'}
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setCreateDialogOpen(true)}
          icon={<Plus className="w-4 h-4" />}
          className="bg-gradient-to-r from-teal-500 to-purple-500 text-white font-bold"
        >
          {isVi ? 'Tạo nhóm mới' : 'Create Group'}
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isVi ? 'Tìm kiếm nhóm theo tên hoặc chủ đề (TOEIC, IELTS, VSTEP...)' : 'Search groups by name or topic...'}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
        />
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((g) => (
          <StudyGroupCard
            key={g.id}
            group={g}
            isMember={joinedGroupIds.includes(g.id)}
            onJoin={() => handleJoinGroup(g.id)}
            locale={locale}
          />
        ))}
      </div>

      <CreateStudyGroupDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onGroupCreated={(newG) => setGroups((prev) => [newG, ...prev])}
        locale={locale}
      />
    </main>
  );
}
