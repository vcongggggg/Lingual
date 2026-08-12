'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, ProgressBar } from '@linguaflow/ui';
import { gamesApi } from '../../../lib/api';
import { Gamepad2, ArrowLeft, Trophy, Sparkles, Timer, RefreshCw, Zap, CheckCircle2, XCircle, Flame, Heart } from 'lucide-react';

export default function GamesPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string>('');
  const [scoreResult, setScoreResult] = useState<any>(null);
  const [timerSeconds, setTimerSeconds] = useState(60);

  // --------------------------------------------------------------------------
  // GAME 1: WORD MATCH (3D MEMORY CARD FLIP) STATE
  // --------------------------------------------------------------------------
  const [matchCards, setMatchCards] = useState<any[]>([]);
  const [firstCard, setFirstCard] = useState<any | null>(null);
  const [secondCard, setSecondCard] = useState<any | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [isCheckingMatch, setIsCheckingMatch] = useState(false);
  const [matchScore, setMatchScore] = useState(0);

  // --------------------------------------------------------------------------
  // GAME 2: SENTENCE SCRAMBLE STATE
  // --------------------------------------------------------------------------
  const [scrambleList, setScrambleList] = useState<any[]>([]);
  const [scrambleIdx, setScrambleIdx] = useState(0);
  const [scrambleSelectedTokens, setScrambleSelectedTokens] = useState<string[]>([]);
  const [scrambleScore, setScrambleScore] = useState(0);

  // --------------------------------------------------------------------------
  // GAME 3: TYPING RACE STATE
  // --------------------------------------------------------------------------
  const [typingWords, setTypingWords] = useState<any[]>([]);
  const [typingIdx, setTypingIdx] = useState(0);
  const [typingInput, setTypingInput] = useState('');
  const [typingScore, setTypingScore] = useState(0);
  const [wpm, setWpm] = useState(0);

  // --------------------------------------------------------------------------
  // GAME 4: FILL BLITZ STATE
  // --------------------------------------------------------------------------
  const [blitzQuestions, setBlitzQuestions] = useState<any[]>([]);
  const [blitzIdx, setBlitzIdx] = useState(0);
  const [blitzCombo, setBlitzCombo] = useState(1);
  const [blitzScore, setBlitzScore] = useState(0);

  const gamesList = [
    {
      id: 'word_match',
      title: 'Word Match (Trí Nhớ Lật Thẻ 3D)',
      desc: 'Tất cả 12 thẻ bài được úp mặt. Lật từng thẻ để tìm cặp từ Tiếng Anh & Nghĩa Tiếng Việt tương ứng.',
      icon: '🧩',
      glow: 'teal' as const,
    },
    {
      id: 'sentence_scramble',
      title: 'Sentence Scramble (Ghép Câu Đúng Ngữ Pháp)',
      desc: 'Sắp xếp các từ xáo trộn thành câu tiếng Anh chuẩn xác dưới áp lực thời gian.',
      icon: '🔤',
      glow: 'amber' as const,
    },
    {
      id: 'typing_race',
      title: 'Typing Race (Đua Tốc Độ Gõ Phím)',
      desc: 'Thử thách gõ từ tiếng Anh chuẩn xác và đo chỉ số WPM (từ/phút).',
      icon: '⚡',
      glow: 'coral' as const,
    },
    {
      id: 'fill_blitz',
      title: 'Fill Blitz (60 Giây Thách Thức)',
      desc: 'Trả lời liên hoàn các câu điền từ trong 60s để tích lũy điểm thưởng Combo Super 5X.',
      icon: '🎯',
      glow: 'teal' as const,
    },
  ];

  // --------------------------------------------------------------------------
  // TIMER TICKER FOR BLITZ & RACE
  // --------------------------------------------------------------------------
  useEffect(() => {
    let interval: any = null;
    if (activeGame && timerSeconds > 0 && !scoreResult) {
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
  }, [activeGame, timerSeconds, scoreResult]);

  // --------------------------------------------------------------------------
  // START GAME INITIALIZER
  // --------------------------------------------------------------------------
  const handleStartGame = async (gameType: string) => {
    setActiveGame(gameType);
    setScoreResult(null);
    setTimerSeconds(60);
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
    setBlitzCombo(1);
    setBlitzScore(0);

    try {
      const attData = await gamesApi.startAttempt(gameType);
      setAttemptId(attData.attemptId);
    } catch {
      setAttemptId(`att-game-${Date.now()}`);
    }

    // Fetch dynamic game data from API
    try {
      const apiData = await gamesApi.getData(gameType);

      if (gameType === 'word_match' && apiData.pairs) {
        const rawPairs = apiData.pairs.slice(0, 6);
        const cards: any[] = [];
        rawPairs.forEach((p: any, idx: number) => {
          cards.push({ cardId: `eng-${idx}`, pairId: String(idx), text: p.targetText, type: 'ENG' });
          cards.push({ cardId: `vi-${idx}`, pairId: String(idx), text: p.translation, type: 'VI' });
        });
        setMatchCards(cards.sort(() => Math.random() - 0.5));
      } else if (gameType === 'sentence_scramble' && apiData.sentences) {
        setScrambleList(apiData.sentences.map((s: any) => ({
          ...s,
          tokens: [...s.tokens].sort(() => Math.random() - 0.5),
        })));
      } else if (gameType === 'typing_race' && apiData.questions) {
        setTypingWords(apiData.questions.slice(0, 8).map((q: any) => ({
          word: q.targetText,
          translation: q.translation,
        })));
      } else if (gameType === 'fill_blitz' && apiData.questions) {
        // Generate fill-in-blank questions from word data
        const blitz = apiData.questions.slice(0, 6).map((q: any, idx: number) => {
          const otherWords = apiData.questions.filter((_: any, i: number) => i !== idx).slice(0, 3).map((w: any) => w.targetText);
          return {
            q: `"${q.translation}" dịch sang tiếng Anh là ______?`,
            options: [q.targetText, ...otherWords].sort(() => Math.random() - 0.5),
            answer: q.targetText,
          };
        });
        setBlitzQuestions(blitz);
      } else {
        loadFallbackGameData(gameType);
      }
    } catch {
      loadFallbackGameData(gameType);
    }
  };

  const loadFallbackGameData = (gameType: string) => {
    if (gameType === 'word_match') {
      const rawPairs = [
        { id: '1', eng: 'Hello', vi: 'Xin chào' },
        { id: '2', eng: 'Water', vi: 'Nước uống' },
        { id: '3', eng: 'Book', vi: 'Quyển sách' },
        { id: '4', eng: 'Coffee', vi: 'Cà phê' },
        { id: '5', eng: 'Teacher', vi: 'Giáo viên' },
        { id: '6', eng: 'Rain', vi: 'Mưa' },
      ];
      const cards: any[] = [];
      rawPairs.forEach((p) => {
        cards.push({ cardId: `eng-${p.id}`, pairId: p.id, text: p.eng, type: 'ENG' });
        cards.push({ cardId: `vi-${p.id}`, pairId: p.id, text: p.vi, type: 'VI' });
      });
      setMatchCards(cards.sort(() => Math.random() - 0.5));
    } else if (gameType === 'sentence_scramble') {
      setScrambleList([
        { id: 's1', sentence: 'Nice to meet you', tokens: ['to', 'Nice', 'you', 'meet'].sort(() => Math.random() - 0.5), translation: 'Rất vui được gặp bạn' },
        { id: 's2', sentence: 'My name is Nam', tokens: ['name', 'is', 'My', 'Nam'].sort(() => Math.random() - 0.5), translation: 'Tên tôi là Nam' },
        { id: 's3', sentence: 'I drink water every day', tokens: ['every', 'I', 'drink', 'water', 'day'].sort(() => Math.random() - 0.5), translation: 'Tôi uống nước mỗi ngày' },
      ]);
    } else if (gameType === 'typing_race') {
      setTypingWords([
        { word: 'Hello', translation: 'Xin chào' },
        { word: 'Water', translation: 'Nước uống' },
        { word: 'Teacher', translation: 'Giáo viên' },
        { word: 'Coffee', translation: 'Cà phê' },
        { word: 'Student', translation: 'Học sinh' },
      ]);
    } else if (gameType === 'fill_blitz') {
      setBlitzQuestions([
        { q: 'Good ______, teacher!', options: ['morning', 'night', 'bye', 'hello'], answer: 'morning' },
        { q: 'My ______ is Nam.', options: ['name', 'country', 'water', 'book'], answer: 'name' },
        { q: 'I like drinking ______.', options: ['coffee', 'rain', 'sun', 'pen'], answer: 'coffee' },
        { q: 'She is an English ______.', options: ['teacher', 'rice', 'sun', 'water'], answer: 'teacher' },
      ]);
    }
  };

  // --------------------------------------------------------------------------
  // GAME 1 LOGIC: REAL 3D MEMORY CARD FLIP & AUTOMATIC RE-FLIP ON MISMATCH
  // --------------------------------------------------------------------------
  const handleCardClick = (card: any) => {
    if (isCheckingMatch) return;
    if (matchedIds.includes(card.cardId)) return;
    if (firstCard?.cardId === card.cardId) return;

    if (!firstCard) {
      setFirstCard(card);
    } else if (!secondCard) {
      setSecondCard(card);
      setIsCheckingMatch(true);

      if (firstCard.pairId === card.pairId) {
        // MATCH SUCCESS!
        setTimeout(() => {
          setMatchedIds((prev) => [...prev, firstCard.cardId, card.cardId]);
          setMatchScore((prev) => prev + 25);
          setFirstCard(null);
          setSecondCard(null);
          setIsCheckingMatch(false);

          if (matchedIds.length + 2 >= matchCards.length) {
            handleFinishCurrentGame(matchScore + 25);
          }
        }, 600);
      } else {
        // MISMATCH -> FLIP BACK FACE DOWN AFTER 800MS
        setTimeout(() => {
          setFirstCard(null);
          setSecondCard(null);
          setIsCheckingMatch(false);
        }, 850);
      }
    }
  };

  // --------------------------------------------------------------------------
  // GAME 2 LOGIC: SENTENCE SCRAMBLE
  // --------------------------------------------------------------------------
  const handleScrambleSubmit = () => {
    const currentScramble = scrambleList[scrambleIdx];
    const userBuilt = scrambleSelectedTokens.join(' ');
    const targetSentence = currentScramble?.sentence || currentScramble?.fullSentence || '';

    if (targetSentence && userBuilt.trim().toLowerCase() === targetSentence.trim().toLowerCase()) {
      setScrambleScore((prev) => prev + 30);
    }

    if (scrambleIdx + 1 < scrambleList.length) {
      setScrambleIdx((prev) => prev + 1);
      setScrambleSelectedTokens([]);
    } else {
      handleFinishCurrentGame(scrambleScore + 30);
    }
  };

  // --------------------------------------------------------------------------
  // GAME 3 LOGIC: TYPING RACE
  // --------------------------------------------------------------------------
  const handleTypingChange = (val: string) => {
    setTypingInput(val);
    const target = typingWords[typingIdx]?.word || '';

    if (val.trim().toLowerCase() === target.trim().toLowerCase()) {
      setTypingScore((prev) => prev + 20);
      setWpm((prev) => prev + 15);
      setTypingInput('');

      if (typingIdx + 1 < typingWords.length) {
        setTypingIdx((prev) => prev + 1);
      } else {
        handleFinishCurrentGame(typingScore + 20);
      }
    }
  };

  // --------------------------------------------------------------------------
  // GAME 4 LOGIC: FILL BLITZ
  // --------------------------------------------------------------------------
  const handleBlitzAnswer = (selectedOpt: string) => {
    const q = blitzQuestions[blitzIdx];
    if (selectedOpt === q.answer) {
      const added = 20 * blitzCombo;
      setBlitzScore((prev) => prev + added);
      setBlitzCombo((prev) => Math.min(5, prev + 1));
    } else {
      setBlitzCombo(1);
    }

    if (blitzIdx + 1 < blitzQuestions.length) {
      setBlitzIdx((prev) => prev + 1);
    } else {
      handleFinishCurrentGame(blitzScore + 20 * blitzCombo);
    }
  };

  // --------------------------------------------------------------------------
  // FINISH GAME & SUBMIT TO SERVER
  // --------------------------------------------------------------------------
  const handleFinishCurrentGame = async (calculatedScore?: number) => {
    const finalScore = calculatedScore || matchScore || scrambleScore || typingScore || blitzScore || 100;
    const duration = 60 - timerSeconds;

    try {
      const result = await gamesApi.submitScore({
        attemptId,
        gameType: activeGame!,
        userAnswers: [{ score: finalScore }],
        durationSeconds: duration,
      });
      setScoreResult(result);

      if (result?.totalUserXP) {
        window.dispatchEvent(
          new CustomEvent('linguaflow_xp_update', {
            detail: { totalXP: result.totalUserXP, streakDays: result.newStreakDays },
          })
        );
      }
    } catch {
      setScoreResult({
        finalScore,
        xpEarned: Math.round(finalScore / 4),
        correctAnswers: 5,
        totalQuestions: 5,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href={`/${locale}/dashboard`}>
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Về Lộ Trình
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-amber-400" />
          <h1 className="text-2xl font-display font-bold text-white">Game Center Lingual</h1>
        </div>
      </div>

      {!activeGame ? (
        /* GAME SELECTION GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gamesList.map((g) => (
            <Card
              key={g.id}
              glow={g.glow}
              className="space-y-4 cursor-pointer group hover:scale-[1.02] transition-transform"
              onClick={() => handleStartGame(g.id)}
            >
              <div className="text-4xl">{g.icon}</div>
              <h3 className="text-xl font-display font-bold text-white group-hover:text-amber-400 transition-colors">
                {g.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">{g.desc}</p>
              <Button variant="accent" size="sm" className="w-full">
                Bắt Đầu Thử Thách
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        /* ACTIVE GAME PLAYGROUND MODAL */
        <Card glow="amber" className="space-y-6 max-w-2xl mx-auto">
          {!scoreResult ? (
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {gamesList.find((g) => g.id === activeGame)?.title}
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                    <Timer className="w-4 h-4" />
                    <span>{timerSeconds}s</span>
                  </div>
                  <button
                    onClick={() => setActiveGame(null)}
                    className="text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Rời Game
                  </button>
                </div>
              </div>

              {/* ------------------------------------------------------------------ */}
              {/* GAME 1: REAL 3D MEMORY CARD FLIP (ÚP THẺ KHI BẮT ĐẦU) */}
              {/* ------------------------------------------------------------------ */}
              {activeGame === 'word_match' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-300">
                    <span>Lật từng thẻ để tìm 6 cặp Anh - Việt tương ứng:</span>
                    <span className="font-bold text-amber-400">Điểm: {matchScore}</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {matchCards.map((card) => {
                      const isMatched = matchedIds.includes(card.cardId);
                      const isFirst = firstCard?.cardId === card.cardId;
                      const isSecond = secondCard?.cardId === card.cardId;
                      const isOpen = isMatched || isFirst || isSecond;
                      const isMismatch = isSecond && !isMatched && (isFirst || isSecond);

                      return (
                        <div key={card.cardId} className="h-28 perspective-1000">
                          <motion.button
                            animate={{ rotateY: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.4, type: 'spring', stiffness: 220, damping: 20 }}
                            style={{ transformStyle: 'preserve-3d' }}
                            onClick={() => handleCardClick(card)}
                            className="relative w-full h-full rounded-2xl select-none"
                          >
                            {/* CARD BACK (MẶT ÚP - BAN ĐẦU) */}
                            <div
                              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                              className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-900 to-teal-950/80 border-2 border-teal-500/30 flex flex-col items-center justify-center gap-1 shadow-lg shadow-teal-500/10 hover:border-amber-400 transition-colors"
                            >
                              <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-amber-400" />
                              </div>
                              <span className="text-[10px] font-extrabold tracking-widest text-teal-400 uppercase">
                                Úp Thẻ
                              </span>
                            </div>

                            {/* CARD FRONT (MẶT NGỬA - HIỂN THỊ TỪ KHI LẬT) */}
                            <div
                              style={{
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)',
                              }}
                              className={`absolute inset-0 rounded-2xl border-2 p-2 flex flex-col items-center justify-center text-center font-display font-bold text-xs sm:text-sm shadow-xl ${
                                isMatched
                                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                  : isMismatch
                                  ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                                  : 'bg-amber-500/20 border-amber-400 text-amber-300'
                              }`}
                            >
                              <span className="text-[9px] font-bold opacity-75 uppercase block mb-0.5">
                                {card.type === 'ENG' ? '🇬🇧 English' : '🇻🇳 Tiếng Việt'}
                              </span>
                              <span className="text-sm font-extrabold">{card.text}</span>
                            </div>
                          </motion.button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------------ */}
              {/* GAME 2: SENTENCE SCRAMBLE */}
              {/* ------------------------------------------------------------------ */}
              {activeGame === 'sentence_scramble' && scrambleList[scrambleIdx] && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-teal-400">Dịch nghĩa câu:</span>
                    <h3 className="text-xl font-display font-bold text-white">
                      "{scrambleList[scrambleIdx].translation}"
                    </h3>
                  </div>

                  <div className="min-h-16 p-4 rounded-2xl bg-slate-950 border border-dashed border-amber-500/40 flex flex-wrap gap-2 items-center">
                    {scrambleSelectedTokens.map((tok, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          setScrambleSelectedTokens(scrambleSelectedTokens.filter((_, i) => i !== idx))
                        }
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-coral-500 to-amber-500 text-slate-950 font-bold text-sm shadow-md"
                      >
                        {tok}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {scrambleList[scrambleIdx].tokens.map((tok: string, idx: number) => {
                      const isUsed = scrambleSelectedTokens.includes(tok);
                      return (
                        <button
                          key={idx}
                          disabled={isUsed}
                          onClick={() => setScrambleSelectedTokens([...scrambleSelectedTokens, tok])}
                          className={`px-3.5 py-2 rounded-xl font-bold text-sm border transition-all ${
                            isUsed
                              ? 'bg-slate-900 border-slate-800 text-slate-600 opacity-40'
                              : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                          }`}
                        >
                          {tok}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full"
                    disabled={scrambleSelectedTokens.length === 0}
                    onClick={handleScrambleSubmit}
                  >
                    Kiểm Tra Câu Đã Ghép
                  </Button>
                </div>
              )}

              {/* ------------------------------------------------------------------ */}
              {/* GAME 3: TYPING RACE */}
              {/* ------------------------------------------------------------------ */}
              {activeGame === 'typing_race' && typingWords[typingIdx] && (
                <div className="space-y-6 text-center">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-coral-400 uppercase tracking-widest">
                      Gõ từ tiếng Anh chuẩn xác:
                    </span>
                    <h2 className="text-4xl font-display font-extrabold text-white">
                      {typingWords[typingIdx].word}
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

                  <div className="flex justify-center gap-6 text-xs text-slate-400">
                    <span>Tốc độ: <strong className="text-teal-400 font-bold">{wpm} WPM</strong></span>
                    <span>Điểm: <strong className="text-amber-400 font-bold">{typingScore}</strong></span>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------------ */}
              {/* GAME 4: FILL BLITZ */}
              {/* ------------------------------------------------------------------ */}
              {activeGame === 'fill_blitz' && blitzQuestions[blitzIdx] && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                      Combo: {blitzCombo}X
                    </span>
                    <span className="text-xs font-mono text-teal-400 font-bold">Điểm: {blitzScore}</span>
                  </div>

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
            /* GAME RESULT CELEBRATION */
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-coral-500 to-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
                <Trophy className="w-10 h-10 text-slate-950" />
              </div>
              <h2 className="text-3xl font-display font-extrabold text-white">Thắng Trận Game!</h2>
              <div className="flex justify-center gap-8 text-sm">
                <div>
                  <span className="block text-xs text-slate-400">Điểm Số</span>
                  <span className="font-extrabold text-2xl text-amber-400">{scoreResult.finalScore || matchScore || scrambleScore || typingScore || blitzScore}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400">XP Đã Nhận</span>
                  <span className="font-extrabold text-2xl text-teal-400">+{scoreResult.xpEarned || 25} XP</span>
                </div>
              </div>
              <Button variant="accent" size="lg" className="w-full" onClick={() => setActiveGame(null)}>
                Trở Về Danh Sách Game
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
