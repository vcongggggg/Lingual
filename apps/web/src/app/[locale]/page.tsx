'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card } from '@linguaflow/ui';
import { Sparkles, ArrowRight, Brain, Gamepad2, Flame, CheckCircle2, Zap } from 'lucide-react';
import Hero3DVisual from '@/components/Hero3DVisual';

export default function LandingPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const router = useRouter();

  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('beginner');

  const handleStartLearning = () => {
    router.push(`/${locale}/dashboard`);
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-16">
      {/* HERO SECTION */}
      <section className="relative w-full max-w-5xl text-center space-y-8">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-coral-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Badge tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-teal-500/30 backdrop-blur-xl shadow-lg shadow-teal-500/10 text-xs font-extrabold text-teal-300"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>Nền tảng Học Tiếng Anh Cá Nhân Hóa Chuẩn SM-2</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-white leading-tight"
        >
          Chinh Phục Tiếng Anh Theo Cách <br />
          <span className="bg-gradient-to-r from-coral-400 via-amber-400 to-teal-300 bg-clip-text text-transparent">
            Gamified Nhưng Nghiêm Túc
          </span>
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal"
        >
          Kết hợp hoàn hảo giữa bài học tương tác, thuật toán lặp lại ngắt quãng SM-2, 4 trò chơi Game Center thử thách và cơ chế phản hồi XP/Streak tức thì.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 pt-4"
        >
          <Button
            variant="accent"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            onClick={() => setShowPlacementModal(true)}
          >
            Bắt Đầu Học Ngay (Miễn Phí)
          </Button>

          <Button
            variant="secondary"
            size="lg"
            icon={<Brain className="w-5 h-5 text-teal-400" />}
            onClick={handleStartLearning}
          >
            Khám Phá Lộ Trình Bài Học
          </Button>
        </motion.div>

        {/* Interactive 3D Orbiting Vocab Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="pt-6"
        >
          <Hero3DVisual />
        </motion.div>
      </section>

      {/* FEATURE HIGHLIGHT CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Card glow="teal" className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Brain className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-white">Ôn Từ Vựng SM-2</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Thuật toán SuperMemo SM-2 tự động tính toán thời điểm lặp lại ngắt quãng hoàn hảo giúp nhớ từ vựng vĩnh viễn.
          </p>
        </Card>

        <Card glow="amber" className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-white">Game Center 4 Chế Độ</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Word Match, Sentence Scramble, Typing Race và Fill Blitz biến bài tập ôn luyện thành trải nghiệm thi đấu hấp dẫn.
          </p>
        </Card>

        <Card glow="coral" className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-coral-500/10 border border-coral-500/20 flex items-center justify-center text-coral-400">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-white">Streak & XP Duotone</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Tích lũy XP, bảo vệ chuỗi Streak theo múi giờ cá nhân và mở khóa các huy hiệu thành tựu danh giá.
          </p>
        </Card>
      </section>

      {/* PLACEMENT QUIZ MODAL */}
      <AnimatePresence>
        {showPlacementModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-slate-900 border border-teal-500/30 p-8 space-y-6 shadow-2xl shadow-teal-500/20"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-display font-bold text-white">Đánh Giá Trình Độ Đầu Vào</h3>
                <button
                  onClick={() => setShowPlacementModal(false)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-slate-300">
                Hãy chọn trình độ tiếng Anh hiện tại của bạn để LinguaFlow sắp xếp bài học phù hợp nhất:
              </p>

              <div className="space-y-3">
                {[
                  { id: 'beginner', title: 'Mới Bắt Đầu (Beginner - A1)', desc: 'Tôi chưa biết nhiều từ vựng hoặc đã quên nền tảng.' },
                  { id: 'intermediate', title: 'Trung Cấp (Intermediate - A2/B1)', desc: 'Tôi có thể nói câu đơn giản và muốn tăng phản xạ.' },
                  { id: 'advanced', title: 'Nâng Cao (Advanced - B2+)', desc: 'Tôi muốn làm chủ ngữ pháp và mở rộng vốn từ chuyên sâu.' },
                ].map((lvl) => (
                  <div
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedLevel === lvl.id
                        ? 'bg-teal-500/20 border-teal-400 text-white shadow-lg shadow-teal-500/10'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base">{lvl.title}</span>
                      {selectedLevel === lvl.id && <CheckCircle2 className="w-5 h-5 text-teal-400" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{lvl.desc}</p>
                  </div>
                ))}
              </div>

              <Button variant="accent" size="lg" className="w-full" onClick={handleStartLearning}>
                Vào Lộ Trình Học Ngay
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
