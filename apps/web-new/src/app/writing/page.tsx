'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LingLing } from '../../components/ui/LingLing';
import { 
  PenTool, 
  Sparkles, 
  Eye, 
  BookOpen, 
  FileEdit, 
  ArrowRight, 
  CheckCircle2, 
  Layers
} from 'lucide-react';

const WRITING_MODES = [
  {
    id: 'see-write',
    title: 'Quan sát & Viết',
    englishTitle: 'See & Write',
    desc: 'Quan sát tranh ảnh đời sống và viết lại câu miêu tả chi tiết. Rèn luyện phản xạ liên kết hình ảnh với cấu trúc câu ngữ pháp.',
    cefr: 'A1–B1',
    topicsCount: '24 chủ đề tranh',
    href: '/writing/practice',
    popular: false,
    illustration: '🖼️ ✍️',
    gradient: 'from-amber/20 to-card',
  },
  {
    id: 'guided-essay',
    title: 'Viết theo hướng dẫn từng bước',
    englishTitle: 'Guided Essay Writing',
    desc: 'Xây dựng bài viết mạch lạc qua từng bước (Mở bài → Thân bài → Kết bài) với dàn ý gợi ý, từ nối và bộ đếm chỉ số từ vựng trực quan.',
    cefr: 'A2–B2',
    topicsCount: '18 bài luận mẫu',
    href: '/writing/practice',
    popular: true,
    illustration: '📑 💡',
    gradient: 'from-teal/20 to-card',
  },
  {
    id: 'free-journal',
    title: 'Viết nhật ký tự do',
    englishTitle: 'Free Journal & AI Review',
    desc: 'Viết về bất kỳ điều gì diễn ra trong ngày của bạn. Trợ lý AI sẽ sửa lỗi ngữ pháp, gợi ý cấu trúc nâng band và nhận xét văn phong.',
    cefr: 'B1–C2',
    topicsCount: 'Không giới hạn',
    href: '/writing/practice',
    popular: false,
    illustration: '📖 ✒️',
    gradient: 'from-red/15 to-card',
  },
];

export default function WritingHubPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10">
      {/* Hero Section phong cách sổ tay */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-red">
              <PenTool className="w-3.5 h-3.5" />
              <span>Phòng Luyện Viết · Writing Lab</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight">
              Đặt bút viết mỗi ngày, biến suy nghĩ thành câu từ sắc sảo
            </h1>

            <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
              Từ câu đơn giản miêu tả tranh đến bài luận học thuật nhiều đoạn, Lingual đồng hành cùng bạn qua hệ thống <b>hướng dẫn dàn ý từng bước</b> và <b>chấm điểm ngữ pháp tức thì</b>.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/writing/practice" className="btn btn-red text-sm font-black shadow-brutal">
                Bắt đầu viết bài luận hôm nay →
              </Link>
              <span className="text-xs font-extrabold text-ink-soft">
                ✍️ Phản hồi ngữ pháp & từ vựng tức thì
              </span>
            </div>
          </div>

          {/* Linh vật LingLing cầm bút viết có chủ đích */}
          <div className="hidden lg:flex flex-col items-center relative flex-shrink-0">
            <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
              Mỗi ngày viết <span className="text-red">3 câu</span>, sau 1 tháng tiến bộ vượt bậc!
            </div>
            <LingLing reaction="greet" size={135} />
          </div>
        </div>
      </div>

      {/* 3 Thẻ Chế Độ Luyện Viết Dạng Card Giấy */}
      <div className="space-y-6 text-left">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
              3 Chế độ rèn luyện ngòi bút
            </h2>
            <p className="text-sm text-ink-soft">Lựa chọn chế độ phù hợp với trình độ và thời gian bạn có.</p>
          </div>
          <span className="stamp-badge w-14 h-14 text-[10px] font-black border-2 border-red text-red">
            WRITE 100
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WRITING_MODES.map((mode) => (
            <div
              key={mode.id}
              className="card-paper p-6 flex flex-col justify-between hover:-translate-y-1 transition-all relative overflow-hidden"
            >
              {mode.popular && (
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-red border border-ink rounded-md text-[10px] font-black uppercase text-white shadow-brutal-sm">
                  Đề xuất hôm nay
                </div>
              )}

              <div className="space-y-4">
                {/* Ảnh minh họa đóng khung viền mực */}
                <div className={`h-36 bg-gradient-to-br ${mode.gradient} border-2 border-ink rounded-xl shadow-brutal-sm flex items-center justify-center text-4xl select-none`}>
                  {mode.illustration}
                </div>

                {/* Tiêu đề & Cấp độ CEFR */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="stamp-badge w-9 h-9 text-[10px] font-black border-2 border-ink text-ink bg-paper">
                      {mode.cefr}
                    </span>
                    <span className="text-xs font-bold text-ink-muted">
                      {mode.topicsCount}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-ink">
                    {mode.title}
                  </h3>
                  <p className="text-xs font-bold text-teal italic">
                    {mode.englishTitle}
                  </p>
                  <p className="text-xs text-ink-soft leading-relaxed pt-1">
                    {mode.desc}
                  </p>
                </div>
              </div>

              {/* Nút vào luyện viết */}
              <div className="pt-4 mt-4 border-t border-ink/10 flex items-center justify-between">
                <Link
                  href={mode.href}
                  className="btn btn-ink text-xs font-black py-2 px-4 w-full justify-between group"
                >
                  <span>Bắt đầu viết</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
