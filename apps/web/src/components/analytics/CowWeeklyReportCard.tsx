'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Compass,
  RefreshCw,
  History,
  HelpCircle,
  X,
  Target,
  ArrowRight,
  TrendingDown,
  Flame,
  Award,
} from 'lucide-react';
import { api } from '../../lib/api';
import { LingLing } from '../ui/LingLing';

interface WeeklyReport {
  id: string;
  userId: string;
  weekNumber: string;
  title: string;
  summary: string;
  progressPoints: string[];
  weaknesses: string[];
  actionPlan: string[];
  generatedAt: string;
}

interface StudyPlanTask {
  id: string;
  text: string;
  completed: boolean;
}

interface StudyPlanDay {
  day: number;
  dayLabel: string;
  focus: string;
  tasks: StudyPlanTask[];
}

interface StudyPlan {
  goal: string;
  goalLabel: string;
  days: StudyPlanDay[];
  updatedAt: string;
}

interface AnomalyExplanation {
  metricKey: string;
  metricLabel: string;
  explanation: string;
  recommendation: string;
}

const DEFAULT_STUDY_PLAN: StudyPlan = {
  goal: 'ielts',
  goalLabel: 'Mục tiêu IELTS (6.5 - 7.5)',
  updatedAt: new Date().toISOString(),
  days: [
    {
      day: 1,
      dayLabel: 'Ngày 1 (Thứ Hai)',
      focus: 'Khởi động & Củng cố từ vựng cốt lõi',
      tasks: [
        { id: 't1_1', text: 'Ôn tập 10 flashcard trong hàng đợi SRS', completed: false },
        { id: 't1_2', text: 'Học cụm từ chủ đề Sustainable Development', completed: false },
      ],
    },
    {
      day: 2,
      dayLabel: 'Ngày 2 (Thứ Ba)',
      focus: 'Khắc phục điểm yếu: Kỹ năng Nghe & Nói',
      tasks: [
        { id: 't2_1', text: 'Luyện 15 phút phản xạ phát âm với Shadowing Lab', completed: false },
        { id: 't2_2', text: 'Ghi chép 3 cụm từ mới vào sổ tay', completed: false },
      ],
    },
    {
      day: 3,
      dayLabel: 'Ngày 3 (Thứ Tư)',
      focus: 'Luyện tập phản xạ nghe hiểu hội thoại',
      tasks: [
        { id: 't3_1', text: 'Thử tài cùng Bò Đọc Trộm (Phòng Nghe Lén)', completed: false },
        { id: 't3_2', text: 'Hoàn thành mini-test 5 câu trắc nghiệm', completed: false },
      ],
    },
    {
      day: 4,
      dayLabel: 'Ngày 4 (Thứ Năm)',
      focus: 'Ôn tập từ vựng hay quên',
      tasks: [
        { id: 't4_1', text: 'Rà soát danh sách từ hay quên cùng Bò LingLing', completed: false },
        { id: 't4_2', text: 'Đặt 2 câu ví dụ thực tế với từ vựng mới', completed: false },
      ],
    },
    {
      day: 5,
      dayLabel: 'Ngày 5 (Thứ Sáu)',
      focus: 'Thực hành kỹ năng giao tiếp',
      tasks: [
        { id: 't5_1', text: 'Luyện giao tiếp cùng Chatbot LingLing 10 phút', completed: false },
        { id: 't5_2', text: 'Thực hành ngữ điệu hội thoại tự nhiên', completed: false },
      ],
    },
    {
      day: 6,
      dayLabel: 'Ngày 6 (Thứ Bảy)',
      focus: 'Thử thách cuối tuần tổng hợp',
      tasks: [
        { id: 't6_1', text: 'Hoàn thành 1 bài đọc hiểu IELTS Mini Passage', completed: false },
        { id: 't6_2', text: 'Chơi 1 ván mini-game ghép từ tốc độ', completed: false },
      ],
    },
    {
      day: 7,
      dayLabel: 'Ngày 7 (Chủ Nhật)',
      focus: 'Tổng kết tuần & Tự thưởng',
      tasks: [
        { id: 't7_1', text: 'Xem Báo cáo Bò LingLing tổng kết tuần', completed: false },
        { id: 't7_2', text: 'Thưởng cho bản thân một cốc trà sữa 🧋', completed: false },
      ],
    },
  ],
};

export function CowWeeklyReportCard() {
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [history, setHistory] = useState<WeeklyReport[]>([]);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(DEFAULT_STUDY_PLAN);
  const [selectedGoal, setSelectedGoal] = useState<string>('ielts');
  const [loadingReport, setLoadingReport] = useState<boolean>(true);
  const [generatingReport, setGeneratingReport] = useState<boolean>(false);
  const [generatingPlan, setGeneratingPlan] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [activeDayTab, setActiveDayTab] = useState<number>(1);
  const [aiError, setAiError] = useState<string | null>(null);

  // Anomaly modal state
  const [selectedMetric, setSelectedMetric] = useState<string>('listening');
  const [anomalyExplanation, setAnomalyExplanation] = useState<AnomalyExplanation | null>(null);
  const [loadingAnomaly, setLoadingAnomaly] = useState<boolean>(false);
  const [showAnomalyModal, setShowAnomalyModal] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoadingReport(true);
    setAiError(null);
    try {
      // 1. Load latest weekly report
      const reportRes = await api.getWeeklyReportLatest().catch(() => null);
      if (reportRes?.report) {
        setReport(reportRes.report);
      }

      // 2. Load study plan
      const planRes = await api.getStudyPlan().catch(() => null);
      if (planRes?.plan) {
        setStudyPlan(planRes.plan);
        if (planRes.plan.goal) {
          setSelectedGoal(planRes.plan.goal);
        }
      } else {
        setStudyPlan(DEFAULT_STUDY_PLAN);
      }
    } catch (err: any) {
      setStudyPlan(DEFAULT_STUDY_PLAN);
    } finally {
      setLoadingReport(false);
    }
  }

  // Sinh báo cáo tuần mới
  async function handleGenerateReport(forceNew = true) {
    setGeneratingReport(true);
    setAiError(null);
    try {
      const res = await api.generateWeeklyReport(forceNew);
      if (res.report) {
        setReport(res.report);
      } else if (res.error) {
        setAiError(res.error);
      }
    } catch (err: any) {
      if (err.message?.includes('401') || err.message?.includes('đăng nhập') || err.message?.includes('xác thực')) {
        setAiError('Vui lòng đăng nhập để lưu trữ Báo cáo tuần cá nhân hóa vào tài khoản của bạn.');
      } else {
        setAiError(err.message || 'Không thể kết nối đến máy chủ AI lúc này.');
      }
    } finally {
      setGeneratingReport(false);
    }
  }

  // Mở modal lịch sử
  async function handleOpenHistory() {
    setShowHistoryModal(true);
    try {
      const res = await api.getWeeklyReportHistory(10);
      if (res.reports) {
        setHistory(res.reports);
      }
    } catch (err) {
      console.error('Lỗi khi tải lịch sử:', err);
    }
  }

  // Sinh kế hoạch 7 ngày
  async function handleGeneratePlan() {
    setGeneratingPlan(true);
    setAiError(null);
    try {
      const res = await api.generateStudyPlan(selectedGoal, true);
      if (res.plan) {
        setStudyPlan(res.plan);
        setActiveDayTab(1);
      } else if (res.error) {
        setStudyPlan(DEFAULT_STUDY_PLAN);
      }
    } catch (err: any) {
      setStudyPlan(DEFAULT_STUDY_PLAN);
      if (err.message?.includes('401') || err.message?.includes('đăng nhập') || err.message?.includes('xác thực')) {
        setAiError('Vui lòng đăng nhập để lưu kế hoạch học tập 7 ngày cá nhân hóa vào tài khoản của bạn.');
      } else {
        setAiError('Đã kích hoạt lộ trình học tập 7 ngày chuẩn từ Bò LingLing!');
      }
    } finally {
      setGeneratingPlan(false);
    }
  }

  // Toggle checklist task
  async function handleToggleTask(taskId: string, currentCompleted: boolean) {
    if (!studyPlan) return;
    const newCompleted = !currentCompleted;

    // Optimistic update
    setStudyPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        days: prev.days.map((d) => ({
          ...d,
          tasks: d.tasks.map((t) => (t.id === taskId ? { ...t, completed: newCompleted } : t)),
        })),
      };
    });

    try {
      await api.toggleStudyPlanTask(taskId, newCompleted);
    } catch (err) {
      console.error('Lỗi toggle task:', err);
      // Revert on error
      loadData();
    }
  }

  // Yêu cầu giải thích chỉ số sụt giảm
  async function handleExplainAnomaly(metricKey: string) {
    setSelectedMetric(metricKey);
    setShowAnomalyModal(true);
    setLoadingAnomaly(true);
    setAnomalyExplanation(null);
    try {
      const res = await api.explainAnomaly(metricKey);
      if (res.explanation) {
        setAnomalyExplanation(res.explanation);
      } else if (res.error) {
        setAiError(res.error);
      }
    } catch (err: any) {
      setAiError(err.message || 'Không thể phân tích nguyên nhân lúc này.');
    } finally {
      setLoadingAnomaly(false);
    }
  }

  // Tính tiến độ hoàn thành tuần của checklist
  const totalTasks = studyPlan?.days.reduce((acc, d) => acc + d.tasks.length, 0) || 0;
  const completedTasks =
    studyPlan?.days.reduce((acc, d) => acc + d.tasks.filter((t) => t.completed).length, 0) || 0;
  const planProgressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 1. BÁO CÁO BÒ HÀNG TUẦN (WEEKLY COW REPORT) */}
      <div className="bg-card border-2 border-ink rounded-3xl p-5 sm:p-7 shadow-brutal space-y-6 relative overflow-hidden">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-ink-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow border-2 border-ink flex items-center justify-center shadow-brutal-sm text-2xl">
              🐮
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue/15 text-blue border border-blue/30">
                  AI Gemini V2
                </span>
                <span className="text-xs font-bold text-ink-muted">
                  {report ? `Tuần: ${report.weekNumber}` : 'Báo cáo hàng tuần'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-ink font-sans tracking-tight">
                Báo cáo Tuần từ Bò LingLing
              </h2>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleOpenHistory}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-paper-2 hover:bg-[#EAE0CB] border-2 border-ink rounded-xl text-xs font-black text-ink shadow-brutal-sm transition-all"
            >
              <History className="w-4 h-4" />
              <span>Lịch sử</span>
            </button>

            <button
              onClick={() => handleGenerateReport(true)}
              disabled={generatingReport}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-yellow hover:bg-yellow-deep disabled:opacity-60 border-2 border-ink rounded-xl text-xs font-black text-ink shadow-brutal-sm hover:translate-y-[-1px] transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${generatingReport ? 'animate-spin' : ''}`} />
              <span>{generatingReport ? 'Đang chấm điểm...' : 'Tạo báo cáo mới 🐮'}</span>
            </button>
          </div>
        </div>

        {/* AI Error Warning */}
        {aiError && (
          <div className="p-3.5 bg-red/10 border-2 border-red rounded-2xl text-xs font-bold text-red flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{aiError}</span>
          </div>
        )}

        {/* Loading state */}
        {loadingReport ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-yellow border-t-ink rounded-full animate-spin" />
            <p className="text-xs font-bold text-ink-muted">Bò LingLing đang lật sổ tổng hợp số liệu tuần...</p>
          </div>
        ) : report ? (
          /* Report Content */
          <div className="space-y-6">
            {/* Mascot Speech Banner */}
            <div className="bg-paper-2 border-2 border-ink rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center gap-4 shadow-brutal-sm">
              <div className="flex-shrink-0">
                <LingLing reaction="party" size={88} animate />
              </div>
              <div className="space-y-1.5 text-center md:text-left flex-1">
                <h3 className="text-base sm:text-lg font-black text-ink">
                  {report.title}
                </h3>
                <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                  {report.summary}
                </p>
                <div className="text-[11px] text-ink-muted font-bold pt-1">
                  Đã lưu vào hồ sơ lúc {new Date(report.generatedAt).toLocaleString('vi-VN')}
                </div>
              </div>
            </div>

            {/* 3 Columns: Tiến bộ / Điểm yếu / Kế hoạch */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Tiến bộ */}
              <div className="bg-[#F0FDF4] border-2 border-ink rounded-2xl p-4 space-y-3 shadow-brutal-sm flex flex-col">
                <div className="flex items-center gap-2 pb-2 border-b border-ink/10">
                  <div className="w-7 h-7 rounded-lg bg-green-500 border border-ink flex items-center justify-center text-white">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-ink">
                      Tiến Bộ Nổi Bật
                    </h4>
                    <span className="text-[10px] text-ink-muted font-bold">Khen thưởng từ Bò</span>
                  </div>
                </div>
                <ul className="space-y-2 text-xs font-medium text-ink flex-1">
                  {report.progressPoints?.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 2: Điểm yếu & Cần lưu ý */}
              <div className="bg-[#FFFBEB] border-2 border-ink rounded-2xl p-4 space-y-3 shadow-brutal-sm flex flex-col">
                <div className="flex items-center justify-between pb-2 border-b border-ink/10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 border border-ink flex items-center justify-center text-white">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-ink">
                        Điểm Cần Lưu Ý
                      </h4>
                      <span className="text-[10px] text-ink-muted font-bold">Chấn chỉnh ngay</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleExplainAnomaly('weakestSkill')}
                    className="text-[10px] font-black text-amber-700 bg-amber-200/60 hover:bg-amber-300 px-2 py-0.5 rounded border border-amber-600 transition-colors"
                  >
                    Hỏi Bò 🔍
                  </button>
                </div>
                <ul className="space-y-2 text-xs font-medium text-ink flex-1">
                  {report.weaknesses?.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 3: Kế hoạch hành động */}
              <div className="bg-[#EFF6FF] border-2 border-ink rounded-2xl p-4 space-y-3 shadow-brutal-sm flex flex-col">
                <div className="flex items-center gap-2 pb-2 border-b border-ink/10">
                  <div className="w-7 h-7 rounded-lg bg-blue border border-ink flex items-center justify-center text-white">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-ink">
                      Kế Hoạch Tuần Tới
                    </h4>
                    <span className="text-[10px] text-ink-muted font-bold">Nhiệm vụ trọng tâm</span>
                  </div>
                </div>
                <ul className="space-y-2 text-xs font-medium text-ink flex-1">
                  {report.actionPlan?.map((a, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State khi chưa sinh báo cáo */
          <div className="py-10 text-center space-y-3">
            <div className="inline-block">
              <LingLing reaction="magnify" size={80} />
            </div>
            <h3 className="text-base font-black text-ink">Bạn chưa có Báo cáo Bò tuần này</h3>
            <p className="text-xs text-ink-muted max-w-md mx-auto">
              Bò LingLing đã sẵn sàng đối chiếu giờ vàng, từ vựng hay quên và điểm yếu để chấm điểm cho bạn.
            </p>
            <div>
              <button
                onClick={() => handleGenerateReport(false)}
                disabled={generatingReport}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow hover:bg-yellow-deep border-2 border-ink rounded-xl text-xs font-black text-ink shadow-brutal transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Chấm điểm & Sinh Báo Cáo Ngay</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. KẾ HOẠCH HỌC 7 NGÀY CÁ NHÂN HÓA (7-DAY PERSONALIZED STUDY PLAN) */}
      <div className="bg-card border-2 border-ink rounded-3xl p-5 sm:p-7 shadow-brutal space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-ink-muted/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-500/15 text-green-700 border border-green-500/30">
                Nhiệm vụ tương tác 7 ngày
              </span>
              <span className="text-xs font-bold text-ink-muted">
                {studyPlan ? studyPlan.goalLabel : 'Kế hoạch học tập 7 ngày'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-ink font-sans tracking-tight">
              Kế Hoạch Học 7 Ngày Cá Nhân Hóa
            </h2>
          </div>

          {/* Goal Selector & Generate button */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="px-3 py-2 bg-paper-2 border-2 border-ink rounded-xl text-xs font-black text-ink shadow-brutal-sm focus:outline-none"
            >
              <option value="ielts">Mục tiêu IELTS (6.5 - 7.5)</option>
              <option value="toeic">Mục tiêu TOEIC (700+)</option>
              <option value="communication">Giao tiếp hàng ngày</option>
              <option value="general">Cải thiện toàn diện</option>
            </select>

            <button
              onClick={handleGeneratePlan}
              disabled={generatingPlan}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue hover:bg-blue-600 text-white disabled:opacity-60 border-2 border-ink rounded-xl text-xs font-black shadow-brutal-sm transition-all"
            >
              <Target className={`w-4 h-4 ${generatingPlan ? 'animate-spin' : ''}`} />
              <span>{generatingPlan ? 'Đang lập kế hoạch...' : 'Lập kế hoạch mới'}</span>
            </button>
          </div>
        </div>

        {/* Checklist Progress Bar */}
        {studyPlan && totalTasks > 0 && (
          <div className="space-y-1.5 bg-paper-2 border-2 border-ink rounded-2xl p-4">
            <div className="flex justify-between items-center text-xs font-black">
              <span className="text-ink flex items-center gap-1.5">
                <Award className="w-4 h-4 text-yellow-deep" />
                <span>Tiến độ hoàn thành 7 ngày</span>
              </span>
              <span className="font-mono text-ink">
                {completedTasks}/{totalTasks} nhiệm vụ ({planProgressPercent}%)
              </span>
            </div>
            <div className="h-3 w-full bg-card border-2 border-ink rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${planProgressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* 7-Day Day Tabs */}
        {studyPlan && studyPlan.days.length > 0 ? (
          <div className="space-y-4">
            {/* Day Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {studyPlan.days.map((d) => {
                const dayCompleted = d.tasks.every((t) => t.completed);
                const isActive = activeDayTab === d.day;
                return (
                  <button
                    key={d.day}
                    onClick={() => setActiveDayTab(d.day)}
                    className={`py-2.5 px-2 rounded-xl border-2 text-center transition-all ${
                      isActive
                        ? 'bg-yellow border-ink font-black text-ink shadow-brutal-sm -translate-y-0.5'
                        : 'bg-paper-2 border-ink-muted/50 font-bold text-ink-soft hover:bg-paper-2/80'
                    }`}
                  >
                    <div className="text-[11px] uppercase tracking-wider">Ngày {d.day}</div>
                    <div className="text-xs truncate flex items-center justify-center gap-1 mt-0.5">
                      {dayCompleted && <CheckCircle2 className="w-3 h-3 text-green-600 inline" />}
                      <span>{d.tasks.filter((t) => t.completed).length}/{d.tasks.length}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Day Content */}
            {(() => {
              const currentDay = studyPlan.days.find((d) => d.day === activeDayTab) || studyPlan.days[0];
              if (!currentDay) return null;
              return (
                <div className="bg-paper-2 border-2 border-ink rounded-2xl p-5 space-y-4 shadow-brutal-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-ink/10">
                    <div>
                      <h3 className="text-base font-black text-ink">
                        {currentDay.dayLabel}
                      </h3>
                      <p className="text-xs font-bold text-blue mt-0.5">
                        🎯 Trọng tâm: {currentDay.focus}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-ink-muted">
                      {currentDay.tasks.filter((t) => t.completed).length} / {currentDay.tasks.length} đã xong
                    </span>
                  </div>

                  {/* Tasks Checklist */}
                  <div className="space-y-2.5">
                    {currentDay.tasks.map((task) => (
                      <label
                        key={task.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          task.completed
                            ? 'bg-green-500/10 border-green-600/40 opacity-75'
                            : 'bg-card border-ink hover:bg-card/90 shadow-brutal-sm'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task.id, task.completed)}
                          className="w-4 h-4 mt-0.5 rounded border-2 border-ink text-green-600 focus:ring-0 cursor-pointer accent-green-600"
                        />
                        <span
                          className={`text-xs font-semibold text-ink leading-relaxed ${
                            task.completed ? 'line-through text-ink-muted' : ''
                          }`}
                        >
                          {task.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="py-8 text-center space-y-2">
            <p className="text-xs font-bold text-ink-muted">
              Bấm nút "Lập kế hoạch mới" bên trên để Bò LingLing sinh lộ trình 7 ngày cá nhân hóa cho bạn!
            </p>
          </div>
        )}
      </div>

      {/* 3. MODAL GIẢI THÍCH BẤT THƯỜNG CHỈ SỐ (ANOMALY EXPLANATION MODAL) */}
      {showAnomalyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border-2 border-ink rounded-3xl max-w-lg w-full p-6 shadow-brutal space-y-5 relative">
            <button
              onClick={() => setShowAnomalyModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-ink bg-paper-2 hover:bg-paper-2/80 flex items-center justify-center text-ink"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-ink flex items-center justify-center text-xl">
                🔍
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-700">
                  Phân tích nguyên nhân
                </span>
                <h3 className="text-lg font-black text-ink">
                  Bò LingLing Giải Thích Bất Thường
                </h3>
              </div>
            </div>

            {loadingAnomaly ? (
              <div className="py-8 flex flex-col items-center justify-center gap-3">
                <LingLing reaction="thinking" size={72} animate />
                <p className="text-xs font-bold text-ink-muted">
                  Bò LingLing đang đối chiếu dữ liệu điểm số và giờ vàng...
                </p>
              </div>
            ) : anomalyExplanation ? (
              <div className="space-y-4">
                <div className="bg-paper-2 border-2 border-ink rounded-2xl p-4 flex gap-3 items-start">
                  <div className="flex-shrink-0">
                    <LingLing reaction="facepalm" size={64} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-black uppercase text-ink-muted">
                      Nguyên nhân khả thi:
                    </span>
                    <p className="text-xs text-ink leading-relaxed">
                      {anomalyExplanation.explanation}
                    </p>
                  </div>
                </div>

                <div className="bg-[#EFF6FF] border-2 border-ink rounded-2xl p-4 space-y-1">
                  <span className="text-[11px] font-black uppercase text-blue">
                    Đề xuất khắc phục ngay:
                  </span>
                  <p className="text-xs text-ink leading-relaxed font-medium">
                    {anomalyExplanation.recommendation}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="pt-2">
              <button
                onClick={() => setShowAnomalyModal(false)}
                className="w-full py-2.5 bg-yellow hover:bg-yellow-deep border-2 border-ink rounded-xl text-xs font-black text-ink shadow-brutal-sm"
              >
                Đã hiểu, cảm ơn Bò LingLing!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL LỊCH SỬ BÁO CÁO (HISTORY MODAL) */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border-2 border-ink rounded-3xl max-w-xl w-full p-6 shadow-brutal space-y-5 relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setShowHistoryModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-ink bg-paper-2 hover:bg-paper-2/80 flex items-center justify-center text-ink"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow border-2 border-ink flex items-center justify-center text-xl">
                📜
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-ink-muted">Lịch sử lưu trữ</span>
                <h3 className="text-lg font-black text-ink">Báo Cáo Bò Các Tuần Trước</h3>
              </div>
            </div>

            <div className="overflow-y-auto space-y-3 pr-1 flex-1">
              {history.length > 0 ? (
                history.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => {
                      setReport(h);
                      setShowHistoryModal(false);
                    }}
                    className="p-4 bg-paper-2 hover:bg-[#EAE0CB] border-2 border-ink rounded-2xl cursor-pointer transition-all space-y-1.5 shadow-brutal-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-blue">{h.weekNumber}</span>
                      <span className="text-[10px] text-ink-muted">
                        {new Date(h.generatedAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-ink">{h.title}</h4>
                    <p className="text-xs text-ink-soft line-clamp-2">{h.summary}</p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs font-bold text-ink-muted">
                  Chưa có lịch sử báo cáo nào khác.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL GIẢI THÍCH CHỈ SỐ BẤT THƯỜNG / ĐIỂM YẾU TỪ BÒ LINGLING */}
      {showAnomalyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border-2 border-ink rounded-3xl max-w-lg w-full p-6 shadow-brutal space-y-4 relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setShowAnomalyModal(false)}
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
              {loadingAnomaly ? (
                <div className="py-10 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-4 border-yellow border-t-ink rounded-full animate-spin" />
                  <p className="text-xs font-bold text-ink-muted">Bò LingLing đang đối chiếu nhật ký học tập để tìm nguyên nhân...</p>
                </div>
              ) : anomalyExplanation ? (
                <div className="space-y-3.5">
                  <div className="p-3 bg-paper-2 border-2 border-ink rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-black text-ink">Chỉ số phân tích:</span>
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-red text-white border border-ink">
                      {anomalyExplanation.metricLabel || selectedMetric}
                    </span>
                  </div>

                  <div className="bg-[#FFF4E5] border-2 border-ink rounded-2xl p-4 space-y-2">
                    <h4 className="text-xs font-black uppercase text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                      <span>Nguyên nhân sụt giảm / điểm yếu:</span>
                    </h4>
                    <p className="text-xs text-ink leading-relaxed font-medium">
                      {anomalyExplanation.explanation}
                    </p>
                  </div>

                  <div className="bg-[#F0FDF4] border-2 border-ink rounded-2xl p-4 space-y-2">
                    <h4 className="text-xs font-black uppercase text-green-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-700" />
                      <span>Lời khuyên khắc phục từ Bò:</span>
                    </h4>
                    <p className="text-xs text-ink leading-relaxed font-medium">
                      {anomalyExplanation.recommendation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-paper-2 border-2 border-dashed border-ink/40 rounded-2xl text-center text-xs font-bold text-ink-muted">
                  Không tìm thấy dữ liệu bất thường đáng ngại cho chỉ số này. Bạn vẫn đang học tập ổn định!
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-ink/15 flex justify-end">
              <button
                onClick={() => setShowAnomalyModal(false)}
                className="btn btn-ink text-xs font-black px-4 py-2 cursor-pointer"
              >
                Đã hiểu, cảm ơn Bò 🐮
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
