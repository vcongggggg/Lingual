'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  BookOpen,
  Headphones,
  FileText,
  Mic,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  Target,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { ieltsApi } from '@/lib/api';
import ThemeIllustration from '@/components/ThemeIllustration';
import Image from 'next/image';
import { mascotReactions } from '@linguaflow/config';
import { TiltCard } from '@/components/common/TiltCard';


const FALLBACK_ROADMAP_TRACKS = [
  {
    id: 'track-1',
    targetBand: 5.5,
    type: 'academic',
    description: 'Chặng 1: Nền tảng IELTS Band 4.5 - 5.5 (Củng cố từ vựng lõi Academic & kỹ năng làm bài cơ bản)',
  },
  {
    id: 'track-2',
    targetBand: 6.5,
    type: 'academic',
    description: 'Chặng 2: Bứt phá IELTS Band 6.0 - 6.5 (Tập trung chiến thuật làm bài Reading 2 cột & Listening)',
  },
  {
    id: 'track-3',
    targetBand: 7.5,
    type: 'academic',
    description: 'Chặng 3: Làm chủ IELTS Band 7.0+ (Luyện đề Mock Test thời gian thực & AI Writing Task 1/2 Evaluator)',
  },
];

export default function IeltsHubPage() {
  const routeParams = useParams();
  const locale = (routeParams?.locale as string) || 'vi';
  const [targetBand, setTargetBand] = useState<number>(6.5);
  const [roadmapTracks, setRoadmapTracks] = useState<any[]>(FALLBACK_ROADMAP_TRACKS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await ieltsApi.getRoadmap();
        if (res?.success && res?.tracks && res.tracks.length > 0) {
          setRoadmapTracks(res.tracks);
        } else {
          setRoadmapTracks(FALLBACK_ROADMAP_TRACKS);
        }
      } catch {
        setRoadmapTracks(FALLBACK_ROADMAP_TRACKS);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const skills = [
    {
      id: 'reading',
      title: 'IELTS Reading',
      desc: 'Luyện đọc 2 cột chuẩn thi thật (Passages + 14 dạng câu hỏi với bộ đếm giờ)',
      icon: BookOpen,
      image: '/images/ielts/mascot_ielts_reading.jpg',
      badge: 'Passage 2-Col',
      link: `/${locale}/ielts/practice/reading`,
      borderColor: 'border-cyan-500/30 hover:border-cyan-400',
      glowColor: 'rgba(6, 182, 212, 0.35)',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      iconColor: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
    },
    {
      id: 'listening',
      title: 'IELTS Listening',
      desc: 'Nghe audio chọn đáp án, điền từ & xem Transcript thông minh đa tốc độ',
      icon: Headphones,
      image: '/images/ielts/mascot_ielts_listening.jpg',
      badge: 'Audio Player & Transcript',
      link: `/${locale}/ielts/practice/listening`,
      borderColor: 'border-purple-500/30 hover:border-purple-400',
      glowColor: 'rgba(168, 85, 247, 0.35)',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      iconColor: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
    },
    {
      id: 'writing',
      title: 'IELTS Writing (AI Nhận Xét)',
      desc: 'Luyện viết Task 1 & Task 2 và nhận đánh giá chi tiết 4 tiêu chí chuẩn Examiner',
      icon: FileText,
      image: '/images/dashboard/unit_study_desk.jpg',
      mascot: '/mascot/cow_salute.png',
      badge: 'AI Examiner 4 Tiêu Chí',
      link: `/${locale}/ielts/practice/writing`,
      borderColor: 'border-amber-500/30 hover:border-amber-400',
      glowColor: 'rgba(245, 158, 11, 0.35)',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      iconColor: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
    },
    {
      id: 'mock-test',
      title: 'Thi Thử IELTS Toàn Diện',
      desc: 'Thi thử 4 kỹ năng trong áp lực thời gian thực & nhận Band điểm ước tính tức thì',
      icon: Clock,
      image: '/images/dashboard/quick_exam.jpg',
      mascot: '/mascot/cow_greet_heart.png',
      badge: 'Full Mock Test 4 Kỹ Năng',
      link: `/${locale}/ielts/mock-test`,
      borderColor: 'border-emerald-500/30 hover:border-emerald-400',
      glowColor: 'rgba(16, 185, 129, 0.35)',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      iconColor: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border border-blue-500/20 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Luyện Thi IELTS • Chế Độ Tập Trung</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
              Luyện Thi IELTS Chuyên Sâu
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Luyện 4 kỹ năng Nghe, Đọc, Viết & Nói bám sát đề thi chuẩn.
              Cùng bò LingLing tập trung chinh phục mục tiêu Band 6.5+!
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="relative w-24 h-24">
              <Image
                src={mascotReactions.focus_mode}
                alt="IELTS Focus Mode Mascot"
                width={96}
                height={96}
                className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
              />
            </div>
            <ThemeIllustration type="ielts" size={100} className="hidden sm:block" />
          </div>
        </div>

        {/* Target Band Selector */}
        <div className="pt-6 relative z-10 flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-300 font-medium flex items-center gap-1.5">
            <Target className="w-4 h-4 text-blue-400" /> Target Band mục tiêu:
          </span>
          {[5.5, 6.0, 6.5, 7.0, 7.5, 8.0].map((band) => (
            <button
              key={band}
              onClick={() => setTargetBand(band)}
              className={`px-3 py-1.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                targetBand === band
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400 scale-105'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              Band {band}
            </button>
          ))}
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Progress & Target Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Mục tiêu đặt ra</div>
            <div className="text-2xl font-bold text-slate-100">IELTS Band {targetBand}</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Trình độ ước tính hiện tại</div>
            <div className="text-2xl font-bold text-purple-300">Band 6.0</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Bài làm hoàn thành</div>
            <div className="text-2xl font-bold text-emerald-300">12 Bài luyện</div>
          </div>
        </div>
      </div>

      {/* Skills Practice Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" /> Rèn Luyện Theo Kỹ Năng
          </h2>
          <Link
            href={`/${locale}/ielts/roadmap`}
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
          >
            Xem Lộ trình đầy đủ <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <TiltCard
                key={skill.id}
                maxTilt={8}
                spotlightColor={skill.glowColor}
                spotlightRadius={380}
                className="h-full rounded-3xl"
              >
                <Link
                  href={skill.link}
                  className={`group relative p-6 sm:p-7 rounded-3xl bg-slate-950/90 border ${skill.borderColor} overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl flex flex-col justify-between h-56 sm:h-64 block`}
                >
                  {/* FULL BACKGROUND 3D ARTWORK WITH MASCOT */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <Image
                      src={skill.image}
                      alt={skill.title}
                      fill
                      className="object-cover object-right sm:object-right transition-transform duration-700 ease-out group-hover:scale-110 opacity-85 group-hover:opacity-100 filter brightness-105 contrast-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Directional glass gradient from left to right */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent/10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/20" />

                    {/* Mascot character overlay for writing and mock-test if specified */}
                    {skill.mascot && (
                      <div className="absolute right-4 bottom-2 w-24 sm:w-28 h-24 sm:h-28 pointer-events-none transition-transform duration-500 group-hover:scale-110">
                        <img
                          src={skill.mascot}
                          alt="Mascot Cow"
                          className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
                        />
                      </div>
                    )}
                  </div>

                  {/* TOP ROW: ICON + BADGE */}
                  <div className="flex items-center justify-between relative z-10" style={{ transform: 'translateZ(25px)' }}>
                    <div className={`p-3 rounded-2xl border backdrop-blur-md shadow-md group-hover:scale-110 transition-transform ${skill.iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border backdrop-blur-md uppercase tracking-wider ${skill.badgeColor}`}>
                      {skill.badge}
                    </span>
                  </div>

                  {/* BOTTOM: TITLE + DESC + CTA ARROW */}
                  <div className="space-y-2 relative z-10 max-w-sm" style={{ transform: 'translateZ(30px)' }}>
                    <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white group-hover:text-cyan-300 transition-colors drop-shadow-md">
                      {skill.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed drop-shadow line-clamp-2">
                      {skill.desc}
                    </p>

                    <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                      <span>Bắt đầu luyện tập</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </TiltCard>
            );
          })}
        </div>
      </div>

      {/* Target Band Pathway Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Lộ Trình Học Theo Chặng (Target Band Pathway)</h2>
            <p className="text-slate-400 text-sm mt-1">Các chặng học được cá nhân hóa theo Band mục tiêu của bạn.</p>
          </div>
          <Link
            href={`/${locale}/ielts/roadmap`}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/20 text-center"
          >
            Vào Lộ Trình Học
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roadmapTracks.map((track, idx) => (
            <div
              key={track.id || idx}
              className={`p-5 rounded-2xl border transition-all ${
                track.targetBand === targetBand
                  ? 'bg-blue-950/40 border-blue-500/50 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-900/40 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Chặng {idx + 1}
                </span>
                <span className="text-lg font-black text-white">Band {track.targetBand}</span>
              </div>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">{track.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
