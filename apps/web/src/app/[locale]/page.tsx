'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card } from '@linguaflow/ui';
import dynamic from 'next/dynamic';
import { Sparkles, ArrowRight, Brain, Gamepad2, Flame, CheckCircle2, Zap, X } from 'lucide-react';

const Hero3DVisual = dynamic(() => import('@/components/Hero3DVisual'), {
  ssr: false,
  loading: () => (
    <div className="relative w-full max-w-4xl h-[420px] sm:h-[480px] mx-auto flex items-center justify-center" />
  ),
});

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

        {/* Badge tag with gentle subtle pulse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-teal-500/30 backdrop-blur-xl shadow-lg shadow-teal-500/10 text-xs font-extrabold text-teal-300"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Nền Tảng Ôn Tập Từ Vựng Thông Minh Tự Động Nhắc Nhở</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-artistic tracking-wide text-white leading-tight"
        >
          Chinh Phục Tiếng Anh Theo Cách <br />
          <span className="bg-gradient-to-r from-coral-400 via-amber-400 to-teal-300 bg-clip-text text-transparent">
            Vừa Học Vừa Chơi Nghiêm Túc
          </span>
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal"
        >
          Kết hợp hoàn hảo giữa bài học tương tác sinh động, thuật toán ôn tập tự động trước khi bạn kịp quên, 4 trò chơi Game Center thử thách và cơ chế điểm số thú vị.
        </motion.p>

        {/* Call to Actions with distinct primary / secondary hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-4 pt-4 relative z-30"
        >
          <Button
            variant="accent"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            onClick={() => setShowPlacementModal(true)}
            aria-label="Bắt đầu học ngay miễn phí"
          >
            Bắt Đầu Học Ngay (Miễn Phí)
          </Button>

          <Button
            variant="outline"
            size="md"
            icon={<Brain className="w-4 h-4 text-teal-400" />}
            onClick={handleStartLearning}
            aria-label="Khám phá lộ trình bài học"
          >
            Khám Phá Lộ Trình Bài Học
          </Button>
        </motion.div>

        {/* Interactive 3D Orbiting Vocab Scene with subtle grounding floor mask */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="pt-6 relative"
        >
          <Hero3DVisual />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
        </motion.div>
      </section>

      {/* FEATURE HIGHLIGHT CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Card className="space-y-4 hover:border-teal-500/40">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Brain className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-white">Ôn Tập Từ Vựng</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Hệ thống tự động nhắc nhở ôn luyện vào thời điểm vàng trước khi bạn quên, giúp khắc sâu từ vựng vào trí nhớ dài hạn.
          </p>
        </Card>

        <Card className="space-y-4 hover:border-amber-500/40">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-white">Trò Chơi Học Tập</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            4 chế độ game hấp dẫn: Ghép thẻ tốc độ, Xếp câu, Đua tốc độ gõ phím và Điền từ thần tốc dưới áp lực thời gian.
          </p>
        </Card>

        <Card className="space-y-4 hover:border-coral-500/40">
          <div className="w-12 h-12 rounded-2xl bg-coral-500/10 border border-coral-500/20 flex items-center justify-center text-coral-400">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-white">Điểm XP & Streak</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Nhận điểm kinh nghiệm (XP) sau mỗi hoạt động, duy trì ngọn lửa học tập hàng ngày (Streak) và nhận huy hiệu danh giá.
          </p>
        </Card>
      </section>

      {/* PLACEMENT QUIZ MODAL */}
      <AnimatePresence>
        {showPlacementModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-slate-900 border border-teal-500/30 p-8 space-y-6 shadow-2xl shadow-teal-500/20"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-display font-bold text-white">Đánh Giá Trình Độ Đầu Vào</h3>
                <button
                  onClick={() => setShowPlacementModal(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
                  aria-label="Đóng đánh giá trình độ"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-slate-300">
                Hãy chọn trình độ tiếng Anh hiện tại của bạn để LinguaFlow sắp xếp bài học phù hợp nhất:
              </p>

              <div className="space-y-3">
                {[
                  {
                    id: 'beginner',
                    title: 'Mới Bắt Đầu (Beginner - A1)',
                    desc: 'Tôi chưa biết nhiều từ vựng hoặc đã quên nền tảng.',
                  },
                  {
                    id: 'intermediate',
                    title: 'Trung Cấp (Intermediate - A2/B1)',
                    desc: 'Tôi có thể nói câu đơn giản và muốn tăng phản xạ.',
                  },
                  {
                    id: 'advanced',
                    title: 'Nâng Cao (Advanced - B2+)',
                    desc: 'Tôi muốn làm chủ ngữ pháp và mở rộng vốn từ chuyên sâu.',
                  },
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
