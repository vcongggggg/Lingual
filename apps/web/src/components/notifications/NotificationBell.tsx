'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCheck,
  ExternalLink,
  Flame,
  BookOpen,
  Award,
  Sparkles,
  AlertTriangle,
  Clock,
  Compass,
} from 'lucide-react';
import { api } from '../../lib/api';
import { LingLing } from '../ui/LingLing';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  deepLink?: string | null;
  isRead: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(true);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 1. Kiểm tra Preferences & Poll Unread Count
  useEffect(() => {
    checkPreferencesAndCount();

    // Poll mỗi 60s
    const interval = setInterval(checkPreferencesAndCount, 60000);

    // Poll khi tab được focus lại
    const handleFocus = () => {
      checkPreferencesAndCount();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function checkPreferencesAndCount() {
    try {
      const prefRes = await api.getNotificationPreferences().catch(() => null);
      if (prefRes?.preferences) {
        setEnabled(Boolean(prefRes.preferences.enabled));
        if (!prefRes.preferences.enabled) {
          setUnreadCount(0);
          return;
        }
      }

      const countRes = await api.getNotificationUnreadCount().catch(() => null);
      if (countRes && typeof countRes.count === 'number') {
        setUnreadCount(countRes.count);
      }
    } catch {
      // ignore
    }
  }

  // Mở dropdown và tải 10 thông báo mới nhất
  async function toggleDropdown() {
    if (!isOpen) {
      setIsOpen(true);
      setLoading(true);
      try {
        const res = await api.getNotifications({ limit: 10 });
        if (res?.notifications) {
          setNotifications(res.notifications);
        }
      } catch (err) {
        console.error('Lỗi khi tải thông báo dropdown:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setIsOpen(false);
    }
  }

  // Bấm vào 1 thông báo -> đánh dấu đã đọc & điều hướng
  async function handleNotificationClick(notif: NotificationItem) {
    if (!notif.isRead) {
      try {
        await api.markNotificationAsRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (e) {
        console.error('Lỗi đánh dấu đã đọc:', e);
      }
    }

    setIsOpen(false);
    if (notif.deepLink) {
      router.push(notif.deepLink);
    }
  }

  // Đánh dấu đọc tất cả
  async function handleMarkAllAsRead() {
    try {
      await api.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error('Lỗi đánh dấu đọc tất cả:', e);
    }
  }

  // Nếu người dùng tắt kill switch -> ẩn chuông hoàn toàn
  if (!enabled) {
    return null;
  }

  // Icon theo từng loại thông báo
  function getNotificationIcon(type: string) {
    switch (type) {
      case 'SRS_DUE':
        return <BookOpen className="w-4 h-4 text-green-600" />;
      case 'STREAK_AT_RISK':
        return <Flame className="w-4 h-4 text-red" />;
      case 'GOLDEN_HOUR':
        return <Clock className="w-4 h-4 text-yellow-deep" />;
      case 'WEAK_SKILL':
      case 'FORGETFUL_WORDS':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'WEEKLY_REPORT':
        return <Compass className="w-4 h-4 text-blue" />;
      case 'ACHIEVEMENT':
        return <Award className="w-4 h-4 text-yellow-deep" />;
      default:
        return <Sparkles className="w-4 h-4 text-teal" />;
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Chuông Thông Báo */}
      <button
        onClick={toggleDropdown}
        className="relative w-9 h-9 rounded-xl border-2 border-ink bg-card hover:bg-paper-2 flex items-center justify-center text-ink hover:text-red shadow-brutal-sm transition-all cursor-pointer"
        title="Thông báo"
        aria-label="Thông báo"
      >
        <Bell className="w-4 h-4" />

        {/* Badge số chưa đọc màu đỏ son */}
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-red text-white text-[10px] font-black rounded-full border border-ink flex items-center justify-center shadow-brutal-sm animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border-2 border-ink rounded-3xl shadow-brutal-xl z-50 overflow-hidden animate-fade-in text-left">
          {/* Header Panel */}
          <div className="p-3.5 sm:p-4 bg-paper-2 border-b-2 border-ink flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-ink">Thông Báo</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red text-white text-[10px] font-black">
                  {unreadCount} mới
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[11px] font-black text-ink hover:text-red flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Đọc tất cả</span>
              </button>
            )}
          </div>

          {/* List Nội Dung Thông Báo */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-ink/10">
            {loading ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs font-bold text-ink-muted">
                <div className="w-5 h-5 border-2 border-ink border-t-red rounded-full animate-spin" />
                <span>Đang kiểm tra thư từ Bò LingLing...</span>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 sm:p-3.5 transition-colors cursor-pointer flex items-start gap-3 hover:bg-paper-2 ${
                    !notif.isRead ? 'bg-yellow/10' : 'bg-card'
                  }`}
                >
                  {/* Icon loại */}
                  <div className="w-8 h-8 rounded-xl border border-ink bg-card flex items-center justify-center flex-shrink-0 mt-0.5 shadow-brutal-sm">
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs font-black truncate ${
                          !notif.isRead ? 'text-ink' : 'text-ink-soft'
                        }`}
                      >
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-red flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-ink-soft line-clamp-2 leading-relaxed">
                      {notif.body}
                    </p>
                    <span className="text-[10px] text-ink-muted block pt-0.5">
                      {new Date(notif.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' • '}
                      {new Date(notif.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              /* Empty state: Bò shrug + câu dí dỏm */
              <div className="py-8 px-4 text-center space-y-2">
                <div className="inline-block">
                  <LingLing reaction="shrug" size={60} />
                </div>
                <h4 className="text-xs font-black text-ink">Hòm thư trống trơn!</h4>
                <p className="text-[11px] text-ink-muted max-w-[240px] mx-auto leading-relaxed">
                  Không có thông báo nào cả. Bò LingLing chúc bạn một ngày học tập thong dong!
                </p>
              </div>
            )}
          </div>

          {/* Footer Panel */}
          <div className="p-2.5 bg-paper-2 border-t-2 border-ink text-center">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-black text-ink hover:text-red inline-flex items-center gap-1.5 transition-colors py-1 px-3"
            >
              <span>Xem tất cả thông báo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
