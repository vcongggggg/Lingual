'use client';

import React, { useState } from 'react';
import {
  UserPlus,
  UserCheck,
  Flame,
  Trophy,
  BookOpen,
  Headphones,
  PenTool,
  FileText,
  Lock,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { SocialProfile as ISocialProfile } from '@linguaflow/domain';
import { Badge, Button } from '@linguaflow/ui';
import { communityApi } from '@/lib/community/api';
import { sfx } from '@/lib/soundEffects';

interface SocialProfileProps {
  profile: ISocialProfile & { isPrivate?: boolean };
  isOwner?: boolean;
  isFriend?: boolean;
  isFollowing?: boolean;
  locale?: string;
  className?: string;
}

export default function SocialProfileView({
  profile,
  isOwner = false,
  isFriend = false,
  isFollowing = false,
  locale = 'vi',
  className = '',
}: SocialProfileProps) {
  const isVi = locale === 'vi';
  const [following, setFollowing] = useState(isFollowing);
  const [friendStatus, setFriendStatus] = useState(isFriend ? 'accepted' : 'none');

  const handleToggleFollow = async () => {
    sfx.playClick();
    if (following) {
      setFollowing(false);
      await communityApi.unfollowUser(profile.userId);
    } else {
      setFollowing(true);
      await communityApi.followUser(profile.userId);
    }
  };

  const handleSendFriendRequest = async () => {
    sfx.playClick();
    setFriendStatus('pending');
    await communityApi.sendFriendRequest(profile.userId);
  };

  if (profile.isPrivate && !isOwner) {
    return (
      <div className={`p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl text-center space-y-4 max-w-xl mx-auto ${className}`}>
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="font-display font-extrabold text-xl text-white">{profile.displayName}</h2>
          <p className="text-xs text-slate-400">@{profile.username}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 text-xs text-slate-300">
          {isVi
            ? 'Hồ sơ người dùng này đang ở chế độ riêng tư.'
            : 'This user profile is private.'}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 max-w-4xl mx-auto ${className}`}>
      {/* Profile Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/30 border border-purple-500/20 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl ring-4 ring-purple-500/40 overflow-hidden bg-slate-800 shrink-0 shadow-xl">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-display font-extrabold text-3xl text-white">
                {profile.displayName.charAt(0)}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                {profile.displayName}
              </h1>
              <Badge variant="teal" className="text-xs font-extrabold uppercase px-2.5 py-0.5">
                {profile.level} • {profile.targetLanguage}
              </Badge>
            </div>

            <p className="text-xs font-mono text-slate-400">@{profile.username}</p>

            {profile.bio && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-2xl">
                {profile.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>{profile.totalLearningDays} {isVi ? 'ngày học tập' : 'learning days'}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold text-amber-300">{profile.currentStreak} {isVi ? 'ngày streak' : 'streak'}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-purple-300">{profile.totalXP} XP</span>
              </div>
            </div>
          </div>

          {/* Interaction Actions */}
          {!isOwner && (
            <div className="flex flex-row sm:flex-col gap-2 shrink-0 self-center sm:self-start">
              <Button
                variant={following ? 'outline' : 'primary'}
                size="sm"
                onClick={handleToggleFollow}
              >
                {following ? (isVi ? 'Đang theo dõi' : 'Following') : (isVi ? '+ Theo dõi' : '+ Follow')}
              </Button>

              {friendStatus === 'none' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendFriendRequest}
                  icon={<UserPlus className="w-3.5 h-3.5" />}
                >
                  {isVi ? 'Kết bạn' : 'Add Friend'}
                </Button>
              )}

              {friendStatus === 'pending' && (
                <Badge variant="amber" className="text-xs py-1.5 px-3">
                  {isVi ? 'Đã gửi lời mời' : 'Request Pending'}
                </Badge>
              )}

              {friendStatus === 'accepted' && (
                <Badge variant="teal" className="text-xs py-1.5 px-3 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Bạn bè' : 'Friends'}</span>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Learning Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span>{isVi ? 'Từ vựng' : 'Vocab'}</span>
          </div>
          <p className="text-xl font-display font-extrabold text-white">
            {profile.vocabularyLearned}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Headphones className="w-4 h-4 text-teal-300" />
            <span>{isVi ? 'Luyện nghe' : 'Listening'}</span>
          </div>
          <p className="text-xl font-display font-extrabold text-white">
            {profile.listeningSessions}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <FileText className="w-4 h-4 text-teal-400" />
            <span>{isVi ? 'Luyện đọc' : 'Reading'}</span>
          </div>
          <p className="text-xl font-display font-extrabold text-white">
            {profile.readingCompleted}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <PenTool className="w-4 h-4 text-purple-400" />
            <span>{isVi ? 'Luyện viết' : 'Writing'}</span>
          </div>
          <p className="text-xl font-display font-extrabold text-white">
            {profile.writingSubmissions}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{isVi ? 'Thi thử' : 'Exams'}</span>
          </div>
          <p className="text-xl font-display font-extrabold text-amber-300">
            {profile.examsCompleted}
          </p>
        </div>
      </div>
    </div>
  );
}
