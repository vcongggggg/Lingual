'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, ProgressBar } from '@linguaflow/ui';
import { gamesApi } from '@/lib/api';
import { sfx } from '@/lib/soundEffects';
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
} from 'lucide-react';
import Image from 'next/image';
import { mascotReactions } from '@linguaflow/config';
import MascotPopup from '@/components/MascotPopup';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export default function GamesPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  // Navigation & Tab State
  const [activeTab, setActiveTab] = useState<'games' | 'leaderboard'>('games');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

  // Active Game State
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('medium');
  const [showDifficultyModal, setShowDifficultyModal] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string>('');
  const [scoreResult, setScoreResult] = useState<any>(null);
  const [timerSeconds, setTimerSeconds] = useState(60);

  // Gameplay Lives & Effects State
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(1);
  const [isShaking, setIsShaking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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
  const [wpm, setWpm] = useState(0);

  // GAME 4: FILL BLITZ STATE
  const [blitzQuestions, setBlitzQuestions] = useState<any[]>([]);
  const [blitzIdx, setBlitzIdx] = useState(0);
  const [blitzScore, setBlitzScore] = useState(0);

  const gamesList = [
    {
      id: 'word_match',
      title: 'Lật Thẻ Ghép Từ 3D',
      desc: 'Lật từng cặp thẻ bài 3D để ghép từ tiếng Anh với nghĩa tiếng Việt tương ứng.',
      icon: '🧩',
      glow: 'teal' as const,
      bgGradient: 'from-teal-900/70 via-emerald-950/80 to-slate-950',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      bgImage: '/images/games/bg-card-word-match.png',
    },
    {
      id: 'sentence_scramble',
      title: 'Xếp Từ Thành Câu',
      desc: 'Sắp xếp các từ xáo trộn thành câu tiếng Anh hoàn chỉnh theo đúng ngữ pháp.',
      icon: '🔤',
      glow: 'amber' as const,
      bgGradient: 'from-amber-900/70 via-orange-950/80 to-slate-950',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      bgImage: '/images/games/bg-card-sentence-builder.png',
    },
    {
      id: 'typing_race',
      title: 'Đua Tốc Độ Gõ Từ',
      desc: 'Thử thách gõ nhanh và chính xác các từ tiếng Anh dưới áp lực thời gian đếm ngược.',
      icon: '⚡',
      glow: 'coral' as const,
      bgGradient: 'from-rose-900/70 via-orange-950/80 to-slate-950',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      bgImage: '/images/games/bg-card-typing-speed.png',
    },
    {
      id: 'fill_blitz',
      title: 'Thách Thức 60 Giây',
      desc: 'Điền từ liên hoàn trong 60 giây để tích lũy điểm thưởng Combo Super 5X.',
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
    if (activeGame && timerSeconds > 0 && !scoreResult && lives > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            handleFinishCurrentGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeGame, timerSeconds, scoreResult, lives]);

  // Handle Wrong Answer Penalty (Heart deduction + Screen Shake + SFX)
  const triggerWrongAnswer = () => {
    sfx.playWrong();
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    setCombo(1);
    setLives((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setPopupState({
          show: true,
          key: 'wrong_severe',
          title: 'Hết Mạng! 💔',
          msg: 'Bò LingLing nhảy cẫng tức giận! Hãy thử lại nhé!',
        });
        setTimeout(() => handleFinishCurrentGame(), 1000);
      } else {
        setPopupState({
          show: true,
          key: 'wrong_mild',
          title: 'Ối! Trừ 1 Mạng! 💔',
          msg: 'Bò LingLing nhắc bạn chú ý quan sát kỹ hơn!',
        });
      }
      return next;
    });
  };

  // Handle Correct Answer Reward (SFX + Confetti + Combo Boost)
  const triggerCorrectAnswer = () => {
    sfx.playCorrect();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1200);

    setCombo((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setPopupState({
          show: true,
          key: 'celebrate_big',
          title: `COMBO SUPER ${next}X! 🔥`,
          msg: 'Bò LingLing bắn tim chúc mừng bạn ghi điểm liên hoàn!',
        });
      }
      return next;
    });
  };

  // Initialize Game Session with Selected Difficulty
  const handleStartGameWithDifficulty = async (difficulty: DifficultyLevel) => {
    if (!showDifficultyModal) return;
    const gameType = showDifficultyModal;
    setShowDifficultyModal(null);

    setActiveGame(gameType);
    setSelectedDifficulty(difficulty);
    setScoreResult(null);
    setLives(difficulty === 'hard' ? 2 : 3);
    setCombo(1);
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
    setWpm(0);
    setBlitzIdx(0);
    setBlitzScore(0);

    const initialTime = difficulty === 'easy' ? 90 : difficulty === 'medium' ? 60 : 45;
    setTimerSeconds(initialTime);

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
          { id: 'p1', targetText: 'Hello', translation: 'Xin chào' },
          { id: 'p2', targetText: 'Book', translation: 'Quyển sách' },
          { id: 'p3', targetText: 'Apple', translation: 'Quả táo' },
          { id: 'p4', targetText: 'Cat', translation: 'Con mèo' },
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
  const handleCardClick = (card: any) => {
    if (isCheckingMatch || matchedIds.includes(card.pairId) || firstCard?.id === card.id) return;

    if (!firstCard) {
      setFirstCard(card);
      return;
    }

    setSecondCard(card);
    setIsCheckingMatch(true);

    if (firstCard.pairId === card.pairId) {
      // Matched!
      triggerCorrectAnswer();
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
      triggerWrongAnswer();
      setTimeout(() => {
        setFirstCard(null);
        setSecondCard(null);
        setIsCheckingMatch(false);
      }, 900);
    }
  };

  // Sentence Scramble Token Click
  const handleScrambleTokenClick = (token: string, idx: number) => {
    const currentScramble = scrambleList[scrambleIdx];
    if (!currentScramble) return;

    const newTokens = [...scrambleSelectedTokens, token];
    setScrambleSelectedTokens(newTokens);

    if (newTokens.length === currentScramble.tokens.length) {
      const userSentence = newTokens.join(' ').trim().toLowerCase();
      const targetSentence = currentScramble.fullSentence.trim().toLowerCase();

      if (userSentence === targetSentence) {
        triggerCorrectAnswer();
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
        triggerWrongAnswer();
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
      triggerCorrectAnswer();
      const diffMultiplier = selectedDifficulty === 'hard' ? 2 : selectedDifficulty === 'medium' ? 1.5 : 1;
      setTypingScore((prev) => prev + Math.round(120 * combo * diffMultiplier));
      setWpm((prev) => prev + 8);
      setTypingInput('');

      if (typingIdx + 1 < typingWords.length) {
        setTypingIdx((prev) => prev + 1);
      } else {
        setTimeout(() => handleFinishCurrentGame(), 500);
      }
    }
  };

  // Fill Blitz Answer Selection
  const handleBlitzAnswer = (selectedOption: string) => {
    const currentQ = blitzQuestions[blitzIdx];
    if (!currentQ) return;

    if (selectedOption === currentQ.correct) {
      triggerCorrectAnswer();
      const diffMultiplier = selectedDifficulty === 'hard' ? 2 : selectedDifficulty === 'medium' ? 1.5 : 1;
      setBlitzScore((prev) => prev + Math.round(100 * combo * diffMultiplier));
    } else {
      triggerWrongAnswer();
    }

    if (blitzIdx + 1 < blitzQuestions.length) {
      setBlitzIdx((prev) => prev + 1);
    } else {
      setTimeout(() => handleFinishCurrentGame(), 500);
    }
  };

  // Finish Game & Record Score
  const handleFinishCurrentGame = async () => {
    sfx.playVictory();
    const finalScoreValue = matchScore || scrambleScore || typingScore || blitzScore || 100;
    const duration = (selectedDifficulty === 'easy' ? 90 : selectedDifficulty === 'medium' ? 60 : 45) - timerSeconds;

    try {
      const res = await gamesApi.submitScore({
        attemptId: attemptId || `att-${Date.now()}`,
        gameType: activeGame || 'word_match',
        userAnswers: [{ itemId: 'g1', answer: 'correct' }],
        durationSeconds: duration,
      });

      setScoreResult({
        finalScore: res.finalScore || finalScoreValue,
        xpEarned: res.xpEarned || 35,
        newStreakDays: res.newStreakDays || 4,
      });
    } catch {
      setScoreResult({
        finalScore: finalScoreValue,
        xpEarned: 35,
        newStreakDays: 4,
      });
    }

    window.dispatchEvent(
      new CustomEvent('linguaflow_xp_update', {
        detail: { totalXP: 250 + (scoreResult?.xpEarned || 35) },
      })
    );
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-8 transition-transform duration-100 ${isShaking ? 'translate-x-1 -translate-y-1 rotate-1' : ''}`}>
      {/* Visual Confetti Overlay */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="text-6xl animate-bounce">🎉 ✨ 🌟 🏆 🎉</div>
        </div>
      )}

      {/* Header & Navigation */}
      <div className="flex items-center justify-between">
        <Link href={`/${locale}/dashboard`}>
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Về Lộ Trình
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-amber-400" />
          <h1 className="text-2xl font-display font-extrabold text-white">Lingual Game Center</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'games' ? 'accent' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('games')}
          >
            Trò Chơi
          </Button>
          <Button
            variant={activeTab === 'leaderboard' ? 'accent' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('leaderboard')}
          >
            Bảng Xếp Hạng
          </Button>
        </div>
      </div>

      {/* HERO BANNER SECTION */}
      {!activeGame && activeTab === 'games' && (
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 p-8 shadow-2xl backdrop-blur-xl bg-slate-950/80">
          {/* Background Banner Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity pointer-events-none"
            style={{ backgroundImage: `url(/images/games/bg-hero-banner.png)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chơi Game Vui • Học Từ Nhanh</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
                Vừa Chơi Game Vừa Thuộc Bài Tiếng Anh!
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Thử thách trí nhớ 3D, gõ phím siêu tốc và tích lũy điểm thưởng Combo cùng Bò LingLing.
              </p>
            </div>

            <div className="relative w-36 h-36 shrink-0">
              <Image
                src={mascotReactions.greet}
                alt="Game Hero Mascot"
                width={144}
                height={144}
                className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(245,158,11,0.3)] animate-pulse"
              />
            </div>
          </div>
        </div>
      )}

      {/* LEADERBOARD TAB */}
      {activeTab === 'leaderboard' && (
        <Card glow="amber" className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-display font-extrabold text-white">Bảng Xếp Hạng Cao Thủ Game</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Cập nhật theo tuần</span>
          </div>

          <div className="space-y-3">
            {leaderboardData.map((user) => (
              <div
                key={user.rank}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                  user.rank === 1
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-slate-950/80 border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl font-black font-mono w-6 text-center">{user.avatar || `#${user.rank}`}</span>
                  <div>
                    <h4 className="font-bold text-sm text-white">{user.displayName}</h4>
                    <p className="text-xs text-slate-400">Chuỗi ngày: {user.streak} ngày • Độ chính xác: {user.accuracy}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-amber-400">{user.xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* GAMES GRID LIST */}
      {!activeGame && activeTab === 'games' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gamesList.map((game) => (
            <motion.div key={game.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                glow={game.glow}
                className={`relative overflow-hidden h-full flex flex-col justify-between p-6 bg-gradient-to-br ${game.bgGradient} border border-white/10 space-y-4`}
              >
                {/* Custom Cropped Banner Background */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay pointer-events-none transition-opacity duration-300 group-hover:opacity-40"
                  style={{ backgroundImage: `url(${game.bgImage})` }}
                />
                <div className="absolute inset-0 bg-slate-950/40 pointer-events-none" />

                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{game.icon}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${game.badgeColor}`}>
                      Hot Game
                    </span>
                  </div>
                  <h3 className="text-xl font-display font-extrabold text-white">{game.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{game.desc}</p>
                </div>

                <div className="relative z-10">
                  <Button
                    variant="accent"
                    size="md"
                    className="w-full font-bold"
                    icon={<Play className="w-4 h-4 fill-current" />}
                    onClick={() => setShowDifficultyModal(game.id)}
                  >
                    Bắt Đầu Chơi
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* DIFFICULTY SELECTION MODAL */}
      {showDifficultyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-amber-500/40 p-6 space-y-6 shadow-2xl text-center">
            <div className="space-y-1">
              <h3 className="text-2xl font-display font-extrabold text-white">Chọn Mức Độ Khó</h3>
              <p className="text-xs text-slate-400">Độ khó càng cao, điểm thưởng XP càng lớn!</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleStartGameWithDifficulty('easy')}
                className="p-4 rounded-2xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 font-bold text-sm flex flex-col items-center gap-1 transition-all active:scale-95"
              >
                <span>🌱 Dễ</span>
                <span className="text-[10px] text-slate-400">90s • x1.0 XP</span>
              </button>
              <button
                onClick={() => handleStartGameWithDifficulty('medium')}
                className="p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-sm flex flex-col items-center gap-1 transition-all active:scale-95"
              >
                <span>🔥 Vừa</span>
                <span className="text-[10px] text-slate-400">60s • x1.5 XP</span>
              </button>
              <button
                onClick={() => handleStartGameWithDifficulty('hard')}
                className="p-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-sm flex flex-col items-center gap-1 transition-all active:scale-95"
              >
                <span>⚡ Khó</span>
                <span className="text-[10px] text-slate-400">45s • x2.0 XP</span>
              </button>
            </div>

            <Button variant="ghost" size="sm" onClick={() => setShowDifficultyModal(null)}>
              Hủy
            </Button>
          </div>
        </div>
      )}

      {/* GAMEPLAY CONTAINER */}
      {activeGame && (
        <Card glow="amber" className="max-w-2xl mx-auto space-y-6 p-6 sm:p-8">
          {/* Game Top Bar: Hearts & Timer & Combo */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            {/* Hearts / Lives */}
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((h) => (
                <Heart
                  key={h}
                  className={`w-5 h-5 ${
                    h <= lives ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-slate-700'
                  }`}
                />
              ))}
            </div>

            {/* Timer */}
            <div className="flex items-center gap-1.5 font-mono text-amber-400 font-bold text-lg">
              <Timer className="w-5 h-5 text-amber-400" />
              <span>{timerSeconds}s</span>
            </div>

            {/* Combo Gauge */}
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-black text-amber-400">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Combo {combo}X</span>
            </div>
          </div>

          {!scoreResult && lives > 0 ? (
            <div>
              {/* GAME 1: WORD MATCH 3D */}
              {activeGame === 'word_match' && (
                <div className="space-y-6">
                  <span className="text-xs text-slate-400 text-center block font-medium">
                    Lật 2 thẻ bài có nghĩa khớp nhau:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {matchCards.map((card) => {
                      const isFlipped = firstCard?.id === card.id || secondCard?.id === card.id || matchedIds.includes(card.pairId);
                      return (
                        <button
                          key={card.id}
                          onClick={() => handleCardClick(card)}
                          className={`h-24 rounded-2xl font-bold text-xs p-2 flex items-center justify-center text-center transition-all duration-300 active:scale-95 border ${
                            matchedIds.includes(card.pairId)
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 opacity-60'
                              : isFlipped
                              ? 'bg-slate-900 border-amber-400 text-white shadow-lg shadow-amber-500/20'
                              : 'bg-gradient-to-tr from-slate-900 to-slate-950 border-slate-800 text-transparent hover:border-slate-700'
                          }`}
                        >
                          {isFlipped ? card.text : '❓'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* GAME 2: SENTENCE SCRAMBLE */}
              {activeGame === 'sentence_scramble' && scrambleList[scrambleIdx] && (
                <div className="space-y-6 text-center">
                  <p className="text-sm font-bold text-amber-300">
                    "{scrambleList[scrambleIdx].translation}"
                  </p>

                  <div className="min-h-16 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap gap-2 items-center justify-center">
                    {scrambleSelectedTokens.map((token, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm">
                        {token}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {scrambleList[scrambleIdx].tokens.map((token: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleScrambleTokenClick(token, idx)}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 font-bold text-sm text-white transition-all active:scale-95"
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
                    <span className="text-xs font-bold text-coral-400 uppercase tracking-widest">
                      Gõ từ tiếng Anh chuẩn xác:
                    </span>
                    <h2 className="text-4xl font-display font-extrabold text-white">
                      {typingWords[typingIdx].word || typingWords[typingIdx].targetText}
                    </h2>
                    <p className="text-xs text-slate-400">({typingWords[typingIdx].translation})</p>
                  </div>

                  <input
                    type="text"
                    autoFocus
                    value={typingInput}
                    onChange={(e) => handleTypingChange(e.target.value)}
                    placeholder="Gõ từ tại đây..."
                    className="w-full p-4 rounded-2xl bg-slate-950 border-2 border-coral-500/40 text-center font-display font-bold text-xl text-white outline-none focus:border-coral-400 shadow-inner"
                  />
                </div>
              )}

              {/* GAME 4: FILL BLITZ */}
              {activeGame === 'fill_blitz' && blitzQuestions[blitzIdx] && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-display font-bold text-white text-center py-2">
                    {blitzQuestions[blitzIdx].q}
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {blitzQuestions[blitzIdx].options.map((opt: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleBlitzAnswer(opt)}
                        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400 font-bold text-sm text-white transition-all active:scale-95"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* GAME VICTORY / RESULTS SCREEN */
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-coral-500 to-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
                <Trophy className="w-10 h-10 text-slate-950" />
              </div>
              <h2 className="text-3xl font-display font-extrabold text-white">Hoàn Thành Trận Game!</h2>
              <div className="flex justify-center gap-8 text-sm">
                <div>
                  <span className="block text-xs text-slate-400">Điểm Số</span>
                  <span className="font-extrabold text-2xl text-amber-400">
                    {scoreResult?.finalScore || matchScore || scrambleScore || typingScore || blitzScore}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400">XP Nhận Được</span>
                  <span className="font-extrabold text-2xl text-teal-400">+{scoreResult?.xpEarned || 35} XP</span>
                </div>
              </div>

              <Button variant="accent" size="lg" className="w-full font-bold" onClick={() => setActiveGame(null)}>
                Quay Về Danh Sách Game
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Mascot Toast Notification */}
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
