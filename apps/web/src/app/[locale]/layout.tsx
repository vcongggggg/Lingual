'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { XPBadge, StreakBadge } from '@linguaflow/ui';
import {
  BookOpen,
  Gamepad2,
  Brain,
  Shield,
  Sparkles,
  Globe,
  Search,
  Menu,
  X,
  User,
  Trophy,
  Target,
  LogOut,
  Headphones,
  PenTool,
  FileText,
  Users,
  Activity,
  Mic,
  Bot,
  ChevronDown,
  Layers,
  Award,
} from 'lucide-react';
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const [popupState, setPopupState] = useState<{
    show: boolean;
    key: MascotReactionKey;
    title?: string;
    msg?: string;
  }>({
    show: false,
    key: 'farewell',
  });

  const handleLogout = () => {
    localStorage.removeItem('lingual_token');
    localStorage.removeItem('lingual_user');
    localStorage.removeItem('linguaflow_token');
    setCurrentUser(null);
    window.dispatchEvent(new CustomEvent('lingual_auth_change', { detail: { user: null } }));
    setPopupState({
      show: true,
      key: 'farewell',
      title: 'Đăng xuất',
      msg: 'Hẹn gặp lại bạn sớm nhé! Hãy tiếp tục duy trì chuỗi học mỗi ngày!',
    });
  };

  useEffect(() => {
    const handleXPUpdate = (e: any) => {
      if (e.detail?.totalXP !== undefined) {
        setUserXP(e.detail.totalXP);
      }
      if (e.detail?.streakDays !== undefined) {
        setStreakDays(e.detail.streakDays);
      }
    };
    window.addEventListener('linguaflow_xp_update', handleXPUpdate);
    return () => window.removeEventListener('linguaflow_xp_update', handleXPUpdate);
  }, []);

  // Close menus on route change or outside click
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const isOutsideNav = dropdownRef.current && !dropdownRef.current.contains(e.target as Node);
      const isOutsideProfile = profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node);
      if (isOutsideNav && isOutsideProfile) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Synchronize authenticated user state dynamically
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const syncUser = () => {
      try {
        const token = localStorage.getItem('lingual_token') || localStorage.getItem('linguaflow_token');
        const savedUserStr = localStorage.getItem('lingual_user');
        if (token && savedUserStr) {
          const parsed = JSON.parse(savedUserStr);
          setCurrentUser(parsed);
          if (parsed.totalXP !== undefined) setUserXP(parsed.totalXP);
          if (parsed.currentStreak !== undefined) setStreakDays(parsed.currentStreak);
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    };

    syncUser();

    window.addEventListener('lingual_auth_change', syncUser);
    window.addEventListener('storage', syncUser);
    return () => {
      window.removeEventListener('lingual_auth_change', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  const userName = currentUser?.displayName || currentUser?.name || 'Học Viên';
  const userEmail = currentUser?.email || '';
  const userRole = currentUser?.role || 'STUDENT';
  const userAvatar = currentUser?.avatarUrl || null;
  const isStaffRole = ['CONTENT_REVIEWER', 'ADMIN', 'SUPER_ADMIN'].includes(userRole);

  // Grouped Navigation Architecture
  const primaryLinks = [
    {
      href: `/${locale}/dashboard`,
      label: locale === 'vi' ? 'Lộ Trình' : 'Learn',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      href: `/${locale}/tutor`,
      label: 'AI Tutor',
      icon: <Bot className="w-4 h-4 text-teal-400" />,
    },
    {
      href: `/${locale}/vocabulary`,
      label: locale === 'vi' ? 'Từ Vựng' : 'Vocab',
      icon: <Search className="w-4 h-4" />,
    },
  ];

  const skillLinks = [
    {
      href: `/${locale}/speaking`,
      label: locale === 'vi' ? 'Luyện Nói' : 'Speaking',
      desc: 'Phát âm AI & Hội thoại',
      icon: <Mic className="w-4 h-4 text-coral-400" />,
    },
    {
      href: `/${locale}/listening`,
      label: locale === 'vi' ? 'Luyện Nghe' : 'Listening',
      desc: 'Dictation & Shadowing',
      icon: <Headphones className="w-4 h-4 text-amber-400" />,
    },
    {
      href: `/${locale}/writing`,
      label: locale === 'vi' ? 'Luyện Viết' : 'Writing Lab',
      desc: 'See & Write + Viết luận',
      icon: <PenTool className="w-4 h-4 text-teal-400" />,
    },
    {
      href: `/${locale}/reading`,
      label: locale === 'vi' ? 'Luyện Đọc' : 'Reading Lab',
      desc: 'Bài đọc CEFR & Trắc nghiệm',
      icon: <FileText className="w-4 h-4 text-emerald-400" />,
    },
  ];

  const examLinks = [
    {
      href: `/${locale}/exam-practice`,
      label: locale === 'vi' ? 'Thi Thử TOEIC' : 'TOEIC Exam Lab',
      desc: 'Đề thi chuẩn ETS & Scaled Score',
      icon: <Trophy className="w-4 h-4 text-amber-400" />,
    },
    {
      href: `/${locale}/ielts`,
      label: locale === 'vi' ? 'Luyện Thi IELTS' : 'IELTS Prep Hub',
      desc: 'Lộ trình Band 5.0 - 8.5 & Mock Test',
      icon: <Target className="w-4 h-4 text-coral-400" />,
    },
  ];

  const exploreLinks = [
    {
      href: `/${locale}/community`,
      label: locale === 'vi' ? 'Cộng Đồng' : 'Community',
      desc: 'Ghi chú & Nhóm học tập',
      icon: <Users className="w-4 h-4 text-teal-400" />,
    },
    {
      href: `/${locale}/analytics`,
      label: locale === 'vi' ? 'Phân Tích Năng Lực' : 'Analytics',
      desc: 'Radar biểu đồ 5 kỹ năng',
      icon: <Activity className="w-4 h-4 text-indigo-400" />,
    },
    {
      href: `/${locale}/srs`,
      label: locale === 'vi' ? 'Thẻ SRS SM-2' : 'SRS Cards',
      desc: 'Ôn tập ngắt quãng thông minh',
      icon: <Brain className="w-4 h-4 text-purple-400" />,
    },
    {
      href: `/${locale}/games`,
      label: locale === 'vi' ? 'Game Center' : 'Arcade Games',
      desc: '4 trò chơi phản xạ nhanh',
      icon: <Gamepad2 className="w-4 h-4 text-pink-400" />,
    },
    ...(isStaffRole
      ? [
          {
            href: `/${locale}/admin`,
            label: 'CMS Admin Portal',
            desc: 'Quản trị bảo mật & kiểm tra',
            icon: <Shield className="w-4 h-4 text-emerald-400" />,
          },
        ]
      : []),
  ];

  // Mobile bottom navigation tabs
  const bottomTabs = [
    {
      href: `/${locale}/dashboard`,
      label: locale === 'vi' ? 'Lộ Trình' : 'Learn',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      href: `/${locale}/tutor`,
      label: 'AI Tutor',
      icon: <Bot className="w-5 h-5" />,
    },
    {
      href: `/${locale}/speaking`,
      label: locale === 'vi' ? 'Kỹ Năng' : 'Skills',
      icon: <Layers className="w-5 h-5" />,
      activeRoutes: [`/${locale}/speaking`, `/${locale}/listening`, `/${locale}/writing`, `/${locale}/reading`],
    },
    {
      href: `/${locale}/vocabulary`,
      label: locale === 'vi' ? 'Từ Vựng' : 'Vocab',
      icon: <Search className="w-5 h-5" />,
    },
    {
      action: () => setMobileMenuOpen(true),
      label: locale === 'vi' ? 'Thêm' : 'More',
      icon: <Menu className="w-5 h-5" />,
    },
  ];

  const switchedLocale = locale === 'vi' ? 'en' : 'vi';
  const switchedPath = pathname.replace(`/${locale}`, `/${switchedLocale}`);

  const isSkillsActive = skillLinks.some((l) => pathname.startsWith(l.href));
  const isExamActive = examLinks.some((l) => pathname.startsWith(l.href));
  const isExploreActive = exploreLinks.some((l) => pathname.startsWith(l.href));

  return (
    <AuthProvider>
      <FloatingMascotUniverse />
      <div className="min-h-screen flex flex-col bg-transparent text-slate-100 font-body relative z-10 pointer-events-none">
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-xl pointer-events-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Logo with Peeking Cow Mascot */}
            <Link href={`/${locale}`} className="flex items-center gap-2.5 group relative" aria-label="LinguaFlow Home">
              <div className="relative">
                {/* Peeking Mascot Sticker with clean offset */}
                <div className="absolute -top-3.5 -left-4 z-20 w-7 h-7 pointer-events-none filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] transition-transform group-hover:-translate-y-1">
                  <Image
                    src={mascotReactions.greet}
                    alt="LinguaFlow Mascot"
                    fill
                    unoptimized
                    className="object-contain"
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

            {/* Desktop Scalable Hierarchical Navigation */}
            <nav
              ref={dropdownRef}
              className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md"
            >
              {/* Core Primary Links */}
              {primaryLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-all ${
                      isActive
                        ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Skills Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'skills' ? null : 'skills')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all ${
                    isSkillsActive
                      ? 'bg-coral-500/15 text-coral-300 border border-coral-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Layers className="w-4 h-4 text-coral-400" />
                  <span>{locale === 'vi' ? 'Kỹ Năng' : 'Skills'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'skills' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'skills' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-64 p-2 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl z-50 space-y-1"
                    >
                      {skillLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800/70 transition-all group"
                        >
                          <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50 group-hover:border-teal-500/40">
                            {item.icon}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-200 group-hover:text-white block">
                              {item.label}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-normal">
                              {item.desc}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Exam Practice Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'exams' ? null : 'exams')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all ${
                    isExamActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>{locale === 'vi' ? 'Luyện Thi' : 'Exams'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'exams' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'exams' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-72 p-2 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl z-50 space-y-1"
                    >
                      {examLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800/70 transition-all group"
                        >
                          <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50 group-hover:border-amber-500/40">
                            {item.icon}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-200 group-hover:text-white block">
                              {item.label}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-normal">
                              {item.desc}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Explore & More Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'explore' ? null : 'explore')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all ${
                    isExploreActive
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>{locale === 'vi' ? 'Khám Phá' : 'Explore'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'explore' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'explore' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-72 p-2 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl z-50 space-y-1"
                    >
                      {exploreLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800/70 transition-all group"
                        >
                          <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50 group-hover:border-indigo-500/40">
                            {item.icon}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-200 group-hover:text-white block">
                              {item.label}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-normal">
                              {item.desc}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* User Badges & Action Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {currentUser ? (
                <>
                  <StreakBadge streak={streakDays} />
                  <XPBadge xp={userXP} />

                  {/* Locale Switcher */}
                  <Link
                    href={switchedPath}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                    title="Chuyển đổi ngôn ngữ giao diện (VI/EN)"
                    aria-label="Toggle language interface"
                  >
                    <Globe className="w-3.5 h-3.5 text-teal-400" />
                    <span className="uppercase">{locale === 'vi' ? 'EN' : 'VI'}</span>
                  </Link>

                  {/* Desktop User Profile Avatar & Dropdown */}
                  <div ref={profileDropdownRef} className="relative hidden md:block">
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(activeDropdown === 'profile' ? null : 'profile')}
                      className={`flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-2xl bg-slate-900 border transition-all shadow-sm group ${
                        activeDropdown === 'profile'
                          ? 'border-teal-500/50 bg-teal-500/10'
                          : 'border-slate-800 hover:border-teal-500/40'
                      }`}
                      aria-label="Menu tài khoản người dùng"
                    >
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt={userName}
                          className="w-7 h-7 rounded-xl object-cover border border-teal-500/40 shrink-0"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-teal-500 via-emerald-400 to-amber-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm shrink-0">
                          {userName ? userName.slice(0, 2).toUpperCase() : 'LF'}
                        </div>
                      )}
                      <span className="text-xs font-bold max-w-[90px] lg:max-w-[120px] truncate text-slate-200 group-hover:text-white">
                        {userName}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200 ${
                          activeDropdown === 'profile' ? 'rotate-180 text-teal-400' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === 'profile' && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full right-0 mt-2 w-64 p-2 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl z-50 space-y-1"
                        >
                          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-2">
                            <p className="text-xs font-extrabold text-white truncate">{userName}</p>
                            <p className="text-[10px] text-slate-400 font-mono truncate">{userEmail}</p>
                            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-800">
                              <span className="text-[9px] px-2 py-0.5 rounded-md bg-teal-500/15 text-teal-300 font-bold border border-teal-500/30">
                                {userRole}
                              </span>
                              <span className="text-[9px] text-amber-400 font-bold flex items-center gap-1">
                                🔥 {streakDays}d • ⚡ {userXP} XP
                              </span>
                            </div>
                          </div>

                          <Link
                            href={`/${locale}/profile`}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all group"
                          >
                            <User className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
                            <span>{locale === 'vi' ? 'Hồ Sơ & Cài Đặt' : 'Profile & Settings'}</span>
                          </Link>

                          <Link
                            href={`/${locale}/community/friends`}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all group"
                          >
                            <Users className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                            <span>{locale === 'vi' ? 'Bạn Bè & Cộng Đồng' : 'Friends & Social'}</span>
                          </Link>

                          <Link
                            href={`/${locale}/analytics`}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all group"
                          >
                            <Activity className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                            <span>{locale === 'vi' ? 'Phân Tích Năng Lực' : 'Learning Analytics'}</span>
                          </Link>

                          <div className="pt-1 border-t border-slate-800/80 mt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveDropdown(null);
                                handleLogout();
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all group"
                            >
                              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              <span>{locale === 'vi' ? 'Đăng Xuất' : 'Sign Out'}</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  {/* Locale Switcher */}
                  <Link
                    href={switchedPath}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                    title="Chuyển đổi ngôn ngữ giao diện (VI/EN)"
                    aria-label="Toggle language interface"
                  >
                    <Globe className="w-3.5 h-3.5 text-teal-400" />
                    <span className="uppercase">{locale === 'vi' ? 'EN' : 'VI'}</span>
                  </Link>

                  {/* Unauthenticated Login & Register Buttons */}
                  <Link
                    href={`/${locale}/login`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white font-bold text-xs transition-all shadow-sm hidden sm:inline-block"
                  >
                    {locale === 'vi' ? 'Đăng Nhập' : 'Sign In'}
                  </Link>

                  <Link
                    href={`/${locale}/register`}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-teal-500/10"
                  >
                    {locale === 'vi' ? 'Bắt Đầu' : 'Get Started'}
                  </Link>
                </>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all"
                aria-label="Toggle mobile menu navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Slide-in Menu Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm pointer-events-auto"
              />

              {/* Side Panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="lg:hidden fixed top-0 right-0 z-50 w-80 h-full bg-slate-900 border-l border-slate-800 shadow-2xl overflow-y-auto pointer-events-auto"
              >
                <div className="p-5 space-y-5">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="font-display font-extrabold text-lg text-white">Menu Điều Hướng</span>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
                      aria-label="Đóng menu"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* User Profile Summary Card or Guest Card */}
                  {currentUser ? (
                    <Link
                      href={`/${locale}/profile`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-teal-500/40 space-y-3 block transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {userAvatar ? (
                            <img
                              src={userAvatar}
                              alt={userName}
                              className="w-10 h-10 rounded-2xl object-cover border border-teal-500/40"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-400 to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center shadow-sm">
                              {userName ? userName.slice(0, 2).toUpperCase() : 'LF'}
                            </div>
                          )}
                          <div>
                            <span className="text-sm font-bold text-white group-hover:text-teal-300 block transition-colors">
                              {userName}
                            </span>
                            <span className="text-xs text-slate-400 truncate block max-w-[150px]">{userEmail}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-teal-400 font-bold bg-teal-500/15 px-2 py-1 rounded-lg border border-teal-500/30">
                          {locale === 'vi' ? 'Xem hồ sơ →' : 'Profile →'}
                        </span>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <StreakBadge streak={streakDays} />
                        <XPBadge xp={userXP} />
                      </div>
                    </Link>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-white block">Chào mừng bạn đến LinguaFlow!</span>
                        <p className="text-xs text-slate-400">Đăng nhập để lưu tiến độ và thi đua cùng bạn bè.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Link
                          href={`/${locale}/login`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-center font-bold text-xs text-white transition-all border border-slate-700"
                        >
                          Đăng Nhập
                        </Link>
                        <Link
                          href={`/${locale}/register`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-center font-extrabold text-xs text-slate-950 transition-all"
                        >
                          Đăng Ký
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Group 1: Core Navigation */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 block mb-1">
                      🚀 Cốt Lõi
                    </span>
                    {primaryLinks.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${
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

                  {/* Group 2: 4 Skills Lab Grid */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 block mb-1">
                      🎙️ 4 Kỹ Năng Ngôn Ngữ
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {skillLinks.map((link) => {
                        const isActive = pathname.startsWith(link.href);
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={`flex flex-col gap-1 p-2.5 rounded-xl border transition-all ${
                              isActive
                                ? 'bg-coral-500/15 border-coral-500/30 text-coral-300'
                                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {link.icon}
                              <span className="text-xs font-bold">{link.label}</span>
                            </div>
                            <span className="text-[9px] text-slate-400 truncate">{link.desc}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Group 3: Exam Prep */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 block mb-1">
                      🏆 Luyện Thi Chứng Chỉ
                    </span>
                    {examLinks.map((link) => {
                      const isActive = pathname.startsWith(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${
                            isActive
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          }`}
                        >
                          {link.icon}
                          <div>
                            <span className="block">{link.label}</span>
                            <span className="text-[10px] font-normal text-slate-400">{link.desc}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Group 4: Explore & Community */}
                  <div className="border-t border-slate-800 pt-4 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 block mb-1">
                      🌐 Khám Phá & Tiện Ích
                    </span>
                    {exploreLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm text-slate-400 hover:bg-slate-800/60 hover:text-white transition-all"
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    ))}
                    {currentUser && (
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm text-rose-400 hover:bg-rose-500/10 transition-all pt-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng Xuất</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8 pointer-events-none [&_button]:pointer-events-auto [&_a]:pointer-events-auto [&_input]:pointer-events-auto [&_textarea]:pointer-events-auto [&_.pointer-events-auto]:pointer-events-auto">
          {children}
        </main>

        {/* Mobile Bottom Tab Bar (Clean 5-tab ergonomic layout) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-3 py-1.5 safe-bottom pointer-events-auto shadow-2xl">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {bottomTabs.map((tab, idx) => {
              if (tab.action) {
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={tab.action}
                    className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all text-slate-400 hover:text-slate-200"
                    aria-label={tab.label}
                  >
                    <div className="p-1 rounded-lg">
                      {tab.icon}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{tab.label}</span>
                  </button>
                );
              }

              const isActive =
                pathname === tab.href ||
                (tab.activeRoutes && tab.activeRoutes.some((r) => pathname.startsWith(r)));

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                    isActive ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className={`p-1 rounded-lg transition-all ${isActive ? 'bg-teal-500/15' : ''}`}>
                    {tab.icon}
                  </div>
                  <span className={`text-[10px] font-bold ${isActive ? 'text-teal-400' : 'text-slate-400'}`}>
                    {tab.label}
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
