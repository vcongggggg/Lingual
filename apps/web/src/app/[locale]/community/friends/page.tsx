'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, UserCheck, UserPlus, Check, X, Flame, Trophy } from 'lucide-react';
import { communityApi } from '@/lib/community/api';
import { SAMPLE_PROFILES } from '@/lib/community/sampleData';
import { Badge, Button } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';

export default function FriendsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const isVi = locale === 'vi';

  const [friends, setFriends] = useState<any[]>(SAMPLE_PROFILES.slice(1, 3));
  const [followings, setFollowings] = useState<any[]>(SAMPLE_PROFILES.slice(1));
  const [requests, setRequests] = useState<any[]>([
    {
      friendshipId: 'f-3',
      requesterId: 'user-linhdan-004',
      requesterName: 'Linh Đan',
      requesterAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      createdAt: '2026-02-14T08:00:00.000Z',
    },
  ]);

  useEffect(() => {
    communityApi
      .getFriends()
      .then((res: any) => {
        if (res?.friends) setFriends(res.friends);
        if (res?.followings) setFollowings(res.followings);
      })
      .catch(() => {});

    communityApi
      .getFriendRequests()
      .then((res: any) => {
        if (res?.requests) setRequests(res.requests);
      })
      .catch(() => {});
  }, []);

  const handleAccept = async (requesterId: string) => {
    sfx.playVictory();
    setRequests((prev) => prev.filter((r) => r.requesterId !== requesterId));
    await communityApi.acceptFriendRequest(requesterId);
  };

  const handleReject = async (requesterId: string) => {
    sfx.playClick();
    setRequests((prev) => prev.filter((r) => r.requesterId !== requesterId));
    await communityApi.rejectFriendRequest(requesterId);
  };

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-4xl mx-auto space-y-6 pointer-events-auto">
      <Link
        href={`/${locale}/community`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isVi ? 'Quay lại Cộng Đồng' : 'Back to Community'}</span>
      </Link>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-teal-400" />
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {isVi ? 'Bạn Bè & Người Đang Theo Dõi' : 'Friends & Following'}
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          {isVi ? 'Quản lý danh sách bạn học tập và các yêu cầu kết bạn' : 'Manage your study network'}
        </p>
      </div>

      {/* Pending Friend Requests */}
      {requests.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/30 backdrop-blur-xl shadow-xl space-y-4">
          <h3 className="font-display font-bold text-sm text-purple-300">
            {isVi ? 'Lời Mời Kết Bạn Chờ Duyệt' : 'Pending Friend Requests'} ({requests.length})
          </h3>

          <div className="space-y-3">
            {requests.map((r) => (
              <div
                key={r.requesterId}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 ring-2 ring-purple-500/30 shrink-0">
                    {r.requesterAvatar ? (
                      <img src={r.requesterAvatar} alt={r.requesterName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-xs text-white flex items-center justify-center h-full">
                        {r.requesterName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-display font-extrabold text-sm text-white block">
                      {r.requesterName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {isVi ? 'Đã gửi lời mời kết bạn' : 'Sent you a friend request'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAccept(r.requesterId)}
                    icon={<Check className="w-3.5 h-3.5" />}
                  >
                    {isVi ? 'Đồng ý' : 'Accept'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReject(r.requesterId)}
                    icon={<X className="w-3.5 h-3.5" />}
                  >
                    {isVi ? 'Từ chối' : 'Decline'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
        <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-teal-400" />
          <span>{isVi ? 'Danh Sách Bạn Bè' : 'Friends List'} ({friends.length})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {friends.map((f) => (
            <Link
              key={f.userId}
              href={`/${locale}/community/profile/${f.userId}`}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 hover:border-teal-500/40 transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-800 ring-2 ring-teal-500/30 shrink-0">
                  {f.avatarUrl ? (
                    <img src={f.avatarUrl} alt={f.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-sm text-white flex items-center justify-center h-full">
                      {f.displayName.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="space-y-0.5">
                  <span className="font-display font-bold text-sm text-white group-hover:text-teal-300 transition-colors block">
                    {f.displayName}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-0.5">
                      <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {f.currentStreak}d
                    </span>
                    <span>•</span>
                    <span className="text-purple-300">{f.totalXP} XP</span>
                  </div>
                </div>
              </div>

              <Badge variant="teal" className="text-[10px] font-bold">
                {isVi ? 'Bạn bè' : 'Friend'}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
