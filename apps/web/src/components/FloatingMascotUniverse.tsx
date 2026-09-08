'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, EyeOff, Zap, Plus, RotateCcw, ScrollText, Pin } from 'lucide-react';

interface MascotItem {
  id: string;
  src: string;
  size: 'xs' | 'sm' | 'md' | 'lg';
  x: number; // percentage 3-95
  y: number; // percentage 4-92
  depth: 'far' | 'mid' | 'front';
  floatDuration: number;
  floatDistance: number;
  dialogue: string;
  dragDialogue: string;
  rotateDeg: number;
  warpCount?: number;
}

// 49 Audited & Verified Non-Error Mascot Stickers (Zero Duplicate Hashes, Zero Border Glitches)
export const ALL_VERIFIED_STICKERS: string[] = [
  // 13 Base Mascot Expressions
  '/mascot/cow_greet_heart.png',
  '/mascot/cow_wink_kiss.png',
  '/mascot/cow_salute.png',
  '/mascot/cow_hands_on_hips.png',
  '/mascot/cow_run_side.png',
  '/mascot/cow_cry_soft.png',
  '/mascot/cow_cry_hard.png',
  '/mascot/cow_jump_angry.png',
  '/mascot/cow_serious_closeup.png',
  '/mascot/cow_lying_relaxed.png',
  '/mascot/cow_lying_curled.png',
  '/mascot/cow_back_view.png',
  '/mascot/lingling_waving_bubble.png',

  // 36 Verified Clean Unique Stickers from apps/web/public/mascot/raw/
  '/mascot/raw/mascot_sticker_clean_01.png',
  '/mascot/raw/mascot_sticker_clean_02.png',
  '/mascot/raw/mascot_sticker_clean_03.png',
  '/mascot/raw/mascot_sticker_clean_04.png',
  '/mascot/raw/mascot_sticker_clean_05.png',
  '/mascot/raw/mascot_sticker_clean_06.png',
  '/mascot/raw/mascot_sticker_clean_07.png',
  '/mascot/raw/mascot_sticker_clean_08.png',
  '/mascot/raw/mascot_sticker_clean_09.png',
  '/mascot/raw/mascot_sticker_clean_10.png',
  '/mascot/raw/mascot_sticker_clean_11.png',
  '/mascot/raw/mascot_sticker_clean_12.png',
  '/mascot/raw/mascot_sticker_clean_13.png',
  '/mascot/raw/mascot_sticker_clean_14.png',
  '/mascot/raw/mascot_sticker_clean_15.png',
  '/mascot/raw/mascot_sticker_clean_16.png',
  '/mascot/raw/mascot_sticker_clean_17.png',
  '/mascot/raw/mascot_sticker_clean_18.png',
  '/mascot/raw/mascot_sticker_clean_19.png',
  '/mascot/raw/mascot_sticker_clean_20.png',
  '/mascot/raw/mascot_sticker_clean_21.png',
  '/mascot/raw/mascot_sticker_clean_22.png',
  '/mascot/raw/mascot_sticker_clean_23.png',
  '/mascot/raw/mascot_sticker_clean_24.png',
  '/mascot/raw/mascot_sticker_clean_25.png',
  '/mascot/raw/mascot_sticker_clean_32.png',
  '/mascot/raw/mascot_sticker_clean_33.png',
  '/mascot/raw/mascot_sticker_clean_34.png',
  '/mascot/raw/mascot_sticker_clean_35.png',
  '/mascot/raw/mascot_sticker_clean_36.png',
  '/mascot/raw/mascot_sticker_clean_37.png',
  '/mascot/raw/mascot_sticker_clean_38.png',
  '/mascot/raw/mascot_sticker_clean_39.png',
  '/mascot/raw/mascot_sticker_clean_40.png',
  '/mascot/raw/mascot_sticker_clean_41.png',
  '/mascot/raw/mascot_sticker_clean_42.png',
];

const INITIAL_MASCOTS: MascotItem[] = [
  // ==========================================================================
  // ZONE 1: 3D ORBIT & HERO CENTER (10 Mascots around the 3D Vocab Orbit)
  // ==========================================================================
  {
    id: 'm_orbit_top',
    src: '/mascot/cow_greet_heart.png',
    size: 'lg',
    x: 50,
    y: 9,
    depth: 'front',
    floatDuration: 7.0,
    floatDistance: 16,
    dialogue: 'Đỉnh cao vũ trụ LinguaFlow! 🌌',
    dragDialogue: 'Bò LingLing bay lượn trên đỉnh quỹ đạo! 🚀',
    rotateDeg: 0,
  },
  {
    id: 'm_orbit_left_top',
    src: '/mascot/raw/mascot_sticker_clean_01.png',
    size: 'md',
    x: 23,
    y: 19,
    depth: 'mid',
    floatDuration: 7.8,
    floatDistance: 17,
    dialogue: 'Quỹ đạo từ vựng thông minh SRS! 🪐',
    dragDialogue: 'Cùng khám phá từ vựng mới nào! ✨',
    rotateDeg: -8,
  },
  {
    id: 'm_orbit_right_top',
    src: '/mascot/raw/mascot_sticker_clean_02.png',
    size: 'md',
    x: 77,
    y: 19,
    depth: 'mid',
    floatDuration: 7.5,
    floatDistance: 16,
    dialogue: 'Chạm xoay thẻ bài 3D kỳ diệu! 🃏',
    dragDialogue: 'Lật mở bí quyết tiếng Anh! 💡',
    rotateDeg: 8,
  },
  {
    id: 'm_orbit_left_mid',
    src: '/mascot/cow_jump_angry.png',
    size: 'lg',
    x: 17,
    y: 29,
    depth: 'front',
    floatDuration: 6.4,
    floatDistance: 19,
    dialogue: 'Luyện thi IELTS bứt phá Band 7.5! 🎯',
    dragDialogue: 'Tiến thẳng vào phòng thi cùng tớ! 🔥',
    rotateDeg: 9,
  },
  {
    id: 'm_orbit_right_mid',
    src: '/mascot/cow_wink_kiss.png',
    size: 'lg',
    x: 83,
    y: 29,
    depth: 'front',
    floatDuration: 6.6,
    floatDistance: 20,
    dialogue: 'Nghe - Nói - Đọc - Viết toàn diện! 🌟',
    dragDialogue: 'Thả tim cho sự chăm chỉ của bạn! 💖',
    rotateDeg: -9,
  },
  {
    id: 'm_orbit_left_bot',
    src: '/mascot/raw/mascot_sticker_clean_03.png',
    size: 'md',
    x: 29,
    y: 41,
    depth: 'mid',
    floatDuration: 8.0,
    floatDistance: 15,
    dialogue: 'Phát âm chuẩn IPA bản xứ! 🎙️',
    dragDialogue: 'Luyện Shadowing từng ngữ điệu! 🎧',
    rotateDeg: -6,
  },
  {
    id: 'm_orbit_right_bot',
    src: '/mascot/raw/mascot_sticker_clean_04.png',
    size: 'md',
    x: 71,
    y: 41,
    depth: 'mid',
    floatDuration: 8.2,
    floatDistance: 16,
    dialogue: 'Gõ phím tốc độ WPM thần tốc! ⌨️',
    dragDialogue: 'Phản xạ gõ từ không cần nhìn phím! ⚡',
    rotateDeg: 6,
  },
  {
    id: 'm_orbit_center_bot',
    src: '/mascot/cow_lying_relaxed.png',
    size: 'md',
    x: 50,
    y: 47,
    depth: 'front',
    floatDuration: 8.8,
    floatDistance: 13,
    dialogue: 'Thư thái học 15 phút mỗi ngày~ 🍃',
    dragDialogue: 'Nằm chill ngắm các thẻ bài xoay tròn! ☁️',
    rotateDeg: 2,
  },
  {
    id: 'm_orbit_deep_1',
    src: '/mascot/raw/mascot_sticker_clean_05.png',
    size: 'sm',
    x: 37,
    y: 25,
    depth: 'far',
    floatDuration: 11.5,
    floatDistance: 10,
    dialogue: 'Ghi nhớ dài hạn theo chu kỳ não bộ! 🧠',
    dragDialogue: 'Khắc sâu từ vựng vào trí nhớ! 💡',
    rotateDeg: -5,
  },
  {
    id: 'm_orbit_deep_2',
    src: '/mascot/raw/mascot_sticker_clean_06.png',
    size: 'sm',
    x: 63,
    y: 25,
    depth: 'far',
    floatDuration: 11.8,
    floatDistance: 10,
    dialogue: 'Khắc sâu từ vựng không lo bị quên! 💎',
    dragDialogue: 'Bò ngân hà gửi lời chào bạn! 🌠',
    rotateDeg: 5,
  },

  // ==========================================================================
  // ZONE 2: FEATURE CARDS & MID-PAGE (10 Mascots across Center & Stats)
  // ==========================================================================
  {
    id: 'm_feat_left',
    src: '/mascot/cow_hands_on_hips.png',
    size: 'lg',
    x: 25,
    y: 56,
    depth: 'front',
    floatDuration: 6.6,
    floatDistance: 19,
    dialogue: 'Não bộ ghi nhớ siêu đỉnh! 🧠',
    dragDialogue: 'Thách thức mọi bài thi khó! 🛡️',
    rotateDeg: -9,
  },
  {
    id: 'm_feat_center',
    src: '/mascot/raw/mascot_sticker_clean_07.png',
    size: 'lg',
    x: 50,
    y: 61,
    depth: 'front',
    floatDuration: 6.3,
    floatDistance: 21,
    dialogue: '4 chế độ Game Arcade cực cuốn! 🎮',
    dragDialogue: 'Đua top bảng vàng tuần này! 🏆',
    rotateDeg: 8,
  },
  {
    id: 'm_feat_right',
    src: '/mascot/cow_salute.png',
    size: 'md',
    x: 75,
    y: 56,
    depth: 'mid',
    floatDuration: 7.7,
    floatDistance: 17,
    dialogue: 'Cày Streak nhận rương quà bí ẩn! 🔥',
    dragDialogue: 'Không được ngắt chuỗi học nha! 🎖️',
    rotateDeg: 11,
  },
  {
    id: 'm_mid_1',
    src: '/mascot/raw/mascot_sticker_clean_08.png',
    size: 'md',
    x: 35,
    y: 69,
    depth: 'mid',
    floatDuration: 8.4,
    floatDistance: 16,
    dialogue: 'Học cùng bạn bè vui gấp đôi! 👥',
    dragDialogue: 'Kết nối mạng lưới học tập toàn cầu! 🌍',
    rotateDeg: -7,
  },
  {
    id: 'm_mid_2',
    src: '/mascot/raw/mascot_sticker_clean_09.png',
    size: 'md',
    x: 65,
    y: 69,
    depth: 'mid',
    floatDuration: 8.1,
    floatDistance: 16,
    dialogue: 'Theo dõi năng lực bằng biểu đồ! 📊',
    dragDialogue: 'Nhìn thấy sự tiến bộ mỗi ngày! 📈',
    rotateDeg: 7,
  },
  {
    id: 'm_mid_deep_1',
    src: '/mascot/raw/mascot_sticker_clean_10.png',
    size: 'sm',
    x: 42,
    y: 77,
    depth: 'far',
    floatDuration: 11.2,
    floatDistance: 10,
    dialogue: 'Kho từ vựng Oxford 3000 chọn lọc! 📚',
    dragDialogue: 'Học từ cốt lõi trước! 🔑',
    rotateDeg: -4,
  },
  {
    id: 'm_mid_deep_2',
    src: '/mascot/raw/mascot_sticker_clean_11.png',
    size: 'sm',
    x: 58,
    y: 77,
    depth: 'far',
    floatDuration: 11.9,
    floatDistance: 10,
    dialogue: 'Ngữ pháp ứng dụng thực tế! 📐',
    dragDialogue: 'Tự tin viết câu đúng chuẩn! ✍️',
    rotateDeg: 4,
  },
  {
    id: 'm_bot_center',
    src: '/mascot/lingling_waving_bubble.png',
    size: 'lg',
    x: 50,
    y: 87,
    depth: 'front',
    floatDuration: 6.8,
    floatDistance: 18,
    dialogue: 'Bò LingLing luôn ở đây giúp bạn! 🐮',
    dragDialogue: 'Cần hỗ trợ? Nhắn AI Chatbot nhé! 💬',
    rotateDeg: 0,
  },
  {
    id: 'm_bot_left',
    src: '/mascot/raw/mascot_sticker_clean_12.png',
    size: 'md',
    x: 31,
    y: 93,
    depth: 'mid',
    floatDuration: 8.3,
    floatDistance: 15,
    dialogue: 'Từng bước nhỏ tạo nên thành công lớn! 🌟',
    dragDialogue: 'Chăm chỉ mỗi ngày là chìa khóa! 🗝️',
    rotateDeg: -6,
  },
  {
    id: 'm_bot_right',
    src: '/mascot/raw/mascot_sticker_clean_13.png',
    size: 'md',
    x: 69,
    y: 93,
    depth: 'mid',
    floatDuration: 8.5,
    floatDistance: 15,
    dialogue: 'Hẹn gặp lại bạn vào buổi học ngày mai! 🎈',
    dragDialogue: 'Chúc bạn một ngày học thật vui! 💖',
    rotateDeg: 6,
  },

  // ==========================================================================
  // ZONE 3: LEFT GUTTER TRAIL (8 Mascots, x: 5% - 10%, y: 5% - 96%)
  // ==========================================================================
  {
    id: 'm_left_1',
    src: '/mascot/raw/mascot_sticker_clean_14.png',
    size: 'md',
    x: 6,
    y: 5,
    depth: 'mid',
    floatDuration: 7.9,
    floatDistance: 17,
    dialogue: 'Khởi đầu ngày mới tràn đầy năng lượng! ⚡',
    dragDialogue: 'Bò LingLing chào buổi sáng! ☕',
    rotateDeg: -8,
  },
  {
    id: 'm_left_2',
    src: '/mascot/raw/mascot_sticker_clean_15.png',
    size: 'lg',
    x: 9,
    y: 17,
    depth: 'front',
    floatDuration: 6.5,
    floatDistance: 20,
    dialogue: 'Tiếng Anh là siêu năng lực mở lối! 🚀',
    dragDialogue: 'Bay lượn siêu tốc cùng Bò! 🏎️',
    rotateDeg: 9,
  },
  {
    id: 'm_left_3',
    src: '/mascot/raw/mascot_sticker_clean_16.png',
    size: 'sm',
    x: 5,
    y: 32,
    depth: 'far',
    floatDuration: 11.0,
    floatDistance: 11,
    dialogue: 'Đừng quên ôn bài kẻo quên nhé~ 🥺',
    dragDialogue: 'Cảm ơn bạn đã cứu tớ! 💖',
    rotateDeg: -5,
  },
  {
    id: 'm_left_4',
    src: '/mascot/cow_run_side.png',
    size: 'md',
    x: 8,
    y: 46,
    depth: 'mid',
    floatDuration: 7.8,
    floatDistance: 18,
    dialogue: 'Đua cùng bạn bè khắp mọi miền! 🏃',
    dragDialogue: 'Chạy đua cùng thời gian! ⏱️',
    rotateDeg: 11,
  },
  {
    id: 'm_left_5',
    src: '/mascot/raw/mascot_sticker_clean_17.png',
    size: 'lg',
    x: 5,
    y: 60,
    depth: 'front',
    floatDuration: 6.4,
    floatDistance: 20,
    dialogue: 'Mỗi ngày tích lũy 10 từ mới! 💡',
    dragDialogue: 'Kho từ vựng ngày càng phong phú! 📖',
    rotateDeg: -10,
  },
  {
    id: 'm_left_6',
    src: '/mascot/raw/mascot_sticker_clean_18.png',
    size: 'md',
    x: 9,
    y: 72,
    depth: 'mid',
    floatDuration: 8.0,
    floatDistance: 16,
    dialogue: 'Đồng hành cùng bạn trên mọi nẻo đường! 🛣️',
    dragDialogue: 'Tiến thẳng tới đích điểm! 🏁',
    rotateDeg: 7,
  },
  {
    id: 'm_left_7',
    src: '/mascot/raw/mascot_sticker_clean_19.png',
    size: 'sm',
    x: 5,
    y: 84,
    depth: 'far',
    floatDuration: 10.7,
    floatDistance: 12,
    dialogue: 'Kiên trì là mẹ của thành công! 🌱',
    dragDialogue: 'Bền bỉ như chú bò chăm chỉ! 🌳',
    rotateDeg: -6,
  },
  {
    id: 'm_left_8',
    src: '/mascot/raw/mascot_sticker_clean_20.png',
    size: 'md',
    x: 8,
    y: 95,
    depth: 'mid',
    floatDuration: 8.2,
    floatDistance: 16,
    dialogue: 'Hoàn thành trọn vẹn mục tiêu hôm nay! 🎖️',
    dragDialogue: 'Tự hào về sự nỗ lực của bạn! 👏',
    rotateDeg: 8,
  },

  // ==========================================================================
  // ZONE 4: RIGHT GUTTER TRAIL (8 Mascots, x: 90% - 95%, y: 5% - 96%)
  // ==========================================================================
  {
    id: 'm_right_1',
    src: '/mascot/raw/mascot_sticker_clean_21.png',
    size: 'md',
    x: 93,
    y: 5,
    depth: 'mid',
    floatDuration: 7.9,
    floatDistance: 17,
    dialogue: 'Vũ trụ tri thức không bao giờ tắt! 🌠',
    dragDialogue: 'Trôi bồng bềnh giữa biển sao! ☁️',
    rotateDeg: 6,
  },
  {
    id: 'm_right_2',
    src: '/mascot/cow_serious_closeup.png',
    size: 'lg',
    x: 91,
    y: 17,
    depth: 'front',
    floatDuration: 6.3,
    floatDistance: 21,
    dialogue: 'Tập trung cao độ, kết quả bất ngờ! 🎯',
    dragDialogue: 'Nghiêm túc học tập nào! 🧐',
    rotateDeg: -11,
  },
  {
    id: 'm_right_3',
    src: '/mascot/raw/mascot_sticker_clean_22.png',
    size: 'sm',
    x: 94,
    y: 32,
    depth: 'far',
    floatDuration: 11.3,
    floatDistance: 11,
    dialogue: 'Mẹo phát âm âm đuôi chuẩn xác! 🎙️',
    dragDialogue: 'Bật âm gió chuẩn như người bản xứ! 🌬️',
    rotateDeg: 5,
  },
  {
    id: 'm_right_4',
    src: '/mascot/cow_lying_curled.png',
    size: 'md',
    x: 92,
    y: 46,
    depth: 'mid',
    floatDuration: 8.6,
    floatDistance: 15,
    dialogue: 'Học một chút rồi nghỉ ngơi lấy sức~ 💤',
    dragDialogue: 'Ai cho bạn đánh thức tớ dậy thế? 🥱',
    rotateDeg: -7,
  },
  {
    id: 'm_right_5',
    src: '/mascot/raw/mascot_sticker_clean_23.png',
    size: 'lg',
    x: 93,
    y: 60,
    depth: 'front',
    floatDuration: 6.5,
    floatDistance: 20,
    dialogue: 'Điểm ngữ pháp hôm nay đã thuộc chưa? 📝',
    dragDialogue: 'Vào Writing Lab thực hành ngay! ✍️',
    rotateDeg: 12,
  },
  {
    id: 'm_right_6',
    src: '/mascot/raw/mascot_sticker_clean_24.png',
    size: 'md',
    x: 90,
    y: 72,
    depth: 'mid',
    floatDuration: 8.1,
    floatDistance: 16,
    dialogue: 'Đề thi thử mới cập nhật tuần này! 📑',
    dragDialogue: 'Vào bấm giờ làm bài thôi! ⏱️',
    rotateDeg: -8,
  },
  {
    id: 'm_right_7',
    src: '/mascot/cow_cry_hard.png',
    size: 'sm',
    x: 94,
    y: 84,
    depth: 'far',
    floatDuration: 11.6,
    floatDistance: 11,
    dialogue: 'Suýt nữa thì mất chuỗi Streak rồi! 😭',
    dragDialogue: 'May quá được bạn vào học cứu Streak! 🛡️',
    rotateDeg: 7,
  },
  {
    id: 'm_right_8',
    src: '/mascot/cow_back_view.png',
    size: 'md',
    x: 91,
    y: 95,
    depth: 'mid',
    floatDuration: 8.2,
    floatDistance: 17,
    dialogue: 'Bước tiếp về phía tương lai tươi sáng! 🌅',
    dragDialogue: 'Hướng về chân trời tri thức! 🧭',
    rotateDeg: -6,
  },
];

interface XPPop {
  id: number;
  x: number;
  y: number;
  text: string;
}

interface MascotEntityProps {
  mascot: MascotItem;
  isDragging: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: (mascot: MascotItem, info: any) => void;
  onClick: (e: React.MouseEvent) => void;
}

// Memoized isolated mascot component - ensures hovering 1 mascot NEVER re-renders the other 35 mascots!
const MascotEntity = React.memo(function MascotEntity({
  mascot,
  isDragging,
  onDragStart,
  onDragEnd,
  onClick,
}: MascotEntityProps) {
  const [isHovered, setIsHovered] = useState(false);

  const depthMultiplier = mascot.depth === 'front' ? 24 : mascot.depth === 'mid' ? 14 : 6;
  const sizePx = mascot.size === 'lg' ? 96 : mascot.size === 'md' ? 64 : mascot.size === 'sm' ? 40 : 28;
  const initialOpacity = mascot.depth === 'far' ? 0.45 : mascot.depth === 'mid' ? 0.75 : 1.0;

  return (
    <motion.div
      key={`${mascot.id}_${mascot.warpCount || 0}`}
      className="absolute pointer-events-auto cursor-grab active:cursor-grabbing transform-gpu select-none"
      style={{
        left: `${mascot.x}%`,
        top: `${mascot.y}%`,
        opacity: initialOpacity,
        zIndex: isDragging ? 80 : isHovered ? 60 : mascot.depth === 'front' ? 25 : mascot.depth === 'mid' ? 20 : 15,
      }}
      drag
      dragSnapToOrigin={false}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => onDragStart(mascot.id)}
      onDragEnd={(_e, info) => onDragEnd(mascot, info)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* 
        CRITICAL SMOOTH DRAG & PARALLAX FIX:
        Keep continuous parallax transform active during drag! 
        Never toggle transform to 'none' on mousedown/drag, which caused the mascot to instantly jump 15-28px!
      */}
      <div
        className="relative transform-gpu will-change-transform"
        style={{
          transform: `translate3d(calc(var(--mouse-x, 0) * ${depthMultiplier}px), calc(var(--mouse-y, 0) * ${depthMultiplier}px), 0px)`,
        }}
      >
        {/* Floating motion container - pauses bobbing during drag so it tracks the cursor with 100% precision */}
        <motion.div
          className="relative group p-2"
          animate={
            isDragging
              ? { scale: 1.25, rotate: 0 }
              : {
                  x: [0, (mascot.floatDistance * (mascot.id.charCodeAt(0) % 2 === 0 ? 1 : -1)) * 0.5, 0],
                  y: [0, -mascot.floatDistance * 0.5, 0],
                  rotate: [mascot.rotateDeg, mascot.rotateDeg + 4, mascot.rotateDeg - 3, mascot.rotateDeg],
                }
          }
          transition={
            isDragging
              ? { duration: 0.15 }
              : {
                  duration: mascot.floatDuration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
        >
          {/* Hardware-accelerated hover/drag scaling on GPU */}
          <motion.div
            animate={{
              scale: isDragging ? 1.35 : isHovered ? 1.25 : 1,
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative"
            style={{ width: sizePx, height: sizePx }}
          >
            {/* Dialogue Speech Bubble (Hover / Drag) */}
            <AnimatePresence>
              {(isHovered || isDragging) && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.85 }}
                  animate={{ opacity: 1, y: -14, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.85 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap z-50 pointer-events-none"
                >
                  <div
                    className={`px-3 py-1.5 rounded-2xl border text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-1.5 ${
                      isDragging
                        ? 'bg-amber-500/95 border-amber-300 text-slate-950 font-black shadow-amber-500/50'
                        : 'bg-slate-900/95 border-amber-500/60 text-amber-300 shadow-black/80'
                    }`}
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isDragging ? 'text-slate-950 animate-bounce' : 'text-amber-400'}`} />
                    <span>{isDragging ? mascot.dragDialogue : mascot.dialogue}</span>
                  </div>
                  <div
                    className={`w-2 h-2 border-b border-r transform rotate-45 mx-auto -mt-1 ${
                      isDragging ? 'bg-amber-500 border-amber-300' : 'bg-slate-900 border-amber-500/60'
                    }`}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Glowing Aura Ring on Drag/Hover - GPU opacity transition without layout repaints */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-300 pointer-events-none ${
                isDragging
                  ? 'bg-amber-400/40 blur-xl scale-150'
                  : isHovered
                  ? 'bg-amber-400/25 blur-lg scale-125'
                  : 'bg-transparent blur-none scale-100'
              }`}
            />

            <Image
              src={mascot.src}
              alt="Floating Draggable Cosmic LingLing"
              fill
              unoptimized
              draggable={false}
              priority={mascot.depth === 'front'}
              className="object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
});

export default function FloatingMascotUniverse() {
  const pathname = usePathname();

  const [enabled, setEnabled] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'page' | 'fixed'>('page');
  const [mascots, setMascots] = useState<MascotItem[]>(INITIAL_MASCOTS);
  const [draggingMascotId, setDraggingMascotId] = useState<string | null>(null);
  const [xpPops, setXpPops] = useState<XPPop[]>([]);
  const mousePosRef = useRef({ x: 0, y: 0 });

  // Mouse Parallax Track (Direct DOM CSS Variable update for 120fps zero-re-render performance)
  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xVal = (e.clientX / innerWidth - 0.5) * 2;
      const yVal = (e.clientY / innerHeight - 0.5) * 2;
      mousePosRef.current = { x: xVal, y: yVal };

      const layer = document?.getElementById('mascot-universe-layer');
      if (layer && layer.style) {
        layer.style.setProperty('--mouse-x', xVal.toFixed(3));
        layer.style.setProperty('--mouse-y', yVal.toFixed(3));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  // Mascot Click & Drag Release XP Particle Burst
  const triggerXPBurst = useCallback((clientX: number, clientY: number, amount = '+15 XP ✨') => {
    const newPop: XPPop = {
      id: Date.now() + Math.random(),
      x: clientX,
      y: clientY - 15,
      text: amount,
    };

    setXpPops((prev) => [...prev, newPop]);
    setTimeout(() => {
      setXpPops((prev) => prev.filter((p) => p.id !== newPop.id));
    }, 1200);
  }, []);

  // Mascot Click Response (XP + Dialogue trigger)
  const handleMascotClick = useCallback((e: React.MouseEvent) => {
    triggerXPBurst(e.clientX, e.clientY, '+15 XP ✨');
  }, [triggerXPBurst]);

  const handleDragStart = useCallback((id: string) => {
    setDraggingMascotId(id);
  }, []);

  const handleDragEnd = useCallback((mascot: MascotItem, info: any) => {
    setDraggingMascotId(null);
    const pt = info?.point;
    if (pt?.x !== undefined && pt?.y !== undefined) {
      const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
      const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
      const currentScrollY = typeof window !== 'undefined' ? (window.scrollY || window.pageYOffset || 0) : 0;
      const totalPageHeight = typeof document !== 'undefined' ? Math.max(document.documentElement.scrollHeight, windowHeight) : 1000;

      let newXPercent: number;
      let newYPercent: number;

      if (layoutMode === 'page') {
        newXPercent = (pt.x / windowWidth) * 100;
        newYPercent = ((pt.y + currentScrollY) / totalPageHeight) * 100;
      } else {
        newXPercent = (pt.x / windowWidth) * 100;
        newYPercent = (pt.y / windowHeight) * 100;
      }

      let isWrapped = false;

      // Symmetrical Screen Boundary Wrap Logic (only if dragged completely off screen edges)
      if (newXPercent > 96) {
        newXPercent = 4;
        isWrapped = true;
      } else if (newXPercent < 2) {
        newXPercent = 94;
        isWrapped = true;
      }

      if (newYPercent > 98) {
        newYPercent = 4;
        isWrapped = true;
      } else if (newYPercent < 1) {
        newYPercent = 96;
        isWrapped = true;
      }

      newXPercent = Math.max(3, Math.min(94, Math.round(newXPercent * 10) / 10));
      newYPercent = Math.max(2, Math.min(97, Math.round(newYPercent * 10) / 10));

      // ALWAYS update state with the exact drop coordinates so mascot never disappears or snaps back!
      setMascots((prev) =>
        prev.map((item) =>
          item.id === mascot.id
            ? {
                ...item,
                x: newXPercent,
                y: newYPercent,
                warpCount: (item.warpCount || 0) + 1,
              }
            : item
        )
      );

      triggerXPBurst(
        pt.x,
        pt.y,
        isWrapped ? 'Dịch Chuyển Không Gian! 🌀' : '+25 XP 🚀'
      );
    }
  }, [layoutMode, triggerXPBurst]);

  // Add 5 Unique Random Mascots to Universe from the 49-sticker pool
  const handleAddMoreMascots = () => {
    const dialogues = [
      'Siêu chiến binh IELTS xuất hiện! 🛡️',
      'Luyện từ vựng thông minh mỗi ngày! ⚡',
      'Lingual AI luôn đồng hành cùng bạn! 🤖',
      'Học vui 5 phút bứt phá mục tiêu! 🎈',
      'Chinh phục Band 8.0 không xa vời! 🏆',
      'Ghi nhớ từ vựng sâu bằng Flashcard! 💡',
      'Phát âm chuẩn IPA tự tin giao tiếp! 🎙️',
      'Luyện nghe phản xạ nhịp độ tự nhiên! 🎧',
      'Viết luận sắc bén điểm Cohesion cao! ✍️',
      'Thử thách Typing Race tốc độ siêu việt! 🏎️',
      'Cày Streak nhận rương quà bí ẩn! 🎁',
      'Học tiếng Anh chưa bao giờ chill thế này! ☕',
      'Thêm một chú Bò gia nhập dải ngân hà! 🌌',
      'Bò LingLing gửi ngàn tim tới bạn! 💖',
      'Không sợ từ khó, có LinguaFlow lo! 🚀',
    ];

    // Pick 5 distinct random stickers from the verified 49-sticker pool
    const shuffledStickers = [...ALL_VERIFIED_STICKERS].sort(() => Math.random() - 0.5);

    const newItems: MascotItem[] = Array.from({ length: 5 }).map((_, idx) => ({
      id: `extra_${Date.now()}_${idx}`,
      src: shuffledStickers[idx % shuffledStickers.length],
      size: (['sm', 'md', 'lg'] as const)[Math.floor(Math.random() * 3)],
      x: Math.floor(Math.random() * 85) + 5,
      y: Math.floor(Math.random() * 85) + 5,
      depth: (['front', 'mid', 'far'] as const)[Math.floor(Math.random() * 3)],
      floatDuration: Math.floor(Math.random() * 8) + 6,
      floatDistance: Math.floor(Math.random() * 15) + 10,
      dialogue: dialogues[Math.floor(Math.random() * dialogues.length)],
      dragDialogue: 'Tớ vừa gia nhập vũ trụ LinguaFlow! 🚀',
      rotateDeg: Math.floor(Math.random() * 30) - 15,
    }));

    setMascots((prev) => [...prev, ...newItems]);
  };

  // Reset Mascot Universe to Default Layout
  const handleResetUniverse = () => {
    setMascots(INITIAL_MASCOTS);
  };

  if (!enabled) {
    return (
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setEnabled(true)}
          className="px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 text-xs font-bold shadow-lg hover:border-amber-400 hover:text-white transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Bật Vũ Trụ Mascot
        </button>
      </div>
    );
  }

  return (
    <>
      {/* GLOBAL COSMIC BACKGROUND LAYER */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-slate-950 overflow-hidden select-none">
        {/* Glowing Cosmic Nebula Spheres */}
        <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[140px]" />
        <div className="absolute top-[40%] right-[15%] w-[35vw] h-[35vw] rounded-full bg-amber-500/5 blur-[100px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-teal-500/5 blur-[110px]" />

        {/* Floating Twinkling Stars Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px] opacity-20" />
      </div>

      {/* INTERACTIVE FLOATING MASCOTS LAYER (Z-20 FLOATING ABOVE CARD BACKGROUNDS) */}
      <div
        id="mascot-universe-layer"
        className={`pointer-events-none z-20 select-none ${
          layoutMode === 'page'
            ? 'absolute inset-0 min-h-full w-full overflow-hidden'
            : 'fixed inset-0 overflow-hidden'
        }`}
      >
        {/* FLOATING & DRAGGABLE MASCOT ENTITIES */}
        {mascots.map((m) => (
          <MascotEntity
            key={`${m.id}_${m.warpCount || 0}`}
            mascot={m}
            isDragging={draggingMascotId === m.id}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={handleMascotClick}
          />
        ))}
      </div>

      {/* FLOATING XP POPUP ANIMATIONS */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {xpPops.map((pop) => (
          <motion.div
            key={pop.id}
            initial={{ opacity: 1, y: pop.y, x: pop.x - 30, scale: 0.8 }}
            animate={{ opacity: 0, y: pop.y - 70, scale: 1.3 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute font-display font-black text-amber-300 text-sm drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] bg-slate-900/95 border border-amber-500/50 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xl backdrop-blur-md"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
            <span>{pop.text}</span>
          </motion.div>
        ))}
      </div>

      {/* FLOATING CONTROLS WIDGET (BOTTOM LEFT) */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setEnabled(false)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-[11px] font-medium shadow-lg backdrop-blur-md transition-all active:scale-95 group"
          title="Tắt hiệu ứng Bò LingLing trôi nổi"
        >
          <EyeOff className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
          <span>Vũ Trụ ({mascots.length} Bò)</span>
        </button>

        {/* Layout Mode Toggle: Trải Theo Trang vs Ghim Màn Hình */}
        <button
          onClick={() => setLayoutMode((prev) => (prev === 'page' ? 'fixed' : 'page'))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-[11px] font-medium shadow-lg backdrop-blur-md transition-all active:scale-95 group"
          title={
            layoutMode === 'page'
              ? 'Đang trải dọc theo toàn bộ chiều dài trang (Click để ghim cố định màn hình)'
              : 'Đang ghim cố định màn hình (Click để trải dọc theo toàn bộ chiều dài trang)'
          }
        >
          {layoutMode === 'page' ? (
            <>
              <ScrollText className="w-3.5 h-3.5 text-cyan-400 group-hover:text-cyan-300" />
              <span className="hidden sm:inline">Trải Dài Trang</span>
            </>
          ) : (
            <>
              <Pin className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-300" />
              <span className="hidden sm:inline">Ghim Màn Hình</span>
            </>
          )}
        </button>

        <button
          onClick={handleAddMoreMascots}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[11px] font-bold shadow-lg backdrop-blur-md transition-all active:scale-95"
          title="Thêm 5 Bò LingLing trôi nổi"
        >
          <Plus className="w-3 h-3" />
          <span>+5 Bò</span>
        </button>

        <button
          onClick={handleResetUniverse}
          className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-[11px] shadow-lg backdrop-blur-md transition-all active:scale-95"
          title="Đặt lại vị trí mặc định"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </>
  );
}
