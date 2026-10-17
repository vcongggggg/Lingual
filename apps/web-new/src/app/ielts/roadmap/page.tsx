'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Target,
  CheckCircle2,
  Clock,
  BookOpen,
  Headphones,
  FileText,
  Mic,
  Play,
  Lock,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { LingLing } from '../../../components/ui/LingLing';

interface Milestone {
  id: string;
  stageNumber: number;
  title: string;
  targetRange: string;
  status: 'completed' | 'active' | 'locked';
  progressPercent: number;
  description: string;
  modules: {
    skill: string;
    task: string;
    icon: any;
  }[];
}

const BAND_TIERS = [
  { band: '5.5', label: 'Band 5.5', code: 'TIER-FND', desc: 'Nền tảng học thuật' },
  { band: '6.5', label: 'Band 6.5', code: 'TIER-ACD', desc: 'Năng lực tiêu chuẩn' },
  { band: '7.5+', label: 'Band 7.5+', code: 'TIER-ADV', desc: 'Làm chủ nâng cao' },
  { band: '8.5+', label: 'Band 8.5+', code: 'TIER-EXP', desc: 'Chuẩn xác bản ngữ' },
];

const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 'stage-1',
    stageNumber: 1,
    title: 'Xây dựng nền tảng học thuật',
    targetRange: 'Band 4.5 → 5.5',
    status: 'completed',
    progressPercent: 100,
    description: 'Củng cố 1.200 từ vựng Academic Word List cơ bản và kỹ năng nghe nhận diện thông tin cụ thể.',
    modules: [
      {
        skill: 'Nghe',
        task: 'Phần 1 & 2: Điền từ vào mẫu đơn & hội thoại đời thường',
        icon: Headphones,
      },
      {
        skill: 'Đọc',
        task: 'Kỹ thuật đọc lướt (Skimming) & Xác định Đúng/Sai/Không có',
        icon: BookOpen,
      },
      {
        skill: 'Viết',
        task: 'Task 1: Cấu trúc biểu đồ đường & mô tả xu hướng tăng giảm',
        icon: FileText,
      },
    ],
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    title: 'Bứt phá kỹ năng & chiến thuật',
    targetRange: 'Band 6.0 → 6.5',
    status: 'active',
    progressPercent: 65,
    description: 'Rèn luyện khả năng phân tích bài đọc 2 cột dài và nghe hiểu bài thảo luận học thuật nhiều người.',
    modules: [
      {
        skill: 'Nghe',
        task: 'Phần 3 & 4: Bài giảng học thuật & gán nhãn bản đồ chi tiết',
        icon: Headphones,
      },
      {
        skill: 'Đọc',
        task: 'Nối tiêu đề đoạn văn (Matching Headings) & Hoàn thành tóm tắt',
        icon: BookOpen,
      },
      {
        skill: 'Viết',
        task: 'Task 2: Bố cục 4 đoạn luận điểm mạch lạc & từ nối liên kết',
        icon: FileText,
      },
    ],
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    title: 'Chinh phục Band điểm cao',
    targetRange: 'Band 7.0 → 7.5+',
    status: 'locked',
    progressPercent: 0,
    description: 'Luyện đề áp lực thời gian thực, viết luận phức hợp và tối ưu độ phong phú ngữ pháp chuẩn Examiner.',
    modules: [
      {
        skill: 'Thi thử',
        task: 'Thi thử toàn bộ 2 kỹ năng Reading & Listening thời gian thực',
        icon: Clock,
      },
      {
        skill: 'Viết',
        task: 'Chấm điểm 4 tiêu chí Band Descriptor với từ vựng chuyên sâu',
        icon: FileText,
      },
      {
        skill: 'Nói',
        task: 'Luyện phản xạ mạch lạc và làm giàu vốn từ theo chủ đề trừu tượng',
        icon: Mic,
      },
    ],
  },
];

export default function IeltsRoadmapPage() {
  const [selectedTier, setSelectedTier] = useState('6.5');
  const [milestones, setMilestones] = useState<Milestone[]>(DEFAULT_MILESTONES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const res = await api.getIeltsRoadmap();
        if (res.success && res.tracks && res.tracks.length > 0) {
          // Merge API tracks descriptions if present
        }
      } catch (err) {
        console.error('Failed to load roadmap API', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRoadmap();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 pb-28 sm:pb-20 text-left">
      {/* Breadcrumb text mực */}
      <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
        <Link
          href="/ielts"
          className="hover:text-red transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Trung tâm IELTS</span>
        </Link>
        <span>/</span>
        <span className="text-ink">Bản đồ hành trình tăng Band</span>
      </div>

      {/* Header Bản Đồ Hành Trình */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-teal">
              <Target className="w-3.5 h-3.5" />
              <span>Bản Đồ Hành Trình · Band Score Roadmap</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight font-sans">
              Kế hoạch bứt phá từng nấc thang điểm số
            </h1>

            <p className="text-sm sm:text-base text-ink-soft leading-relaxed font-sans">
              Lộ trình được chia thành 3 chặng học tập rõ ràng. Vượt qua từng module kỹ năng và hoàn thành bài thi thử để mở khóa nấc thang tiếp theo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 flex-shrink-0">
            <Link
              href="/ielts/mock-test"
              className="btn btn-red text-sm font-black shadow-brutal inline-flex items-center justify-center gap-2 whitespace-nowrap px-6 py-3 flex-shrink-0"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Thi thử toàn bộ</span>
            </Link>
            <LingLing reaction="greet" size={100} className="hidden sm:block" />
          </div>
        </div>

        {/* Band Tiers dạng "Cuống Vé" Giấy Răng Cưa */}
        <div className="pt-6 mt-6 border-t-2 border-dashed border-ink/25 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-ink-muted block">
            Các bậc mục tiêu · Cuống vé chặng hành trình:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BAND_TIERS.map((tier) => {
              const isSelected = selectedTier === tier.band;
              return (
                <button
                  key={tier.band}
                  onClick={() => setSelectedTier(tier.band)}
                  className={`p-3 rounded-2xl border-2 border-dashed text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-red bg-red/10 shadow-brutal-sm text-ink'
                      : 'border-ink/30 bg-card hover:border-ink text-ink-soft'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-black uppercase tracking-wider text-ink-muted">
                      {tier.code}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-red" />
                    )}
                  </div>
                  <div className="text-lg font-black font-sans mt-0.5 text-ink">
                    {tier.label}
                  </div>
                  <span className="text-[11px] font-semibold text-ink-muted block line-clamp-1">
                    {tier.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hành Trình 3 Chặng Nối Nhau Bằng Đường Mực Đứt Nét */}
      <div className="space-y-8 relative">
        {/* Đường mực kẻ dọc nối các chặng (chỉ hiện trên màn hình lớn) */}
        <div className="hidden md:block absolute left-8 top-12 bottom-12 w-0.5 border-l-2 border-dashed border-ink/30 pointer-events-none" />

        {milestones.map((m, idx) => {
          const isCompleted = m.status === 'completed';
          const isActive = m.status === 'active';
          const isLocked = m.status === 'locked';

          return (
            <div
              key={m.id}
              className={`relative bg-card rounded-3xl p-6 sm:p-8 transition-all ${
                isActive
                  ? 'border-4 border-ink shadow-brutal-xl'
                  : isCompleted
                  ? 'border-2 border-teal shadow-brutal bg-paper-2'
                  : 'border-2 border-ink/30 opacity-75'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                {/* Cột Trái: Thông tin Chặng + Badge */}
                <div className="space-y-3 max-w-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full border-2 border-ink bg-paper-2 flex items-center justify-center font-black font-mono text-sm text-ink flex-shrink-0">
                      0{m.stageNumber}
                    </span>

                    <span className="font-mono text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded border border-ink bg-card text-ink">
                      {m.targetRange}
                    </span>

                    {/* Con Dấu Đỏ "ĐÃ HOÀN THÀNH" hoặc "ĐANG HỌC" */}
                    {isCompleted && (
                      <span className="px-3 py-0.5 rounded-full border-2 border-red bg-red/10 text-red text-xs font-black uppercase tracking-wider inline-flex items-center gap-1 -rotate-2 shadow-brutal-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đã hoàn thành</span>
                      </span>
                    )}

                    {isActive && (
                      <span className="px-3 py-0.5 rounded-full border-2 border-ink bg-amber text-ink text-xs font-black uppercase tracking-wider inline-flex items-center gap-1 shadow-brutal-sm">
                        <span>Chặng hiện tại</span>
                      </span>
                    )}

                    {isLocked && (
                      <span className="px-2.5 py-0.5 rounded-full border border-ink/30 text-ink-muted text-xs font-black uppercase tracking-wider inline-flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Chưa mở khóa</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-ink tracking-tight font-sans">
                    Chặng {m.stageNumber}: {m.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-ink-soft leading-relaxed font-sans">
                    {m.description}
                  </p>

                  {/* Vạch Mực Tiến Độ (Ink Progress Bar) */}
                  <div className="space-y-1.5 pt-2 max-w-sm">
                    <div className="flex items-center justify-between text-xs font-black">
                      <span className="text-ink-muted">Tiến độ chặng:</span>
                      <span className="font-mono text-ink">{m.progressPercent}%</span>
                    </div>
                    <div className="w-full h-3 bg-paper-2 border-2 border-ink rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-ink rounded-full transition-all duration-500"
                        style={{ width: `${m.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Cột Phải: Danh Sách Module Kỹ Năng dạng Thẻ Nhỏ */}
                <div className="md:w-80 space-y-2.5 flex-shrink-0">
                  <span className="text-xs font-black uppercase tracking-wider text-ink-muted block">
                    Nhiệm vụ trọng tâm:
                  </span>
                  {m.modules.map((mod, modIdx) => {
                    const ModIcon = mod.icon;
                    return (
                      <div
                        key={modIdx}
                        className="p-3 rounded-xl border border-ink/30 bg-card flex items-start gap-3 text-left shadow-brutal-sm"
                      >
                        <div className="w-7 h-7 rounded-lg border border-ink bg-paper-2 flex items-center justify-center text-ink flex-shrink-0 mt-0.5">
                          <ModIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-teal block">
                            {mod.skill}
                          </span>
                          <p className="text-xs font-bold text-ink leading-tight">
                            {mod.task}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
