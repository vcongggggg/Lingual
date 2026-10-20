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
  X,
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
  isComputed?: boolean;
}

interface WeaknessRadar {
  scores: Record<'vocabulary' | 'listening' | 'speaking' | 'reading' | 'writing', number>;
  weakestSkill: 'vocabulary' | 'listening' | 'speaking' | 'reading' | 'writing';
  weakestSkillNameVi: string;
  weakestScore: number;
  recommendedAction: string;
  actionUrl: string;
  radarData: Array<{ skill: string; score: number; labelVi: string; fullMark: number }>;
  isComputed?: boolean;
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
  isComputed?: boolean;
}

interface DropoffWarning {
  hasWarning: boolean;
  reason: 'streak_risk' | 'activity_drop' | null;
  streakDays: number;
  dropPercent: number;
  linglingMessage: string;
  mascotReaction: 'annoyed' | 'proud' | 'celebrate';
  encouragementTitle: string;
  isComputed?: boolean;
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
  isComputed?: boolean;
}

interface InsightsSummary {
  enabled: boolean;
  status: 'active' | 'disabled';
  generatedAt?: string;
  isComputed?: boolean;
  forgottenWordsComputed?: boolean;
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

  // Anomaly explanation state
  const [anomalyModalOpen, setAnomalyModalOpen] = useState(false);
  const [anomalyLoading, setAnomalyLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>('listening');
  const [anomalyExplanation, setAnomalyExplanation] = useState<{
    metricKey: string;
    metricLabel: string;
    explanation: string;
    recommendation: string;
  } | null>(null);

  const handleExplainAnomaly = async (metricKey: string, metricValue?: number) => {
    setSelectedMetric(metricKey);
    setAnomalyModalOpen(true);
    setAnomalyLoading(true);
    setAnomalyExplanation(null);
    try {
      const res = await api.explainAnomaly(metricKey, metricValue);
      if (res?.explanation) {
        setAnomalyExplanation(res.explanation);
      }
    } catch (err) {
      console.error('Lỗi khi gọi explainAnomaly:', err);
    } finally {
      setAnomalyLoading(false);
    }
  };

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
  if (!loading && data && (data.enabled === false || data.status === 'disabled')) {
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

  // Nếu không tải được phân tích (Item 3) -> Hiển thị empty state thân thiện
  if (!data) {
    return (
      <section className="space-y-4 pt-2">
        <div className="card-paper p-6 sm:p-8 bg-card border-2 border-ink rounded-3xl shadow-brutal text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF9C4] border-2 border-ink flex items-center justify-center text-2xl shadow-brutal-sm">
            🐮
          </div>
          <h3 className="text-base sm:text-lg font-black text-ink">
            Không tải được phân tích từ Bò LingLing
          </h3>
          <p className="text-xs text-ink-muted max-w-md mx-auto">
            Không thể kết nối đến hệ thống phân tích hành vi học tập lúc này. Hãy kiểm tra kết nối mạng hoặc thử tải lại.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setLoading(true);
                api.getInsightsSummary()
                  .then(setData)
                  .catch(() => {})
                  .finally(() => setLoading(false));
              }}
              className="btn btn-paper text-xs font-black px-4 py-2 inline-flex items-center gap-1.5 cursor-pointer shadow-brutal-sm"
            >
              <span>Thử tải lại</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  const { goldenHours, weaknessRadar, forgottenWords, dropoffWarning, curriculumAdaptation } = data;

  return (
    <section className="space-y-6 pt-2">
      {/* Header của mục Góc nhìn của Bò */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-ink/15 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#FFF2B2] border-2 border-ink rounded-full text-xs font-black uppercase tracking-wider text-ink shadow-brutal-sm">
              <Sparkles className="w-3.5 h-3.5 text-red" />
              <span>AI Phân Tích Hành Vi V1</span>
            </div>
            {data.isComputed ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-green-500/15 text-green-800 border border-green-600">
                <CheckCircle2 className="w-3 h-3" />
                Dữ liệu thật
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#FFF9C4] text-ink border border-ink/40">
                <Info className="w-3 h-3 text-ink-muted" />
                Gợi ý mặc định
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-ink font-sans flex items-center gap-2">
            Góc nhìn của Bò LingLing 🐮
          </h2>
          <p className="text-xs sm:text-sm text-ink-soft">
            {data.isComputed
              ? 'Mách nước thời gian học hiệu quả, điểm yếu kỹ năng và từ vựng hay quên dựa trên dữ liệu thật của bạn.'
              : 'Gợi ý mặc định — bạn chưa có đủ dữ liệu, học thêm để Bò phân tích chính xác hơn.'}
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

                  <button
                    onClick={() => handleExplainAnomaly('dropoffRisk', dropoffWarning.dropPercent || 30)}
                    className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 bg-paper-2 hover:bg-[#EAE0CB] text-ink rounded-xl border border-ink shadow-brutal-sm transition-all cursor-pointer"
                  >
                    <span>Giải thích nguyên nhân 🔍</span>
                  </button>
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
                {goldenHours.isComputed ? (
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-paper-2 border border-ink text-ink">
                    SRS Retention
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FFF9C4] border border-ink/40 text-ink-muted">
                    Gợi ý mặc định
                  </span>
                )}
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

                {!goldenHours.isComputed && (
                  <p className="text-[11px] font-medium text-ink-muted bg-paper-1/60 p-2 rounded-lg border border-dashed border-ink/30 mt-1">
                    Gợi ý mặc định — bạn chưa có đủ lượt ôn tập SRS, hãy ôn thêm để Bò phân tích khung giờ vàng chính xác hơn.
                  </p>
                )}
              </div>

              {/* Hourly breakdown preview */}
              {goldenHours.hourlyBreakdown && Array.isArray(goldenHours.hourlyBreakdown) && goldenHours.hourlyBreakdown.length > 0 && (
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
        {weaknessRadar && (() => {
          const radarItems = Array.isArray(weaknessRadar?.radarData) && weaknessRadar.radarData.length > 0
            ? weaknessRadar.radarData
            : [
                {
                  skill: 'vocabulary',
                  score: weaknessRadar?.scores?.vocabulary ?? (weaknessRadar as any)?.skills?.vocabulary ?? 75,
                  labelVi: 'Từ vựng',
                  fullMark: 100,
                },
                {
                  skill: 'listening',
                  score: weaknessRadar?.scores?.listening ?? (weaknessRadar as any)?.skills?.listening ?? 68,
                  labelVi: 'Kỹ năng Nghe',
                  fullMark: 100,
                },
                {
                  skill: 'speaking',
                  score: weaknessRadar?.scores?.speaking ?? (weaknessRadar as any)?.skills?.speaking ?? 65,
                  labelVi: 'Kỹ năng Nói',
                  fullMark: 100,
                },
                {
                  skill: 'reading',
                  score: weaknessRadar?.scores?.reading ?? (weaknessRadar as any)?.skills?.reading ?? 80,
                  labelVi: 'Kỹ năng Đọc',
                  fullMark: 100,
                },
                {
                  skill: 'writing',
                  score: weaknessRadar?.scores?.writing ?? (weaknessRadar as any)?.skills?.writing ?? 70,
                  labelVi: 'Kỹ năng Viết',
                  fullMark: 100,
                },
              ];
          const weakestSkillKey = weaknessRadar?.weakestSkill || 'listening';
          const weakestSkillLabel = weaknessRadar?.weakestSkillNameVi || weakestLabel(weakestSkillKey);
          const weakestScoreVal = weaknessRadar?.weakestScore ?? (weaknessRadar?.scores?.[weakestSkillKey] ?? 68);

          return (
            <div className="card-paper p-5 sm:p-6 bg-card border-2 border-ink rounded-3xl shadow-brutal-md space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl border-2 border-ink bg-[#FFCDD2] flex items-center justify-center text-ink shadow-brutal-sm">
                      <TrendingDown className="w-4 h-4 text-red" />
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-ink font-sans">
                      Kỹ Năng Cần Khắc Phục
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {weaknessRadar.isComputed ? (
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-red text-white border border-ink">
                        {weakestSkillLabel} ({weakestScoreVal}/100)
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FFF9C4] border border-ink/40 text-ink-muted">
                        Gợi ý mặc định
                      </span>
                    )}

                    <button
                      onClick={() => handleExplainAnomaly(weakestSkillKey, weakestScoreVal)}
                      className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#FFF2B2] hover:bg-[#FFE57F] text-ink border border-ink shadow-brutal-sm transition-all cursor-pointer"
                    >
                      <span>Giải thích 🐮</span>
                    </button>
                  </div>
                </div>

                {/* Progress bars cho 5 kỹ năng (đã guard hoàn toàn) */}
                <div className="space-y-2 bg-paper-2 border-2 border-ink rounded-2xl p-3.5">
                  {radarItems.map((item) => {
                    const isWeakest = (item.skill || '').toLowerCase() === (weakestSkillKey || '').toLowerCase();
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

                {!weaknessRadar.isComputed && (
                  <p className="text-[11px] font-medium text-ink-muted bg-paper-1/60 p-2 rounded-lg border border-dashed border-ink/30">
                    Gợi ý mặc định — bạn chưa hoàn thành đủ bài học các kỹ năng, điểm số 5 kỹ năng hiện là mức tham chiếu ban đầu.
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Link
                  href={weaknessRadar.actionUrl || '/practice'}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-red hover:bg-[#D9381E] text-white border-2 border-ink rounded-xl text-xs font-black shadow-brutal-sm hover:-translate-y-0.5 transition-all"
                >
                  <span>Luyện ngay kỹ năng {weakestSkillLabel} ⚡</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })()}

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
                {forgottenWords[0]?.isComputed !== false ? (
                  <span className="text-xs font-bold text-ink-muted">
                    {forgottenWords.length} từ cần củng cố
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FFF9C4] border border-ink/40 text-ink-muted">
                    Từ vựng mẫu
                  </span>
                )}
              </div>

              <p className="text-xs text-ink-soft">
                {forgottenWords[0]?.isComputed !== false
                  ? 'Các từ vựng có số lần quên lặp lại (lapses ≥ 2). Bấm vào từ để xem chi tiết và phát âm:'
                  : 'Bạn chưa có từ vựng nào bị quên trong hệ thống SRS. Dưới đây là các từ vựng tiêu biểu gợi ý để bạn rèn luyện:'}
              </p>

              {/* Chips list (đã guard Array) */}
              <div className="flex flex-wrap gap-2">
                {Array.isArray(forgottenWords) && forgottenWords.map((w) => (
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
                  {forgottenWords[0]?.isComputed !== false
                    ? 'Hệ thống Daily Challenge và Bản tin từ Bò tự động ưu tiên đưa các từ này vào bài luyện tập hàng ngày.'
                    : 'Gợi ý mặc định — sau khi bạn ôn tập SRS, các từ bạn hay ấn "Quên" sẽ xuất hiện tại đây.'}
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
                {curriculumAdaptation.isComputed ? (
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-paper-2 border border-ink text-ink">
                    Đề xuất kế tiếp
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FFF9C4] border border-ink/40 text-ink-muted">
                    Gợi ý mặc định
                  </span>
                )}
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
                      {curriculumAdaptation.completedLessonsCount || 0}/{curriculumAdaptation.totalLessonsCount || 1} bài ({curriculumAdaptation.completionPercent || 0}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-card border border-ink rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, curriculumAdaptation.completionPercent || 0)}%` }}
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

      {/* MODAL GIẢI THÍCH BẤT THƯỜNG / ĐIỂM YẾU TỪ BÒ LINGLING */}
      {anomalyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border-2 border-ink rounded-3xl max-w-lg w-full p-6 shadow-brutal space-y-4 relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setAnomalyModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-ink bg-paper-2 hover:bg-paper-2/80 flex items-center justify-center text-ink cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF9C4] border-2 border-ink flex items-center justify-center text-xl">
                🐮
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-ink-muted">AI Phân Tích Bất Thường</span>
                <h3 className="text-lg font-black text-ink">Bò LingLing Giải Thích Điểm Yếu</h3>
              </div>
            </div>

            <div className="space-y-4 py-2 flex-1 overflow-y-auto">
              {anomalyLoading ? (
                <div className="py-10 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-4 border-yellow border-t-ink rounded-full animate-spin" />
                  <p className="text-xs font-bold text-ink-muted">Bò LingLing đang đối chiếu nhật ký học tập...</p>
                </div>
              ) : anomalyExplanation ? (
                <div className="space-y-3.5">
                  <div className="p-3 bg-paper-2 border-2 border-ink rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-black text-ink">Chỉ số:</span>
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-red text-white border border-ink">
                      {anomalyExplanation.metricLabel || selectedMetric}
                    </span>
                  </div>

                  <div className="bg-[#FFF4E5] border-2 border-ink rounded-2xl p-4 space-y-2">
                    <h4 className="text-xs font-black uppercase text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                      <span>Nguyên nhân:</span>
                    </h4>
                    <p className="text-xs text-ink leading-relaxed font-medium">
                      {anomalyExplanation.explanation}
                    </p>
                  </div>

                  <div className="bg-[#F0FDF4] border-2 border-ink rounded-2xl p-4 space-y-2">
                    <h4 className="text-xs font-black uppercase text-green-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-700" />
                      <span>Lời khuyên khắc phục:</span>
                    </h4>
                    <p className="text-xs text-ink leading-relaxed font-medium">
                      {anomalyExplanation.recommendation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-paper-2 border-2 border-dashed border-ink/40 rounded-2xl text-center text-xs font-bold text-ink-muted">
                  Không tìm thấy nguyên nhân bất thường đáng ngại. Bạn đang học tập tốt!
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-ink/15 flex justify-end">
              <button
                onClick={() => setAnomalyModalOpen(false)}
                className="btn btn-ink text-xs font-black px-4 py-2 cursor-pointer"
              >
                Đã hiểu, cảm ơn Bò 🐮
              </button>
            </div>
          </div>
        </div>
      )}
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
