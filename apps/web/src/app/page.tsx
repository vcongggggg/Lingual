'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../components/ui/Button';
import { StreakCard } from '../components/ui/StreakCard';
import { LingLing } from '../components/ui/LingLing';
import { InteractiveFlashcardDeck } from '../components/ui/InteractiveFlashcardDeck';
import { StampSlam } from '../components/ui/StampSlam';

export default function HomePage() {
  return (
    <div className="w-full max-w-full overflow-x-clip">
      {/* 1. HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16 md:py-20 w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Cột trái: Văn bản & CTA */}
          <div className="lg:col-span-7 text-left space-y-6 max-w-full">
            <div className="inline-flex items-center gap-2.5 text-xs font-black tracking-widest uppercase text-red">
              <span className="w-8 h-0.5 bg-red" />
              Nền tảng học tiếng Anh · Ôn tập thông minh
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[60px] font-black leading-[1.12] sm:leading-[1.08] tracking-tight text-ink break-words">
              Học tiếng Anh<br />
              <span className="relative whitespace-normal sm:whitespace-nowrap inline-block">
                đều đặn mỗi ngày,
                <span className="absolute -left-1 -right-1 bottom-1 h-3 sm:h-3.5 bg-amber -z-10 -rotate-1 pointer-events-none" />
              </span><br />
              nhớ lâu thật sự.
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-ink-soft leading-relaxed max-w-xl break-words">
              Lingual kết hợp bài học ngắn, thẻ ghi nhớ lặp lại thông minh, trò chơi và luyện thi IELTS — tất cả bằng tiếng Việt, thân thiện và hoàn toàn không xao nhãng.
            </p>

            {/* Nút CTA xếp dọc trên mobile, xếp ngang trên desktop */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="red" size="lg" className="w-full sm:w-auto justify-center">
                  Bắt đầu miễn phí →
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="white" size="lg" className="w-full sm:w-auto justify-center">
                  Xem lộ trình học
                </Button>
              </Link>
            </div>

            {/* Cụm stats: vừa khít 390px, wrap text an toàn */}
            <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-4 border-t-2 border-ink/15 text-xs text-ink-soft min-w-0">
              <div className="min-w-0">
                <b className="block text-base sm:text-xl font-black text-ink truncate sm:overflow-visible">Ôn tập</b>
                <span className="break-words">Lịch thông minh</span>
              </div>
              <div className="min-w-0">
                <b className="block text-base sm:text-xl font-black text-ink">6</b>
                <span className="break-words">Trò chơi tốc độ</span>
              </div>
              <div className="min-w-0">
                <b className="block text-base sm:text-xl font-black text-ink truncate sm:overflow-visible">Anh – Việt</b>
                <span className="break-words">Từ vựng song ngữ</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Visual Bộ Thẻ Tương Tác & LingLing Mascot */}
          <div className="lg:col-span-5 relative select-none flex items-center justify-center max-w-full overflow-visible mx-auto w-full pt-4 sm:pt-0">
            <div className="relative w-full max-w-[360px] sm:max-w-[400px] flex flex-col items-center">
              {/* Linh vật LingLing trao tim yêu thích */}
              <div className="absolute -top-10 -right-2 sm:-top-12 sm:right-0 z-40 w-20 sm:w-24 pointer-events-none animate-mascot">
                <LingLing reaction="heart" size={96} />
              </div>

              {/* Interactive Flashcard Deck */}
              <InteractiveFlashcardDeck />

              {/* Con dấu mực đỏ đóng xuống góc */}
              <div className="absolute -bottom-6 -right-2 sm:-bottom-8 sm:right-0 z-40 hidden sm:block pointer-events-none">
                <StampSlam
                  text="ÔN TẬP"
                  subtext="ĐÚNG LÚC"
                  variant="circle"
                  color="red"
                  size="sm"
                  delayMs={300}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DẢI TICKER CHẠY CHỮ */}
      <div className="border-y-2 border-ink bg-ink text-paper py-3.5 overflow-hidden whitespace-nowrap select-none font-bold text-sm tracking-wider">
        <div className="ticker-marquee">
          <div className="inline-flex items-center gap-8 pr-8">
            <span>Hello <span className="text-amber">✦</span> Xin chào</span>
            <span>Perseverance <span className="text-amber">✦</span> Sự kiên trì</span>
            <span>Journey <span className="text-amber">✦</span> Hành trình</span>
            <span>Knowledge <span className="text-amber">✦</span> Kiến thức</span>
            <span>Bridge <span className="text-amber">✦</span> Cây cầu</span>
          </div>
          <div className="inline-flex items-center gap-8 pr-8" aria-hidden="true">
            <span>Hello <span className="text-amber">✦</span> Xin chào</span>
            <span>Perseverance <span className="text-amber">✦</span> Sự kiên trì</span>
            <span>Journey <span className="text-amber">✦</span> Hành trình</span>
            <span>Knowledge <span className="text-amber">✦</span> Kiến thức</span>
            <span>Bridge <span className="text-amber">✦</span> Cây cầu</span>
          </div>
        </div>
      </div>

      {/* 3. 3 TÍNH NĂNG CỐT LÕI */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-left">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight mb-3">
            Mọi thứ bạn cần, gói trong một sổ tay.
          </h2>
          <p className="text-base text-ink-soft max-w-2xl leading-relaxed">
            Không lan man. Mỗi tính năng phục vụ một việc duy nhất: giúp bạn học xong bài hôm nay và quay lại vào ngày mai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Thẻ ghi nhớ thông minh */}
          <div className="bg-card border-2 border-ink rounded-2xl shadow-brutal-lg p-7 hover:-translate-x-1 hover:-translate-y-1 transition-transform flex flex-col justify-between">
            <div>
              <span className="text-sm font-black text-red tracking-widest block mb-3">01</span>
              <h3 className="text-2xl font-black text-ink mb-2">Thẻ ghi nhớ thông minh</h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                Hệ thống tính đúng ngày bạn sắp quên một từ và nhắc ôn trước khi điều đó xảy ra. Ôn ít, nhớ lâu.
              </p>
            </div>
            <Link href="/srs" className="inline-flex items-center gap-1 font-black text-sm text-ink hover:text-red mt-6 border-b-2 border-amber w-fit">
              Mở bộ thẻ →
            </Link>
          </div>

          {/* Card 2: Trò chơi tốc độ */}
          <div className="bg-card border-2 border-ink rounded-2xl shadow-brutal-lg p-7 hover:-translate-x-1 hover:-translate-y-1 transition-transform flex flex-col justify-between">
            <div>
              <span className="text-sm font-black text-red tracking-widest block mb-3">02</span>
              <h3 className="text-2xl font-black text-ink mb-2">Trò chơi tốc độ</h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                Sáu trò chơi tốc độ — nối từ, xếp câu, gõ nhanh, điền từ — biến mười phút rảnh thành một trận đấu phản xạ.
              </p>
            </div>
            <Link href="/games" className="inline-flex items-center gap-1 font-black text-sm text-ink hover:text-red mt-6 border-b-2 border-amber w-fit">
              Chơi game →
            </Link>
          </div>

          {/* Card 3: IELTS */}
          <div className="bg-card border-2 border-ink rounded-2xl shadow-brutal-lg p-7 hover:-translate-x-1 hover:-translate-y-1 transition-transform flex flex-col justify-between">
            <div>
              <span className="text-sm font-black text-red tracking-widest block mb-3">03</span>
              <h3 className="text-2xl font-black text-ink mb-2">Luyện thi IELTS</h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                Đề đọc–nghe theo kỹ năng, chấm điểm theo thang band chuẩn quốc tế, và bài thi thử bấm giờ như phòng thi thật.
              </p>
            </div>
            <Link href="/ielts" className="inline-flex items-center gap-1 font-black text-sm text-ink hover:text-red mt-6 border-b-2 border-amber w-fit">
              Vào phòng thi →
            </Link>
          </div>
        </div>
      </section>

      {/* 4. DẢI STREAK STRIP */}
      <section className="w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <StreakCard currentStreak={5} streakFreezes={1} completedDays={[0, 1, 2, 3, 4]} todayIndex={4} />
        </div>
      </section>

      {/* 5. CTA BOX */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="relative bg-card border-2 border-ink rounded-3xl shadow-brutal-2xl p-8 sm:p-14 text-center overflow-hidden">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink tracking-tight mb-4">
            Sẵn sàng cho ngày đầu tiên?
          </h2>
          <p className="text-base sm:text-lg text-ink-soft max-w-lg mx-auto mb-8 leading-relaxed">
            Không cần thẻ tín dụng. Không quảng cáo phiền phức. Chỉ có bài học đầu tiên đang chờ đón bạn.
          </p>
          <Link href="/register">
            <Button variant="ink" size="lg" className="px-8 py-4 text-base">
              Tạo tài khoản miễn phí →
            </Button>
          </Link>

          {/* Mascot LingLing chỉ tay tới lượt bạn ở góc phải CTA */}
          <div className="absolute -bottom-2 right-4 sm:right-10 w-24 sm:w-28 rotate-6 animate-mascot">
            <LingLing reaction="pointYou" size={112} />
          </div>
        </div>
      </section>
    </div>
  );
}
