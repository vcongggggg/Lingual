'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { gamesApi } from '@/lib/api';
import { arcadeAudio } from '@/lib/arcadeAudio';
import { useAuth } from '@/contexts/AuthContext';
import ParticleCanvas, { ParticleCanvasHandle } from '@/components/games/ParticleCanvas';
import ComboMeter from '@/components/games/ComboMeter';
import HeartContainer from '@/components/games/HeartContainer';
import VictoryOverlay from '@/components/games/VictoryOverlay';
import GameOverOverlay from '@/components/games/GameOverOverlay';
import WordMatchGame, { WordMatchPair } from '@/components/games/WordMatchGame';
import SentenceScrambleGame, { ScrambleQuestion } from '@/components/games/SentenceScrambleGame';
import SpeedTypingGame, { TypingQuestion } from '@/components/games/SpeedTypingGame';
import FillBlitzGame, { BlitzQuestion } from '@/components/games/FillBlitzGame';
import LingoWordleGame from '@/components/games/LingoWordleGame';
import SoundReflexGame, { SoundQuestion } from '@/components/games/SoundReflexGame';
import LiveMascotCompanion, { MascotReaction } from '@/components/games/LiveMascotCompanion';
import {
  Gamepad2,
  ArrowLeft,
  Trophy,
  Timer,
  Play,
  Volume2,
  VolumeX,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import MascotPopup from '@/components/MascotPopup';
import {
  UNIVERSAL_VOCABULARY,
  WORDLE_WORDS_BANK,
  WordleTarget,
  getFilteredVocabulary,
  generateSmartDistractors,
  getRandomWordleTarget,
  getScrambleQuestions,
} from '@/lib/data/universalMasterData';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface ArcadeGameItem {
  id: string;
  title: string;
  desc: string;
  badgeColor: string;
  image3d: string;
  glowColor: string;
}

function TiltGameCard({
  game,
  isVi,
  onStart,
}: {
  game: ArcadeGameItem;
  isVi: boolean;
  onStart: () => void;
}) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rX = ((y - centerY) / centerY) * -8;
    const rY = ((x - centerX) / centerX) * 8;
    setRotateX(rX);
    setRotateY(rY);
    setSpotlight({ x, y, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div style={{ perspective: 1000 }} className="relative pt-6 overflow-visible">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        style={{ transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative rounded-[26px] bg-[#101424]/90 border border-slate-800/80 hover:border-cyan-400/60 backdrop-blur-2xl p-6 pt-7 flex flex-col justify-between min-h-[225px] transition-all duration-300 overflow-visible group shadow-[0_16px_45px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.08)] hover:shadow-[0_20px_50px_rgba(34,211,238,0.18),inset_0_1px_2px_rgba(255,255,255,0.2)]"
      >
        {/* Spotlight Glow */}
        <div
          className="absolute inset-0 rounded-[26px] pointer-events-none transition-opacity duration-300 z-10"
          style={{
            opacity: spotlight.opacity,
            background: `radial-gradient(350px circle at ${spotlight.x}px ${spotlight.y}px, rgba(34,211,238,0.15), transparent 80%)`,
          }}
        />

        {/* Ambient Bloom */}
        <div className="absolute inset-0 rounded-[26px] overflow-hidden pointer-events-none z-0">
          <div
            className={`absolute -top-12 -right-6 w-52 h-48 rounded-full ${game.glowColor} blur-[65px] opacity-75 group-hover:opacity-100 transition-opacity duration-500`}
          />
        </div>

        {/* 3D POP-OUT OBJECT */}
        <div
          className="absolute -top-10 -right-4 sm:-right-6 w-32 h-32 sm:w-36 sm:h-36 z-30 pointer-events-none transition-transform duration-300 ease-out group-hover:-translate-y-3 group-hover:scale-115 group-hover:rotate-3"
          style={{ transform: 'translateZ(55px)' }}
        >
          <img
            src={game.image3d}
            alt={game.title}
            className="w-full h-full object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.85)] filter mix-blend-screen"
          />
        </div>

        {/* Info Layer */}
        <div className="relative z-20 space-y-2 pr-20" style={{ transform: 'translateZ(25px)' }}>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-extrabold uppercase tracking-wider border shadow-sm ${game.badgeColor}`}
            >
              {game.id === 'lingo_wordle' || game.id === 'sound_reflex' ? 'HOT NEW' : 'ARCADE'}
            </span>
          </div>

          <div>
            <h3 className="text-xl font-display font-black text-white group-hover:text-cyan-300 transition-colors leading-tight">
              {game.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
              {game.desc}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="relative z-20 pt-2.5" style={{ transform: 'translateZ(35px)' }}>
          <button
            onClick={onStart}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 hover:shadow-cyan-500/30 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isVi ? 'Bắt Đầu Thử Thách' : 'Start Challenge'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function GamesPage() {
  const { user } = useAuth();
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const isVi = locale === 'vi';

  const particleRef = useRef<ParticleCanvasHandle | null>(null);

  // Audio & Tabs
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'games' | 'leaderboard'>('games');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedCefr, setSelectedCefr] = useState<string>('all');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

  // Active Game State
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('medium');
  const [showDifficultyModal, setShowDifficultyModal] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState(60);

  // Game Engine State
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);
  const [currentScore, setCurrentScore] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [mascotReaction, setMascotReaction] = useState<MascotReaction>('idle');

  // Modular Data States
  const [matchPairs, setMatchPairs] = useState<WordMatchPair[]>([]);
  const [scrambleList, setScrambleList] = useState<ScrambleQuestion[]>([]);
  const [typingWords, setTypingWords] = useState<TypingQuestion[]>([]);
  const [blitzQuestions, setBlitzQuestions] = useState<BlitzQuestion[]>([]);
  const [wordleTarget, setWordleTarget] = useState<WordleTarget>(WORDLE_WORDS_BANK[0]);
  const [soundQuestions, setSoundQuestions] = useState<SoundQuestion[]>([]);

  // Overlays
  const [showVictory, setShowVictory] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [finalXP, setFinalXP] = useState(50);
  const [finalScore, setFinalScore] = useState(0);

  // Mascot Popup Toast
  const [popupState, setPopupState] = useState<{
    show: boolean;
    key: any;
    title?: string;
    msg?: string;
  }>({ show: false, key: 'confirm' });

  // Filter Bar Topics
  const topicFilters = [
    { id: 'all', label: isVi ? 'Tất cả' : 'All Topics' },
    { id: 'Daily Life', label: isVi ? 'Đời Sống' : 'Daily Life' },
    { id: 'Travel', label: isVi ? 'Du Lịch' : 'Travel' },
    { id: 'Business', label: isVi ? 'Công Sở' : 'Business' },
    { id: 'Technology', label: isVi ? 'Công Nghệ' : 'Technology' },
    { id: 'Food', label: isVi ? 'Ẩm Thực' : 'Food' },
    { id: 'Health', label: isVi ? 'Sức Khỏe' : 'Health' },
    { id: 'Environment', label: isVi ? 'Môi Trường' : 'Environment' },
    { id: 'Academic IELTS', label: isVi ? 'Học Thuật IELTS' : 'Academic IELTS' },
  ];

  // 6 Arcade Game Modes
  const gamesList: ArcadeGameItem[] = [
    {
      id: 'word_match',
      title: isVi ? 'Lật Thẻ Ghép Từ 3D' : '3D Word Match Cards',
      desc: isVi ? 'Lật từng cặp thẻ bài 3D để ghép từ tiếng Anh với nghĩa tiếng Việt tương ứng.' : 'Flip 3D cards to match English words with their contextual meanings.',
      badgeColor: 'border-teal-500/40 bg-teal-950/40 text-teal-300',
      image3d: '/images/games/card-word-match-3d.png',
      glowColor: 'bg-emerald-500/20',
    },
    {
      id: 'sentence_scramble',
      title: isVi ? 'Xếp Từ Thành Câu' : 'Sentence Builder Arcade',
      desc: isVi ? 'Sắp xếp các từ xáo trộn thành câu tiếng Anh hoàn chỉnh theo đúng ngữ pháp.' : 'Unscramble mixed word tokens to construct grammatically perfect sentences.',
      badgeColor: 'border-amber-500/40 bg-amber-950/40 text-amber-300',
      image3d: '/images/games/card-sentence-scramble-3d.png',
      glowColor: 'bg-blue-500/20',
    },
    {
      id: 'typing_race',
      title: isVi ? 'Đua Tốc Độ Gõ Từ' : 'Speed Typing Sprint',
      desc: isVi ? 'Thử thách gõ nhanh và chính xác các từ tiếng Anh dưới áp lực thời gian đếm ngược.' : 'Type English vocabulary fast with 100% precision before the clock expires.',
      badgeColor: 'border-rose-500/40 bg-rose-950/40 text-rose-300',
      image3d: '/images/games/card-typing-race-3d.png',
      glowColor: 'bg-rose-500/20',
    },
    {
      id: 'fill_blitz',
      title: isVi ? 'Trắc Nghiệm Siêu Tốc' : 'Rapid Fill Blitz',
      desc: isVi ? 'Phản xạ lựa chọn nghĩa chính xác trong 60 giây với các đáp án gây nhiễu thông minh.' : 'Rapid 60-second vocabulary sprint with context-aware smart distractors.',
      badgeColor: 'border-purple-500/40 bg-purple-950/40 text-purple-300',
      image3d: '/images/games/card-fill-blitz-3d.png',
      glowColor: 'bg-purple-500/20',
    },
    {
      id: 'lingo_wordle',
      title: isVi ? 'Lingo Wordle' : 'Lingo Wordle',
      desc: isVi ? 'Đoán từ tiếng Anh 5 chữ cái trong 6 lượt thử với gợi ý vị trí màu sắc sinh động.' : 'Guess the 5-letter hidden English word in 6 attempts with dynamic color hints.',
      badgeColor: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300',
      image3d: '/card_wordle_3d_1788921429387.jpg',
      glowColor: 'bg-emerald-500/20',
    },
    {
      id: 'sound_reflex',
      title: isVi ? 'Phản Xạ Âm Thanh' : 'Sound Reflex Speed',
      desc: isVi ? 'Lắng nghe phát âm bản xứ chuẩn xác và chọn ngay từ vựng đúng trong 5 giây.' : 'Listen to native pronunciation audio and identify the target word within 5s.',
      badgeColor: 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300',
      image3d: '/card_sound_reflex_3d_1788921457609.jpg',
      glowColor: 'bg-cyan-500/20',
    },
  ];

  // Load Leaderboard on mount or tab change
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await gamesApi.getLeaderboard({ userId: user?.id });
        if (res?.leaderboard) setLeaderboardData(res.leaderboard);
      } catch (err) {
        console.warn('Could not fetch leaderboard:', err);
      }
    };
    fetchLeaderboard();
  }, [activeTab, user?.id]);

  // Audio mute toggle
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    arcadeAudio.setMuted(nextMuted);
  };

  // Timer ticker for active games
  useEffect(() => {
    if (!activeGame || activeGame === 'lingo_wordle' || showVictory || showGameOver) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTriggerGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeGame, showVictory, showGameOver]);

  // Dynamic Max Lives depending on game mode and difficulty
  const getMaxLives = (game: string | null, diff: DifficultyLevel) => {
    if (game === 'word_match') {
      // Memory card matching requires flipping and exploring: 6 lives for easy, 5 for medium, 4 for hard
      return diff === 'easy' ? 6 : diff === 'medium' ? 5 : 4;
    }
    if (game === 'lingo_wordle') {
      return 6;
    }
    return diff === 'hard' ? 3 : diff === 'medium' ? 4 : 5;
  };

  // Start game session with selected difficulty
  const handleStartGame = async (diff: DifficultyLevel) => {
    if (!showDifficultyModal) return;
    const gameType = showDifficultyModal;
    setShowDifficultyModal(null);

    setActiveGame(gameType);
    setSelectedDifficulty(diff);
    setShowVictory(false);
    setShowGameOver(false);
    setLives(getMaxLives(gameType, diff));
    setCombo(1);
    setMaxCombo(1);
    setCurrentScore(0);

    const initialTime =
      gameType === 'word_match'
        ? diff === 'easy' ? 90 : diff === 'medium' ? 75 : 60
        : diff === 'easy' ? 90 : diff === 'medium' ? 60 : 45;
    setTimerSeconds(initialTime);
    arcadeAudio.playLaser();

    try {
      const attemptRes = await gamesApi.startAttempt(gameType);
      if (attemptRes?.attemptId) setAttemptId(attemptRes.attemptId);

      const dataRes = await gamesApi.getData(gameType, { topic: selectedTopic, cefr: selectedCefr });

      if (gameType === 'word_match' && dataRes?.pairs) {
        setMatchPairs(dataRes.pairs);
      } else if (gameType === 'sentence_scramble' && dataRes?.sentences) {
        setScrambleList(dataRes.sentences);
      } else if (gameType === 'typing_race' && dataRes?.questions) {
        setTypingWords(dataRes.questions);
      } else if (gameType === 'fill_blitz' && dataRes?.questions) {
        setBlitzQuestions(dataRes.questions);
      } else if (gameType === 'lingo_wordle' && dataRes?.target) {
        setWordleTarget(dataRes.target);
      } else if (gameType === 'sound_reflex' && dataRes?.questions) {
        setSoundQuestions(dataRes.questions);
      }
    } catch {
      // Fallback to local 26.5k universal dataset
      const filteredVocab = getFilteredVocabulary({ category: selectedTopic, cefr: selectedCefr, count: 12 });

      if (gameType === 'word_match') {
        setMatchPairs(filteredVocab.slice(0, 8).map((w, idx) => ({
          id: `fb-p-${idx}`,
          targetText: w.word,
          translation: w.meaningVi,
          category: w.category,
          cefr: w.cefr,
        })));
      } else if (gameType === 'sentence_scramble') {
        setScrambleList(getScrambleQuestions(selectedCefr, 5));
      } else if (gameType === 'typing_race') {
        setTypingWords(filteredVocab.slice(0, 10).map((w) => ({
          id: w.id,
          targetText: w.word,
          translation: w.meaningVi,
          phonetic: w.phoneticUs,
          category: w.category,
        })));
      } else if (gameType === 'fill_blitz') {
        setBlitzQuestions(filteredVocab.slice(0, 10).map((w, idx) => ({
          id: `fb-q-${idx}`,
          q: `Chọn nghĩa tiếng Việt chính xác của từ "${w.word}":`,
          targetText: w.word,
          correct: w.meaningVi,
          options: generateSmartDistractors(w, 4),
          phonetic: w.phoneticUs,
          category: w.category,
        })));
      } else if (gameType === 'lingo_wordle') {
        setWordleTarget(getRandomWordleTarget());
      } else if (gameType === 'sound_reflex') {
        setSoundQuestions(filteredVocab.slice(0, 10).map((w, idx) => {
          const others = filteredVocab.filter((o) => o.id !== w.id).map((o) => o.word);
          const options = [w.word, ...others.slice(0, 3)].sort(() => Math.random() - 0.5);
          return {
            id: `fb-s-${idx}`,
            audioWord: w.word,
            phonetic: w.phoneticUs,
            translation: w.meaningVi,
            correct: w.word,
            options,
          };
        }));
      }
    }
  };

  // Correct answer handler
  const handleCorrect = (scoreDelta: number, e?: React.MouseEvent) => {
    arcadeAudio.playTing();
    setCurrentScore((prev) => prev + scoreDelta);

    const clientX = e?.clientX || (typeof window !== 'undefined' ? window.innerWidth / 2 : 400);
    const clientY = e?.clientY || (typeof window !== 'undefined' ? window.innerHeight / 2 : 300);

    // Visual Game Juice: Shockwave ring + XP floating text + sparks
    particleRef.current?.spawnShockwave(clientX, clientY, '#22d3ee');
    particleRef.current?.spawnXPFloat(clientX, clientY, scoreDelta);
    particleRef.current?.spawnSparks(clientX, clientY, '#22d3ee', 12);

    setCombo((prev) => {
      const next = prev + 1;
      if (next > maxCombo) setMaxCombo(next);

      if (next >= 3) {
        particleRef.current?.spawnFloatingText(clientX, clientY - 35, `COMBO x${next}! 🔥`, '#fbbf24', 1.4);
        arcadeAudio.playCombo(next);
      }

      // Combo life recovery: in word_match, each 3x combo grants +1 heart (up to maxLives)
      if (activeGame === 'word_match' && next % 3 === 0) {
        const maxL = getMaxLives(activeGame, selectedDifficulty);
        setLives((cur) => {
          if (cur < maxL) {
            particleRef.current?.spawnFloatingText(clientX, clientY - 60, '+1 TIM HỒI SINH! ❤️', '#f43f5e', 1.4);
            arcadeAudio.playHeartRecover();
            return cur + 1;
          }
          return cur;
        });
      }
      return next;
    });

    setMascotReaction('combo');
    setTimeout(() => setMascotReaction('idle'), 2500);
  };

  // Wrong answer handler
  const handleWrong = (e?: React.MouseEvent) => {
    arcadeAudio.playBuzzer();
    arcadeAudio.playHeartLost();
    setCombo(1);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);

    const clientX = e?.clientX || (typeof window !== 'undefined' ? window.innerWidth / 2 : 400);
    const clientY = e?.clientY || (typeof window !== 'undefined' ? window.innerHeight / 2 : 300);
    particleRef.current?.spawnSparks(clientX, clientY, '#f43f5e', 14);
    particleRef.current?.spawnFloatingText(clientX, clientY - 20, 'MISS! 💔', '#f43f5e', 1.3);

    setMascotReaction('wrong');
    setTimeout(() => setMascotReaction('idle'), 2500);

    setLives((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        handleTriggerGameOver();
        return 0;
      }
      return next;
    });
  };

  const handleTriggerGameOver = () => {
    arcadeAudio.playGameOver();
    setMascotReaction('wrong');
    setShowGameOver(true);
    setPopupState({
      show: true,
      key: 'wrong',
      title: isVi ? 'Cố Lên Bạn Ơi!' : 'Keep Going!',
      msg: isVi ? 'Đừng nản lòng! Hãy rèn luyện lại để đạt điểm số cao hơn nhé.' : 'Practice makes perfect! Try again to achieve a higher score.',
    });
  };

  // Game Completion Handler
  const handleFinish = async (finalGameScore: number) => {
    const initialTime = selectedDifficulty === 'easy' ? 90 : selectedDifficulty === 'medium' ? 60 : 45;
    const duration = Math.max(1, initialTime - timerSeconds);
    const earnedXP = Math.round(finalGameScore / 10);

    setFinalScore(finalGameScore);
    setFinalXP(earnedXP);
    setShowVictory(true);
    setMascotReaction('victory');
    particleRef.current?.spawnConfetti();
    arcadeAudio.playVictoryFanfare();

    // Persist session to DB through API
    try {
      await gamesApi.submitScore({
        attemptId: attemptId || `att-${Date.now()}`,
        gameType: activeGame || 'arcade',
        userAnswers: [],
        durationSeconds: duration,
        userId: user?.id,
        comboMax: maxCombo,
      });

      // Refresh leaderboard after victory
      const lbRes = await gamesApi.getLeaderboard({ userId: user?.id });
      if (lbRes?.leaderboard) setLeaderboardData(lbRes.leaderboard);
    } catch (err) {
      console.warn('Could not submit game score to DB:', err);
    }
  };

  const filteredGames = gamesList.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 font-sans ${isShaking ? 'animate-bounce' : ''}`}>
      <ParticleCanvas ref={particleRef} />

      {/* Main Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl shadow-2xl relative z-10">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/dashboard`}
            className="w-10 h-10 rounded-full bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 flex items-center justify-center transition-all shadow-inner"
            aria-label="Trở về lộ trình học"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300">6 MODES</span>
              <span>LINGUAFLOW ARCADE 2.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">
              {isVi ? 'Đấu Trường Luyện Game Đa Dạng' : 'Gamified Arcade Arena'}
            </h1>
          </div>
        </div>

        {/* Top Controls: Search, Audio & Tabs */}
        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isVi ? 'Tìm game...' : 'Search games...'}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500/50"
            />
          </div>

          <button
            onClick={toggleMute}
            className="w-9 h-9 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-950/80 border border-slate-800">
            <button
              onClick={() => setActiveTab('games')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'games'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>{isVi ? 'Trò Chơi' : 'Games'}</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>{isVi ? 'Vinh Danh' : 'Ranking'}</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* FILTER DRAWER FOR TOPICS & CEFR */}
      {activeTab === 'games' && !activeGame && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-850 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-xs font-bold text-slate-400 shrink-0">{isVi ? 'Chủ đề:' : 'Topic:'}</span>
            {topicFilters.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedTopic === t.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-850'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-slate-400 mr-1">CEFR:</span>
            {['all', 'A1', 'A2', 'B1', 'B2', 'C1'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedCefr(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedCefr === lvl
                    ? 'bg-amber-500 text-slate-950 font-extrabold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {lvl.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ARCADE GAMES LISTING GRID */}
      {activeTab === 'games' && !activeGame && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8 relative z-10">
          {filteredGames.map((g) => (
            <TiltGameCard
              key={g.id}
              game={g}
              isVi={isVi}
              onStart={() => {
                arcadeAudio.playLaser();
                setShowDifficultyModal(g.id);
              }}
            />
          ))}
        </div>
      )}

      {/* DYNAMIC REAL-TIME LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-6 z-10 max-w-4xl mx-auto overflow-visible">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span>{isVi ? 'Bảng Vinh Danh Arcade (Real-time)' : 'Arcade Champions'}</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">Synced with PostgreSQL</span>
          </div>

          <div className="space-y-2.5">
            {leaderboardData.map((player) => (
              <div
                key={player.rank}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  player.userId === user?.id || player.displayName.includes('Bạn')
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-950/80 border-slate-850 hover:border-slate-700'
                }`}
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
        <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl space-y-6 z-10 max-w-4xl mx-auto">
          {/* Top Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <button
              onClick={() => {
                arcadeAudio.playLaser();
                setActiveGame(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isVi ? 'Thoát' : 'Quit'}</span>
            </button>

            <div className="flex items-center gap-3">
              <ComboMeter combo={combo} />
              <HeartContainer lives={lives} maxLives={getMaxLives(activeGame, selectedDifficulty)} />

              {activeGame !== 'lingo_wordle' && (
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
              )}
            </div>
          </div>

          {/* GAME 1: 3D WORD MATCH */}
          {activeGame === 'word_match' && (
            <WordMatchGame
              pairs={matchPairs}
              difficulty={selectedDifficulty}
              combo={combo}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
              onFinish={handleFinish}
              isVi={isVi}
            />
          )}

          {/* GAME 2: SENTENCE SCRAMBLE */}
          {activeGame === 'sentence_scramble' && (
            <SentenceScrambleGame
              sentences={scrambleList}
              difficulty={selectedDifficulty}
              combo={combo}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
              onFinish={handleFinish}
              isVi={isVi}
            />
          )}

          {/* GAME 3: SPEED TYPING */}
          {activeGame === 'typing_race' && (
            <SpeedTypingGame
              words={typingWords}
              difficulty={selectedDifficulty}
              combo={combo}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
              onFinish={handleFinish}
              isVi={isVi}
            />
          )}

          {/* GAME 4: RAPID FILL BLITZ */}
          {activeGame === 'fill_blitz' && (
            <FillBlitzGame
              questions={blitzQuestions}
              difficulty={selectedDifficulty}
              combo={combo}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
              onFinish={handleFinish}
              isVi={isVi}
            />
          )}

          {/* GAME 5: LINGO WORDLE */}
          {activeGame === 'lingo_wordle' && (
            <LingoWordleGame
              target={wordleTarget}
              onWin={(score) => handleFinish(score)}
              onLose={handleTriggerGameOver}
              onRestart={() => setWordleTarget(getRandomWordleTarget())}
              isVi={isVi}
            />
          )}

          {/* GAME 6: SOUND REFLEX */}
          {activeGame === 'sound_reflex' && (
            <SoundReflexGame
              questions={soundQuestions}
              combo={combo}
              onCorrect={(e) => handleCorrect(120 * combo, e)}
              onWrong={handleWrong}
              onFinish={() => handleFinish(currentScore)}
              isVi={isVi}
            />
          )}

          {/* Live Mascot Companion */}
          <LiveMascotCompanion
            reaction={mascotReaction}
            combo={combo}
            lives={lives}
            isVi={isVi}
          />
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
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleStartGame(diff)}
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-850 hover:border-cyan-500/50 flex items-center justify-between text-left transition-all group cursor-pointer"
                >
                  <div>
                    <span className="font-display font-bold text-sm text-white group-hover:text-cyan-300 block">
                      {diff === 'easy'
                        ? (isVi ? 'Dễ (90s / 5-6 Mạng)' : 'Easy (90s / 5-6 Lives)')
                        : diff === 'medium'
                        ? (isVi ? 'Chuẩn (60-75s / 4-5 Mạng)' : 'Medium (60-75s / 4-5 Lives)')
                        : (isVi ? 'Khó (45-60s / 3-4 Mạng)' : 'Hard (45-60s / 3-4 Lives)')}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {diff === 'hard'
                        ? (isVi ? 'Thử thách cao, nhân 2x điểm thưởng XP' : 'Earn 2X bonus XP multiplier')
                        : diff === 'medium'
                        ? (isVi ? 'Nhịp độ tiêu chuẩn đấu trường' : 'Standard arcade gameplay')
                        : (isVi ? 'Thư giãn, hỗ trợ nhiều mạng và lượt xem trước' : 'Relaxed pace, more lives & hints')}
                    </span>
                  </div>
                  <Play className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* VICTORY OVERLAY */}
      {showVictory && (
        <VictoryOverlay
          score={finalScore}
          xpEarned={finalXP}
          maxCombo={maxCombo}
          accuracy={96}
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

      {/* GAME OVER OVERLAY */}
      {showGameOver && (
        <GameOverOverlay
          score={currentScore}
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

      {/* MASCOT REACTION POPUP */}
      <MascotPopup
        isVisible={popupState.show}
        reactionKey={popupState.key}
        title={popupState.title}
        message={popupState.msg}
        onClose={() => setPopupState((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
