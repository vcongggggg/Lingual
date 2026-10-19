'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Headphones, ListOrdered, Mic, BookOpen, Play } from 'lucide-react';
import { DictationVideo } from '@/lib/listening/videoDictationData';

export type VideoPlayerMode = 'dictation' | 'word_order' | 'shadowing' | 'transcript';

interface VideoModeSelectModalProps {
  video: DictationVideo | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (video: DictationVideo, mode: VideoPlayerMode) => void;
  locale?: string;
}

export const VideoModeSelectModal: React.FC<VideoModeSelectModalProps> = ({
  video,
  isOpen,
  onClose,
  onSelectMode,
  locale = 'vi',
}) => {
  if (!video) return null;
  const isVi = locale === 'vi';

  const modes: {
    key: VideoPlayerMode;
    title: string;
    desc: string;
    icon: React.ReactNode;
    glow: string;
    border: string;
    tag: string;
  }[] = [
    {
      key: 'dictation',
      title: isVi ? 'Dictation' : 'Dictation',
      desc: isVi ? 'Nghe và gõ lại từng từ chính xác' : 'Listen & type each word accurately',
      icon: <Headphones className="w-8 h-8 text-teal-400" />,
      glow: 'from-teal-500/20 to-slate-900',
      border: 'hover:border-teal-400 hover:ring-2 hover:ring-teal-500/20',
      tag: isVi ? 'Phổ biến nhất' : 'Most Popular',
    },
    {
      key: 'word_order',
      title: isVi ? 'Xếp từ' : 'Word Order',
      desc: isVi ? 'Ghép câu từ các từ bị xáo trộn' : 'Arrange scrambled words in order',
      icon: <ListOrdered className="w-8 h-8 text-amber-400" />,
      glow: 'from-amber-500/20 to-slate-900',
      border: 'hover:border-amber-400 hover:ring-2 hover:ring-amber-500/20',
      tag: isVi ? 'Dễ làm quen' : 'Beginner Friendly',
    },
    {
      key: 'shadowing',
      title: isVi ? 'Shadowing' : 'Shadowing',
      desc: isVi ? 'Thu âm nhại giọng & chấm điểm AI' : 'Record voice & AI score pitch',
      icon: <Mic className="w-8 h-8 text-emerald-400" />,
      glow: 'from-emerald-500/20 to-slate-900',
      border: 'hover:border-emerald-400 hover:ring-2 hover:ring-emerald-500/20',
      tag: isVi ? 'Luyện ngữ điệu' : 'Speaking Boost',
    },
    {
      key: 'transcript',
      title: isVi ? 'Transcript' : 'Transcript',
      desc: isVi ? 'Xem lời thoại song ngữ tương tác' : 'Interactive bilingual script',
      icon: <BookOpen className="w-8 h-8 text-indigo-400" />,
      glow: 'from-indigo-500/20 to-slate-900',
      border: 'hover:border-indigo-400 hover:ring-2 hover:ring-indigo-500/20',
      tag: isVi ? 'Đọc hiểu sâu' : 'Study Mode',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-slate-900/95 border border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl z-10 space-y-6"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-1.5">
              <h3 className="text-2xl font-display font-extrabold text-white">
                {isVi ? 'Chọn chế độ luyện tập' : 'Select Practice Mode'}
              </h3>
              <p className="text-xs text-slate-400">
                {isVi ? 'Chọn chế độ học phù hợp với mục tiêu của bạn' : 'Choose the best mode for your current learning goal'}
              </p>
            </div>

            {/* 4 Mode Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {modes.map((m) => (
                <button
                  key={m.key}
                  onClick={() => {
                    onSelectMode(video, m.key);
                    onClose();
                  }}
                  className={`relative p-5 rounded-2xl bg-gradient-to-b ${m.glow} border border-slate-800 text-center flex flex-col items-center justify-between gap-3 transition-all duration-200 group ${m.border} shadow-lg`}
                >
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 group-hover:scale-110 transition-transform shadow-inner">
                    {m.icon}
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-extrabold text-white block group-hover:text-teal-300 transition-colors">
                      {m.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block line-clamp-2 leading-tight">
                      {m.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Video Preview Footer Tag */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate max-w-[400px]">
                {isVi ? 'Video đã chọn: ' : 'Selected video: '}
                <strong className="text-teal-300">{video.title}</strong>
              </span>
              <span className="font-mono text-slate-500">{video.segments.length} đoạn câu</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default VideoModeSelectModal;
