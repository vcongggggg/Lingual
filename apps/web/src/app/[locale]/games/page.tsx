'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, ProgressBar } from '@linguaflow/ui';
import { gamesApi } from '@/lib/api';
import { arcadeAudio } from '@/lib/arcadeAudio';
import ParticleCanvas, { ParticleCanvasHandle } from '@/components/games/ParticleCanvas';
import ComboMeter from '@/components/games/ComboMeter';
import HeartContainer from '@/components/games/HeartContainer';
import VictoryOverlay from '@/components/games/VictoryOverlay';
import GameOverOverlay from '@/components/games/GameOverOverlay';
import {
  Gamepad2,
  ArrowLeft,
  Trophy,
  Sparkles,
  Timer,
  RefreshCw,
  Zap,
  CheckCircle2,
  XCircle,
  Flame,
  Heart,
  Shield,
  Star,
  Award,
  Swords,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import Image from 'next/image';
import { mascotReactions } from '@linguaflow/config';
import MascotPopup from '@/components/MascotPopup';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export default function GamesPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const isVi = locale === 'vi';

  const particleRef = useRef<ParticleCanvasHandle | null>(null);

  // Audio State
  const [isMuted, setIsMuted] = useState(false);

  // Navigation & Tab State
  const [activeTab, setActiveTab] = useState<'games' | 'leaderboard'>('games');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

  // Active Game State
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('medium');
  const [showDifficultyModal, setShowDifficultyModal] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState(60);

  // Overlay states
  const [showVictory, setShowVictory] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [finalXP, setFinalXP] = useState(50);
  const [finalScore, setFinalScore] = useState(0);

  // Gameplay Lives & Effects State
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);
  const [isShaking, setIsShaking] = useState(false);

  // Mascot Reaction Toast State
  const [popupState, setPopupState] = useState<{
    show: boolean;
    key: any;
    title?: string;
    msg?: string;
  }>({
    show: false,
    key: 'confirm',
  });

  // GAME 1: WORD MATCH STATE
  const [matchCards, setMatchCards] = useState<any[]>([]);
  const [firstCard, setFirstCard] = useState<any | null>(null);
  const [secondCard, setSecondCard] = useState<any | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [isCheckingMatch, setIsCheckingMatch] = useState(false);
  const [matchScore, setMatchScore] = useState(0);

  // GAME 2: SENTENCE SCRAMBLE STATE
  const [scrambleList, setScrambleList] = useState<any[]>([]);
  const [scrambleIdx, setScrambleIdx] = useState(0);
  const [scrambleSelectedTokens, setScrambleSelectedTokens] = useState<string[]>([]);
  const [scrambleScore, setScrambleScore] = useState(0);

  // GAME 3: TYPING RACE STATE
  const [typingWords, setTypingWords] = useState<any[]>([]);
  const [typingIdx, setTypingIdx] = useState(0);
  const [typingInput, setTypingInput] = useState('');
  const [typingScore, setTypingScore] = useState(0);

  // GAME 4: FILL BLITZ STATE
  const [blitzQuestions, setBlitzQuestions] = useState<any[]>([]);
  const [blitzIdx, setBlitzIdx] = useState(0);
  const [blitzScore, setBlitzScore] = useState(0);

  const gamesList = [
    {
      id: 'word_match',
      title: isVi ? 'Lật Thẻ Ghép Từ 3D' : '3D Word Match Cards',
      desc: isVi ? 'Lật từng cặp thẻ bài 3D để ghép từ tiếng Anh với nghĩa tiếng Việt tương ứng.' : 'Flip 3D cards to match English words with their contextual meanings.',
      icon: '🧩',
      glow: 'teal' as const,
      bgGradient: 'from-teal-900/70 via-emerald-950/80 to-slate-950',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      bgImage: '/images/games/bg-card-word-match.png',
    },
    {
      id: 'sentence_scramble',
      title: isVi ? 'Xếp Từ Thành Câu' : 'Sentence Builder Arcade',
      desc: isVi ? 'Sắp xếp các từ xáo trộn thành câu tiếng Anh hoàn chỉnh theo đúng ngữ pháp.' : 'Unscramble mixed word tokens to construct grammatically perfect sentences.',
      icon: '🔤',
      glow: 'amber' as const,
      bgGradient: 'from-amber-900/70 via-orange-950/80 to-slate-950',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      bgImage: '/images/games/bg-card-sentence-builder.png',
    },
    {
      id: 'typing_race',
      title: isVi ? 'Đua Tốc Độ Gõ Từ' : 'Speed Typing Sprint',
      desc: isVi ? 'Thử thách gõ nhanh và chính xác các từ tiếng Anh dưới áp lực thời gian đếm ngược.' : 'Type English vocabulary fast with 100% precision before the clock expires.',
      icon: '⚡',
      glow: 'coral' as const,
      bgGradient: 'from-rose-900/70 via-orange-950/80 to-slate-950',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      bgImage: '/images/games/bg-card-typing-speed.png',
    },
    {
      id: 'fill_blitz',
      title: isVi ? 'Thách Thức 60 Giây' : '60-Second Rapid Blitz',
      desc: isVi ? 'Điền từ liên hoàn trong 60 giây để tích lũy điểm thưởng Combo Super 5X.' : 'Rapid-fire vocabulary challenge to build massive combo multipliers.',
      icon: '🎯',
      glow: 'teal' as const,
      bgGradient: 'from-indigo-900/70 via-purple-950/80 to-slate-950',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      bgImage: '/images/games/bg-card-fill-blitz.png',
    },
  ];

  // Load Leaderboard Data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await gamesApi.getLeaderboard();
        if (res?.leaderboard) {
          setLeaderboardData(res.leaderboard);
        }
      } catch {
        setLeaderboardData([
          { rank: 1, displayName: 'Thắng Trí Việt', xp: 2450, accuracy: 98, streak: 15, avatar: '👑' },
          { rank: 2, displayName: 'Học Viên Lingual', xp: 1890, accuracy: 94, streak: 10, avatar: '🥇' },
          { rank: 3, displayName: 'Minh Anh IELTS', xp: 1650, accuracy: 91, streak: 8, avatar: '🥈' },
          { rank: 4, displayName: 'Hoàng Long Code', xp: 1420, accuracy: 88, streak: 6, avatar: '🥉' },
          { rank: 5, displayName: 'Khánh Linh', xp: 1200, accuracy: 85, streak: 5, avatar: '⭐' },
        ]);
      }
    };
    fetchLeaderboard();
  }, []);

  // Timer Ticker
  useEffect(() => {
    let interval: any = null;
    if (activeGame && timerSeconds > 0 && !showVictory && !showGameOver && lives > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 6 && prev > 1) {
            arcadeAudio.playTick(true);
          }
          if (prev <= 1) {
            handleFinishCurrentGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeGame, timerSeconds, showVictory, showGameOver, lives]);

  // Handle Wrong Answer Penalty (Heart deduction + Screen Shake + SFX)
  const triggerWrongAnswer = (x?: number, y?: number) => {
    arcadeAudio.playBuzzer();
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 450);

    setCombo(1);
    setLives((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setShowGameOver(true);
      } else {
        setPopupState({
          show: true,
          key: 'wrong_mild',
          title: isVi ? 'Ối! Trừ 1 Mạng! 💔' : 'Lost 1 Life! 💔',
          msg: isVi ? 'Bò LingLing nhắc bạn chú ý quan sát kỹ hơn!' : 'Careful! Keep your focus sharp!',
        });
      }
      return next;
    });
  };

  // Handle Correct Answer Reward (SFX + Confetti + Combo Boost)
  const triggerCorrectAnswer = (x?: number, y?: number) => {
    arcadeAudio.playCoin();
    if (x && y) {
      particleRef.current?.spawnComboSpark(x, y, `${combo}x COMBO!`);
      particleRef.current?.spawnXPFloat(x, y, 25 * combo);
    }

    setCombo((prev) => {
      const next = prev + 1;
      if (next > maxCombo) setMaxCombo(next);
      arcadeAudio.playCombo(next);

      if (next >= 4) {
        setPopupState({
          show: true,
          key: 'celebrate_big',
          title: `COMBO SUPER ${next}X! 🔥`,
          msg: isVi ? 'Bò LingLing bắn tim chúc mừng bạn ghi điểm liên hoàn!' : 'Super streak! LingLing is celebrating with you!',
        });
      }
      return next;
    });
  };

  // Finish game and record attempt
  const handleFinishCurrentGame = async () => {
    const totalScore = matchScore || scrambleScore || typingScore || blitzScore || 100;
    const earnedXP = Math.round(totalScore / 10) + 20;

    setFinalScore(totalScore);
    setFinalXP(earnedXP);

    if (lives > 0) {
      setShowVictory(true);
      particleRef.current?.spawnConfetti();
    } else {
      setShowGameOver(true);
    }

    if (attemptId && activeGame) {
      try {
        await gamesApi.submitScore({
          attemptId,
          gameType: activeGame,
          userAnswers: [],
          durationSeconds: Math.max(1, 60 - timerSeconds),
        });
      } catch {}
    }
  };

  // Initialize Game Session with Selected Difficulty
  const handleStartGameWithDifficulty = async (difficulty: DifficultyLevel) => {
    if (!showDifficultyModal) return;
    const gameType = showDifficultyModal;
    setShowDifficultyModal(null);

    setActiveGame(gameType);
    setSelectedDifficulty(difficulty);
    setShowVictory(false);
    setShowGameOver(false);
    setLives(difficulty === 'hard' ? 2 : 3);
    setCombo(1);
    setMaxCombo(1);
    setFirstCard(null);
    setSecondCard(null);
    setMatchedIds([]);
    setIsCheckingMatch(false);
    setMatchScore(0);
    setScrambleIdx(0);
    setScrambleSelectedTokens([]);
    setScrambleScore(0);
    setTypingIdx(0);
    setTypingInput('');
    setTypingScore(0);
    setBlitzIdx(0);
    setBlitzScore(0);

    const initialTime = difficulty === 'easy' ? 90 : difficulty === 'medium' ? 60 : 45;
    setTimerSeconds(initialTime);

    arcadeAudio.playLaser();

    try {
      const attemptRes = await gamesApi.startAttempt(gameType);
      if (attemptRes?.attemptId) setAttemptId(attemptRes.attemptId);
      const dataRes = await gamesApi.getData(gameType);

      if (gameType === 'word_match' && dataRes?.pairs) {
        const cards: any[] = [];
        dataRes.pairs.forEach((p: any) => {
          cards.push({ id: `${p.id}-target`, pairId: p.id, text: p.targetText, type: 'target' });
          cards.push({ id: `${p.id}-trans`, pairId: p.id, text: p.translation, type: 'trans' });
        });
        cards.sort(() => Math.random() - 0.5);
        setMatchCards(cards);
      }

      if (gameType === 'sentence_scramble' && dataRes?.sentences) {
        setScrambleList(dataRes.sentences);
      }

      if (gameType === 'typing_race' && dataRes?.questions) {
        setTypingWords(dataRes.questions);
      }

      if (gameType === 'fill_blitz' && dataRes?.questions) {
        const qList = dataRes.questions.map((q: any) => ({
          q: `Điền nghĩa tiếng Việt của từ "${q.targetText}"`,
          correct: q.translation,
          options: [q.translation, 'Xin chào', 'Cảm ơn', 'Tạm biệt'].sort(() => Math.random() - 0.5),
        }));
        setBlitzQuestions(qList);
      }
    } catch {
      // Fallback local initializers
      if (gameType === 'word_match') {
        const fallbackPairs = [
          { id: 'p1', targetText: 'Resilience', translation: 'Khả năng phục hồi' },
          { id: 'p2', targetText: 'Diligent', translation: 'Chăm chỉ' },
          { id: 'p3', targetText: 'Serendipity', translation: 'Duyên may bất ngờ' },
          { id: 'p4', targetText: 'Ubiquitous', translation: 'Phổ biến khắp nơi' },
        ];
        const cards: any[] = [];
        fallbackPairs.forEach((p) => {
          cards.push({ id: `${p.id}-target`, pairId: p.id, text: p.targetText, type: 'target' });
          cards.push({ id: `${p.id}-trans`, pairId: p.id, text: p.translation, type: 'trans' });
        });
        cards.sort(() => Math.random() - 0.5);
        setMatchCards(cards);
      }
    }
  };

  // Card Flip Action (Word Match)
  const handleCardClick = (card: any, e?: React.MouseEvent) => {
    if (isCheckingMatch || matchedIds.includes(card.pairId) || firstCard?.id === card.id) return;
    arcadeAudio.playLaser();

    if (!firstCard) {
      setFirstCard(card);
      return;
    }

    setSecondCard(card);
    setIsCheckingMatch(true);

    const clientX = e?.clientX || (typeof window !== 'undefined' ? window.innerWidth / 2 : 400);
    const clientY = e?.clientY || (typeof window !== 'undefined' ? window.innerHeight / 2 : 300);

    if (firstCard.pairId === card.pairId) {
      // Matched!
      triggerCorrectAnswer(clientX, clientY);
      setMatchedIds((prev) => [...prev, card.pairId]);
      const diffMultiplier = selectedDifficulty === 'hard' ? 2 : selectedDifficulty === 'medium' ? 1.5 : 1;
      setMatchScore((prev) => prev + Math.round(100 * combo * diffMultiplier));
      setFirstCard(null);
      setSecondCard(null);
      setIsCheckingMatch(false);

      if (matchedIds.length + 1 >= matchCards.length / 2) {
        setTimeout(() => handleFinishCurrentGame(), 600);
      }
    } else {
      // Wrong Match!
      triggerWrongAnswer(clientX, clientY);
      setTimeout(() => {
        setFirstCard(null);
        setSecondCard(null);
        setIsCheckingMatch(false);
      }, 900);
    }
  };

  // Sentence Scramble Token Click
  const handleScrambleTokenClick = (token: string, idx: number, e?: React.MouseEvent) => {
    arcadeAudio.playLaser();
    const currentScramble = scrambleList[scrambleIdx];
    if (!currentScramble) return;

    const newTokens = [...scrambleSelectedTokens, token];
    setScrambleSelectedTokens(newTokens);

    const clientX = e?.clientX || 400;
    const clientY = e?.clientY || 300;

    if (newTokens.length === currentScramble.tokens.length) {
      const userSentence = newTokens.join(' ').trim().toLowerCase();
      const targetSentence = currentScramble.fullSentence.trim().toLowerCase();

      if (userSentence === targetSentence) {
        triggerCorrectAnswer(clientX, clientY);
        const diffMultiplier = selectedDifficulty === 'hard' ? 2 : selectedDifficulty === 'medium' ? 1.5 : 1;
        setScrambleScore((prev) => prev + Math.round(150 * combo * diffMultiplier));

        if (scrambleIdx + 1 < scrambleList.length) {
          setTimeout(() => {
            setScrambleIdx((prev) => prev + 1);
            setScrambleSelectedTokens([]);
          }, 600);
        } else {
          setTimeout(() => handleFinishCurrentGame(), 600);
        }
      } else {
        triggerWrongAnswer(clientX, clientY);
        setTimeout(() => {
          setScrambleSelectedTokens([]);
        }, 800);
      }
    }
  };

  // Typing Race Input Change
  const handleTypingChange = (val: string) => {
    setTypingInput(val);
    const targetWord = typingWords[typingIdx]?.targetText || typingWords[typingIdx]?.word;

    if (targetWord && val.trim().toLowerCase() === targetWord.trim().toLowerCase()) {
      triggerCorrectAnswer(typeof window !== 'undefined' ? window.innerWidth / 2 : 400, 300);
      const diffMultiplier = selectedDifficulty === 'hard' ? 2 : selectedDifficulty === 'medium' ? 1.5 : 1;
      setTypingScore((prev) => prev + Math.round(120 * combo * diffMultiplier));
      setTypingInput('');

      if (typingIdx + 1 < typingWords.length) {
        setTypingIdx((prev) => prev + 1);
      } else {
        setTimeout(() => handleFinishCurrentGame(), 500);
      }
    }
  };

  // Fill Blitz Answer Selection
  const handleBlitzAnswer = (opt: string, e?: React.MouseEvent) => {
    const currentQ = blitzQuestions[blitzIdx];
    if (!currentQ) return;

    const clientX = e?.clientX || 400;
    const clientY = e?.clientY || 300;

    if (opt === currentQ.correct) {
      triggerCorrectAnswer(clientX, clientY);
      const diffMultiplier = selectedDifficulty === 'hard' ? 2 : selectedDifficulty === 'medium' ? 1.5 : 1;
      setBlitzScore((prev) => prev + Math.round(100 * combo * diffMultiplier));
    } else {
      triggerWrongAnswer(clientX, clientY);
    }

    if (blitzIdx + 1 < blitzQuestions.length) {
      setBlitzIdx((prev) => prev + 1);
    } else {
      setTimeout(() => handleFinishCurrentGame(), 500);
    }
  };

  return (
    <div className={`relative min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 font-sans ${isShaking ? 'animate-bounce' : ''}`}>
      {/* 2D Particle Canvas for Confetti, Sparks & Floating XP */}
      <ParticleCanvas ref={particleRef} />

      {/* Main Header / Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl shadow-xl relative z-10">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/dashboard`}
            className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            aria-label="Trở về lộ trình học"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-400">
              <Gamepad2 className="w-4 h-4" />
              <span>{isVi ? 'LinguaFlow Arcade Hub' : 'Arcade Game Center'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              {isVi ? 'Đấu Trường Luyện Game' : 'Gamified Arcade Arena'}
            </h1>
          </div>
        </div>

        {/* Top Controls: Audio Toggle & Tabs */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => {
              const muted = arcadeAudio.toggleMute();
              setIsMuted(muted);
            }}
            aria-label={isMuted ? 'Bật âm thanh game' : 'Tắt âm thanh game'}
            className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-amber-300 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
          </button>

          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-950/80 border border-slate-800">
            <button
              onClick={() => {
                arcadeAudio.playLaser();
                setActiveTab('games');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-display font-bold text-xs transition-all ${
                activeTab === 'games'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isVi ? 'Trò Chơi' : 'Arcade Games'}
            </button>
            <button
              onClick={() => {
                arcadeAudio.playLaser();
                setActiveTab('leaderboard');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-display font-bold text-xs transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isVi ? 'Bảng Xếp Hạng' : 'Leaderboard'}
            </button>
          </div>
        </div>
      </div>

      {/* ARCADE GAMES LISTING GRID */}
      {activeTab === 'games' && !activeGame && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {gamesList.map((g) => (
            <motion.div
              key={g.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-5 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-3 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
                    {g.icon}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${g.badgeColor}`}>
                    {isVi ? 'Tích lũy XP x5' : 'Earn 5X XP'}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white group-hover:text-amber-300 transition-colors">
                  {g.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans min-h-[40px]">
                  {g.desc}
                </p>
              </div>

              <Button
                variant="accent"
                size="md"
                className="w-full font-bold"
                onClick={() => {
                  arcadeAudio.playLaser();
                  setShowDifficultyModal(g.id);
                }}
                icon={<Play className="w-4 h-4 fill-slate-950" />}
              >
                {isVi ? 'Chơi Ngay' : 'Play Now'}
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* LEADERBOARD TAB */}
      {activeTab === 'leaderboard' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-6 relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span>{isVi ? 'Bảng Vinh Danh Arcade' : 'Arcade Champions'}</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">Tuần này</span>
          </div>

          <div className="space-y-2.5">
            {leaderboardData.map((player) => (
              <div
                key={player.rank}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-850 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-900 font-mono font-extrabold text-sm flex items-center justify-center text-amber-300 border border-slate-800">
                    #{player.rank}
                  </span>
                  <span className="text-xl">{player.avatar}</span>
                  <div>
                    <span className="font-display font-bold text-sm text-white block">
                      {player.displayName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      🔥 {player.streak} ngày streak • {player.accuracy}% chính xác
                    </span>
                  </div>
                </div>

                <span className="font-mono font-extrabold text-sm text-teal-300">
                  {player.xp.toLocaleString()} XP
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE GAME CONTAINER */}
      {activeGame && (
        <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-amber-500/30 backdrop-blur-2xl shadow-2xl space-y-6 z-10 max-w-4xl mx-auto">
          {/* Active Game Top Status Bar (Timer, Combo, Lives, Exit) */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <button
              onClick={() => {
                arcadeAudio.playLaser();
                setActiveGame(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isVi ? 'Thoát' : 'Quit'}</span>
            </button>

            <div className="flex items-center gap-3">
              {/* Combo Multiplier Meter */}
              <ComboMeter combo={combo} />

              {/* Heart Lives Container */}
              <HeartContainer lives={lives} maxLives={selectedDifficulty === 'hard' ? 2 : 3} />

              {/* Countdown Timer */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border font-mono font-extrabold text-xs shadow-sm ${
                  timerSeconds <= 10
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                    : 'bg-slate-900 text-teal-300 border-slate-800'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>{timerSeconds}s</span>
              </div>
            </div>
          </div>

          {/* GAME 1: 3D WORD MATCH */}
          {activeGame === 'word_match' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{isVi ? 'Ghép cặp thẻ bài tương ứng' : 'Match identical pairs'}</span>
                <span className="font-mono font-bold text-amber-300">
                  {matchedIds.length} / {matchCards.length / 2} {isVi ? 'Cặp Hoàn Thành' : 'Pairs'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {matchCards.map((card) => {
                  const isMatched = matchedIds.includes(card.pairId);
                  const isSelected = firstCard?.id === card.id || secondCard?.id === card.id;

                  return (
                    <motion.button
                      key={card.id}
                      disabled={isMatched || isCheckingMatch}
                      onClick={(e) => handleCardClick(card, e)}
                      whileHover={!isMatched ? { scale: 1.04 } : {}}
                      whileTap={!isMatched ? { scale: 0.96 } : {}}
                      className={`h-28 rounded-2xl p-3 flex items-center justify-center text-center font-display font-extrabold text-sm sm:text-base border transition-all duration-300 shadow-md ${
                        isMatched
                          ? 'bg-teal-500/20 border-teal-500/40 text-teal-300 opacity-60'
                          : isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/30 scale-105'
                          : 'bg-slate-950/80 border-slate-800 text-white hover:border-slate-700'
                      }`}
                    >
                      <span>{card.text}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* GAME 2: SENTENCE SCRAMBLE */}
          {activeGame === 'sentence_scramble' && scrambleList[scrambleIdx] && (
            <div className="space-y-6 text-center">
              <p className="text-sm sm:text-base font-bold text-amber-300 bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
                "{scrambleList[scrambleIdx].translation}"
              </p>

              <div className="min-h-16 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap gap-2 items-center justify-center">
                {scrambleSelectedTokens.map((token, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm">
                    {token}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2.5 justify-center">
                {scrambleList[scrambleIdx].tokens.map((token: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={(e) => handleScrambleTokenClick(token, idx, e)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 font-bold text-sm text-white transition-all active:scale-95 shadow-md"
                  >
                    {token}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GAME 3: TYPING RACE */}
          {activeGame === 'typing_race' && typingWords[typingIdx] && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                  {isVi ? 'Gõ từ tiếng Anh chuẩn xác:' : 'Type the exact target word:'}
                </span>
                <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
                  {typingWords[typingIdx].word || typingWords[typingIdx].targetText}
                </h2>
                <p className="text-xs text-slate-400">({typingWords[typingIdx].translation})</p>
              </div>

              <input
                type="text"
                autoFocus
                value={typingInput}
                onChange={(e) => handleTypingChange(e.target.value)}
                placeholder={isVi ? 'Gõ từ tại đây...' : 'Type word here...'}
                className="w-full p-4 rounded-2xl bg-slate-950 border-2 border-rose-500/40 text-center font-display font-bold text-xl text-white outline-none focus:border-rose-400 shadow-inner"
              />
            </div>
          )}

          {/* GAME 4: FILL BLITZ */}
          {activeGame === 'fill_blitz' && blitzQuestions[blitzIdx] && (
            <div className="space-y-6">
              <h3 className="text-2xl font-display font-bold text-white text-center py-2">
                {blitzQuestions[blitzIdx].q}
              </h3>

              <div className="grid grid-cols-2 gap-3.5">
                {blitzQuestions[blitzIdx].options.map((opt: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={(e) => handleBlitzAnswer(opt, e)}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400 font-bold text-sm text-white transition-all active:scale-95 shadow-md"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* DIFFICULTY SELECTION MODAL */}
      {showDifficultyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-lg text-white">
                {isVi ? 'Chọn Cấp Độ Thử Thách' : 'Select Difficulty'}
              </h3>
              <button
                onClick={() => setShowDifficultyModal(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleStartGameWithDifficulty(diff)}
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-850 hover:border-amber-500/50 flex items-center justify-between text-left transition-all group"
                >
                  <div>
                    <span className="font-display font-bold text-sm text-white group-hover:text-amber-300 block">
                      {diff === 'easy' ? (isVi ? 'Dễ (90s / 3 Mạng)' : 'Easy (90s / 3 Lives)') : diff === 'medium' ? (isVi ? 'Chuẩn (60s / 3 Mạng)' : 'Medium (60s / 3 Lives)') : (isVi ? 'Khó (45s / 2 Mạng / x2 XP)' : 'Hard (45s / 2 Lives / 2X XP)')}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {diff === 'hard' ? (isVi ? 'Nhận nhân đôi điểm thưởng XP' : 'Earn 2X bonus XP multiplier') : (isVi ? 'Phù hợp làm quen nhịp độ' : 'Standard arcade gameplay')}
                    </span>
                  </div>
                  <Play className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* VICTORY MODAL OVERLAY */}
      {showVictory && (
        <VictoryOverlay
          score={finalScore}
          xpEarned={finalXP}
          maxCombo={maxCombo}
          accuracy={95}
          onPlayAgain={() => {
            setShowVictory(false);
            if (activeGame) setShowDifficultyModal(activeGame);
          }}
          onExit={() => {
            setShowVictory(false);
            setActiveGame(null);
          }}
          locale={locale}
        />
      )}

      {/* GAME OVER MODAL OVERLAY */}
      {showGameOver && (
        <GameOverOverlay
          score={finalScore}
          onRetry={() => {
            setShowGameOver(false);
            if (activeGame) setShowDifficultyModal(activeGame);
          }}
          onExit={() => {
            setShowGameOver(false);
            setActiveGame(null);
          }}
          locale={locale}
        />
      )}

      {/* Mascot Corner Notification */}
      <MascotPopup
        isVisible={popupState.show}
        reactionKey={popupState.key}
        title={popupState.title}
        message={popupState.msg}
        autoDismissMs={2500}
        onClose={() => setPopupState((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
