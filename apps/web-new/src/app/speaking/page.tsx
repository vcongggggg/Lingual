'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LingLing } from '../../components/ui/LingLing';
import { 
  Mic, 
  Flame, 
  Target, 
  Award, 
  Volume2, 
  Repeat, 
  Headphones, 
  Image as ImageIcon, 
  MessageSquare, 
  Sparkles, 
  BarChart3,
  ArrowRight
} from 'lucide-react';

const STATS = [
  { label: 'Số câu đã luyện', value: '142 câu', sub: '+12 câu hôm nay', color: 'text-teal' },
  { label: 'Điểm phát âm TB', value: '88/100', sub: 'Độ chuẩn bản xứ', color: 'text-red' },
  { label: 'Chuỗi ngày luyện nói', value: '7 ngày', sub: 'Giữ vững phong độ!', color: 'text-amber' },
  { label: 'Cấp độ phát âm', value: 'B1 Vững vàng', sub: 'Mục tiêu: B2', color: 'text-ink' },
];

const SPEAKING_MODES = [
  {
    id: 'pronunciation',
    title: 'Luyện phát âm & Cặp âm tối thiểu',
    englishTitle: 'Minimal Pairs & Phonetics',
    desc: 'Phân biệt và phát âm chuẩn các cặp âm dễ nhầm lẫn như /i:/ và /ɪ/ (sheep/ship), /æ/ và /e/.',
    icon: Volume2,
    cefr: 'A1–B1',
    href: '/speaking/practice',
    popular: true,
  },
  {
    id: 'repetition',
    title: 'Lặp lại câu theo mẫu',
    englishTitle: 'Sentence Repetition',
    desc: 'Luyện cơ miệng và ngữ điệu bằng cách nghe và nhắc lại các mẫu câu từ cơ bản đến nâng cao.',
    icon: Repeat,
    cefr: 'A1–B2',
    href: '/speaking/practice',
  },
  {
    id: 'shadowing',
    title: 'Nhại giọng theo tốc độ tự nhiên',
    englishTitle: 'Speech Shadowing',
    desc: 'Nói đuổi ngay sau người bản xứ với độ trễ 0.5s để rèn ngữ điệu, nối âm và ngữ pháp ngầm.',
    icon: Headphones,
    cefr: 'B1–C1',
    href: '/speaking/practice',
  },
  {
    id: 'picture',
    title: 'Miêu tả tranh ảnh trực quan',
    englishTitle: 'Picture Description',
    desc: 'Quan sát các bức tranh đời sống và miêu tả chi tiết người, hành động, không gian trong 60 giây.',
    icon: ImageIcon,
    cefr: 'A2–B2',
    href: '/speaking/practice',
  },
  {
    id: 'situation',
    title: 'Hội thoại theo tình huống',
    englishTitle: 'Situational Dialogue',
    desc: 'Nhập vai đối thoại trực tiếp trong các ngữ cảnh: gọi món, đặt phòng khách sạn, hỏi đường.',
    icon: MessageSquare,
    cefr: 'A2–B1',
    href: '/speaking/practice',
  },
  {
    id: 'free',
    title: 'Nói tự do theo chủ đề',
    englishTitle: 'Free Topic Speech',
    desc: 'Trình bày quan điểm cá nhân về một chủ đề bất kỳ, AI phân tích độ lưu loát và từ vựng.',
    icon: Sparkles,
    cefr: 'B2–C2',
    href: '/speaking/practice',
  },
  {
    id: 'analytics',
    title: 'Lịch sử & Phân tích giọng nói',
    englishTitle: 'Voice History & Analytics',
    desc: 'Bản đồ phổ âm thanh, các âm bạn hay phát âm sai và biểu đồ tiến bộ theo từng tuần.',
    icon: BarChart3,
    cefr: 'Tất cả',
    href: '/speaking/practice',
  },
];

export default function SpeakingHubPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 pb-28 sm:pb-20">
      {/* Hero Section phong cách sổ tay với bò đeo tai nghe */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-red">
              <Mic className="w-3.5 h-3.5" />
              <span>Phòng Luyện Nói · Speaking Lab</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight">
              Mở khẩu hình tự tin, phát âm chuẩn xác từng âm tiết
            </h1>

            <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
              Luyện nói tiếng Anh mỗi ngày cùng AI phản hồi tức thì về <b>ngữ điệu</b>, <b>nối âm</b> và <b>độ chính xác theo chuẩn IPA quốc tế</b>.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/speaking/practice" className="btn btn-red text-sm font-black shadow-brutal">
                Luyện phát âm ngay hôm nay →
              </Link>
              <span className="text-xs font-extrabold text-ink-soft">
                Micro AI sẵn sàng nhận diện
              </span>
            </div>
          </div>

          {/* Linh vật LingLing đeo tai nghe trên nền giấy */}
          <div className="hidden lg:flex flex-col items-center relative flex-shrink-0">
            <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
              Đừng ngại nói sai nhé, <span className="text-red">cứ tự tin phát âm</span> cùng tớ!
            </div>
            <LingLing reaction="greet" size={135} />
          </div>
        </div>
      </div>

      {/* 4 Stat Cards dạng Thẻ Giấy */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {STATS.map((stat, idx) => (
          <div
            key={idx}
            className="card-paper p-5 flex flex-col justify-between text-left shadow-brutal hover:shadow-brutal-lg transition-all"
          >
            <span className="text-xs font-bold text-ink-soft">{stat.label}</span>
            <div className={`text-2xl sm:text-3xl font-black my-1 ${stat.color}`}>
              {stat.value}
            </div>
            <span className="text-[11px] font-extrabold text-ink-muted">{stat.sub}</span>
          </div>
        ))}
      </div>

      {/* 7 Chế Độ Luyện Nói Dạng Card Giấy */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
              7 Chế độ luyện nói toàn diện
            </h2>
            <p className="text-sm text-ink-soft">Chọn chế độ phù hợp với mục tiêu luyện tập của bạn hôm nay.</p>
          </div>
          <span className="stamp-badge w-14 h-14 text-[10px] font-black border-2 border-red text-red">
            PRO 88
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPEAKING_MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <Link
                key={mode.id}
                href={mode.href}
                className="group card-paper p-6 flex flex-col justify-between text-left hover:-translate-y-1 transition-all relative overflow-hidden"
              >
                {mode.popular && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-amber border border-ink rounded-md text-[10px] font-black uppercase text-ink shadow-brutal-sm">
                    Phổ biến nhất
                  </div>
                )}

                <div className="space-y-4">
                  {/* Icon trong vòng tròn mực + Stamp CEFR */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-full border-2 border-ink bg-paper-2 flex items-center justify-center shadow-brutal-sm group-hover:bg-red group-hover:text-white transition-all text-ink">
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="stamp-badge w-11 h-11 text-[10px] font-black border-2 border-ink text-ink bg-paper">
                      {mode.cefr}
                    </span>
                  </div>

                  {/* Nội dung */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-ink group-hover:text-red transition-colors">
                      {mode.title}
                    </h3>
                    <p className="text-xs font-bold text-ink-muted italic">
                      {mode.englishTitle}
                    </p>
                    <p className="text-xs text-ink-soft leading-relaxed pt-1">
                      {mode.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-ink/10 flex items-center justify-between text-xs font-black text-red">
                  <span>Bắt đầu luyện tập</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
