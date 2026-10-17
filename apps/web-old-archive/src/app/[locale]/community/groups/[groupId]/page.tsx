'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Users, Trophy, MessageSquare, Send, Shield } from 'lucide-react';
import { SAMPLE_STUDY_GROUPS } from '@/lib/community/sampleData';
import { communityApi } from '@/lib/community/api';
import { StudyGroup, StudyGroupMember, GroupPost } from '@linguaflow/domain';
import { Badge, Button } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';

export default function StudyGroupDetailPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const groupId = params?.groupId as string;
  const isVi = locale === 'vi';

  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [members, setMembers] = useState<StudyGroupMember[]>([
    {
      groupId,
      userId: 'user-alice-002',
      userName: 'Alice Nguyễn',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      role: 'owner',
      joinedAt: new Date().toISOString(),
      contributedXP: 2400,
    },
    {
      groupId,
      userId: 'demo-user-id-001',
      userName: 'Minh Trần',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      role: 'member',
      joinedAt: new Date().toISOString(),
      contributedXP: 1450,
    },
  ]);
  const [posts, setPosts] = useState<GroupPost[]>([
    {
      id: 'post-1',
      groupId,
      authorId: 'user-alice-002',
      authorName: 'Alice Nguyễn',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      content: 'Chào cả nhóm! Hôm nay chúng ta cùng hoàn thành Mock Test 01 trong Exam Lab nhé.',
      commentCount: 2,
      createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    },
  ]);
  const [newPostContent, setNewPostContent] = useState('');
  const [submittingPost, setSubmittingPost] = useState(false);

  useEffect(() => {
    const found = SAMPLE_STUDY_GROUPS.find((g) => g.id === groupId) || SAMPLE_STUDY_GROUPS[0];
    setGroup(found);

    communityApi
      .getGroup(groupId)
      .then((res: any) => {
        if (res?.group) setGroup(res.group);
        if (res?.members) setMembers(res.members);
        if (res?.posts) setPosts(res.posts);
      })
      .catch(() => {});
  }, [groupId]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || submittingPost) return;

    setSubmittingPost(true);
    sfx.playClick();

    try {
      const res = await communityApi.createGroupPost(groupId, { content: newPostContent });
      if (res?.post) {
        setPosts((prev) => [res.post, ...prev]);
        setNewPostContent('');
      }
    } catch {} finally {
      setSubmittingPost(false);
    }
  };

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        <p>{isVi ? 'Đang tải thông tin nhóm...' : 'Loading group...'}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-5xl mx-auto space-y-6 pointer-events-auto">
      <Link
        href={`/${locale}/community/groups`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isVi ? 'Quay lại danh sách nhóm' : 'Back to Groups'}</span>
      </Link>

      {/* Group Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-teal-500/30 backdrop-blur-2xl shadow-2xl space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="teal" className="text-xs font-extrabold uppercase px-3 py-1">
            {group.topic} • {group.level}
          </Badge>
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{group.totalGroupXP.toLocaleString()} Group XP</span>
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {group.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-3xl">
            {group.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Discussion Posts */}
        <div className="lg:col-span-8 space-y-5">
          {/* Post Composer */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg space-y-3">
            <h4 className="font-display font-bold text-sm text-white">
              {isVi ? 'Đăng bài thảo luận nhóm' : 'Post to Discussion'}
            </h4>
            <form onSubmit={handleCreatePost} className="space-y-3">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={3}
                placeholder={isVi ? 'Chia sẻ bài tập, hỏi đáp hoặc thảo luận...' : 'Share questions, exercise tips or insights...'}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-400 resize-none"
              />
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={submittingPost || !newPostContent.trim()}
                  icon={<Send className="w-3.5 h-3.5" />}
                >
                  {isVi ? 'Đăng thảo luận' : 'Publish Post'}
                </Button>
              </div>
            </form>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg space-y-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 ring-1 ring-purple-500/40 relative shrink-0">
                    {post.authorAvatar ? (
                      <Image src={post.authorAvatar} alt={post.authorName} fill className="object-cover" unoptimized />
                    ) : (
                      <span className="font-bold text-xs text-white flex items-center justify-center h-full">
                        {post.authorName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-display font-extrabold text-xs text-white block">
                      {post.authorName}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Members Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg space-y-3">
            <h4 className="font-display font-extrabold text-sm text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              <span>{isVi ? 'Thành Viên' : 'Members'} ({members.length})</span>
            </h4>

            <div className="space-y-2">
              {members.map((m) => (
                <div
                  key={m.userId}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-slate-850 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-800 shrink-0 relative">
                      {m.userAvatar ? (
                        <Image src={m.userAvatar} alt={m.userName} fill className="object-cover" unoptimized />
                      ) : (
                        <span className="font-bold text-[10px] text-white flex items-center justify-center h-full">
                          {m.userName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="font-display font-bold text-xs text-white block">
                        {m.userName}
                      </span>
                      <span className="text-[10px] text-teal-400 font-mono">
                        +{m.contributedXP} XP
                      </span>
                    </div>
                  </div>

                  <Badge variant={m.role === 'owner' ? 'amber' : 'teal'} className="text-[9px] uppercase font-bold">
                    {m.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
