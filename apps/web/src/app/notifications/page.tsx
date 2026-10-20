'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  Flame,
  BookOpen,
  Award,
  Sparkles,
  AlertTriangle,
  Clock,
  Compass,
  ArrowRight,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../lib/api';
import { LingLing } from '../../components/ui/LingLing';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  deepLink?: string | null;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterUnread, setFilterUnread] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications(true);
  }, [filterUnread]);

  async function loadNotifications(reset = false) {
    if (reset) {
      setLoading(true);
      setNextCursor(null);
    }
    try {
      const res = await api.getNotifications({
        unreadOnly: filterUnread,
        limit: 15,
        cursor: reset ? undefined : nextCursor || undefined,
      });

      if (res?.notifications) {
        if (reset) {
          setNotifications(res.notifications);
        } else {
          setNotifications((prev) => [...prev, ...res.notifications]);
        }
        setNextCursor(res.nextCursor);
        setTotalCount(res.total);
      }
    } catch (err) {
      console.error('Lỗi khi tải thông báo:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  async function handleLoadMore() {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    await loadNotifications(false);
  }

  async function handleMarkAsRead(notif: NotificationItem) {
    if (!notif.isRead) {
      try {
        await api.markNotificationAsRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
      } catch (err) {
        console.error('Lỗi mark as read:', err);
      }
    }

    if (notif.deepLink) {
      router.push(notif.deepLink);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await api.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setActionMessage('Đã đánh dấu tất cả thông báo là đã đọc!');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error('Lỗi mark all read:', err);
    }
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await api.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setTotalCount((prev) => Math.max(0, prev - 1));
      setActionMessage('Đã xóa thông báo.');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error('Lỗi xóa thông báo:', err);
    }
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case 'SRS_DUE':
        return <BookOpen className="w-5 h-5 text-green-600" />;
      case 'STREAK_AT_RISK':
        return <Flame className="w-5 h-5 text-red" />;
      case 'GOLDEN_HOUR':
        return <Clock className="w-5 h-5 text-yellow-deep" />;
      case 'WEAK_SKILL':
      case 'FORGETFUL_WORDS':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'WEEKLY_REPORT':
        return <Compass className="w-5 h-5 text-blue" />;
      case 'ACHIEVEMENT':
        return <Award className="w-5 h-5 text-yellow-deep" />;
      default:
        return <Sparkles className="w-5 h-5 text-teal" />;
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-6 pb-28 text-left">
      {/* Header Bar */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-red">
            <Bell className="w-3.5 h-3.5" />
            <span>Hòm Thư Bò LingLing</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
            Tất Cả Thông Báo
          </h1>

          <p className="text-xs font-semibold text-ink-muted">
            Quản lý lời nhắc học tập, cập nhật chuỗi ngày và báo cáo tuần cá nhân hóa
          </p>
        </div>

        {/* Nút hành động */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleMarkAllAsRead}
            disabled={notifications.every((n) => n.isRead)}
            className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-1.5 disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4 text-green-600" />
            <span>Đọc tất cả</span>
          </button>

          <Link
            href="/settings"
            className="btn btn-ink text-xs font-black shadow-brutal flex items-center gap-1.5"
          >
            <span>Cài đặt thông báo</span>
          </Link>
        </div>
      </div>

      {/* Thông báo thao tác ngắn */}
      {actionMessage && (
        <div className="p-3 bg-green-500/15 border-2 border-green-600 rounded-2xl text-xs font-bold text-green-800 shadow-brutal-sm animate-fade-in flex items-center gap-2">
          <CheckCheck className="w-4 h-4" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter Tabs & Counter */}
      <div className="flex items-center justify-between gap-3 border-b-2 border-ink/15 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterUnread(false)}
            className={`px-4 py-2 rounded-xl border-2 text-xs font-black transition-all cursor-pointer ${
              !filterUnread
                ? 'bg-yellow border-ink text-ink shadow-brutal-sm -translate-y-0.5'
                : 'bg-paper-2 border-ink-muted/40 text-ink-soft hover:bg-paper-2/80'
            }`}
          >
            Tất cả ({totalCount})
          </button>

          <button
            onClick={() => setFilterUnread(true)}
            className={`px-4 py-2 rounded-xl border-2 text-xs font-black transition-all cursor-pointer ${
              filterUnread
                ? 'bg-yellow border-ink text-ink shadow-brutal-sm -translate-y-0.5'
                : 'bg-paper-2 border-ink-muted/40 text-ink-soft hover:bg-paper-2/80'
            }`}
          >
            Chưa đọc
          </button>
        </div>

        <button
          onClick={() => loadNotifications(true)}
          className="p-2 border-2 border-ink rounded-xl bg-card hover:bg-paper-2 shadow-brutal-sm text-ink transition-all"
          title="Tải lại"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Notifications List Card */}
      <div className="bg-card border-2 border-ink rounded-3xl p-5 sm:p-7 shadow-brutal-xl space-y-4">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-yellow border-t-ink rounded-full animate-spin" />
            <p className="text-xs font-bold text-ink-muted">Bò LingLing đang mở ngăn kéo thư từ...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleMarkAsRead(notif)}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-brutal-sm flex items-start justify-between gap-4 group ${
                  !notif.isRead
                    ? 'bg-yellow/10 border-ink hover:bg-yellow/20'
                    : 'bg-paper-2 border-ink-muted/50 hover:bg-[#EAE0CB]'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-2xl border-2 border-ink bg-card flex items-center justify-center flex-shrink-0 shadow-brutal-sm mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* Body Content */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`text-sm sm:text-base font-black ${
                          !notif.isRead ? 'text-ink' : 'text-ink-soft'
                        }`}
                      >
                        {notif.title}
                      </h3>
                      {!notif.isRead && (
                        <span className="px-2 py-0.5 rounded-full bg-red text-white text-[10px] font-black tracking-wider">
                          MỚI
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-ink-soft leading-relaxed">
                      {notif.body}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-bold text-ink-muted pt-1">
                      <span>
                        {new Date(notif.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' • '}
                        {new Date(notif.createdAt).toLocaleDateString('vi-VN')}
                      </span>

                      {notif.deepLink && (
                        <span className="text-blue inline-flex items-center gap-1 group-hover:underline">
                          <span>Mở bài học</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Nút xóa */}
                <button
                  onClick={(e) => handleDelete(notif.id, e)}
                  className="p-2 rounded-xl border border-transparent hover:border-ink hover:bg-red/10 text-ink-muted hover:text-red transition-all cursor-pointer"
                  title="Xóa thông báo này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Load more */}
            {nextCursor && (
              <div className="pt-4 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-2.5 bg-paper-2 hover:bg-[#EAE0CB] border-2 border-ink rounded-xl text-xs font-black text-ink shadow-brutal-sm transition-all disabled:opacity-50"
                >
                  {loadingMore ? 'Đang nạp tiếp...' : 'Xem thêm thông báo cũ hơn'}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty state: Bò shrug + câu dí dỏm tiếng Việt */
          <div className="py-16 px-4 text-center space-y-4">
            <div className="inline-block">
              <LingLing reaction="shrug" size={88} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-ink">
                Hòm thư trống trơn!
              </h3>
              <p className="text-xs text-ink-muted max-w-sm mx-auto leading-relaxed font-medium">
                Không có thông báo nào cả. Bò LingLing chúc bạn một ngày học tập thong dong và giữ vững phong độ nhé!
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="btn btn-red px-5 py-2.5 text-xs font-black shadow-brutal"
              >
                Trở về bàn học Lộ Trình →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
