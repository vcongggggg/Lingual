'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  Shuffle,
  Keyboard,
  CheckCircle,
  Trophy,
  RotateCcw,
  Sparkles,
  Gamepad2,
  Volume2,
  Clock,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { api } from '../../lib/api';
import { LingLing } from '../../components/ui/LingLing';

interface GameTicket {
  id: string;
  ticketCode: string;
  title: string;
  englishTitle: string;
  desc: string;
  badge: string;
  xpReward: string;
  icon: any;
  accentColor: string;
}

const GAME_TICKETS: GameTicket[] = [
  {
    id: 'word-match',
    ticketCode: 'TICKET-01',
    title: 'Nối từ siêu tốc',
    englishTitle: 'Speed Word Match',
    desc: 'Nối các cặp từ vựng tiếng Anh với nghĩa tiếng Việt chuẩn xác trong thời gian 60 giây.',
    badge: 'Từ vựng',
    xpReward: '+25 XP',
    icon: Zap,
    accentColor: 'border-teal bg-teal/10 text-teal',
  },
  {
    id: 'scramble',
    ticketCode: 'TICKET-02',
    title: 'Xếp câu trật tự',
    englishTitle: 'Sentence Scramble',
    desc: 'Sắp xếp các khối từ bị đảo lộn thành câu văn hoàn chỉnh đúng ngữ pháp và cấu trúc.',
    badge: 'Ngữ pháp',
    xpReward: '+30 XP',
    icon: Shuffle,
    accentColor: 'border-amber bg-amber/10 text-amber',
  },
  {
    id: 'fast-typing',
    ticketCode: 'TICKET-03',
    title: 'Gõ phím thần tốc',
    englishTitle: 'Spelling Rain',
    desc: 'Gõ đúng chính tả các từ vựng đang rơi để rèn luyện tốc độ phản xạ và trí nhớ bàn tay.',
    badge: 'Chính tả',
    xpReward: '+40 XP',
    icon: Keyboard,
    accentColor: 'border-red bg-red/10 text-red',
  },
  {
    id: 'word-fill',
    ticketCode: 'TICKET-04',
    title: 'Điền khuyết ngữ cảnh',
    englishTitle: 'Context Cloze Challenge',
    desc: 'Chọn từ còn thiếu phù hợp nhất với ngữ cảnh đoạn văn bản xứ chuẩn ngữ điệu.',
    badge: 'Ngữ cảnh',
    xpReward: '+20 XP',
    icon: CheckCircle,
    accentColor: 'border-ink bg-card text-ink',
  },
  {
    id: 'listening-challenge',
    ticketCode: 'TICKET-05',
    title: 'Đố vui nghe âm',
    englishTitle: 'Audio Ear Training',
    desc: 'Lắng nghe phát âm của người bản ngữ và chọn từ vựng đúng trong vòng 3 giây.',
    badge: 'Thính giác',
    xpReward: '+35 XP',
    icon: Volume2,
    accentColor: 'border-teal bg-teal/10 text-teal',
  },
  {
    id: 'word-guess',
    ticketCode: 'TICKET-06',
    title: 'Đoán từ 5 chữ cái',
    englishTitle: 'Five-Letter Puzzle',
    desc: 'Thử tài suy đoán từ vựng tiếng Anh 5 chữ cái qua các gợi ý màu sắc sau 6 lần đoán.',
    badge: 'Tư duy',
    xpReward: '+50 XP',
    icon: HelpCircle,
    accentColor: 'border-amber bg-amber/10 text-amber',
  },
];

const MATCH_PAIRS = [
  { id: 1, en: 'Environment', vi: 'Môi trường sống' },
  { id: 2, en: 'Perseverance', vi: 'Sự kiên trì' },
  { id: 3, en: 'Substantial', vi: 'Đáng kể' },
  { id: 4, en: 'Achieve', vi: 'Đạt được' },
];

const LEADERBOARD_ROWS = [
  { rank: 1, name: 'Minh Trí', badge: 'Quán quân', score: '3.450 XP', gamesPlayed: 48, date: '17/10/2026' },
  { rank: 2, name: 'Thu Thảo', badge: 'Á quân', score: '2.920 XP', gamesPlayed: 39, date: '17/10/2026' },
  { rank: 3, name: 'Quốc Bảo', badge: 'Hạng ba', score: '2.680 XP', gamesPlayed: 32, date: '16/10/2026' },
  { rank: 4, name: 'Hoàng Nam', badge: 'Học viên', score: '2.140 XP', gamesPlayed: 25, date: '16/10/2026' },
  { rank: 5, name: 'Bạn (Hiện tại)', badge: 'Đang phấn đấu', score: '1.250 XP', gamesPlayed: 14, date: 'Hôm nay' },
];

export default function GamesPage() {
  const [activeTab, setActiveTab] = useState<'hub' | 'play' | 'leaderboard'>('hub');
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 pb-28 sm:pb-20 text-left">
      {/* Header Khu Trò Chơi */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-amber">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Khu Trò Chơi Tiếng Anh</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight font-sans">
              Đấu trường phản xạ từ vựng & ngữ pháp
            </h1>

            <p className="text-sm sm:text-base text-ink-soft leading-relaxed font-sans">
              Biến những phút rèn luyện thành các ván đấu tốc độ cuốn hút.
              Ghi nhớ từ vựng phản xạ tự nhiên không gây nhàm chán.
            </p>
          </div>

          <div className="flex flex-col items-center relative flex-shrink-0">
            <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
              Chơi ngay một ván <span className="text-red">60 giây</span> nhé!
            </div>
            <LingLing reaction="greet" size={120} />
          </div>
        </div>

        {/* Tab chuyển đổi chế độ */}
        <div className="pt-6 mt-6 border-t-2 border-ink/15 w-full overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2.5 min-w-max">
            <button
              onClick={() => setActiveTab('hub')}
              className={`px-4 py-2.5 rounded-xl border-2 border-ink text-xs font-black transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeTab === 'hub'
                  ? 'bg-ink text-paper shadow-brutal-sm'
                  : 'bg-card text-ink hover:bg-paper-2'
              }`}
            >
              Danh sách vé trò chơi
            </button>
            <button
              onClick={() => {
                setActiveTab('play');
                if (!gameActive) handleStartGame();
              }}
              className={`px-4 py-2.5 rounded-xl border-2 border-ink text-xs font-black transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeTab === 'play'
                  ? 'bg-ink text-paper shadow-brutal-sm'
                  : 'bg-card text-ink hover:bg-paper-2'
              }`}
            >
              Đấu trường Nối từ trực tiếp
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-2.5 rounded-xl border-2 border-ink text-xs font-black transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeTab === 'leaderboard'
                  ? 'bg-ink text-paper shadow-brutal-sm'
                  : 'bg-card text-ink hover:bg-paper-2'
              }`}
            >
              Bảng xếp hạng danh dự
            </button>
          </div>
        </div>
      </div>

      {/* CHẾ ĐỘ 1: DANH SÁCH THẺ GAME VẼ NHƯ "VÉ TRÒ CHƠI" GIẤY */}
      {activeTab === 'hub' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-ink font-sans">
              Các chế độ trò chơi sẵn có
            </h2>
            <span className="text-xs font-bold text-ink-muted">6 trò chơi phản xạ</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GAME_TICKETS.map((ticket) => {
              const Icon = ticket.icon;
              return (
                <div
                  key={ticket.id}
                  className="card-paper p-6 flex flex-col justify-between space-y-5 bg-card hover:-translate-y-1 transition-all relative border-2 border-dashed border-ink/40"
                >
                  {/* Cuống vé: Header + Code */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b-2 border-dashed border-ink/20 pb-2.5">
                      <span className="font-mono text-[10px] font-black uppercase tracking-wider text-ink-muted">
                        {ticket.ticketCode}
                      </span>
                      {/* XP Thưởng Dạng Stamp Con Dấu Mực */}
                      <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded border-2 border-red bg-red/10 text-red -rotate-2 shadow-brutal-sm">
                        {ticket.xpReward}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl border-2 border-ink bg-paper-2 flex items-center justify-center text-ink shadow-brutal-sm flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-ink font-sans leading-tight">
                          {ticket.title}
                        </h3>
                        <span className="text-[11px] font-mono font-bold text-ink-muted block">
                          {ticket.englishTitle}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-ink-soft leading-relaxed font-sans">
                      {ticket.desc}
                    </p>
                  </div>

                  {/* Nút Đỏ "Chơi ngay" */}
                  <div className="pt-2 border-t-2 border-dashed border-ink/20">
                    <button
                      onClick={() => {
                        setActiveTab('play');
                        handleStartGame();
                      }}
                      className="w-full btn btn-red text-xs font-black shadow-brutal flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Chơi ngay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CHẾ ĐỘ 2: ĐẤU TRƯỜNG NỐI TỪ TRỰC TIẾP */}
      {activeTab === 'play' && (
        <div className="card-paper p-6 sm:p-10 space-y-6 bg-card shadow-brutal-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-ink/20 pb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-teal block">
                Đang chơi: Nối từ siêu tốc
              </span>
              <h2 className="text-2xl font-black text-ink font-sans">
                Đấu trường phản xạ từ vựng
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-black text-red bg-paper-2 border-2 border-ink rounded-xl px-3 py-1.5 shadow-brutal-sm">
                Thời gian: {timer}s
              </span>
              <span className="font-mono text-sm font-black text-ink bg-amber border-2 border-ink rounded-xl px-3 py-1.5 shadow-brutal-sm">
                Điểm: {score} XP
              </span>
              <button
                onClick={handleStartGame}
                className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Chơi lại</span>
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-ink-soft font-sans">
            Hướng dẫn: Nhấp chọn một từ tiếng Anh ở cột trái, sau đó chọn nghĩa tiếng Việt tương ứng ở cột phải để hoàn thành cặp từ.
          </p>

          {/* Bàn Cờ Thẻ Giấy Nối Từ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Cột Tiếng Anh */}
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-ink-muted block">
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
              <span className="text-xs font-black uppercase tracking-wider text-ink-muted block">
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

          {/* Khi hoàn thành toàn bộ cặp từ */}
          {matchedIds.length === MATCH_PAIRS.length && (
            <div className="p-6 bg-paper-2 border-2 border-ink rounded-2xl text-center space-y-3 animate-in fade-in duration-200">
              <span className="text-xl font-black text-ink block font-sans">
                Tuyệt vời! Bạn đã ghép đúng toàn bộ các cặp từ! (+100 XP)
              </span>
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleStartGame}
                  className="btn btn-red text-xs font-black shadow-brutal"
                >
                  Chơi ván tiếp theo
                </button>
                <button
                  onClick={() => setActiveTab('hub')}
                  className="btn btn-paper text-xs font-black shadow-brutal"
                >
                  Về danh sách vé
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CHẾ ĐỘ 3: TAB "BẢNG XẾP HẠNG" VẼ NHƯ BẢNG GIẤY KẺ */}
      {activeTab === 'leaderboard' && (
        <div className="card-paper p-6 sm:p-8 space-y-6 bg-card shadow-brutal-xl">
          <div className="flex items-center justify-between border-b-2 border-ink/20 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-amber block">
                Vinh danh bảng vàng
              </span>
              <h2 className="text-2xl font-black text-ink font-sans">
                Bảng xếp hạng học viên tích cực
              </h2>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-ink bg-paper-2 flex items-center justify-center text-amber shadow-brutal-sm">
              <Trophy className="w-5 h-5" />
            </div>
          </div>

          {/* Bảng Giấy Kẻ (Lined Paper Table) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-ink text-xs font-black uppercase tracking-wider text-ink-muted">
                  <th className="py-3 px-3">Hạng</th>
                  <th className="py-3 px-3">Học viên</th>
                  <th className="py-3 px-3">Danh hiệu</th>
                  <th className="py-3 px-3 text-right">Tổng điểm XP</th>
                  <th className="py-3 px-3 text-right">Số ván chơi</th>
                  <th className="py-3 px-3 text-right">Gần nhất</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/15 text-sm font-sans font-bold">
                {LEADERBOARD_ROWS.map((row) => {
                  const isTop1 = row.rank === 1;
                  const isTop2 = row.rank === 2;
                  const isTop3 = row.rank === 3;
                  const isMe = row.rank === 5;

                  return (
                    <tr
                      key={row.rank}
                      className={`transition-colors ${
                        isMe
                          ? 'bg-amber/15 font-black text-ink'
                          : 'hover:bg-paper-2'
                      }`}
                    >
                      <td className="py-3.5 px-3 font-mono">
                        <span
                          className={`w-7 h-7 rounded-full border border-ink inline-flex items-center justify-center font-black text-xs ${
                            isTop1
                              ? 'bg-amber text-ink'
                              : isTop2
                              ? 'bg-paper-2 text-ink'
                              : isTop3
                              ? 'bg-card text-ink'
                              : 'bg-card text-ink-muted'
                          }`}
                        >
                          {row.rank}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-ink">
                        {row.name}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-xs px-2.5 py-0.5 rounded border border-ink/40 bg-card text-ink-soft">
                          {row.badge}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-red font-black">
                        {row.score}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-ink">
                        {row.gamesPlayed} ván
                      </td>
                      <td className="py-3.5 px-3 text-right text-xs text-ink-muted">
                        {row.date}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
