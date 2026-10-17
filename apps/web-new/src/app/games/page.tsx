'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LingLing } from '../../components/ui/LingLing';
import { Zap, Shuffle, Keyboard, CheckCircle, Trophy, RotateCcw } from 'lucide-react';

const MATCH_PAIRS = [
  { id: 1, en: 'Environment', vi: 'Môi trường sống' },
  { id: 2, idMatch: 2, en: 'Perseverance', vi: 'Sự kiên trì' },
  { id: 3, idMatch: 3, en: 'Substantial', vi: 'Đáng kể' },
  { id: 4, idMatch: 4, en: 'Achieve', vi: 'Đạt được' },
];

export default function GamesPage() {
  const [selectedEn, setSelectedEn] = useState<string | null>(null);
  const [selectedVi, setSelectedVi] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [gameActive, setGameActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (gameActive && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setGameActive(false);
    }
    return () => clearInterval(interval);
  }, [gameActive, timer]);

  const handleStartGame = () => {
    setMatchedIds([]);
    setSelectedEn(null);
    setSelectedVi(null);
    setScore(0);
    setTimer(60);
    setGameActive(true);
  };

  const handleEnClick = (enWord: string) => {
    setSelectedEn(enWord);
    if (selectedVi) checkMatch(enWord, selectedVi);
  };

  const handleViClick = (viWord: string) => {
    setSelectedVi(viWord);
    if (selectedEn) checkMatch(selectedEn, viWord);
  };

  const checkMatch = (en: string, vi: string) => {
    const pair = MATCH_PAIRS.find((p) => p.en === en && p.vi === vi);
    if (pair) {
      setMatchedIds((prev) => [...prev, pair.id]);
      setScore((s) => s + 25);
    }
    setSelectedEn(null);
    setSelectedVi(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 text-left space-y-10">
      {/* Header */}
      <div className="pb-6 border-b-2 border-ink/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber block mb-1">
            Đấu trường phản xạ · 4 Chế độ
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
            Game Center Tiếng Anh 🎮
          </h1>
          <p className="text-sm text-ink-soft mt-1">
            Biến những phút rảnh rỗi thành một trận đấu tốc độ thú vị để ghi nhớ từ vựng phản xạ.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-card border-2 border-ink rounded-xl px-4 py-2 shadow-brutal-sm">
            <Trophy className="w-4 h-4 text-amber" />
            <span className="text-xs font-black text-ink">Điểm: {score} XP</span>
          </div>
        </div>
      </div>

      {/* Đấu Trường Nối Từ Trực Tiếp (Interactive Word Match Arena) */}
      <div className="bg-card border-2 border-ink rounded-3xl shadow-brutal-xl p-8 sm:p-10 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <Badge variant="amber">Minigame 01</Badge>
            <h3 className="text-2xl font-black text-ink mt-1">Nối Từ Siêu Tốc (Word Match)</h3>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-black text-red bg-paper-2 border-2 border-ink rounded-xl px-3 py-1.5 shadow-brutal-sm">
              Thời gian: {timer}s
            </span>
            <Button variant={gameActive ? 'paper' : 'red'} size="sm" onClick={handleStartGame}>
              {gameActive ? 'Chơi Lại' : 'Bắt Đầu Chơi →'}
            </Button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-ink-soft">
          Quy tắc: Chọn một thẻ từ tiếng Anh ở cột trái, rồi chọn nghĩa tiếng Việt tương ứng ở cột phải để ghi điểm!
        </p>

        {/* Bàn Cờ Nối Thẻ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          {/* Cột Tiếng Anh */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-ink-soft block">
              Từ Tiếng Anh:
            </span>
            {MATCH_PAIRS.map((p) => {
              const isMatched = matchedIds.includes(p.id);
              const isSelected = selectedEn === p.en;

              return (
                <button
                  key={p.en}
                  disabled={isMatched || !gameActive}
                  onClick={() => handleEnClick(p.en)}
                  className={`w-full p-4 rounded-xl border-2 border-ink text-left font-black text-base shadow-brutal-sm transition-all cursor-pointer ${
                    isMatched
                      ? 'bg-teal text-white border-teal opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'bg-amber text-ink scale-[1.02] shadow-brutal'
                      : 'bg-paper hover:bg-paper-2 text-ink'
                  }`}
                >
                  {p.en} {isMatched && '✓'}
                </button>
              );
            })}
          </div>

          {/* Cột Tiếng Việt */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-ink-soft block">
              Nghĩa Tiếng Việt:
            </span>
            {MATCH_PAIRS.map((p) => {
              const isMatched = matchedIds.includes(p.id);
              const isSelected = selectedVi === p.vi;

              return (
                <button
                  key={p.vi}
                  disabled={isMatched || !gameActive}
                  onClick={() => handleViClick(p.vi)}
                  className={`w-full p-4 rounded-xl border-2 border-ink text-left font-black text-base shadow-brutal-sm transition-all cursor-pointer ${
                    isMatched
                      ? 'bg-teal text-white border-teal opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'bg-amber text-ink scale-[1.02] shadow-brutal'
                      : 'bg-paper hover:bg-paper-2 text-ink'
                  }`}
                >
                  {p.vi} {isMatched && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {matchedIds.length === MATCH_PAIRS.length && (
          <div className="p-4 bg-teal text-white rounded-xl font-black text-center shadow-brutal-sm">
            Tuyệt vời! Bạn đã ghép đúng toàn bộ các cặp từ! (+100 XP) 🎉
          </div>
        )}
      </div>

      {/* 3 Chế Độ Khác */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border-2 border-ink rounded-2xl p-6 shadow-brutal-md flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-red/10 border-2 border-ink rounded-xl flex items-center justify-center text-red mb-3">
              <Shuffle className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-black text-ink mb-1">Xếp Câu Trật Tự</h4>
            <p className="text-xs text-ink-soft leading-relaxed">Sắp xếp các khối từ đảo lộn thành câu hoàn chỉnh theo ngữ pháp.</p>
          </div>
          <Button variant="paper" size="sm" className="mt-4 w-full" onClick={() => alert('Chế độ Xếp Câu đang sẵn sàng!')}>
            Chơi Thử →
          </Button>
        </div>

        <div className="bg-card border-2 border-ink rounded-2xl p-6 shadow-brutal-md flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-teal/15 border-2 border-ink rounded-xl flex items-center justify-center text-teal mb-3">
              <Keyboard className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-black text-ink mb-1">Gõ Phím Thần Tốc</h4>
            <p className="text-xs text-ink-soft leading-relaxed">Gõ đúng chính tả các từ vựng đang xuất hiện trước khi hết giờ.</p>
          </div>
          <Button variant="paper" size="sm" className="mt-4 w-full" onClick={() => alert('Chế độ Gõ Phím đang sẵn sàng!')}>
            Chơi Thử →
          </Button>
        </div>

        <div className="bg-card border-2 border-ink rounded-2xl p-6 shadow-brutal-md flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-amber/20 border-2 border-ink rounded-xl flex items-center justify-center text-ink mb-3">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-black text-ink mb-1">Điền Khuyết Thử Thách</h4>
            <p className="text-xs text-ink-soft leading-relaxed">Chọn từ còn thiếu phù hợp nhất với ngữ cảnh câu tiếng Anh.</p>
          </div>
          <Button variant="paper" size="sm" className="mt-4 w-full" onClick={() => alert('Chế độ Điền Khuyết đang sẵn sàng!')}>
            Chơi Thử →
          </Button>
        </div>
      </div>
    </div>
  );
}
