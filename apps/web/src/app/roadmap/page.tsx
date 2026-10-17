'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Map,
  CheckCircle2,
  Lock,
  Play,
  ArrowRight,
  BookOpen,
  Sparkles,
  Award,
  Clock,
  Compass,
} from 'lucide-react';
import { api } from '../../lib/api';
import { LingLing } from '../../components/ui/LingLing';

interface Lesson {
  order: number;
  title: string;
  durationMin: number;
  completed?: boolean;
}

interface UnitNode {
  order: number;
  title: string;
  description: string;
  level: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED';
  completedLessons: number;
  totalLessons: number;
  lessons: Lesson[];
}

const DEFAULT_UNITS: UnitNode[] = [
  {
    order: 1,
    title: 'Unit 1: Chào hỏi & Giới thiệu bản thân',
    description: 'Nắm vững các mẫu câu chào hỏi thường ngày, giới thiệu tên tuổi, nghề nghiệp và xuất xứ quốc gia.',
    level: 'A1 · Khởi đầu',
    status: 'COMPLETED',
    completedLessons: 3,
    totalLessons: 3,
    lessons: [
      { order: 1, title: 'Bài 1: Chào hỏi thường ngày (Greetings)', durationMin: 15, completed: true },
      { order: 2, title: 'Bài 2: Nghề nghiệp & Học tập (Occupations)', durationMin: 18, completed: true },
      { order: 3, title: 'Bài 3: Quốc gia & Quốc tịch (Countries)', durationMin: 20, completed: true },
    ],
  },
  {
    order: 2,
    title: 'Unit 2: Cuộc sống thường ngày & Gia đình',
    description: 'Miêu tả nề nếp sinh hoạt mỗi sáng, các hoạt động cuối tuần và cây gia phả gia đình thân thiết.',
    level: 'A2 · Sơ cấp',
    status: 'IN_PROGRESS',
    completedLessons: 1,
    totalLessons: 3,
    lessons: [
      { order: 1, title: 'Bài 1: Nếp sinh hoạt buổi sáng (Morning Routine)', durationMin: 20, completed: true },
      { order: 2, title: 'Bài 2: Cây phả hệ gia đình (Family Tree)', durationMin: 22, completed: false },
      { order: 3, title: 'Bài 3: Hoạt động cuối tuần (Weekend Leisure)', durationMin: 25, completed: false },
    ],
  },
  {
    order: 3,
    title: 'Unit 3: Mua sắm & Ẩm thực nhà hàng',
    description: 'Gọi món bằng tiếng Anh tự nhiên, hỏi giá cả, mặc cả và thanh toán hóa đơn văn minh.',
    level: 'B1 · Trung cấp',
    status: 'LOCKED',
    completedLessons: 0,
    totalLessons: 3,
    lessons: [
      { order: 1, title: 'Bài 1: Thực đơn nhà hàng (Restaurant Menu)', durationMin: 25, completed: false },
      { order: 2, title: 'Bài 2: Hỏi giá & Chiết khấu (Prices & Discounts)', durationMin: 20, completed: false },
      { order: 3, title: 'Bài 3: Nhận xét món ăn (Food Review)', durationMin: 22, completed: false },
    ],
  },
  {
    order: 4,
    title: 'Unit 4: Môi trường công sở & Họp nhóm',
    description: 'Giao tiếp đồng nghiệp, viết thư điện tử công việc và trình bày ý tưởng ngắn gọn trong cuộc họp.',
    level: 'B1+ · Trung cấp cao',
    status: 'LOCKED',
    completedLessons: 0,
    totalLessons: 3,
    lessons: [
      { order: 1, title: 'Bài 1: Thư điện tử chuyên nghiệp (Professional Email)', durationMin: 30, completed: false },
      { order: 2, title: 'Bài 2: Báo cáo tiến độ dự án (Status Update)', durationMin: 25, completed: false },
      { order: 3, title: 'Bài 3: Thảo luận & Đàm phán (Team Discussion)', durationMin: 28, completed: false },
    ],
  },
  {
    order: 5,
    title: 'Unit 5: Du lịch, Văn hóa & Giao lưu quốc tế',
    description: 'Hỏi đường tại sân bay quốc tế, đặt phòng khách sạn và xử lý các tình huống bất ngờ khi du lịch.',
    level: 'B2 · Độc lập',
    status: 'LOCKED',
    completedLessons: 0,
    totalLessons: 3,
    lessons: [
      { order: 1, title: 'Bài 1: Thủ tục sân bay & Hải quan (Airport Procedures)', durationMin: 30, completed: false },
      { order: 2, title: 'Bài 2: Nhận phòng & Hỏi đường (Check-in & Directions)', durationMin: 25, completed: false },
      { order: 3, title: 'Bài 3: Xử lý sự cố du lịch (Travel Emergencies)', durationMin: 30, completed: false },
    ],
  },
];

export default function CurriculumRoadmapPage() {
  const [units, setUnits] = useState<UnitNode[]>(DEFAULT_UNITS);

  useEffect(() => {
    async function loadUnits() {
      try {
        const res = await api.getCurriculumUnits();
        if (res && res.units && res.units.length > 0) {
          // Map DB units into roadmap nodes
          const mapped: UnitNode[] = res.units.map((u: any, idx: number) => {
            const isCompleted = idx === 0;
            const isInProgress = idx === 1;
            return {
              order: u.order || idx + 1,
              title: u.title || `Unit ${idx + 1}`,
              description: u.description || 'Chương trình rèn luyện kỹ năng toàn diện.',
              level: idx === 0 ? 'A1' : idx === 1 ? 'A2' : 'B1',
              status: isCompleted ? 'COMPLETED' : isInProgress ? 'IN_PROGRESS' : 'LOCKED',
              completedLessons: isCompleted ? (u.lessons?.length || 3) : isInProgress ? 1 : 0,
              totalLessons: u.lessons?.length || 3,
              lessons: (u.lessons || []).map((l: any, lIdx: number) => ({
                order: l.order || lIdx + 1,
                title: l.title || `Bài ${lIdx + 1}`,
                durationMin: 20,
                completed: isCompleted || (isInProgress && lIdx === 0),
              })),
            };
          });
          setUnits(mapped);
        }
      } catch {}
    }
    loadUnits();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 pb-28 sm:pb-20 text-left">
      {/* Header bar Bản Đồ Lộ Trình Giáo Trình */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-teal">
            <Compass className="w-3.5 h-3.5" />
            <span>Lộ Trình Giáo Trình</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight font-sans">
            Bản đồ lộ trình học tập Lingual
          </h1>

          <p className="text-xs sm:text-sm text-ink-soft leading-relaxed font-sans">
            Hành trình từng bước làm chủ tiếng Anh từ cơ bản đến nâng cao. Mỗi chặng đường được nối liền như những trang sách mở ra chân trời mới.
          </p>
        </div>

        <div className="flex flex-col items-center flex-shrink-0">
          <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
            Tới lượt bạn chinh phục chặng đường hôm nay!
          </div>
          <LingLing reaction="pointYou" size={110} />
        </div>
      </div>

      {/* BẢN ĐỒ HÀNH TRÌNH CÁC NODE NỐI BẰNG ĐƯỜNG MỰC ĐỨT NÉT */}
      <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:top-4 before:bottom-4 before:left-[19px] sm:before:left-[35px] before:w-0.5 before:border-l-2 before:border-dashed before:border-ink/40">
        {units.map((unit) => {
          const isCompleted = unit.status === 'COMPLETED';
          const isInProgress = unit.status === 'IN_PROGRESS';
          const isLocked = unit.status === 'LOCKED';

          return (
            <div key={unit.order} className="relative group">
              {/* Node Tròn Biểu Tượng Trên Trục Mực */}
              <div
                className={`absolute -left-[27px] sm:-left-[43px] top-6 w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-ink flex items-center justify-center font-mono font-black text-xs sm:text-sm shadow-brutal-sm z-10 ${
                  isCompleted
                    ? 'bg-teal text-white'
                    : isInProgress
                    ? 'bg-red text-white animate-bounce-subtle'
                    : 'bg-paper-2 text-ink-muted'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 stroke-[3]" />
                ) : isLocked ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  unit.order
                )}
              </div>

              {/* Thẻ Unit Giấy */}
              <div
                className={`card-paper p-6 sm:p-8 rounded-3xl border-2 transition-all ${
                  isInProgress
                    ? 'border-4 border-ink bg-card shadow-brutal-xl'
                    : isCompleted
                    ? 'border-2 border-ink bg-paper shadow-brutal'
                    : 'border-2 border-ink/40 bg-paper-2 opacity-65 shadow-none'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/15 pb-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-card border border-ink text-ink">
                        {unit.level}
                      </span>

                      {/* Con Dấu Mực (Stamps) */}
                      {isCompleted && (
                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded border-2 border-teal text-teal bg-teal/10 -rotate-2 inline-block">
                          ĐÃ HOÀN THÀNH
                        </span>
                      )}

                      {isInProgress && (
                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded border-2 border-red text-red bg-red/10 rotate-1 inline-block">
                          ĐANG HỌC DỞ
                        </span>
                      )}

                      {isLocked && (
                        <span className="text-[10px] font-bold text-ink-muted flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Chưa mở khóa</span>
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg sm:text-2xl font-black text-ink tracking-tight font-sans pt-1">
                      {unit.title}
                    </h2>
                  </div>

                  <div className="text-xs font-mono font-bold text-ink-muted self-start sm:self-auto">
                    Tiến độ: <strong className="text-ink">{unit.completedLessons}/{unit.totalLessons}</strong> bài
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-ink-soft mb-5 leading-relaxed font-sans">
                  {unit.description}
                </p>

                {/* Danh sách các bài học con */}
                <div className="space-y-2 mb-6">
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-ink-muted block">
                    Các bài học trong chặng này:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {unit.lessons.map((lesson) => (
                      <div
                        key={lesson.order}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                          lesson.completed
                            ? 'bg-card border-ink/40 text-ink font-bold'
                            : isLocked
                            ? 'bg-transparent border-dashed border-ink/30 text-ink-muted'
                            : 'bg-paper border-ink text-ink font-bold'
                        }`}
                      >
                        <div className="truncate">
                          <span className="text-ink-muted mr-1.5">#{lesson.order}</span>
                          <span>{lesson.title}</span>
                        </div>
                        {lesson.completed && (
                          <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nút Hành Động Theo Trạng Thái */}
                <div className="pt-2 flex items-center justify-between">
                  {isCompleted ? (
                    <Link
                      href="/vocabulary/practice"
                      className="btn btn-outline text-xs font-black shadow-brutal flex items-center gap-2"
                    >
                      <span>Ôn tập lại Unit này</span>
                    </Link>
                  ) : isInProgress ? (
                    <Link
                      href="/listening/practice"
                      className="btn btn-red text-xs font-black shadow-brutal flex items-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Tiếp tục bài 2 ngay →</span>
                    </Link>
                  ) : (
                    <div className="text-xs font-bold text-ink-muted flex items-center gap-1.5 italic">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Hoàn thành Unit {unit.order - 1} để mở khóa chặng này</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
