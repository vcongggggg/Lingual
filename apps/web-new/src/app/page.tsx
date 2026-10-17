'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StreakCard } from '../components/ui/StreakCard';
import { LingLing } from '../components/ui/LingLing';

export default function HomePage() {
  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Cột trái: Văn bản & CTA */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2.5 text-xs font-black tracking-widest uppercase text-red">
              <span className="w-8 h-0.5 bg-red" />
              Nền tảng học tiếng Anh · SM-2
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-black leading-[1.08] tracking-tight text-ink">
              Học tiếng Anh<br />
              <span className="relative whitespace-nowrap inline-block">
                đều đặn mỗi ngày,
                <span className="absolute -left-1 -right-1 bottom-1.5 h-3.5 bg-amber -z-10 -rotate-1 pointer-events-none" />
              </span><br />
              nhớ lâu thật sự.
            </h1>

            <p className="text-base sm:text-lg text-ink-soft leading-relaxed max-w-xl">
              Lingual kết hợp bài học ngắn, thẻ ghi nhớ lặp lại ngắt quãng (SM-2), trò chơi và luyện thi IELTS — tất cả bằng tiếng Việt, thân thiện và hoàn toàn không xao nhãng.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/register">
                <Button variant="red" size="lg">
                  Bắt đầu miễn phí →
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="white" size="lg">
                  Xem lộ trình học
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-4 border-t-2 border-ink/15 text-xs text-ink-soft">
              <div>
                <b className="block text-xl font-black text-ink">SM-2</b>
                Thuật toán SuperMemo
              </div>
              <div>
                <b className="block text-xl font-black text-ink">4</b>
                Chế độ game tốc độ
              </div>
              <div>
                <b className="block text-xl font-black text-ink">VI → EN</b>
                Cặp ngôn ngữ đầu tiên
              </div>
            </div>
          </div>

          {/* Cột phải: Visual Bộ Thẻ & LingLing Mascot */}
          <div className="lg:col-span-5 relative h-[440px] select-none flex items-center justify-center">
            {/* Thẻ 1 (phía sau bên trái) */}
            <div className="absolute w-[280px] bg-card border-2 border-ink rounded-2xl shadow-brutal-xl p-6 text-center top-6 left-2 -rotate-6 z-10 transition-transform hover:-rotate-3">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber/70 border-l-2 border-r-2 border-dashed border-ink/40 -rotate-3" />
              <span className="inline-block text-[11px] font-black uppercase tracking-wider bg-paper-2 border-2 border-ink rounded-full px-3 py-1 mb-4">
                Danh từ · B1
              </span>
              <div className="text-3xl font-black text-ink tracking-tight mb-1">Environment</div>
              <div className="text-xs text-ink-soft mb-3">/ɪnˈvaɪrənmənt/</div>
              <div className="text-lg font-extrabold text-teal">Môi trường sống</div>
            </div>

            {/* Thẻ 2 (ở giữa nền ngà) */}
            <div className="absolute w-[280px] bg-paper-2 border-2 border-ink rounded-2xl shadow-brutal-xl p-6 text-center top-16 left-16 rotate-3 z-20 transition-transform hover:rotate-1">
              <span className="inline-block text-[11px] font-black uppercase tracking-wider bg-card border-2 border-ink rounded-full px-3 py-1 mb-4">
                Động từ · A2
              </span>
              <div className="text-3xl font-black text-ink tracking-tight mb-1">Achieve</div>
              <div className="text-xs text-ink-soft mb-3">/əˈtʃiːv/</div>
              <div className="text-lg font-extrabold text-teal">Đạt được</div>
            </div>

            {/* Thẻ 3 (trên cùng bên phải) */}
            <div className="absolute w-[290px] bg-card border-2 border-ink rounded-2xl shadow-brutal-xl p-6 text-center top-6 left-24 -rotate-2 z-30 transition-transform hover:rotate-0">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber/70 border-l-2 border-r-2 border-dashed border-ink/40 -rotate-3" />
              <span className="inline-block text-[11px] font-black uppercase tracking-wider bg-paper-2 border-2 border-ink rounded-full px-3 py-1 mb-4">
                Tính từ · B2
              </span>
              <div className="text-3xl font-black text-ink tracking-tight mb-1">Substantial</div>
              <div className="text-xs text-ink-soft mb-3">/səbˈstænʃl/</div>
              <div className="text-lg font-extrabold text-teal">Đáng kể</div>
            </div>

            {/* Con dấu mực đỏ */}
            <div className="absolute bottom-6 right-2 z-40 w-28 h-28 border-[3px] border-red rounded-full flex items-center justify-center -rotate-12 bg-[#FAF5EA]/95 text-red font-black text-xs uppercase tracking-widest text-center shadow-brutal-sm">
              Ôn tập<br />đúng lúc
            </div>

            {/* Linh vật LingLing cầm trà sữa nhô ra từ góc thẻ */}
            <div className="absolute -top-4 right-0 z-40 w-32 animate-mascot">
              <Image
                src="/mascot/cow_greet_heart.png"
                alt="LingLing chào mừng"
                width={128}
                height={128}
                unoptimized
                className="pointer-events-none drop-shadow-md"
              />
            </div>

            {/* Bong bóng thoại LingLing */}
            <div className="absolute top-20 right-14 z-50 max-w-[210px] bg-card border-2 border-ink rounded-xl p-3 text-xs font-bold leading-snug shadow-brutal text-ink">
              <b className="text-red">LingLing: </b>
              Hôm nay ôn 5 từ thôi là đủ giữ streak rồi! Cố lên nhé!
              <div className="absolute -top-2 right-6 w-3.5 h-3.5 bg-card border-l-2 border-t-2 border-ink rotate-45" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. DẢI TICKER CHẠY CHỮ */}
      <div className="border-y-2 border-ink bg-ink text-paper py-3.5 overflow-hidden whitespace-nowrap select-none font-bold text-sm tracking-wider">
        <div className="inline-flex gap-8 animate-none">
          <span>Hello <span className="text-amber">✦</span> Xin chào</span>
          <span>Perseverance <span className="text-amber">✦</span> Sự kiên trì</span>
          <span>Journey <span className="text-amber">✦</span> Hành trình</span>
          <span>Knowledge <span className="text-amber">✦</span> Kiến thức</span>
          <span>Bridge <span className="text-amber">✦</span> Cây cầu</span>
          <span>Hello <span className="text-amber">✦</span> Xin chào</span>
          <span>Perseverance <span className="text-amber">✦</span> Sự kiên trì</span>
          <span>Journey <span className="text-amber">✦</span> Hành trình</span>
          <span>Knowledge <span className="text-amber">✦</span> Kiến thức</span>
          <span>Bridge <span className="text-amber">✦</span> Cây cầu</span>
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
          {/* Card 1: SRS */}
          <div className="bg-card border-2 border-ink rounded-2xl shadow-brutal-lg p-7 hover:-translate-x-1 hover:-translate-y-1 transition-transform flex flex-col justify-between">
            <div>
              <span className="text-sm font-black text-red tracking-widest block mb-3">01</span>
              <h3 className="text-2xl font-black text-ink mb-2">Thẻ ghi nhớ SM-2</h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                Thuật toán SuperMemo tính đúng ngày bạn sắp quên một từ và nhắc ôn trước khi điều đó xảy ra. Ôn ít, nhớ lâu.
              </p>
            </div>
            <Link href="/srs" className="inline-flex items-center gap-1 font-black text-sm text-ink hover:text-red mt-6 border-b-2 border-amber w-fit">
              Mở bộ thẻ →
            </Link>
          </div>

          {/* Card 2: Games */}
          <div className="bg-card border-2 border-ink rounded-2xl shadow-brutal-lg p-7 hover:-translate-x-1 hover:-translate-y-1 transition-transform flex flex-col justify-between">
            <div>
              <span className="text-sm font-black text-red tracking-widest block mb-3">02</span>
              <h3 className="text-2xl font-black text-ink mb-2">Game Center</h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                Bốn trò chơi tốc độ — nối từ, xếp câu, gõ nhanh, điền từ — biến mười phút rảnh thành một trận đấu với chính mình.
              </p>
            </div>
            <Link href="/games" className="inline-flex items-center gap-1 font-black text-sm text-ink hover:text-red mt-6 border-b-2 border-amber w-fit">
              Chơi ngay →
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

          {/* Mascot LingLing nháy mắt ở góc phải CTA */}
          <div className="absolute -bottom-2 right-4 sm:right-10 w-24 sm:w-28 rotate-6 animate-mascot">
            <Image
              src="/mascot/cow_wink_kiss.png"
              alt="LingLing nháy mắt"
              width={112}
              height={112}
              unoptimized
              className="pointer-events-none drop-shadow-md"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
