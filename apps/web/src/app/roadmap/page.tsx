'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Compass,
  CheckCircle2,
  Lock,
  Play,
  ArrowRight,
  BookOpen,
  Sparkles,
  Award,
  Clock,
  MapPin,
  Flag,
  RotateCcw,
  Navigation,
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { api } from '../../lib/api';
import { LingLing, LingLingReaction } from '../../components/ui/LingLing';
import { StampSlam } from '../../components/ui/StampSlam';
import { RoadmapErrorBoundary } from '../../components/ui/RoadmapErrorBoundary';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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

const MASCOT_MESSAGES: Record<number, { text: string; pose: LingLingReaction }> = {
  1: { text: 'Chào bạn! Bắt đầu chặng A1 với bài chào hỏi nhé! 🎒', pose: 'pointYou' },
  2: { text: 'Chặng A2 đang rực cháy! Tiếp tục giữ phong độ nào! 🔥', pose: 'magnify' },
  3: { text: 'Sắp tới thế giới B1 với ẩm thực & mua sắm! 🍜', pose: 'thinking' },
  4: { text: 'B1+ công sở & đàm phán, kiến thức siêu giá trị! 💼', pose: 'proud' },
  5: { text: 'B2 độc lập, tự tin du lịch & giao lưu năm châu! ✈️', pose: 'thumbsup' },
  6: { text: 'Nâng cao kỹ năng với học thuật & giao tiếp chuyên sâu! 📚', pose: 'studying' },
  7: { text: 'Khám phá văn hóa & đời sống xã hội đa dạng! 🌍', pose: 'storyteller' },
  8: { text: 'Rèn luyện sức khỏe, dinh dưỡng & lối sống lành mạnh! 🏃', pose: 'flex' },
  9: { text: 'Công nghệ số & truyền thông hiện đại! 💻', pose: 'coolSerious' },
  10: { text: 'Chặng 10: Văn hóa toàn cầu & bảo vệ môi trường! 🌿', pose: 'celebrate' },
  11: { text: 'Tuyệt đỉnh! Bạn đã hoàn thành toàn bộ hành trình! 🏆🎉', pose: 'party' },
};

function CurriculumRoadmapContent() {
  const [units, setUnits] = useState<UnitNode[]>(DEFAULT_UNITS);
  const [pathD, setPathD] = useState<string>('');
  const [pathLength, setPathLength] = useState<number>(0);
  const [activeUnitIndex, setActiveUnitIndex] = useState<number>(2);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [revealedUnits, setRevealedUnits] = useState<Set<number>>(new Set([1, 2]));
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const guidePathRef = useRef<SVGPathElement>(null);
  const travelerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Tải dữ liệu giáo trình thực tế từ server
  useEffect(() => {
    async function loadUnits() {
      try {
        const res = await api.getCurriculumUnits();
        if (res && res.units && res.units.length > 0) {
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

          // ScrollTrigger refresh an toàn sau khi DOM render units thật
          setTimeout(() => {
            try {
              ScrollTrigger.refresh();
            } catch {}
          }, 150);
        }
      } catch {}
    }
    loadUnits();
  }, []);

  // Kiểm tra prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Tính toán tọa độ Sợi chỉ đỏ SVG (Red Thread Path) nối chuẩn qua tâm các node
  const calculateThreadPath = () => {
    try {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;

      const anchors = container.querySelectorAll<HTMLElement>('.journey-node-anchor');
      if (anchors.length === 0) return;

      const points: { x: number; y: number }[] = [];

      // Điểm bắt đầu ở phía trên node đầu tiên
      const firstAnchorRect = anchors[0].getBoundingClientRect();
      const startX = isMobile
        ? firstAnchorRect.left - containerRect.left + firstAnchorRect.width / 2
        : containerRect.width / 2;
      points.push({ x: startX, y: 10 });

      anchors.forEach((anchor) => {
        const rect = anchor.getBoundingClientRect();
        points.push({
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        });
      });

      // Điểm kết thúc ở card đích (tiếp giáp viền trên để nét chỉ đỏ không đâm xuyên tiêu đề)
      const finishEl = container.querySelector<HTMLElement>('#destination-anchor');
      if (finishEl) {
        const finishRect = finishEl.getBoundingClientRect();
        points.push({
          x: finishRect.left - containerRect.left + finishRect.width / 2,
          y: finishRect.top - containerRect.top + 16,
        });
      } else {
        const last = points[points.length - 1];
        if (last) {
          points.push({ x: last.x, y: last.y + 160 });
        }
      }

      if (points.length < 2) return;

      // Vẽ đường cong Bezier bậc ba mượt mà như đường chỉ thêu
      let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const dy = (p2.y - p1.y) * 0.52;
        d += ` C ${p1.x.toFixed(1)} ${(p1.y + dy).toFixed(1)}, ${p2.x.toFixed(1)} ${(p2.y - dy).toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      }

      setPathD(d);
    } catch (err) {
      console.warn('calculateThreadPath failed safely:', err);
    }
  };

  // Cập nhật path khi mount, resize hoặc đổi units
  useEffect(() => {
    calculateThreadPath();
    const handleResize = () => calculateThreadPath();
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(calculateThreadPath, 200);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [units]);

  // Cập nhật độ dài đường path sau khi setPathD (chỉ set khi pathD hợp lệ)
  useEffect(() => {
    if (pathRef.current && pathD) {
      try {
        const len = pathRef.current.getTotalLength();
        if (typeof len === 'number' && !isNaN(len) && len > 0) {
          setPathLength(len);
        }
      } catch (err) {
        console.warn('getTotalLength failed safely:', err);
      }
    }
  }, [pathD]);

  // Thiết lập Scrollytelling bằng GSAP + ScrollTrigger với gsap.context (an toàn với SSR & re-renders)
  useEffect(() => {
    if (typeof window === 'undefined' || isReducedMotion) return;
    // Guard tuyệt đối: KHÔNG chạy khi pathD rỗng hoặc pathLength <= 0 để tránh ném InvalidStateError getPointAtLength
    if (!containerRef.current || !pathRef.current || !pathD || pathLength <= 0) return;

    const path = pathRef.current;
    let fallbackTimer: NodeJS.Timeout;

    // Dùng gsap.context để quản lý scope và cleanup triệt để mọi ScrollTrigger và tweens
    const ctx = gsap.context(() => {
      try {
        gsap.set(path, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        // 1. Chỉ đỏ vẽ dần theo vị trí scroll (scrub: 0.6) + Bò LingLing di chuyển bám sát sợi chỉ
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top 40%',
          end: 'bottom 85%',
          scrub: 0.6,
          onUpdate: (self) => {
            try {
              const progress = Math.max(0, Math.min(1, self.progress));
              setScrollProgress(Math.round(progress * 100));

              // Vẽ dần nét chỉ
              if (path && pathLength > 0) {
                const offset = pathLength * (1 - progress);
                path.style.strokeDashoffset = `${offset}`;
              }

              // Di chuyển bò LingLing an toàn tuyệt đối theo getPointAtLength
              if (travelerRef.current && path && pathLength > 0) {
                const dAttr = path.getAttribute('d');
                if (dAttr && dAttr.trim().length > 5) {
                  const distance = Math.max(0, Math.min(progress * pathLength, pathLength));
                  const pt = path.getPointAtLength(distance);
                  if (pt && typeof pt.x === 'number' && typeof pt.y === 'number' && !isNaN(pt.x) && !isNaN(pt.y)) {
                    travelerRef.current.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) translate(-50%, -50%)`;
                    travelerRef.current.style.opacity = progress >= 0.95 ? '0' : '1';
                  }
                }
              }

              // Cập nhật stage hiển thị trên Hộ Chiếu Hành Trình theo số lượng units thực tế
              const totalUnits = Math.max(1, units.length);
              if (progress >= 0.98) {
                setActiveUnitIndex(totalUnits + 1); // Destination
              } else {
                const calculatedIdx = Math.min(totalUnits, Math.floor(progress * totalUnits) + 1);
                setActiveUnitIndex(calculatedIdx);
              }
            } catch (onUpdateErr) {
              // Phòng vệ an toàn nếu SVG path đang recalculate
            }
          },
        });

        // 2. Reveal các card chặng khi đi vào viewport (trượt nhẹ + hiện dần) + đóng dấu
        cardRefs.current.forEach((card, idx) => {
          if (!card) return;
          const unitOrder = idx + 1;

          try {
            // GSAP chủ động set opacity ban đầu và trượt lên khi vào màn hình
            gsap.set(card, { opacity: 0, y: 35 });

            ScrollTrigger.create({
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
              onEnter: () => {
                gsap.to(card, {
                  opacity: 1,
                  y: 0,
                  duration: 0.7,
                  ease: 'power2.out',
                });
                setRevealedUnits((prev) => new Set(prev).add(unitOrder));
              },
            });
          } catch (cardTriggerErr) {
            // Fallback an toàn: nếu ScrollTrigger lỗi, hiện card ngay
            if (card) {
              card.style.opacity = '1';
              card.style.transform = 'none';
            }
          }
        });
      } catch (gsapInitErr) {
        console.warn('GSAP ScrollTrigger context setup failed safely:', gsapInitErr);
      }

      // Cơ chế an toàn (Fallback): sau 800ms tự động reveal mọi card nếu ScrollTrigger chưa bắn
      fallbackTimer = setTimeout(() => {
        cardRefs.current.forEach((card, idx) => {
          if (card && card.style.opacity === '0') {
            card.style.opacity = '1';
            card.style.transform = 'none';
            setRevealedUnits((prev) => new Set(prev).add(idx + 1));
          }
        });
      }, 800);
    }, containerRef);

    return () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      ctx.revert(); // Triệt tiêu 100% ScrollTrigger và listener khi re-render
    };
  }, [pathD, pathLength, isReducedMotion, units]);

  // Cuộn mượt tới chặng mong muốn
  const scrollToUnit = (order: number) => {
    const target = document.getElementById(`unit-stage-${order}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const currentMascotMsg = MASCOT_MESSAGES[activeUnitIndex] || MASCOT_MESSAGES[2] || {
    text: 'Cùng khám phá hành trình tiếng Anh nào! 🔥',
    pose: 'pointYou' as LingLingReaction,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10 pb-32 text-left relative">
      {/* 1. Header sổ tay: Bản đồ lộ trình học tập */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative overflow-hidden">
        {/* Nếp gấp gáy sổ tay */}
        <div className="absolute top-0 left-0 bottom-0 w-3 bg-red/10 border-r border-ink/20 pointer-events-none" />

        <div className="space-y-3 max-w-xl pl-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-teal">
            <Compass className="w-3.5 h-3.5" />
            <span>Hành Trình Cuộn Tương Tác</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-ink tracking-tight font-sans">
            Hành trình Lộ trình Sổ tay Lingual
          </h1>

          <p className="text-xs sm:text-sm text-ink-soft leading-relaxed font-sans">
            Cuộn trang để theo chân sợi chỉ đỏ và chú bò LingLing qua 5 chặng luyện tiếng Anh thực tế từ A1 đến B2. Mỗi bước chân ghi dấu một nấc thang tiến bộ.
          </p>
        </div>

        <div className="flex flex-col items-center flex-shrink-0">
          <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink max-w-[200px] text-center">
            {isReducedMotion
              ? 'Chế độ tĩnh: sẵn sàng khám phá lộ trình!'
              : 'Cuộn xuống để cùng tớ bước đi trên sợi chỉ đỏ!'}
          </div>
          <LingLing reaction={currentMascotMsg.pose} size={105} animate={!isReducedMotion} />
        </div>
      </div>

      {/* 2. Layout chính: Timeline hành trình + Hộ chiếu sticky */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        {/* CỘT TIMELINE SCROLLYTELLING (8 CỘT DESKTOP) */}
        <div ref={containerRef} className="lg:col-span-8 relative min-h-[1600px] pb-16">
          {/* SỢI CHỈ ĐỎ SVG UỐN LƯỢN XUYÊN SUỐT TRANG */}
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
            aria-hidden="true"
          >
            {/* Đường nét đứt màu chì tượng trưng cho vết may kim định sẵn trên trang giấy */}
            <path
              ref={guidePathRef}
              d={pathD}
              stroke="#211A13"
              strokeOpacity="0.18"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              fill="none"
              strokeLinecap="round"
            />

            {/* Sợi chỉ đỏ chính: VẼ DẦN THEO VỊ TRÍ SCROLL (scrub: true) */}
            <path
              ref={pathRef}
              d={pathD}
              stroke="#D64027"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                strokeDasharray: pathLength,
                strokeDashoffset: isReducedMotion ? 0 : pathLength,
                transition: isReducedMotion ? 'none' : undefined,
              }}
            />
          </svg>

          {/* BÒ LINGLING ĐỒNG HÀNH: ĐI DỌC ĐÚNG THEO SỢI CHỈ ĐỎ BÁM TIẾN ĐỘ SCROLL */}
          {!isReducedMotion && (
            <div
              ref={travelerRef}
              className="absolute top-0 left-0 z-30 pointer-events-none transition-opacity duration-300 will-change-transform"
              style={{
                transform: 'translate3d(0, 0, 0) translate(-50%, -50%)',
              }}
            >
              <div className="relative flex flex-col items-center">
                {/* Lời nhắn nhỏ của LingLing khi đến từng chặng */}
                <div className="bg-card text-ink border-2 border-ink text-[11px] font-black px-2.5 py-1 rounded-xl shadow-brutal-sm whitespace-nowrap mb-1">
                  {currentMascotMsg.text}
                </div>

                {/* Bò con di chuyển */}
                <div className="w-14 h-14 relative filter drop-shadow-[0_4px_8px_rgba(33,26,19,0.25)]">
                  <LingLing reaction={currentMascotMsg.pose} size={56} animate={true} />
                </div>
              </div>
            </div>
          )}

          {/* DANH SÁCH 5 CHẶNG HỌC TẬP (CARDS XEN KẼ TRÁI / PHẢI) */}
          <div className="space-y-24 sm:space-y-36 relative z-10 pt-8">
            {units.map((unit, index) => {
              const isEven = index % 2 === 0;
              const isCompleted = unit.status === 'COMPLETED';
              const isInProgress = unit.status === 'IN_PROGRESS';
              const isLocked = unit.status === 'LOCKED';
              const isRevealed = isReducedMotion || revealedUnits.has(unit.order);

              return (
                <div
                  key={unit.order}
                  id={`unit-stage-${unit.order}`}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={`relative flex flex-col ${
                    isEven ? 'md:items-start md:pr-12' : 'md:items-end md:pl-12'
                  }`}
                  style={{
                    opacity: 1,
                    transform: 'none',
                  }}
                >
                  {/* Điểm Neo Node Tròn (Anchor để SVG nối chỉ đỏ xuyên qua) */}
                  <div
                    className={`journey-node-anchor w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-ink flex items-center justify-center font-mono font-black text-sm shadow-brutal mb-4 z-20 ${
                      isCompleted
                        ? 'bg-teal text-white'
                        : isInProgress
                        ? 'bg-red text-white animate-pulse'
                        : 'bg-paper-2 text-ink-muted'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 stroke-[3]" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      unit.order
                    )}
                  </div>

                  {/* THẺ CHẶNG SỔ TAY GIẤY */}
                  <div
                    className={`w-full md:w-[92%] card-paper p-5 sm:p-7 rounded-3xl border-2 transition-all relative overflow-visible ${
                      isInProgress
                        ? 'border-4 border-ink bg-card shadow-brutal-xl ring-2 ring-red/30'
                        : isCompleted
                        ? 'border-2 border-ink bg-paper shadow-brutal'
                        : 'border-2 border-ink/40 bg-paper-2 opacity-75 shadow-none'
                    }`}
                  >
                    {/* Con Dấu StampSlam đóng xuống khi hoàn thành chặng */}
                    {isCompleted && isRevealed && (
                      <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 pointer-events-none">
                        <StampSlam
                          text="ĐẠT"
                          subtext="HOÀN THÀNH"
                          variant="circle"
                          color="teal"
                          size="sm"
                          delayMs={isReducedMotion ? 0 : 250}
                        />
                      </div>
                    )}

                    {/* Header chặng */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink/15 pb-3 mb-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-card border border-ink text-ink">
                            {unit.level}
                          </span>

                          {isCompleted && (
                            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded border-2 border-teal text-teal bg-teal/10 -rotate-1">
                              ĐÃ HOÀN THÀNH
                            </span>
                          )}

                          {isInProgress && (
                            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded border-2 border-red text-red bg-red/10 rotate-1 animate-pulse">
                              ĐANG HỌC TIẾP
                            </span>
                          )}

                          {isLocked && (
                            <span className="text-[10px] font-bold text-ink-muted flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              <span>Chưa mở khóa</span>
                            </span>
                          )}
                        </div>

                        <h2 className="text-lg sm:text-xl font-black text-ink tracking-tight font-sans">
                          {unit.title}
                        </h2>
                      </div>

                      <div className="text-xs font-mono font-bold text-ink-muted self-start sm:self-auto">
                        Tiến độ: <strong className="text-ink">{unit.completedLessons}/{unit.totalLessons}</strong> bài
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-ink-soft mb-4 leading-relaxed font-sans">
                      {unit.description}
                    </p>

                    {/* Danh sách bài học con */}
                    <div className="space-y-2 mb-5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-ink-muted block">
                        Các bài học trong chặng này:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {unit.lessons.map((lesson) => (
                          <div
                            key={lesson.order}
                            className={`p-2.5 rounded-xl border flex items-center justify-between gap-1.5 text-xs ${
                              lesson.completed
                                ? 'bg-card border-ink/40 text-ink font-bold'
                                : isLocked
                                ? 'bg-transparent border-dashed border-ink/30 text-ink-muted'
                                : 'bg-paper border-ink text-ink font-bold'
                            }`}
                          >
                            <div className="truncate">
                              <span className="text-ink-muted mr-1">#{lesson.order}</span>
                              <span>{lesson.title}</span>
                            </div>
                            {lesson.completed && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Nút hành động theo trạng thái */}
                    <div className="pt-2 flex items-center justify-between">
                      {isCompleted ? (
                        <Link
                          href="/vocabulary/practice"
                          className="btn btn-outline text-xs font-black shadow-brutal flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Ôn tập lại Unit này</span>
                        </Link>
                      ) : isInProgress ? (
                        <Link
                          href="/listening/practice"
                          className="btn btn-red text-xs font-black shadow-brutal flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Tiếp tục học ngay →</span>
                        </Link>
                      ) : (
                        <div className="text-xs font-bold text-ink-muted flex items-center gap-1.5 italic">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Hoàn thành Unit {unit.order - 1} để mở khóa</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 5. CUỐI HÀNH TRÌNH: TỔNG KẾT NGẮN + CTA + BÒ CELEBRATING + ĐÓNG DẤU HOÀN THÀNH */}
          <div
            id="destination-anchor"
            className="mt-32 pt-8 border-t-2 border-dashed border-ink/30 relative"
          >
            {(() => {
              const allCompleted = units.length > 0 && units.every((u) => u.status === 'COMPLETED');

              if (allCompleted) {
                return (
                  <div className="bg-card border-4 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl relative overflow-visible text-center space-y-6">
                    {/* Con dấu lớn HOÀN THÀNH */}
                    <div className="absolute -top-7 right-6 sm:right-10 z-20 pointer-events-none">
                      <StampSlam
                        text="HOÀN THÀNH"
                        subtext="XUẤT SẮC"
                        variant="circle"
                        color="teal"
                        size="md"
                        delayMs={isReducedMotion ? 0 : 300}
                      />
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-soft border border-ink rounded-full text-xs font-black uppercase tracking-wider text-ink">
                      <Flag className="w-3.5 h-3.5 text-red" />
                      <span>Đích Đến Cuối Cùng Của Giáo Trình</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
                      Chúc mừng bạn đã chinh phục toàn bộ Lộ trình LinguaFlow!
                    </h3>

                    <p className="text-xs sm:text-sm text-ink-soft max-w-xl mx-auto leading-relaxed">
                      Từ chặng A1 khởi đầu đến B2 giao lưu tự tin, bạn đã xây dựng nền tảng vững chắc với các bài học ngữ cảnh thực tế và hàng trăm cụm từ thực dụng.
                    </p>

                    <div className="flex justify-center py-2">
                      <LingLing reaction="party" size={120} animate={!isReducedMotion} />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Link
                        href="/practice"
                        className="btn btn-red text-sm font-black shadow-brutal-lg px-8 py-3.5 flex items-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Ôn tập các kỹ năng nâng cao</span>
                      </Link>

                      <Link
                        href="/dashboard"
                        className="btn btn-outline text-sm font-black shadow-brutal px-6 py-3.5"
                      >
                        <span>Quay về Dashboard</span>
                      </Link>
                    </div>
                  </div>
                );
              }

              return (
                <div className="bg-card border-4 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl relative overflow-visible text-center space-y-6">
                  {/* Con dấu mục tiêu khát vọng */}
                  <div className="absolute -top-7 right-6 sm:right-10 z-20 pointer-events-none">
                    <StampSlam
                      text="MỤC TIÊU"
                      subtext="CHINH PHỤC"
                      variant="circle"
                      color="teal"
                      size="md"
                      delayMs={isReducedMotion ? 0 : 300}
                    />
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-soft border border-ink rounded-full text-xs font-black uppercase tracking-wider text-ink">
                    <Flag className="w-3.5 h-3.5 text-red" />
                    <span>Lộ Trình Toàn Diện 5 Bậc Tiếng Anh</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
                    Sẵn sàng chinh phục toàn bộ Lộ trình LinguaFlow!
                  </h3>

                  <p className="text-xs sm:text-sm text-ink-soft max-w-xl mx-auto leading-relaxed">
                    Từ chặng A1 khởi đầu đến B2 giao lưu tự tin, mỗi bài học hoàn thành đưa bạn gần hơn đến mục tiêu thông thạo tiếng Anh. Hãy duy trì nhịp độ rèn luyện mỗi ngày cùng Bò LingLing nhé!
                  </p>

                  <div className="flex justify-center py-2">
                    <LingLing reaction="pointYou" size={120} animate={!isReducedMotion} />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      href="/practice"
                      className="btn btn-red text-sm font-black shadow-brutal-lg px-8 py-3.5 flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Tiếp tục học chặng tiếp theo ngay</span>
                    </Link>

                    <Link
                      href="/dashboard"
                      className="btn btn-outline text-sm font-black shadow-brutal px-6 py-3.5"
                    >
                      <span>Quay về Dashboard</span>
                    </Link>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* 4. HỘ CHIẾU HÀNH TRÌNH (STICKY PASSPORT SIDEBAR TRÊN DESKTOP) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <div className="card-paper p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-brutal bg-card relative overflow-hidden">
            {/* Ruy-băng đỏ kẹp trang sổ */}
            <div className="absolute -top-3 right-5 w-6 h-10 bg-red border-x-2 border-b-2 border-ink shadow-sm" />

            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red mb-3">
              <Navigation className="w-4 h-4" />
              <span>Hộ Chiếu Hành Trình</span>
            </div>

            {(() => {
              const displayStage = Math.max(1, Math.min(units.length, activeUnitIndex));
              const currentUnit = units[displayStage - 1] || units[0];
              const unitSubtitle = currentUnit?.title?.includes(':')
                ? currentUnit.title.split(':')[1]?.trim()
                : currentUnit?.title || 'Đang khám phá';

              return (
                <h4 className="text-lg font-black text-ink mb-1 font-sans">
                  Chặng {displayStage}/{units.length} · {activeUnitIndex > units.length ? 'Đã về đích' : unitSubtitle}
                </h4>
              );
            })()}

            <p className="text-xs text-ink-soft mb-4">
              Dấu mốc theo bước chân cuộn trang của bạn.
            </p>

            {/* Thước đo tiến độ cuộn trang */}
            <div className="space-y-1.5 mb-5">
              <div className="flex justify-between text-[11px] font-mono font-bold text-ink">
                <span>Tiến độ cuộn:</span>
                <span className="text-red font-black">{scrollProgress}%</span>
              </div>
              <div className="w-full h-3 bg-paper-2 border border-ink rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-red rounded-full transition-all duration-150"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
            </div>

            {/* Ô DẤU VISA TÍCH DẦN THEO SCROLL */}
            <div className="space-y-2 border-t border-ink/15 pt-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-ink-muted block mb-2">
                Dấu thị thực các chặng:
              </span>

              <div className="grid grid-cols-5 gap-2">
                {units.map((u) => {
                  if (!u || typeof u.order !== 'number') return null;
                  const isPassed = activeUnitIndex >= u.order;
                  const isCurrent = activeUnitIndex === u.order;
                  const isCompletedInDb = u.status === 'COMPLETED';

                  return (
                    <button
                      key={u.order}
                      onClick={() => scrollToUnit(u.order)}
                      title={`Cuộn đến ${u.title || `Unit ${u.order}`}`}
                      className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-1 transition-all ${
                        isCurrent
                          ? 'border-red bg-red/10 text-red font-black scale-105 shadow-brutal-sm'
                          : isPassed || isCompletedInDb
                          ? 'border-teal bg-teal/10 text-teal font-black'
                          : 'border-dashed border-ink/30 text-ink-muted hover:border-ink/60'
                      }`}
                    >
                      <span className="text-[10px] font-mono leading-none">U{u.order}</span>
                      {isCompletedInDb || (isPassed && activeUnitIndex > u.order) ? (
                        <CheckCircle2 className="w-3 h-3 mt-1 stroke-[3]" />
                      ) : isCurrent ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-red mt-1 animate-ping" />
                      ) : (
                        <Lock className="w-2.5 h-2.5 mt-1 opacity-50" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nút tắt/bật thông tin hỗ trợ */}
            <div className="mt-5 pt-3 border-t border-ink/15 text-[11px] text-ink-muted space-y-1 font-sans">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal" />
                <span>Unit 1: Đã hoàn thành (+1 tem)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red animate-pulse" />
                <span>Unit 2: Đang học tiếp (Bài 2/3)</span>
              </div>
            </div>

            {/* Nút cuộn nhanh tới chặng đang học tiếp */}
            {(() => {
              const inProgressUnit = units.find((u) => u.status === 'IN_PROGRESS') || units[0];
              const targetOrder = inProgressUnit?.order || 1;
              return (
                <button
                  onClick={() => scrollToUnit(targetOrder)}
                  className="w-full mt-4 btn btn-red text-xs font-black shadow-brutal py-2 flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Chuyển tới chặng đang học</span>
                </button>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CurriculumRoadmapPage() {
  return (
    <RoadmapErrorBoundary fallbackTitle="Lộ trình học tập Sổ tay tạm thời chưa tải xong">
      <CurriculumRoadmapContent />
    </RoadmapErrorBoundary>
  );
}
