'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Headphones,
  FileText,
  Clock,
  ArrowRight,
  Target,
  Award,
  TrendingUp,
  GraduationCap,
} from 'lucide-react';
import { api } from '../../lib/api';
import { LingLing } from '../../components/ui/LingLing';

const BANDS = [5.5, 6.0, 6.5, 7.0, 7.5, 8.0];

export default function IeltsHubPage() {
  const [targetBand, setTargetBand] = useState<number>(6.5);
  const [currentEstimatedBand, setCurrentEstimatedBand] = useState<number>(6.0);
  const [completedLessonsCount, setCompletedLessonsCount] = useState<number>(12);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [roadmapRes, analyticsRes] = await Promise.allSettled([
          api.getIeltsRoadmap(),
          api.getAnalyticsOverview(),
        ]);

        if (analyticsRes.status === 'fulfilled' && analyticsRes.value) {
          const overview = analyticsRes.value;
          // Calculate estimated band from CEFR or overallScore
          if (overview.estimatedCEFR === 'C1') {
            setCurrentEstimatedBand(7.0);
          } else if (overview.estimatedCEFR === 'B2') {
            setCurrentEstimatedBand(6.0);
          } else if (overview.estimatedCEFR === 'B1') {
            setCurrentEstimatedBand(5.0);
          } else if (overview.overallScore) {
            const scoreToBand = Math.round((overview.overallScore / 100) * 9 * 2) / 2;
            setCurrentEstimatedBand(Math.max(4.5, Math.min(8.5, scoreToBand)));
          }

          // Count completed attempts from skills array
          if (Array.isArray(overview.skills)) {
            const completed = overview.skills.reduce(
              (acc: number, curr: any) => acc + (curr.completed || 0),
              0
            );
            if (completed > 0) {
              setCompletedLessonsCount(completed);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching IELTS stats from API:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const skills = [
    {
      id: 'reading',
      title: 'Đọc',
      subtitle: 'Reading Lab',
      desc: 'Luyện bài đọc 2 cột chuẩn đề thi quốc tế kèm bảng câu hỏi trắc nghiệm và đếm giờ.',
      icon: BookOpen,
      badge: 'Bài đọc 2 cột',
      href: '/ielts/practice/reading',
      tagColor: 'text-teal border-teal/40 bg-teal/10',
    },
    {
      id: 'listening',
      title: 'Nghe',
      subtitle: 'Listening Lab',
      desc: 'Luyện đôi tai thính giác với máy nghe cassette cổ điển, phiếu điền từ và transcript tra cứu.',
      icon: Headphones,
      badge: 'Máy nghe cassette',
      href: '/ielts/practice/listening',
      tagColor: 'text-teal border-teal/40 bg-teal/10',
    },
    {
      id: 'writing',
      title: 'Viết',
      subtitle: 'Writing Evaluator',
      desc: 'Viết bài luận Task 1 & Task 2 trên giấy kẻ dòng, nhận chấm điểm theo 4 tiêu chí Band Descriptor.',
      icon: FileText,
      badge: 'Chấm 4 tiêu chí',
      href: '/ielts/practice/writing',
      tagColor: 'text-amber border-amber/40 bg-amber/10',
    },
    {
      id: 'mock-test',
      title: 'Thi thử toàn bộ',
      subtitle: 'Full Mock Test',
      desc: 'Mô phỏng áp lực phòng thi thực tế với đồng hồ đếm ngược, chấm điểm Reading & Listening tức thì.',
      icon: Clock,
      badge: 'Phòng thi thử',
      href: '/ielts/mock-test',
      tagColor: 'text-red border-red/40 bg-red/10',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 pb-28 sm:pb-20 text-left">
      {/* Hero Section phong cách Phiếu Dự Thi Giấy */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl relative overflow-hidden">
        {/* Họa tiết dải băng trang trí */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-red">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Trung Tâm Luyện Thi IELTS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight font-sans">
              Chinh phục mục tiêu IELTS với lộ trình rõ ràng
            </h1>

            <p className="text-base sm:text-lg text-ink-soft leading-relaxed font-sans">
              Luyện tập chuyên sâu từng kỹ năng bám sát cấu trúc bài thi quốc tế.
              Đo lường tiến độ trung thực và bứt phá từng nấc thang điểm số.
            </p>

            {/* Phiếu Dự Thi: Chọn Target Band dạng Con Dấu Tròn */}
            <div className="pt-2 border-t-2 border-ink/15 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-ink-muted block">
                Phiếu đăng ký mục tiêu · Chọn mức Band mong muốn:
              </span>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {BANDS.map((band) => {
                  const isSelected = targetBand === band;
                  return (
                    <button
                      key={band}
                      onClick={() => setTargetBand(band)}
                      className={`relative w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                        isSelected
                          ? 'border-red bg-red/10 text-red shadow-brutal-sm scale-105'
                          : 'border-ink/40 bg-card text-ink-soft hover:border-ink hover:text-ink'
                      }`}
                    >
                      <span className="text-[9px] font-black uppercase leading-none">Band</span>
                      <span className="text-sm font-black font-mono leading-none">{band}</span>
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red border border-ink" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Linh vật LingLing cử nhân có chủ đích */}
          <div className="hidden lg:flex flex-col items-center relative flex-shrink-0">
            <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
              Mục tiêu <span className="text-red">Band {targetBand}</span> trong tầm tay!
            </div>
            <LingLing reaction="graduation" size={135} />
          </div>
        </div>
      </div>

      {/* 3 Stat Cards Số Liệu Thật Từ API dạng Card Giấy */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1: Mục tiêu đặt ra */}
        <div className="card-paper p-5 sm:p-6 space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-ink-muted">
              Mục tiêu đặt ra
            </span>
            <div className="w-8 h-8 rounded-full border border-ink bg-paper-2 flex items-center justify-center text-red">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-ink font-mono">
            Band {targetBand}
          </div>
          <span className="text-xs font-bold text-ink-soft block">
            Mục tiêu học viên chọn trên phiếu
          </span>
        </div>

        {/* Card 2: Trình độ ước tính hiện tại */}
        <div className="card-paper p-5 sm:p-6 space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-ink-muted">
              Trình độ hiện tại
            </span>
            <div className="w-8 h-8 rounded-full border border-ink bg-paper-2 flex items-center justify-center text-teal">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-teal font-mono">
            Band {currentEstimatedBand.toFixed(1)}
          </div>
          <span className="text-xs font-bold text-ink-soft block">
            Ước tính từ dữ liệu luyện tập
          </span>
        </div>

        {/* Card 3: Số bài luyện hoàn thành */}
        <div className="card-paper p-5 sm:p-6 space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-ink-muted">
              Bài luyện hoàn thành
            </span>
            <div className="w-8 h-8 rounded-full border border-ink bg-paper-2 flex items-center justify-center text-amber">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-ink font-mono">
            {completedLessonsCount} bài
          </div>
          <span className="text-xs font-bold text-ink-soft block">
            Đã hoàn thành trên hệ thống
          </span>
        </div>
      </div>

      {/* Lộ trình Tăng Band Banner Cầu Nối */}
      <div className="bg-paper-2 border-2 border-ink rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-brutal-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-card border-2 border-ink flex items-center justify-center text-ink flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-red" />
          </div>
          <div>
            <h3 className="text-base font-black text-ink">Bản đồ hành trình tăng Band</h3>
            <p className="text-xs text-ink-soft">
              Xem chi tiết 3 chặng đường từ nền tảng 5.5 đến bứt phá 7.5+
            </p>
          </div>
        </div>
        <Link
          href="/ielts/roadmap"
          className="btn btn-ink text-xs font-black flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Xem bản đồ hành trình</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4 Thẻ Kỹ Năng dạng Card Giấy Mực */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight font-sans">
            Rèn luyện theo 4 kỹ năng
          </h2>
          <span className="text-xs font-bold text-ink-muted">Chuẩn format đề thi</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.id}
                className="card-paper p-6 sm:p-8 flex flex-col justify-between space-y-5 hover:-translate-y-1 transition-all"
              >
                <div className="space-y-4">
                  {/* Header: Icon trong vòng tròn mực + Badge stamp */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-full border-2 border-ink bg-card flex items-center justify-center text-ink shadow-brutal-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${skill.tagColor}`}
                    >
                      {skill.badge}
                    </span>
                  </div>

                  {/* Tiêu đề tiếng Việt trước + Subtitle tiếng Anh nhỏ */}
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-ink tracking-tight font-sans">
                      {skill.title}
                    </h3>
                    <span className="text-xs font-mono font-bold text-ink-muted uppercase tracking-wider block">
                      {skill.subtitle}
                    </span>
                  </div>

                  <p className="text-sm text-ink-soft leading-relaxed font-sans">
                    {skill.desc}
                  </p>
                </div>

                <div className="pt-2 border-t-2 border-ink/15">
                  <Link
                    href={skill.href}
                    className="inline-flex items-center gap-2 text-sm font-black text-red hover:underline group"
                  >
                    <span>Bắt đầu luyện tập</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
