'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';
import { Sparkles, ArrowRight, PenTool } from 'lucide-react';

export function StampBookMiniWidget() {
  const [balance, setBalance] = useState(3);
  const [maxCap] = useState(10);
  const [freeUsedToday, setFreeUsedToday] = useState(false);

  useEffect(() => {
    api.getStamps()
      .then((data) => {
        if (data && typeof data.balance === 'number') {
          setBalance(data.balance);
          setFreeUsedToday(data.freeWritingUsedToday || false);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-[#FAF5EB] border-2 border-ink rounded-2xl p-4 sm:p-5 shadow-brutal-md flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red border border-ink" />
          <span className="text-[11px] font-mono font-black uppercase tracking-wider text-red">
            SỔ TEM HỌC TẬP
          </span>
          <span className="text-[10px] font-mono font-bold text-ink-muted px-2 py-0.5 rounded border border-ink/20 bg-card">
            {balance}/{maxCap} tem
          </span>
        </div>

        <h4 className="text-sm sm:text-base font-black text-ink font-serif">
          Tích lũy tem để đổi lượt chấm AI Writing tự do
        </h4>

        {/* 10 Dấu chấm/tem trực quan */}
        <div className="flex items-center gap-1.5 pt-1">
          {Array.from({ length: 10 }).map((_, idx) => (
            <span
              key={idx}
              className={`w-3.5 h-3.5 rounded-full border border-ink transition-transform ${
                idx < balance
                  ? 'bg-red shadow-sm scale-105'
                  : 'bg-paper-2 border-dashed border-ink/40'
              }`}
              title={idx < balance ? `Tem #${idx + 1}` : `Ô trống #${idx + 1}`}
            />
          ))}
          <span className="text-xs font-mono font-black text-ink ml-1.5">
            {balance >= 10 ? '(Đầy 10/10)' : `(Còn ${10 - balance} ô)`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
        <div className="text-right hidden sm:block">
          <span className="text-[10px] font-mono font-black text-ink-muted uppercase block">Chấm AI hôm nay</span>
          <span className={`text-xs font-black ${freeUsedToday ? 'text-red' : 'text-teal'}`}>
            {freeUsedToday ? 'Đã dùng 1 lượt free' : '1 lượt miễn phí sẵn sàng'}
          </span>
        </div>

        <Link
          href="/profile#so-tem"
          className="btn btn-paper text-xs font-black shadow-brutal-sm flex items-center gap-1.5 cursor-pointer hover:bg-card"
        >
          <span>Mở Sổ Tem</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
