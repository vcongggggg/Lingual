'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Sparkles,
  BookOpen,
  Flame,
  CheckCircle2,
  Compass,
  ExternalLink,
  Info,
} from 'lucide-react';
import { api } from '../../lib/api';
import { LingLing } from '../ui/LingLing';
import { WordLookupDrawer } from '../ui/WordLookupDrawer';

interface HourlyData {
  hour: number;
  label: string;
  total: number;
  retention: number;
}

interface GoldenHours {
  goldenHour: string;
  startHour: number;
  endHour: number;
  retentionRate: number;
  totalReviewsInGoldenHour: number;
  hourlyBreakdown: HourlyData[];
  recommendationText: string;
  isBaseline: boolean;
}

interface WeaknessRadar {
  scores: Record<'vocabulary' | 'listening' | 'speaking' | 'reading' | 'writing', number>;
  weakestSkill: 'vocabulary' | 'listening' | 'speaking' | 'reading' | 'writing';
  weakestSkillNameVi: string;
  weakestScore: number;
  recommendedAction: string;
  actionUrl: string;
  radarData: Array<{ skill: string; score: number; labelVi: string; fullMark: number }>;
}

interface ForgottenWord {
  id: string;
  wordId: string;
  targetText: string;
  translation: string;
  phonetic: string;
  cefrLevel: string;
  partOfSpeech: string;
  exampleSentence: string;
  exampleTranslation: string;
  lapses: number;
  failureCount: number;
  lastReviewedAt: string;
}

interface DropoffWarning {
  hasWarning: boolean;
  reason: 'streak_risk' | 'activity_drop' | null;
  streakDays: number;
  dropPercent: number;
  linglingMessage: string;
  mascotReaction: 'annoyed' | 'proud' | 'celebrate';
  encouragementTitle: string;
}

interface CurriculumAdaptation {
  recommendedUnitId: string;
  unitTitle: string;
  unitOrder: number;
  courseTitle: string;
  completedLessonsCount: number;
  totalLessonsCount: number;
  completionPercent: number;
  reason: string;
  actionUrl: string;
}

interface InsightsSummary {
  enabled: boolean;
  status: 'active' | 'disabled';
  generatedAt?: string;
  goldenHours?: GoldenHours;
  weaknessRadar?: WeaknessRadar;
  forgottenWords?: ForgottenWord[];
  dropoffWarning?: DropoffWarning;
  curriculumAdaptation?: CurriculumAdaptation;
}

export function CowInsightsSection() {
  const [data, setData] = useState<InsightsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchInsights() {
      try {
        const res = await api.getInsightsSummary();
        if (isMounted) {
          setData(res);
        }
      } catch (err) {
        // If error or disabled
        console.error('Failed to load cow insights:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchInsights();

    return () => {
      isMounted = false;
    };
  }, []);

  // Nếu tính năng bị tắt trong cài đặt Privacy -> Ẩn hoàn toàn UI
  if (!loading && (!data || data.enabled === false || data.status === 'disabled')) {
    return null;
  }

  if (loading) {
    return (
      <div className="card-paper p-6 bg-card border-2 border-ink rounded-3xl animate-pulse space-y-4">
        <div className="h-6 w-48 bg-paper-2 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-36 bg-paper-2 rounded-2xl" />
          <div className="h-36 bg-paper-2 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { goldenHours, weaknessRadar, forgottenWords, dropoffWarning, curriculumAdaptation } = data;

  return (
    <section className="space-y-6 pt-2">
      {/* Header của mục Góc nhìn của Bò */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-ink/15 pb-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#FFF2B2] border-2 border-ink rounded-full text-xs font-black uppercase tracking-wider text-ink shadow-brutal-sm">
            <Sparkles className="w-3.5 h-3.5 text-red" />
            <span>AI Phân Tích Hành Vi V1</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-ink font-sans flex items-center gap-2">
            Góc nhìn của Bò LingLing 🐮
          </h2>
          <p className="text-xs sm:text-sm text-ink-soft">
            Mách nước thời gian học hiệu quả, điểm yếu kỹ năng và từ vựng hay quên dựa trên dữ liệu thật của bạn.
          </p>
        </div>

        <Link
          href="/settings"
          className="self-start sm:self-auto text-xs font-bold text-ink-muted hover:text-red transition-colors flex items-center gap-1 border border-ink/30 px-2.5 py-1 rounded-lg bg-paper-2"
        >
          Cài đặt riêng tư
        </Link>
      </div>

      {/* BANNER THÔNG ĐIỆP BÒ LINGLING (Cảnh báo bỏ cuộc hoặc Lời khen) */}
      {dropoffWarning && (
        <div
          className={`border-2 border-ink rounded-3xl p-5 sm:p-6 shadow-brutal-md relative overflow-hidden transition-all ${
            dropoffWarning.hasWarning
              ? 'bg-[#FFF4E5] border-red/80'
              : 'bg-[#F0FFF4] border-[#2E7D32]/60'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="flex-shrink-0">
              <LingLing
                reaction={dropoffWarning.hasWarning ? 'angryHandsHips' : 'proud'}
                size={76}
                animate={true}
              />
            </div>

            <div className="flex-1 space-y-1.5 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span
                  className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-ink ${
                    dropoffWarning.hasWarning ? 'bg-red text-white' : 'bg-[#E8F5E9] text-[#2E7D32]'
                  }`}
                >
                  {dropoffWarning.encouragementTitle || (dropoffWarning.hasWarning ? 'Cảnh báo streak!' : 'Lời nhắn của Bò')}
                </span>
                {dropoffWarning.streakDays > 0 && (
                  <span className="text-xs font-bold text-ink-muted flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-red fill-red" /> Chuỗi {dropoffWarning.streakDays} ngày
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base font-extrabold text-ink leading-relaxed">
                "{dropoffWarning.linglingMessage}"
              </p>

              {dropoffWarning.hasWarning && (
                <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Link
                    href="/daily"
                    className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 bg-red text-white rounded-xl border border-ink shadow-brutal-sm hover:-translate-y-0.5 transition-all"
                  >
                    <span>Làm thử thách giữ streak ngay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LƯỚI 4 CARD NỘI DUNG CHÍNH (SỔ TAY GIẤY) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. GIỜ VÀNG HỌC TẬP */}
        {goldenHours && (
          <div className="card-paper p-5 sm:p-6 bg-card border-2 border-ink rounded-3xl shadow-brutal-md space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl border-2 border-ink bg-[#FFF9C4] flex items-center justify-center text-ink shadow-brutal-sm">
                    <Clock className="w-4 h-4 text-ink" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-ink font-sans">
                    Giờ Vàng Học Tập
                  </h3>
                </div>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-paper-2 border border-ink text-ink">
                  SRS Retention
                </span>
              </div>

              <div className="bg-paper-2 border-2 border-ink rounded-2xl p-4 space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-black uppercase text-ink-muted block">Khung giờ tối ưu</span>
                    <span className="text-2xl sm:text-3xl font-black text-red font-mono">
                      {goldenHours.goldenHour}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black uppercase text-ink-muted block">Tỷ lệ nhớ từ</span>
                    <span className="text-xl sm:text-2xl font-black text-[#2E7D32] font-mono">
                      {goldenHours.retentionRate}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-ink-soft leading-relaxed pt-1">
                  {goldenHours.recommendationText}
                </p>
              </div>

              {/* Hourly breakdown preview */}
              {goldenHours.hourlyBreakdown && goldenHours.hourlyBreakdown.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-ink-muted block uppercase tracking-wider">
                    Hiệu suất ghi nhớ theo mốc giờ
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                    {goldenHours.hourlyBreakdown.slice(0, 6).map((hb) => (
                      <div
                        key={hb.hour}
                        className={`p-1.5 rounded-xl border border-ink text-center text-[10px] ${
                          hb.hour === goldenHours.startHour
                            ? 'bg-red text-white font-black shadow-brutal-sm'
                            : 'bg-card text-ink font-medium'
                        }`}
                      >
                        <div className="font-mono">{hb.label}</div>
                        <div className="font-bold">{hb.retention}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Link
                href="/srs"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-paper-2 hover:bg-[#EAE0CB] border-2 border-ink rounded-xl text-xs font-black text-ink shadow-brutal-sm transition-all"
              >
                <span>Mở Thẻ ghi nhớ SRS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* 2. RADAR ĐIỂM YẾU & BÀI LUYỆN ĐỀ XUẤT */}
        {weaknessRadar && (
          <div className="card-paper p-5 sm:p-6 bg-card border-2 border-ink rounded-3xl shadow-brutal-md space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl border-2 border-ink bg-[#FFCDD2] flex items-center justify-center text-ink shadow-brutal-sm">
                    <TrendingDown className="w-4 h-4 text-red" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-ink font-sans">
                    Kỹ Năng Cần Khắc Phục
                  </h3>
                </div>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-red text-white border border-ink">
                  {weakestLabel(weaknessRadar.weakestSkill)} ({weaknessRadar.weakestScore}/100)
                </span>
              </div>

              {/* Progress bars cho 5 kỹ năng */}
              <div className="space-y-2 bg-paper-2 border-2 border-ink rounded-2xl p-3.5">
                {weaknessRadar.radarData.map((item) => {
                  const isWeakest = item.skill.toLowerCase() === weaknessRadar.weakestSkill.toLowerCase();
                  return (
                    <div key={item.skill} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className={`flex items-center gap-1.5 ${isWeakest ? 'text-red font-black' : 'text-ink'}`}>
                          {item.labelVi}
                          {isWeakest && <span className="text-[10px] bg-red/10 px-1.5 py-0.2 rounded text-red border border-red/30">Ưu tiên</span>}
                        </span>
                        <span className="font-mono text-ink-muted">{item.score}/100</span>
                      </div>
                      <div className="h-2 w-full bg-card border border-ink rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            isWeakest ? 'bg-red' : 'bg-ink'
                          }`}
                          style={{ width: `${Math.max(5, item.score)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-[#FFF8E7] border border-ink rounded-xl p-3 text-xs text-ink leading-relaxed">
                <span className="font-black text-red">Mách nước: </span>
                {weaknessRadar.recommendedAction}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={weaknessRadar.actionUrl || '/practice'}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-red hover:bg-[#D9381E] text-white border-2 border-ink rounded-xl text-xs font-black shadow-brutal-sm hover:-translate-y-0.5 transition-all"
              >
                <span>Luyện ngay kỹ năng {weaknessRadar.weakestSkillNameVi} ⚡</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* 3. SỔ TAY TỪ HAY QUÊN */}
        {forgottenWords && (
          <div className="card-paper p-5 sm:p-6 bg-card border-2 border-ink rounded-3xl shadow-brutal-md space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl border-2 border-ink bg-[#E1BEE7] flex items-center justify-center text-ink shadow-brutal-sm">
                    <BookOpen className="w-4 h-4 text-ink" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-ink font-sans">
                    Sổ Tay Từ Hay Quên
                  </h3>
                </div>
                <span className="text-xs font-bold text-ink-muted">
                  {forgottenWords.length} từ cần củng cố
                </span>
              </div>

              <p className="text-xs text-ink-soft">
                Các từ vựng có số lần quên lặp lại (lapses &ge; 2). Bấm vào từ để xem chi tiết và phát âm:
              </p>

              {/* Chips list */}
              <div className="flex flex-wrap gap-2">
                {forgottenWords.map((w) => (
                  <button
                    key={w.id}
                    onClick={() =>
                      setSelectedWord({
                        targetText: w.targetText,
                        translation: w.translation,
                        phonetic: w.phonetic,
                        cefrLevel: w.cefrLevel,
                        partOfSpeech: w.partOfSpeech,
                        exampleSentence: w.exampleSentence,
                        exampleTranslation: w.exampleTranslation,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper-2 hover:bg-[#FFF3E0] border-2 border-ink rounded-xl text-xs font-extrabold text-ink shadow-brutal-sm hover:-translate-y-0.5 transition-all cursor-pointer group"
                  >
                    <span className="group-hover:text-red transition-colors">{w.targetText}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red/10 text-red border border-red/20">
                      quên {w.lapses || w.failureCount || 2}x
                    </span>
                  </button>
                ))}
              </div>

              <div className="bg-paper-2 border border-dashed border-ink/40 rounded-xl p-3 text-xs text-ink-muted flex items-center gap-2">
                <Info className="w-4 h-4 flex-shrink-0 text-ink-muted" />
                <span>
                  Hệ thống Daily Challenge và Bản tin từ Bò tự động ưu tiên đưa các từ này vào bài luyện tập hàng ngày.
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/daily"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-paper-2 hover:bg-[#EAE0CB] border-2 border-ink rounded-xl text-xs font-black text-ink shadow-brutal-sm transition-all"
              >
                <span>Luyện các từ này trong Thử thách ngày</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* 4. LỘ TRÌNH THÍCH ỨNG (CURRICULUM ADAPTATION) */}
        {curriculumAdaptation && (
          <div className="card-paper p-5 sm:p-6 bg-card border-2 border-ink rounded-3xl shadow-brutal-md space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl border-2 border-ink bg-[#B2EBF2] flex items-center justify-center text-ink shadow-brutal-sm">
                    <Compass className="w-4 h-4 text-ink" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-ink font-sans">
                    Lộ Trình Thích Ứng
                  </h3>
                </div>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-paper-2 border border-ink text-ink">
                  Đề xuất kế tiếp
                </span>
              </div>

              <div className="bg-paper-2 border-2 border-ink rounded-2xl p-4 space-y-2.5">
                <div>
                  <span className="text-[11px] font-black uppercase text-ink-muted block">
                    {curriculumAdaptation.courseTitle || 'Chương Trình Chuẩn'}
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-ink font-sans">
                    {curriculumAdaptation.unitTitle}
                  </h4>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-ink-soft">Tiến độ Unit</span>
                    <span className="font-mono text-ink">
                      {curriculumAdaptation.completedLessonsCount}/{curriculumAdaptation.totalLessonsCount} bài ({curriculumAdaptation.completionPercent}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-card border border-ink rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, curriculumAdaptation.completionPercent)}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-ink-soft leading-relaxed pt-1">
                  {curriculumAdaptation.reason}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={curriculumAdaptation.actionUrl || '/curriculum'}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-paper-2 hover:bg-[#EAE0CB] border-2 border-ink rounded-xl text-xs font-black text-ink shadow-brutal-sm transition-all"
              >
                <span>Mở bài học tiếp theo trên Lộ trình</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* MODAL / DRAWER TRA CỨU TỪ NHANH */}
      <WordLookupDrawer
        isOpen={Boolean(selectedWord)}
        onClose={() => setSelectedWord(null)}
        word={selectedWord}
      />
    </section>
  );
}

function weakestLabel(skillKey: string): string {
  switch (skillKey?.toLowerCase()) {
    case 'vocabulary':
      return 'Từ vựng';
    case 'listening':
      return 'Kỹ năng Nghe';
    case 'speaking':
      return 'Kỹ năng Nói';
    case 'reading':
      return 'Kỹ năng Đọc';
    case 'writing':
      return 'Kỹ năng Viết';
    default:
      return skillKey || 'Kỹ năng';
  }
}
