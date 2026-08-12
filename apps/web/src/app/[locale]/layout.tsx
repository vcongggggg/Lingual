'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { XPBadge, StreakBadge } from '@linguaflow/ui';
import { BookOpen, Gamepad2, Brain, Shield, Sparkles, Globe, Search, Menu, X, User, Trophy, Target } from 'lucide-react';
import LingLingChatbot from '@/components/LingLingChatbot';

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const pathname = usePathname();

  const [userXP, setUserXP] = useState(150);
  const [streakDays, setStreakDays] = useState(3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleXPUpdate = (e: any) => {
      if (e.detail?.totalXP) setUserXP(e.detail.totalXP);
      if (e.detail?.streakDays) setStreakDays(e.detail.streakDays);
    };
    window.addEventListener('linguaflow_xp_update', handleXPUpdate);
    return () => window.removeEventListener('linguaflow_xp_update', handleXPUpdate);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: `/${locale}/dashboard`, label: locale === 'vi' ? 'Lộ Trình Học' : 'Path', icon: <BookOpen className="w-4 h-4" />, mobileLabel: locale === 'vi' ? 'Học' : 'Learn' },
    { href: `/${locale}/ielts`, label: locale === 'vi' ? 'Luyện Thi IELTS' : 'IELTS Prep', icon: <Target className="w-4 h-4" />, mobileLabel: 'IELTS' },
    { href: `/${locale}/dictionary`, label: locale === 'vi' ? 'Từ Điển' : 'Dictionary', icon: <Search className="w-4 h-4" />, mobileLabel: locale === 'vi' ? 'Từ Điển' : 'Dict' },
    { href: `/${locale}/srs`, label: locale === 'vi' ? 'Thẻ SRS' : 'SRS Cards', icon: <Brain className="w-4 h-4" />, mobileLabel: 'SRS' },
    { href: `/${locale}/games`, label: locale === 'vi' ? 'Game Center' : 'Games', icon: <Gamepad2 className="w-4 h-4" />, mobileLabel: 'Games' },
  ];

  const secondaryLinks = [
    { href: `/${locale}/achievements`, label: locale === 'vi' ? 'Huy Hiệu & Xếp Hạng' : 'Achievements', icon: <Trophy className="w-4 h-4" /> },
    { href: `/${locale}/admin`, label: 'CMS Admin', icon: <Shield className="w-4 h-4" /> },
  ];

  const switchedLocale = locale === 'vi' ? 'en' : 'vi';
  const switchedPath = pathname.replace(`/${locale}`, `/${switchedLocale}`);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-body">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-coral-500 via-amber-500 to-teal-400 p-0.5 shadow-lg shadow-coral-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                Lingual
              </span>
              <span className="text-[10px] text-teal-400 font-bold tracking-widest uppercase hidden sm:block">
                Việt → English
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-teal-300 border border-teal-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Badges & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <StreakBadge streak={streakDays} />
            <XPBadge xp={userXP} />

            {/* Locale Switcher */}
            <Link
              href={switchedPath}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
              title="Chuyển đổi ngôn ngữ giao diện"
            >
              <Globe className="w-4 h-4 text-teal-400" />
              <span className="uppercase hidden sm:inline">{locale === 'vi' ? 'EN' : 'VI'}</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
            />

            {/* Side Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="md:hidden fixed top-0 right-0 z-50 w-72 h-full bg-slate-900 border-l border-slate-800 shadow-2xl overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="font-display font-extrabold text-lg text-white">Menu</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User Stats */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-950" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">Học Viên LinguaFlow</span>
                      <span className="text-xs text-slate-400">demo@linguaflow.com</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <StreakBadge streak={streakDays} />
                    <XPBadge xp={userXP} />
                  </div>
                </div>

                {/* Navigation */}
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 px-3 block mb-2">
                    Chức năng chính
                  </span>
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm transition-all ${
                          isActive
                            ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="border-t border-slate-800 pt-4 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 px-3 block mb-2">
                    Khác
                  </span>
                  {secondaryLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm text-slate-400 hover:bg-slate-800/60 hover:text-white transition-all"
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-2 py-1 safe-bottom">
        <div className="flex items-center justify-around">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[60px] ${
                  isActive
                    ? 'text-teal-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-teal-500/15' : ''}`}>
                  {React.cloneElement(link.icon as React.ReactElement<any>, {
                    className: `w-5 h-5 ${isActive ? 'text-teal-400' : 'text-slate-500'}`,
                  })}
                </div>
                <span className={`text-[10px] font-bold ${isActive ? 'text-teal-400' : 'text-slate-500'}`}>
                  {link.mobileLabel}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="bottomTabIndicator"
                    className="w-1 h-1 rounded-full bg-teal-400"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
              </Link>
            );
          })}
          {/* Profile tab on mobile */}
          <Link
            href={`/${locale}/achievements`}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[60px] ${
              pathname.includes('/achievements')
                ? 'text-teal-400'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${pathname.includes('/achievements') ? 'bg-teal-500/15' : ''}`}>
              <Trophy className={`w-5 h-5 ${pathname.includes('/achievements') ? 'text-teal-400' : 'text-slate-500'}`} />
            </div>
            <span className={`text-[10px] font-bold ${pathname.includes('/achievements') ? 'text-teal-400' : 'text-slate-500'}`}>
              {locale === 'vi' ? 'Huy Hiệu' : 'Rank'}
            </span>
          </Link>
        </div>
      </nav>

      {/* Footer (desktop only) */}
      <footer className="hidden md:block w-full border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Lingual. Gamified English Learning Platform for Vietnamese.</p>
          <div className="flex gap-4 font-semibold text-slate-400">
            <Link href={`/${locale}/achievements`} className="hover:text-amber-400 transition-colors">
              Huy Hiệu & Xếp Hạng
            </Link>
            <Link href={`/${locale}/admin`} className="hover:text-teal-400 transition-colors">
              CMS Admin
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating AI Chatbot Widget */}
      <LingLingChatbot />
    </div>
  );
}
