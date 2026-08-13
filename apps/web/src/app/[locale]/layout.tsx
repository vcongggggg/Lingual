'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { XPBadge, StreakBadge } from '@linguaflow/ui';
import { BookOpen, Gamepad2, Brain, Shield, Sparkles, Globe, Search, Menu, X, User, Trophy, Target, LogOut } from 'lucide-react';
import LingLingChatbot from '@/components/LingLingChatbot';
import MascotPopup from '@/components/MascotPopup';
import FloatingMascotUniverse from '@/components/FloatingMascotUniverse';
import { mascotReactions, MascotReactionKey } from '@linguaflow/config';
import { AuthProvider } from '../../contexts/AuthContext';


export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const pathname = usePathname();

  const [userXP, setUserXP] = useState(150);
  const [streakDays, setStreakDays] = useState(3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [popupState, setPopupState] = useState<{ show: boolean; key: MascotReactionKey; title?: string; msg?: string }>({
    show: false,
    key: 'farewell',
  });

  const handleLogout = () => {
    setPopupState({
      show: true,
      key: 'farewell',
      title: 'Hẹn gặp lại! 👋',
      msg: 'Bò LingLing quay lưng bước đi... Hẹn bạn buổi học tới!',
    });
  };


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

  // Read authenticated user role from localStorage/state for UX menu rendering
  const [userRole, setUserRole] = useState<string>('SUPER_ADMIN');

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('lingual_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.role) setUserRole(parsed.role);
      }
    } catch {}
  }, []);

  // NOTE: Filtering menu links based on role is purely for UX convenience (preventing clutter for STUDENT role).
  // Security enforcement is 100% guaranteed by backend RolesGuard (default-deny).
  const isStaffRole = ['CONTENT_REVIEWER', 'ADMIN', 'SUPER_ADMIN'].includes(userRole);

  const secondaryLinks = [
    { href: `/${locale}/achievements`, label: locale === 'vi' ? 'Huy Hiệu & Xếp Hạng' : 'Achievements', icon: <Trophy className="w-4 h-4" /> },
    ...(isStaffRole ? [{ href: `/${locale}/admin`, label: 'CMS Admin', icon: <Shield className="w-4 h-4" /> }] : []),
  ];

  const switchedLocale = locale === 'vi' ? 'en' : 'vi';
  const switchedPath = pathname.replace(`/${locale}`, `/${switchedLocale}`);

  return (
    <AuthProvider>
      <FloatingMascotUniverse />
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-body relative">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo with Peeking Cow Mascot */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group relative">
            <div className="relative">
              {/* Peeking Mascot Sticker Sitting on Logo */}
              <div className="absolute -top-4 -left-3.5 z-20 w-8 h-8 pointer-events-none filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] transition-transform group-hover:-translate-y-1">
                <img
                  src={mascotReactions.greet}
                  alt="Peeking Logo Mascot"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-coral-500 via-amber-500 to-teal-400 p-0.5 shadow-lg shadow-coral-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
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
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm text-rose-400 hover:bg-rose-500/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng Xuất (Easter Egg)</span>
                  </button>
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
                  isActive ? 'text-teal-400' : 'text-slate-500 hover:text-slate-300'
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
        </div>
      </nav>

      {/* Persistent AI Chatbot Assistant */}
      <LingLingChatbot />

      {/* Mascot Toast Reaction Popup */}
      <MascotPopup
        isVisible={popupState.show}
        reactionKey={popupState.key}
        title={popupState.title}
        message={popupState.msg}
        autoDismissMs={3500}
        onClose={() => setPopupState((prev) => ({ ...prev, show: false }))}
      />
    </div>
    </AuthProvider>
  );
}

