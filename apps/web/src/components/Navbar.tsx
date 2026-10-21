'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Flame, User as UserIcon, LogOut, Menu, X, Settings, Bell, ChevronDown } from 'lucide-react';
import { api, removeAuthToken } from '../lib/api';
import { NotificationBell } from './notifications/NotificationBell';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'learning' | 'explore' | 'user' | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let isMounted = true;
    api.getMe()
      .then((res) => {
        if (isMounted) {
          if (res?.user) {
            setCurrentUser(res.user);
          } else {
            setCurrentUser(null);
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setCurrentUser(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  // Đóng mọi dropdown khi route thay đổi
  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lắng nghe click bên ngoài và phím Escape để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    removeAuthToken();
    setCurrentUser(null);
    router.push('/login');
  };

  const toggleDropdown = (menu: 'learning' | 'explore' | 'user') => {
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  };

  // Nhóm route
  const mainLinks = [
    { href: '/dashboard', label: 'Lộ trình' },
    { href: '/srs', label: 'Thẻ ghi nhớ' },
    { href: '/vocabulary', label: 'Từ vựng' },
    { href: '/games', label: 'Game' },
  ];

  const learningLinks = [
    { href: '/daily', label: 'Thử thách ngày' },
    { href: '/practice', label: 'Luyện tập' },
    { href: '/ielts', label: 'Luyện IELTS' },
  ];

  const exploreLinks = [
    { href: '/letters', label: 'Bản tin' },
    { href: '/dictionary', label: 'Từ điển' },
  ];

  const isLearningActive = learningLinks.some(
    (l) => pathname === l.href || pathname.startsWith(`${l.href}/`)
  );
  const isExploreActive = exploreLinks.some(
    (l) => pathname === l.href || pathname.startsWith(`${l.href}/`)
  );

  return (
    <header ref={headerRef} className="sticky top-0 z-40 bg-paper border-b-2 border-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[76px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-black text-2xl tracking-tight text-ink group select-none shrink-0 mr-2 lg:mr-6">
          <span className="w-9 h-9 bg-red text-white border-2 border-ink rounded-xl flex items-center justify-center font-black text-xl shadow-brutal-sm group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            L
          </span>
          <span>Lingual</span>
        </Link>

        {/* Desktop Nav Links (hiển thị từ lg: >=1024px) */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-extrabold text-ink whitespace-nowrap">
          {/* 4 Link chính */}
          {mainLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors relative py-1 hover:text-red ${
                  isActive
                    ? 'text-red font-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red'
                    : ''
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Dropdown Học tập */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('learning')}
              aria-haspopup="true"
              aria-expanded={openDropdown === 'learning'}
              className={`flex items-center gap-1 transition-colors relative py-1 hover:text-red cursor-pointer ${
                isLearningActive
                  ? 'text-red font-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red'
                  : ''
              }`}
            >
              <span>Học tập</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openDropdown === 'learning' ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>

            {openDropdown === 'learning' && (
              <div className="absolute left-0 mt-2 w-48 bg-card border-2 border-ink rounded-xl shadow-brutal p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-1">
                {learningLinks.map((link) => {
                  const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpenDropdown(null)}
                      className={`px-3 py-2 rounded-lg text-sm font-extrabold transition-colors hover:bg-paper-2 ${
                        isActive ? 'text-red font-black bg-paper-2' : 'text-ink'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dropdown Khám phá */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('explore')}
              aria-haspopup="true"
              aria-expanded={openDropdown === 'explore'}
              className={`flex items-center gap-1 transition-colors relative py-1 hover:text-red cursor-pointer ${
                isExploreActive
                  ? 'text-red font-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red'
                  : ''
              }`}
            >
              <span>Khám phá</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openDropdown === 'explore' ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>

            {openDropdown === 'explore' && (
              <div className="absolute left-0 mt-2 w-44 bg-card border-2 border-ink rounded-xl shadow-brutal p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-1">
                {exploreLinks.map((link) => {
                  const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpenDropdown(null)}
                      className={`px-3 py-2 rounded-lg text-sm font-extrabold transition-colors hover:bg-paper-2 ${
                        isActive ? 'text-red font-black bg-paper-2' : 'text-ink'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* User Status / CTA (Desktop >= lg) */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* Streak Badge */}
              <div className="flex items-center gap-1.5 bg-card border-2 border-ink rounded-xl px-3 py-1.5 shadow-brutal-sm">
                <Flame className="w-4 h-4 text-red fill-red" />
                <span className="text-xs font-black text-ink">{currentUser.currentStreak || 0} ngày</span>
              </div>

              {/* Notification Bell */}
              <NotificationBell />

              {/* User Dropdown Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown('user')}
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'user'}
                  className={`flex items-center gap-1.5 bg-paper-2 hover:bg-[#EAE0CB] border-2 border-ink rounded-xl px-3 py-1.5 text-xs font-black shadow-brutal-sm text-ink transition-all cursor-pointer ${
                    openDropdown === 'user' || pathname === '/settings' ? 'border-red text-red' : ''
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="max-w-[120px] truncate">{currentUser.displayName}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      openDropdown === 'user' ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                {/* User Dropdown Panel */}
                {openDropdown === 'user' && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border-2 border-ink rounded-xl shadow-brutal p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-1">
                    <Link
                      href="/settings"
                      onClick={() => setOpenDropdown(null)}
                      className={`px-3 py-2 rounded-lg text-xs font-extrabold flex items-center gap-2 transition-colors hover:bg-paper-2 ${
                        pathname === '/settings' ? 'text-red font-black bg-paper-2' : 'text-ink'
                      }`}
                    >
                      <Settings className="w-4 h-4 text-ink" />
                      <span>Cài đặt</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenDropdown(null);
                        handleLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-extrabold flex items-center gap-2 transition-colors hover:bg-paper-2 text-ink hover:text-red cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-sm font-black text-ink hover:text-red transition-colors inline-flex items-center shrink-0"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="btn btn-red btn-sm text-sm font-black inline-flex items-center shrink-0"
              >
                Bắt đầu học →
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button (hiển thị dưới lg: <1024px) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden w-10 h-10 border-2 border-ink bg-card rounded-xl flex items-center justify-center shadow-brutal-sm text-ink cursor-pointer"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
        </button>
      </div>

      {/* Mobile menu dropdown (dưới lg) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-ink bg-paper p-5 flex flex-col gap-4 animate-in fade-in duration-100 max-h-[calc(100vh-80px)] overflow-y-auto">
          {/* Nhóm 1: Chính */}
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-ink/60 mb-1.5 px-1">Chính</div>
            <div className="flex flex-col gap-1.5">
              {mainLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2 text-sm font-black border-2 border-ink rounded-xl shadow-brutal-sm ${
                      isActive ? 'bg-paper-2 text-red' : 'bg-card text-ink'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Nhóm 2: Học tập */}
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-ink/60 mb-1.5 px-1">Học tập</div>
            <div className="flex flex-col gap-1.5">
              {learningLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2 text-sm font-black border-2 border-ink rounded-xl shadow-brutal-sm ${
                      isActive ? 'bg-paper-2 text-red' : 'bg-card text-ink'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Nhóm 3: Khám phá */}
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-ink/60 mb-1.5 px-1">Khám phá</div>
            <div className="flex flex-col gap-1.5">
              {exploreLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2 text-sm font-black border-2 border-ink rounded-xl shadow-brutal-sm ${
                      isActive ? 'bg-paper-2 text-red' : 'bg-card text-ink'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Phần User / Auth */}
          <div className="pt-2 border-t border-ink/20 flex flex-col gap-2">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-card border-2 border-ink rounded-xl">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-ink" />
                    <span className="text-sm font-black text-ink">{currentUser.displayName}</span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-xs font-bold text-red flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Đăng xuất
                  </button>
                </div>
                <div className="flex items-center gap-1.5 px-2 text-xs font-black text-ink">
                  <Flame className="w-4 h-4 text-red fill-red" />
                  <span>Streak: {currentUser.currentStreak || 0} ngày</span>
                </div>
                <Link
                  href="/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-ink border border-ink/40 bg-card rounded-xl flex items-center gap-2"
                >
                  <Bell className="w-3.5 h-3.5" /> Thông báo
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-ink border border-ink/40 bg-card rounded-xl flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5" /> Cài đặt & Quyền riêng tư
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-paper text-sm text-center py-2.5"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-red text-sm text-center py-2.5"
                >
                  Bắt đầu học miễn phí →
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

