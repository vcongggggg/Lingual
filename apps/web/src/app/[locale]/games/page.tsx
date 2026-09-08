'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, ProgressBar } from '@linguaflow/ui';
import { gamesApi } from '@/lib/api';
import { arcadeAudio } from '@/lib/arcadeAudio';
import { useAuth } from '@/contexts/AuthContext';
import ParticleCanvas, { ParticleCanvasHandle } from '@/components/games/ParticleCanvas';
import ComboMeter from '@/components/games/ComboMeter';
import HeartContainer from '@/components/games/HeartContainer';
import VictoryOverlay from '@/components/games/VictoryOverlay';
import GameOverOverlay from '@/components/games/GameOverOverlay';
import LingoWordleGame from '@/components/games/LingoWordleGame';
import SoundReflexGame from '@/components/games/SoundReflexGame';
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
  Search,
  Crown,
  Filter,
  SlidersHorizontal,
  Headphones,
  Keyboard,
  Puzzle,
  Lightbulb,
} from 'lucide-react';
import Image from 'next/image';
import MascotPopup from '@/components/MascotPopup';
import {
  UNIVERSAL_VOCABULARY,
  UNIVERSAL_SCRAMBLE_BANK,
  WORDLE_WORDS_BANK,
  WordleTarget,
  getFilteredVocabulary,
  generateSmartDistractors,
  getRandomWordleTarget,
  getScrambleQuestions,
} from '@/lib/data/universalMasterData';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export default function GamesPage() {
  const { user } = useAuth();
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const isVi = locale === 'vi';

  const particleRef = useRef<ParticleCanvasHandle | null>(null);

  // Audio State
  const [isMuted, setIsMuted] = useState(false);

  // Navigation & Tab State
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

  // GAME 5: LINGO WORDLE STATE
  const [wordleTarget, setWordleTarget] = useState<WordleTarget>(WORDLE_WORDS_BANK[0]);

  // GAME 6: SOUND REFLEX STATE
  const [soundQuestions, setSoundQuestions] = useState<any[]>([]);
  const [soundScore, setSoundScore] = useState(0);

  // Topics for Filter Bar
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
  const gamesList = [
    {
      id: 'word_match',
      title: isVi ? 'Lật Thẻ Ghép Từ 3D' : '3D Word Match Cards',
      desc: isVi ? 'Lật từng cặp thẻ bài 3D để ghép từ tiếng Anh với nghĩa tiếng Việt tương ứng.' : 'Flip 3D cards to match English words with their contextual meanings.',
      iconType: 'puzzle',
      badgeColor: 'border-teal-500/40 bg-teal-950/40 text-teal-300',
      image3d: '/images/games/card-word-match-3d.png',
      cardBg: 'bg-gradient-to-br from-emerald-950/30 via-slate-900/95 to-teal-950/40 border-emerald-500/30 hover:border-emerald-400/60 shadow-[0_10px_35px_rgba(6,78,59,0.2)]',
      glowColor: 'bg-emerald-500/20',
      decorType: 'grid',
    },
    {
      id: 'sentence_scramble',
      title: isVi ? 'Xếp Từ Thành Câu' : 'Sentence Builder Arcade',
      desc: isVi ? 'Sắp xếp các từ xáo trộn thành câu tiếng Anh hoàn chỉnh theo đúng ngữ pháp.' : 'Unscramble mixed word tokens to construct grammatically perfect sentences.',
      iconType: 'abc',
      badgeColor: 'border-amber-500/40 bg-amber-950/40 text-amber-300',
      image3d: '/images/games/card-sentence-scramble-3d.png',
      cardBg: 'bg-gradient-to-br from-blue-950/30 via-slate-900/95 to-indigo-950/40 border-blue-500/30 hover:border-blue-400/60 shadow-[0_10px_35px_rgba(30,58,138,0.2)]',
      glowColor: 'bg-blue-500/20',
      decorType: 'constellation',
    },
    {
      id: 'typing_race',
      title: isVi ? 'Đua Tốc Độ Gõ Từ' : 'Speed Typing Sprint',
      desc: isVi ? 'Thử thách gõ nhanh và chính xác các từ tiếng Anh dưới áp lực thời gian đếm ngược.' : 'Type English vocabulary fast with 100% precision before the clock expires.',
      iconType: 'keyboard',
      badgeColor: 'border-rose-500/40 bg-rose-950/40 text-rose-300',
      image3d: '/images/games/card-typing-race-3d.png',
      cardBg: 'bg-gradient-to-br from-rose-950/30 via-slate-900/95 to-purple-950/40 border-rose-500/30 hover:border-rose-400/60 shadow-[0_10px_35px_rgba(136,19,55,0.2)]',
      glowColor: 'bg-rose-500/20',
      decorType: 'speed',
    },
    {
      id: 'fill_blitz',
      title: isVi ? 'Thách Thức 60 Giây' : '60-Second Rapid Blitz',
      desc: isVi ? 'Điền từ liên hoàn trong 60 giây với các đáp án thông minh để tích lũy điểm thưởng Combo.' : 'Rapid-fire vocabulary challenge with smart distractors to build massive combos.',
      iconType: 'target',
      badgeColor: 'border-purple-500/40 bg-purple-950/40 text-purple-300',
      image3d: '/images/games/card-fill-blitz-3d.png',
      cardBg: 'bg-gradient-to-br from-purple-950/30 via-slate-900/95 to-indigo-950/40 border-purple-500/30 hover:border-purple-400/60 shadow-[0_10px_35px_rgba(88,28,135,0.25)]',
      glowColor: 'bg-purple-500/20',
      decorType: 'atomic',
    },
    {
      id: 'lingo_wordle',
      title: isVi ? 'Lingo Wordle 5 Chữ Cái' : 'Lingo Wordle 5-Letter Arena',
      desc: isVi ? 'Đoán từ bí mật 5 chữ cái với phản hồi màu sắc Xanh/Vàng/Xám và bàn phím tương tác trực quan.' : 'Guess the secret 5-letter English word with color feedback and interactive keyboard.',
      iconType: 'star',
      badgeColor: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300',
      image3d: '/images/games/card-fill-blitz-3d.png',
      cardBg: 'bg-gradient-to-br from-emerald-950/40 via-slate-900/95 to-cyan-950/40 border-emerald-500/30 hover:border-emerald-400/60 shadow-[0_10px_35px_rgba(16,185,129,0.2)]',
      glowColor: 'bg-emerald-500/25',
      decorType: 'wordle',
    },
    {
      id: 'sound_reflex',
      title: isVi ? 'Bắt Âm Bản Ngữ (Sound Reflex)' : 'Sound Reflex Listening Pop',
      desc: isVi ? 'Lắng nghe phát âm chuẩn bản ngữ và phản xạ chọn nhanh từ vựng tương ứng trong 5 giây.' : 'Listen to native pronunciation and tap the matching word in 5 seconds flat.',
      iconType: 'headphones',
      badgeColor: 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300',
      image3d: '/images/games/card-word-match-3d.png',
      cardBg: 'bg-gradient-to-br from-cyan-950/30 via-slate-900/95 to-blue-950/40 border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_10px_35px_rgba(6,182,212,0.2)]',
      glowColor: 'bg-cyan-500/20',
      decorType: 'sound',
    },
  ];

  // Load Leaderboard Data and local high score
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await gamesApi.getLeaderboard();
        if (res?.leaderboard) {
          setLeaderboardData(res.leaderboard);
        }
      } catch {
        const localScore = typeof window !== 'undefined' ? parseInt(localStorage.getItem('linguaflow_arcade_highscore') || '0', 10) : 0;
        const initial = [
          { rank: 1, displayName: 'Thắng Trí Việt', xp: 2450, accuracy: 98, streak: 15, avatar: '👑' },
          { rank: 2, displayName: 'Học Viên Lingual', xp: 1890, accuracy: 94, streak: 10, avatar: '🥇' },
          { rank: 3, displayName: 'Minh Anh IELTS', xp: 1650, accuracy: 91, streak: 8, avatar: '🥈' },
          { rank: 4, displayName: 'Hoàng Long Code', xp: 1420, accuracy: 88, streak: 6, avatar: '🥉' },
          { rank: 5, displayName: 'Khánh Linh', xp: 1200, accuracy: 85, streak: 5, avatar: '⭐' },
        ];
        if (localScore > 0) {
          initial.push({ rank: 6, displayName: 'Bạn (Người chơi)', xp: localScore, accuracy: 96, streak: 3, avatar: '🚀' });
          initial.sort((a, b) => b.xp - a.xp);
          initial.forEach((p, idx) => (p.rank = idx + 1));
        }
        setLeaderboardData(initial);
      }
    };
    fetchLeaderboard();
  }, []);

  // Timer Ticker
  useEffect(() => {
    let interval: any = null;
    if (activeGame && activeGame !== 'lingo_wordle' && timerSeconds > 0 && !showVictory && !showGameOver && lives > 0) {
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

  // Native Speech Playback
  const speakText = (text: string) => {
    arcadeAudio.playLaser();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Finish game and record attempt
  const handleFinishCurrentGame = async () => {
    const totalScore = matchScore || scrambleScore || typingScore || blitzScore || soundScore || 120;
    const earnedXP = Math.round(totalScore / 10) + 25;

    setFinalScore(totalScore);
    setFinalXP(earnedXP);

    // Save local high score
    if (typeof window !== 'undefined') {
      const prevBest = parseInt(localStorage.getItem('linguaflow_arcade_highscore') || '0', 10);
      if (totalScore > prevBest) {
        localStorage.setItem('linguaflow_arcade_highscore', totalScore.toString());
      }
    }

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
          userId: user?.id,
        });
      } catch {}
    }
  };

  // Initialize Game Session with Selected Difficulty & Topic Filter
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
    setSoundScore(0);

    const initialTime = difficulty === 'easy' ? 90 : difficulty === 'medium' ? 60 : 45;
    setTimerSeconds(initialTime);

    arcadeAudio.playLaser();

    try {
      const attemptRes = await gamesApi.startAttempt(gameType);
      if (attemptRes?.attemptId) setAttemptId(attemptRes.attemptId);
      const dataRes = await gamesApi.getData(gameType, { topic: selectedTopic, cefr: selectedCefr });

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
        setBlitzQuestions(dataRes.questions);
      }

      if (gameType === 'lingo_wordle' && dataRes?.target) {
        setWordleTarget(dataRes.target);
      }

      if (gameType === 'sound_reflex' && dataRes?.questions) {
        setSoundQuestions(dataRes.questions);
      }
    } catch {
      // 100% RELIABLE RICH FALLBACK DATASET (Never blanks out or freezes)
      const filteredVocab = getFilteredVocabulary({ category: selectedTopic, cefr: selectedCefr, count: 12 });

      if (gameType === 'word_match') {
        const pairs = filteredVocab.slice(0, 6);
        const cards: any[] = [];
        pairs.forEach((p, idx) => {
          cards.push({ id: `fb-${idx}-t`, pairId: `p-${idx}`, text: p.word, type: 'target' });
          cards.push({ id: `fb-${idx}-m`, pairId: `p-${idx}`, text: p.meaningVi, type: 'trans' });
        });
        cards.sort(() => Math.random() - 0.5);
        setMatchCards(cards);
      }

      if (gameType === 'sentence_scramble') {
        setScrambleList(getScrambleQuestions(selectedCefr, 5));
      }

      if (gameType === 'typing_race') {
        setTypingWords(filteredVocab.slice(0, 10));
      }

      if (gameType === 'fill_blitz') {
        const qList = filteredVocab.slice(0, 10).map((w, idx) => ({
          id: `fb-q-${idx}`,
          q: `Chọn nghĩa tiếng Việt của từ "${w.word}":`,
          correct: w.meaningVi,
          options: generateSmartDistractors(w, 4),
          phonetic: w.phoneticUs,
        }));
        setBlitzQuestions(qList);
      }

      if (gameType === 'lingo_wordle') {
        setWordleTarget(getRandomWordleTarget());
      }

      if (gameType === 'sound_reflex') {
        const sList = filteredVocab.slice(0, 10).map((w, idx) => {
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
        });
        setSoundQuestions(sList);
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
        speakText(currentScramble.fullSentence);
        const diffMultiplier = selectedDifficulty === 'hard' ? 2 : selectedDifficulty === 'medium' ? 1.5 : 1;
        setScrambleScore((prev) => prev + Math.round(150 * combo * diffMultiplier));

        if (scrambleIdx + 1 < scrambleList.length) {
          setTimeout(() => {
            setScrambleIdx((prev) => prev + 1);
            setScrambleSelectedTokens([]);
          }, 800);
        } else {
          setTimeout(() => handleFinishCurrentGame(), 800);
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
    const targetWord = typingWords[typingIdx]?.word || typingWords[typingIdx]?.targetText;

    if (targetWord && val.trim().toLowerCase() === targetWord.trim().toLowerCase()) {
      triggerCorrectAnswer(typeof window !== 'undefined' ? window.innerWidth / 2 : 400, 300);
      speakText(targetWord);
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

  const filteredGames = gamesList.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 font-sans ${isShaking ? 'animate-bounce' : ''}`}>
      {/* 2D Particle Canvas for Confetti, Sparks & Floating XP */}
      <ParticleCanvas ref={particleRef} />

      {/* Main Header / Top Navigation Bar */}
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
              <span>{isVi ? 'LINGUAFLOW ARCADE HUB 2.0' : 'LINGUAFLOW ARCADE HUB 2.0'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">
              {isVi ? 'Đấu Trường Luyện Game Đa Dạng' : 'Gamified Arcade Arena'}
            </h1>
          </div>
        </div>

        {/* Top Controls: Search Input, Audio Toggle & Tabs */}
        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isVi ? "Tìm trò chơi..." : "Search games..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-32 sm:w-44 pl-8 pr-3 py-1.5 rounded-full bg-slate-950/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors shadow-inner"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              const muted = arcadeAudio.toggleMute();
              setIsMuted(muted);
            }}
            aria-label={isMuted ? 'Bật âm thanh game' : 'Tắt âm thanh game'}
            className="w-9 h-9 rounded-2xl bg-slate-950/90 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-slate-700 flex items-center justify-center transition-colors shadow-inner"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-950/90 border border-slate-800">
            <button
              onClick={() => {
                arcadeAudio.playLaser();
                setActiveTab('games');
              }}
              className={`px-4 py-1.5 rounded-xl font-display font-bold text-xs transition-all ${
                activeTab === 'games'
                  ? 'bg-gradient-to-r from-purple-950/90 via-indigo-900/90 to-purple-950/90 text-white border border-purple-500/40 shadow-lg shadow-purple-950/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isVi ? 'Trò Chơi (6)' : 'Arcade Games (6)'}
            </button>
            <button
              onClick={() => {
                arcadeAudio.playLaser();
                setActiveTab('leaderboard');
              }}
              className={`px-4 py-1.5 rounded-xl font-display font-bold text-xs transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-gradient-to-r from-purple-950/90 via-indigo-900/90 to-purple-950/90 text-white border border-purple-500/40 shadow-lg shadow-purple-950/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isVi ? 'Bảng Xếp Hạng' : 'Leaderboard'}
            </button>
          </div>
        </div>
      </div>

      {/* TOPIC & CEFR FILTER BAR */}
      {activeTab === 'games' && !activeGame && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-850 relative z-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto scrollbar-none">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              {isVi ? 'Chủ đề:' : 'Topic:'}
            </span>
            {topicFilters.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  arcadeAudio.playLaser();
                  setSelectedTopic(t.id);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  selectedTopic === t.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
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
                onClick={() => {
                  arcadeAudio.playLaser();
                  setSelectedCefr(lvl);
                }}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold transition-all ${
                  selectedCefr === lvl
                    ? 'bg-amber-500 text-slate-950'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 relative z-10">
          {filteredGames.map((g) => (
            <motion.div
              key={g.id}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="relative rounded-[22px] bg-[#121626]/85 border border-[rgba(80,100,160,0.3)] hover:border-cyan-400/50 backdrop-blur-xl p-6 flex flex-col justify-between space-y-4 transition-all duration-300 overflow-visible group shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] hover:shadow-[0_12px_40px_rgba(34,211,238,0.12),inset_0_1px_2px_rgba(255,255,255,0.15)]"
            >
              {/* Subtle Ambient Radial Glow Behind Card */}
              <div className="absolute inset-0 rounded-[22px] overflow-hidden pointer-events-none z-0">
                <div
                  className={`absolute -top-10 right-4 w-48 h-44 rounded-full ${g.glowColor} blur-[60px] opacity-70 group-hover:opacity-100 transition-opacity duration-500`}
                />
              </div>

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-extrabold uppercase tracking-wider border ${g.badgeColor}`}>
                    {g.id === 'lingo_wordle' || g.id === 'sound_reflex' ? 'HOT NEW' : 'ARCADE'}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center text-cyan-400">
                    {g.iconType === 'puzzle' && <Puzzle className="w-4 h-4" />}
                    {g.iconType === 'abc' && <Zap className="w-4 h-4" />}
                    {g.iconType === 'keyboard' && <Keyboard className="w-4 h-4" />}
                    {g.iconType === 'target' && <Flame className="w-4 h-4" />}
                    {g.iconType === 'star' && <Sparkles className="w-4 h-4 text-amber-400" />}
                    {g.iconType === 'headphones' && <Headphones className="w-4 h-4 text-cyan-400" />}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-display font-black text-white group-hover:text-cyan-300 transition-colors">
                    {g.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                    {g.desc}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  arcadeAudio.playLaser();
                  setShowDifficultyModal(g.id);
                }}
                className="relative z-10 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isVi ? 'Bắt Đầu Thử Thách' : 'Start Challenge'}</span>
              </button>
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
            <span className="text-xs text-slate-400 font-mono">Real-time Ranking</span>
          </div>

          <div className="space-y-2.5">
            {leaderboardData.map((player) => (
              <div
                key={player.rank}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  player.displayName.includes('Bạn')
                    ? 'bg-cyan-950/30 border-cyan-500/50 shadow-lg shadow-cyan-950/30'
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
          {/* Top Status Bar (Timer, Combo, Lives, Exit) */}
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
              {/* Combo Multiplier Meter */}
              <ComboMeter combo={combo} />

              {/* Heart Lives Container */}
              <HeartContainer lives={lives} maxLives={selectedDifficulty === 'hard' ? 2 : 3} />

              {/* Countdown Timer */}
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
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{isVi ? 'Ghép cặp thẻ bài từ vựng với nghĩa tương ứng' : 'Match identical pairs'}</span>
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
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Câu {scrambleIdx + 1} / {scrambleList.length}
                </span>
                <button
                  onClick={() => speakText(scrambleList[scrambleIdx].fullSentence)}
                  className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-950 border border-slate-800 text-cyan-400 hover:text-white flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Phát âm mẫu' : 'Listen'}</span>
                </button>
              </div>

              <p className="text-base sm:text-lg font-bold text-amber-300 bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
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
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 font-bold text-sm text-white transition-all active:scale-95 shadow-md cursor-pointer"
                  >
                    {token}
                  </button>
                ))}
              </div>

              {scrambleSelectedTokens.length > 0 && (
                <button
                  onClick={() => setScrambleSelectedTokens([])}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Xếp lại câu này' : 'Reset words'}</span>
                </button>
              )}
            </div>
          )}

          {/* GAME 3: TYPING RACE */}
          {activeGame === 'typing_race' && typingWords[typingIdx] && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                  {isVi ? 'Gõ từ tiếng Anh chuẩn xác:' : 'Type the exact target word:'}
                </span>
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
                    {typingWords[typingIdx].word || typingWords[typingIdx].targetText}
                  </h2>
                  <button
                    onClick={() => speakText(typingWords[typingIdx].word || typingWords[typingIdx].targetText)}
                    className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 text-cyan-400 hover:text-white flex items-center justify-center"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  ({typingWords[typingIdx].meaningVi || typingWords[typingIdx].translation}) • {typingWords[typingIdx].phoneticUs || typingWords[typingIdx].phonetic || ''}
                </p>
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

          {/* GAME 4: RAPID FILL BLITZ (Context-aware Smart Distractors) */}
          {activeGame === 'fill_blitz' && blitzQuestions[blitzIdx] && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Câu {blitzIdx + 1} / {blitzQuestions.length}</span>
                <span className="text-amber-400">Combo x{combo}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-display font-bold text-white text-center py-2">
                {blitzQuestions[blitzIdx].q}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {blitzQuestions[blitzIdx].options.map((opt: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={(e) => handleBlitzAnswer(opt, e)}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400 font-bold text-sm text-white transition-all active:scale-95 shadow-md text-left flex items-center justify-between cursor-pointer"
                  >
                    <span>{opt}</span>
                    <span className="text-xs font-mono text-slate-600">#{idx + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GAME 5: LINGO WORDLE */}
          {activeGame === 'lingo_wordle' && (
            <LingoWordleGame
              target={wordleTarget}
              onWin={(score, guesses) => {
                setFinalScore(score);
                setFinalXP(Math.round(score / 8));
                setShowVictory(true);
                particleRef.current?.spawnConfetti();
              }}
              onLose={() => {
                triggerWrongAnswer();
                setShowGameOver(true);
              }}
              onRestart={() => setWordleTarget(getRandomWordleTarget())}
              isVi={isVi}
            />
          )}

          {/* GAME 6: SOUND REFLEX */}
          {activeGame === 'sound_reflex' && soundQuestions.length > 0 && (
            <SoundReflexGame
              questions={soundQuestions}
              combo={combo}
              onCorrect={(e) => {
                const clientX = e?.clientX || 400;
                const clientY = e?.clientY || 300;
                triggerCorrectAnswer(clientX, clientY);
                setSoundScore((prev) => prev + 120 * combo);
              }}
              onWrong={(e) => {
                const clientX = e?.clientX || 400;
                const clientY = e?.clientY || 300;
                triggerWrongAnswer(clientX, clientY);
              }}
              onFinish={() => handleFinishCurrentGame()}
              isVi={isVi}
            />
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
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-850 hover:border-cyan-500/50 flex items-center justify-between text-left transition-all group cursor-pointer"
                >
                  <div>
                    <span className="font-display font-bold text-sm text-white group-hover:text-cyan-300 block">
                      {diff === 'easy' ? (isVi ? 'Dễ (90s / 3 Mạng)' : 'Easy (90s / 3 Lives)') : diff === 'medium' ? (isVi ? 'Chuẩn (60s / 3 Mạng)' : 'Medium (60s / 3 Lives)') : (isVi ? 'Khó (45s / 2 Mạng / x2 XP)' : 'Hard (45s / 2 Lives / 2X XP)')}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {diff === 'hard' ? (isVi ? 'Nhận nhân đôi điểm thưởng XP' : 'Earn 2X bonus XP multiplier') : (isVi ? 'Phù hợp làm quen nhịp độ' : 'Standard arcade gameplay')}
                    </span>
                  </div>
                  <Play className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
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
