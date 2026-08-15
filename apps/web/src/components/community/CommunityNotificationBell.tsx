'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Check, Users, Sparkles, Trophy, Heart } from 'lucide-react';
import { CommunityNotification } from '@linguaflow/domain';
import { communityApi } from '@/lib/community/api';
import { sfx } from '@/lib/soundEffects';

interface CommunityNotificationBellProps {
  currentUserId?: string;
  locale?: string;
  className?: string;
}

export default function CommunityNotificationBell({
  currentUserId = 'demo-user-id-001',
  locale = 'vi',
  className = '',
}: CommunityNotificationBellProps) {
  const isVi = locale === 'vi';
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<CommunityNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    communityApi
      .getNotifications(currentUserId)
      .then((res: any) => {
        if (res?.notifications) {
          setNotifications(res.notifications);
          setUnreadCount(res.unreadCount || 0);
        }
      })
      .catch(() => {});
  }, [currentUserId]);

  const handleMarkRead = async (notifId: string) => {
    sfx.playClick();
    await communityApi.markNotificationAsRead(notifId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors shadow-sm"
        aria-label="Thông báo cộng đồng"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-extrabold flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h4 className="font-display font-extrabold text-sm text-white">
              {isVi ? 'Thông Báo Cộng Đồng' : 'Community Notifications'}
            </h4>
            {unreadCount > 0 && (
              <span className="text-[11px] font-mono text-purple-300 font-bold">
                {unreadCount} {isVi ? 'chưa đọc' : 'unread'}
              </span>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                {isVi ? 'Không có thông báo mới' : 'No new notifications'}
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkRead(n.id)}
                  className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                    n.isRead
                      ? 'bg-slate-950/60 border-slate-850 text-slate-400'
                      : 'bg-purple-950/20 border-purple-500/40 text-slate-200'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-purple-400 mt-1 shrink-0" />
                  <div className="flex-1 space-y-0.5">
                    <p className="leading-relaxed">
                      <strong className="text-white">{n.actorName}</strong> {n.message}
                    </p>
                    <span className="text-[10px] text-slate-500 block">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
