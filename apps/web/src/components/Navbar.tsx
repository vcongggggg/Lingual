'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Flame, User as UserIcon, LogOut, Menu, X, BookOpen, Layers, Sparkles, GraduationCap } from 'lucide-react';
import { api, getAuthToken, removeAuthToken } from '../lib/api';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      api.getMe()
        .then((res) => setCurrentUser(res.user))
        .catch(() => removeAuthToken());
    }
  }, [pathname]);

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

  const navLinks = [
    { href: '/dashboard', label: 'Lộ trình' },
    { href: '/daily', label: 'Thử thách ngày' },
    { href: '/letters', label: 'Bản tin' },
    { href: '/srs', label: 'Thẻ ghi nhớ' },
    { href: '/vocabulary', label: 'Từ vựng' },
    { href: '/games', label: 'Game' },
    { href: '/ielts', label: 'Luyện IELTS' },
    { href: '/practice', label: 'Luyện tập' },
    { href: '/dictionary', label: 'Từ điển' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-paper border-b-2 border-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-black text-2xl tracking-tight text-ink group select-none">
          <span className="w-9 h-9 bg-red text-white border-2 border-ink rounded-xl flex items-center justify-center font-black text-xl shadow-brutal-sm group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            L
          </span>
          <span>Lingual</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-extrabold text-ink">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors relative py-1 hover:text-red ${
                  isActive ? 'text-red font-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red' : ''
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Status / CTA */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* Streak Badge */}
              <div className="flex items-center gap-1.5 bg-card border-2 border-ink rounded-xl px-3 py-1.5 shadow-brutal-sm">
                <Flame className="w-4 h-4 text-red fill-red" />
                <span className="text-xs font-black text-ink">{currentUser.currentStreak || 0} ngày</span>
              </div>

              {/* User Name */}
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 bg-paper-2 hover:bg-[#EAE0CB] border-2 border-ink rounded-xl px-3 py-1.5 text-xs font-black shadow-brutal-sm text-ink transition-all"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{currentUser.displayName}</span>
              </Link>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-xl border-2 border-ink bg-card hover:bg-paper-2 flex items-center justify-center text-ink hover:text-red shadow-brutal-sm transition-all cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-black text-ink hover:text-red transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="btn btn-red text-sm font-black py-2.5 px-5"
              >
                Bắt đầu học →
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 border-2 border-ink bg-card rounded-xl flex items-center justify-center shadow-brutal-sm text-ink cursor-pointer"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-ink bg-paper p-5 flex flex-col gap-3 animate-in fade-in duration-100">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 text-sm font-black text-ink border-2 border-ink bg-card rounded-xl shadow-brutal-sm"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-ink/20 flex flex-col gap-2">
            {currentUser ? (
              <div className="flex items-center justify-between p-2">
                <span className="text-sm font-black text-ink">{currentUser.displayName}</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-xs font-bold text-red flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Đăng xuất
                </button>
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
