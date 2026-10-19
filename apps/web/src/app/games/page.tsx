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
  ArrowLeft,
  Check,
  X,
  Database,
} from 'lucide-react';
import { LingLing } from '../../components/ui/LingLing';
import { api } from '../../lib/api';

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

const SCRAMBLE_SENTENCES = [
  {
    id: 1,
    words: ['Sustainable', 'development', 'protects', 'our', 'environment', 'for', 'generations'],
    translation: 'Phát triển bền vững bảo vệ môi trường của chúng ta cho các thế hệ tương lai.',
  },
  {
    id: 2,
    words: ['Perseverance', 'is', 'essential', 'for', 'mastering', 'English', 'fluency'],
    translation: 'Lòng kiên trì là thiết yếu để đạt được sự lưu loát trong tiếng Anh.',
  },
  {
    id: 3,
    words: ['Bilingualism', 'stimulates', 'cognitive', 'flexibility', 'in', 'human', 'brains'],
    translation: 'Việc biết hai ngôn ngữ kích thích sự linh hoạt nhận thức trong não bộ con người.',
  },
];

const TYPING_WORDS = [
  { id: 1, word: 'PERSEVERANCE', phonetic: '/ˌpɜː.sɪˈvɪə.rəns/', vi: 'Sự kiên trì, lòng bền bỉ' },
  { id: 2, word: 'RESILIENT', phonetic: '/rɪˈzɪl.jənt/', vi: 'Kiên cường, có khả năng phục hồi' },
  { id: 3, word: 'SERENDIPITY', phonetic: '/ˌser.ənˈdɪp.ə.ti/', vi: 'Sự may mắn bất ngờ' },
  { id: 4, word: 'PRAGMATIC', phonetic: '/præɡˈmæt.ɪk/', vi: 'Thực tế, có tính ứng dụng cao' },
];

const CLOZE_QUESTIONS = [
  {
    id: 1,
    sentence: 'Urban planners designed ______ infrastructure to withstand frequent seasonal floods.',
    options: ['resilient', 'fragile', 'hasty', 'passive'],
    correct: 'resilient',
    explanation: '"Resilient" (kiên cường, có khả năng chống chịu) là tính từ phù hợp nhất với hạ tầng chống lũ.',
  },
  {
    id: 2,
    sentence: 'Finding this peaceful bookstore in the old town was pure ______ on a rainy afternoon.',
    options: ['serendipity', 'hazard', 'calamity', 'negligence'],
    correct: 'serendipity',
    explanation: '"Pure serendipity" là collocation tự nhiên mang nghĩa sự may mắn tình cờ kỳ diệu.',
  },
  {
    id: 3,
    sentence: 'We must adopt a ______ approach to solve speaking hesitation without fear of errors.',
    options: ['pragmatic', 'delusional', 'superficial', 'reckless'],
    correct: 'pragmatic',
    explanation: '"Pragmatic approach" nghĩa là hướng tiếp cận thực tiễn, giải quyết vấn đề dựa trên thực tế.',
  },
];

const AUDIO_CHALLENGES = [
  {
    id: 1,
    audioText: 'Collaborate',
    options: [
      { text: 'Collaborate', vi: 'Hợp tác, cộng tác cùng làm việc', isCorrect: true },
      { text: 'Corroborate', vi: 'Xác nhận, chứng thực thông tin', isCorrect: false },
      { text: 'Calibrate', vi: 'Hiệu chỉnh thông số kỹ thuật', isCorrect: false },
      { text: 'Celebrate', vi: 'Kỷ niệm, ăn mừng thành công', isCorrect: false },
    ],
  },
  {
    id: 2,
    audioText: 'Metaphor',
    options: [
      { text: 'Metaphor', vi: 'Phép ẩn dụ tu từ trong văn học', isCorrect: true },
      { text: 'Metamorphosis', vi: 'Sự biến thái, biến đổi hình dạng', isCorrect: false },
      { text: 'Metropolis', vi: 'Đô thị lớn, thành phố trung tâm', isCorrect: false },
      { text: 'Metadata', vi: 'Dữ liệu miêu tả cấu trúc thông tin', isCorrect: false },
    ],
  },
];

const FIVE_LETTER_WORDS = [
  { word: 'SMART', hint: 'Thông minh, sắc sảo và nhạy bén trong tư duy.' },
  { word: 'BRAVE', hint: 'Dũng cảm, không run sợ trước chướng ngại vật.' },
  { word: 'LEARN', hint: 'Học tập, tiếp thu kiến thức và kỹ năng mới.' },
  { word: 'FOCUS', hint: 'Tập trung cao độ vào một mục tiêu duy nhất.' },
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
  const [currentGameId, setCurrentGameId] = useState<string>('word-match');
  const [tearingTicketId, setTearingTicketId] = useState<string | null>(null);

  // Chung: Timer & Score
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [gameActive, setGameActive] = useState(false);

  // Dynamic Game Data from Live DB (with hardcoded fallbacks)
  const [matchPairs, setMatchPairs] = useState<{ id: string | number; en: string; vi: string }[]>(MATCH_PAIRS);
  const [shuffledViList, setShuffledViList] = useState<{ id: string | number; vi: string }[]>(
    MATCH_PAIRS.map((p) => ({ id: p.id, vi: p.vi }))
  );
  const [scrambleSentences, setScrambleSentences] = useState<{ id: string | number; words: string[]; translation: string }[]>(SCRAMBLE_SENTENCES);
  const [typingWords, setTypingWords] = useState<{ id: string | number; word: string; phonetic: string; vi: string }[]>(TYPING_WORDS);
  const [clozeQuestions, setClozeQuestions] = useState<{ id: string | number; sentence: string; options: string[]; correct: string; explanation: string }[]>(CLOZE_QUESTIONS);
  const [audioChallenges, setAudioChallenges] = useState<{ id: string | number; audioText: string; options: { text: string; vi: string; isCorrect: boolean }[] }[]>(AUDIO_CHALLENGES);
  const [guessWords, setGuessWords] = useState<{ word: string; hint: string }[]>(FIVE_LETTER_WORDS);
  const [isLoadingGameData, setIsLoadingGameData] = useState<boolean>(true);
  const [dataLoadedCount, setDataLoadedCount] = useState<number>(0);

  // 1. Game: Word Match
  const [selectedEn, setSelectedEn] = useState<string | null>(null);
  const [selectedVi, setSelectedVi] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<(number | string)[]>([]);

  // 2. Game: Scramble
  const [scrambleIdx, setScrambleIdx] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [scrambleStatus, setScrambleStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // 3. Game: Fast Typing
  const [typingIdx, setTypingIdx] = useState(0);
  const [typingInput, setTypingInput] = useState('');
  const [typingFeedback, setTypingFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // 4. Game: Word Fill
  const [clozeIdx, setClozeIdx] = useState(0);
  const [selectedClozeOpt, setSelectedClozeOpt] = useState<string | null>(null);
  const [clozeFeedback, setClozeFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // 5. Game: Listening Challenge
  const [audioIdx, setAudioIdx] = useState(0);
  const [selectedAudioOpt, setSelectedAudioOpt] = useState<string | null>(null);
  const [audioFeedback, setAudioFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // 6. Game: Word Guess (5-letter)
  const [guessIdx, setGuessIdx] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guessAttempts, setGuessAttempts] = useState<string[]>([]);
  const [guessStatus, setGuessStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  // Load dynamic game pools & sentences from Live API (DB) with graceful fallback
  useEffect(() => {
    let isMounted = true;
    async function loadGamesContent() {
      setIsLoadingGameData(true);
      try {
        const [gamePoolsRes, dictationRes, vocabQuestionsRes] = await Promise.allSettled([
          api.getGamePools({ limit: 100, random: true }),
          api.getDictationSentences({ limit: 25, random: true }),
          api.getDailyVocabQuestions({ limit: 20, random: true }),
        ]);

        if (!isMounted) return;

        let totalItemsLoaded = 0;

        // 1. Process Game Pools for Game 1 (word-match), Game 3 (fast-typing), Game 5 (listening), Game 6 (word-guess)
        if (gamePoolsRes.status === 'fulfilled' && gamePoolsRes.value?.items?.length > 0) {
          const poolItems = gamePoolsRes.value.items;
          totalItemsLoaded += poolItems.length;

          // Game 1: Word Match (8 pairs)
          const validMatch = poolItems
            .filter((it: any) => it.targetText && it.translation)
            .slice(0, 8)
            .map((it: any, idx: number) => ({
              id: it.id || idx + 1,
              en: it.targetText.trim(),
              vi: it.translation.trim(),
            }));
          if (validMatch.length >= 4) {
            setMatchPairs(validMatch);
            setShuffledViList([...validMatch].map((p) => ({ id: p.id, vi: p.vi })).sort(() => Math.random() - 0.5));
          }

          // Game 3: Fast Typing (10 words with IPA and meaning)
          const validTyping = poolItems
            .filter((it: any) => it.targetText && it.translation)
            .slice(8, 18)
            .map((it: any, idx: number) => ({
              id: it.id || idx + 1,
              word: it.targetText.trim().toUpperCase(),
              phonetic: it.phonetic || '/.../',
              vi: it.translation.trim(),
            }));
          if (validTyping.length >= 4) {
            setTypingWords(validTyping);
          }

          // Game 5: Listening Challenge (8 items with 4 options each)
          const validAudio = poolItems.slice(18, 28).map((target: any, idx: number) => {
            const distractors = poolItems.filter((it: any) => it.id !== target.id).slice(0, 3);
            const rawOpts = [
              { text: target.targetText.trim(), vi: target.translation.trim(), isCorrect: true },
              ...distractors.map((d: any) => ({
                text: d.targetText.trim(),
                vi: d.translation.trim(),
                isCorrect: false,
              })),
            ];
            return {
              id: target.id || idx + 1,
              audioText: target.targetText.trim(),
              options: rawOpts.sort(() => Math.random() - 0.5),
            };
          });
          if (validAudio.length >= 4) {
            setAudioChallenges(validAudio);
          }

          // Game 6: Word Guess (5-letter words from game-pools)
          const validFiveLetter = poolItems
            .filter(
              (it: any) =>
                it.targetText &&
                it.targetText.trim().length === 5 &&
                /^[a-zA-Z]+$/.test(it.targetText.trim())
            )
            .slice(0, 15)
            .map((it: any) => ({
              word: it.targetText.trim().toUpperCase(),
              hint: `${it.translation.trim()}${it.exampleSentence ? ` — "${it.exampleSentence.trim()}"` : ''}`,
            }));
          if (validFiveLetter.length >= 4) {
            setGuessWords(validFiveLetter);
          }
        }

        // 2. Process Dictation for Game 2 (scramble)
        if (dictationRes.status === 'fulfilled' && dictationRes.value?.items?.length > 0) {
          const dictItems = dictationRes.value.items;
          totalItemsLoaded += dictItems.length;

          const validScramble = dictItems
            .map((it: any, idx: number) => {
              const rawEn = (it.textEn || '').trim();
              const rawVi = (it.textVi || '').trim();
              const words = rawEn
                .replace(/[.,!?;:"]/g, '')
                .split(/\s+/)
                .filter((w: string) => w.length > 0);
              return {
                id: it.id || idx + 1,
                words,
                translation: rawVi,
              };
            })
            .filter((it: any) => it.words.length >= 4 && it.words.length <= 12)
            .slice(0, 12);

          if (validScramble.length >= 3) {
            setScrambleSentences(validScramble);
            setupScrambleQuestion(0, validScramble);
          }
        }

        // 3. Process Vocab Questions for Game 4 (word-fill)
        if (vocabQuestionsRes.status === 'fulfilled' && vocabQuestionsRes.value?.items?.length > 0) {
          const vqItems = vocabQuestionsRes.value.items;
          totalItemsLoaded += vqItems.length;

          const validCloze = vqItems
            .filter((it: any) => it.question && Array.isArray(it.options) && it.options.length >= 2 && it.correctAnswer)
            .slice(0, 12)
            .map((it: any, idx: number) => ({
              id: it.id || idx + 1,
              sentence: it.question,
              options: it.options,
              correct: it.correctAnswer,
              explanation: it.explanation || `Đáp án chính xác là "${it.correctAnswer}".`,
            }));

          if (validCloze.length >= 3) {
            setClozeQuestions(validCloze);
          }
        }

        setDataLoadedCount(totalItemsLoaded);
      } catch (err) {
        console.warn('Game pools API fetch warning, keeping fallbacks:', err);
      } finally {
        if (isMounted) setIsLoadingGameData(false);
      }
    }

    loadGamesContent();

    return () => {
      isMounted = false;
    };
  }, []);

  // URL query handling
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      const game = params.get('game');
      if (game && GAME_TICKETS.some((t) => t.id === game)) {
        setCurrentGameId(game);
        setActiveTab('play');
        handleStartGame(game);
      } else if (tab === 'play' || tab === 'leaderboard') {
        setActiveTab(tab as any);
        if (tab === 'play') handleStartGame(currentGameId);
      }
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval: any;
    if (gameActive && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setGameActive(false);
    }
    return () => clearInterval(interval);
  }, [gameActive, timer]);

  const handlePlayTicket = (ticketId: string) => {
    if (tearingTicketId) return;
    setTearingTicketId(ticketId);
    setTimeout(() => {
      setCurrentGameId(ticketId);
      setActiveTab('play');
      handleStartGame(ticketId);
      setTearingTicketId(null);
    }, 250);
  };

  const handleStartGame = (gameId = currentGameId) => {
    setScore(0);
    setTimer(60);
    setGameActive(true);

    if (gameId === 'word-match') {
      setMatchedIds([]);
      setSelectedEn(null);
      setSelectedVi(null);
      setShuffledViList([...matchPairs].map((p) => ({ id: p.id, vi: p.vi })).sort(() => Math.random() - 0.5));
    } else if (gameId === 'scramble') {
      setScrambleIdx(0);
      setupScrambleQuestion(0);
    } else if (gameId === 'fast-typing') {
      setTypingIdx(0);
      setTypingInput('');
      setTypingFeedback('idle');
    } else if (gameId === 'word-fill') {
      setClozeIdx(0);
      setSelectedClozeOpt(null);
      setClozeFeedback('idle');
    } else if (gameId === 'listening-challenge') {
      setAudioIdx(0);
      setSelectedAudioOpt(null);
      setAudioFeedback('idle');
    } else if (gameId === 'word-guess') {
      setGuessIdx(0);
      setCurrentGuess('');
      setGuessAttempts([]);
      setGuessStatus('playing');
    }
  };

  // Scramble helpers
  const setupScrambleQuestion = (
    idx: number,
    customList?: { id: string | number; words: string[]; translation: string }[]
  ) => {
    const list = customList || scrambleSentences;
    if (!list || list.length === 0) return;
    const q = list[idx % list.length];
    const shuffled = [...q.words].sort(() => Math.random() - 0.5);
    setAvailableWords(shuffled);
    setSelectedWords([]);
    setScrambleStatus('idle');
  };

  const handlePickWord = (word: string, index: number) => {
    if (scrambleStatus === 'correct') return;
    setSelectedWords((prev) => [...prev, word]);
    setAvailableWords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (scrambleStatus === 'correct') return;
    setSelectedWords((prev) => prev.filter((_, i) => i !== index));
    setAvailableWords((prev) => [...prev, word]);
  };

  const handleCheckScramble = () => {
    const q = scrambleSentences[scrambleIdx % scrambleSentences.length];
    if (selectedWords.join(' ') === q.words.join(' ')) {
      setScrambleStatus('correct');
      setScore((s) => s + 30);
    } else {
      setScrambleStatus('wrong');
    }
  };

  const handleNextScramble = () => {
    const nextIdx = (scrambleIdx + 1) % scrambleSentences.length;
    setScrambleIdx(nextIdx);
    setupScrambleQuestion(nextIdx);
  };

  // Word match helpers
  const handleEnClick = (enWord: string) => {
    setSelectedEn(enWord);
    if (selectedVi) checkMatch(enWord, selectedVi);
  };

  const handleViClick = (viWord: string) => {
    setSelectedVi(viWord);
    if (selectedEn) checkMatch(selectedEn, viWord);
  };

  const checkMatch = (en: string, vi: string) => {
    const pair = matchPairs.find((p) => p.en === en && p.vi === vi);
    if (pair) {
      setMatchedIds((prev) => [...prev, pair.id]);
      setScore((s) => s + 25);
    }
    setSelectedEn(null);
    setSelectedVi(null);
  };

  // Typing helpers
  const handleTypingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cur = typingWords[typingIdx % typingWords.length];
    if (typingInput.trim().toUpperCase() === cur.word) {
      setTypingFeedback('correct');
      setScore((s) => s + 40);
      setTimeout(() => {
        const next = (typingIdx + 1) % typingWords.length;
        setTypingIdx(next);
        setTypingInput('');
        setTypingFeedback('idle');
      }, 700);
    } else {
      setTypingFeedback('wrong');
    }
  };

  // Cloze helpers
  const handleSelectCloze = (opt: string) => {
    if (clozeFeedback === 'correct') return;
    setSelectedClozeOpt(opt);
    const cur = clozeQuestions[clozeIdx % clozeQuestions.length];
    if (opt === cur.correct) {
      setClozeFeedback('correct');
      setScore((s) => s + 20);
    } else {
      setClozeFeedback('wrong');
    }
  };

  const handleNextCloze = () => {
    const next = (clozeIdx + 1) % clozeQuestions.length;
    setClozeIdx(next);
    setSelectedClozeOpt(null);
    setClozeFeedback('idle');
  };

  // Audio helpers
  const playSpeech = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  const handleSelectAudioOpt = (text: string, isCorrect: boolean) => {
    if (audioFeedback === 'correct') return;
    setSelectedAudioOpt(text);
    if (isCorrect) {
      setAudioFeedback('correct');
      setScore((s) => s + 35);
    } else {
      setAudioFeedback('wrong');
    }
  };

  const handleNextAudio = () => {
    const next = (audioIdx + 1) % audioChallenges.length;
    setAudioIdx(next);
    setSelectedAudioOpt(null);
    setAudioFeedback('idle');
  };

  // Word Guess helpers
  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentGuess.trim().length !== 5) return;
    const cur = guessWords[guessIdx % guessWords.length];
    const upperGuess = currentGuess.trim().toUpperCase();
    const newAttempts = [...guessAttempts, upperGuess];
    setGuessAttempts(newAttempts);
    setCurrentGuess('');

    if (upperGuess === cur.word) {
      setGuessStatus('won');
      setScore((s) => s + 50);
    } else if (newAttempts.length >= 6) {
      setGuessStatus('lost');
    }
  };

  const currentTicket = GAME_TICKETS.find((t) => t.id === currentGameId) || GAME_TICKETS[0];

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
            <LingLing reaction="laughTease" size={120} />
          </div>
        </div>

        {/* Tab chuyển đổi chế độ */}
        <div className="pt-6 mt-6 border-t-2 border-ink/15 w-full overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2.5 min-w-max">
            <button
              type="button"
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
              type="button"
              onClick={() => {
                setActiveTab('play');
                if (!gameActive) handleStartGame(currentGameId);
              }}
              className={`px-4 py-2.5 rounded-xl border-2 border-ink text-xs font-black transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeTab === 'play'
                  ? 'bg-ink text-paper shadow-brutal-sm'
                  : 'bg-card text-ink hover:bg-paper-2'
              }`}
            >
              Đang chơi: {currentTicket.title}
            </button>
            <button
              type="button"
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
              const isTearing = tearingTicketId === ticket.id;

              return (
                <div
                  key={ticket.id}
                  data-testid={`ticket-${ticket.id}`}
                  onClick={() => handlePlayTicket(ticket.id)}
                  className={`ticket-card p-6 flex flex-col justify-between space-y-4 bg-card cursor-pointer select-none relative overflow-visible ${
                    isTearing ? 'animate-ticket-tear pointer-events-none' : ''
                  }`}
                >
                  {/* Hai rãnh răng cưa bấm vé bên cạnh mép giấy */}
                  <div className="ticket-notch-l" />
                  <div className="ticket-notch-r" />

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

                  {/* Đường răng cưa xé vé */}
                  <div className="border-t-2 border-dashed border-ink/25 my-1" />

                  {/* Nút Đỏ "Xé vé chơi ngay" */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayTicket(ticket.id);
                      }}
                      className="w-full btn btn-red text-xs font-black shadow-brutal flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{isTearing ? 'Đang xé vé...' : 'Xé vé chơi ngay'}</span>
                      <ArrowRight className="w-3.5 h-3.5 pointer-events-none" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CHẾ ĐỘ 2: ĐẤU TRƯỜNG TRÒ CHƠI ĐANG CHỌN */}
      {activeTab === 'play' && (
        <div className="card-paper p-6 sm:p-10 space-y-6 bg-card shadow-brutal-xl">
          {/* Header Bảng Đấu Game */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-ink/20 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-red block font-mono">
                  ĐANG CHƠI: {currentTicket.title.toUpperCase()}
                </span>
                <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded border ${currentTicket.accentColor}`}>
                  {currentTicket.badge}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal/15 text-teal border border-teal/30">
                  <Database className="w-3 h-3" />
                  {isLoadingGameData ? 'Đang nạp từ DB...' : `Live DB: ${dataLoadedCount} items`}
                </span>
              </div>
              <h2 className="text-2xl font-black text-ink font-sans">
                {currentTicket.englishTitle}
              </h2>
              <p className="text-xs text-ink-soft">
                {currentTicket.desc}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-sm font-black text-red bg-paper-2 border-2 border-ink rounded-xl px-3 py-1.5 shadow-brutal-sm">
                Thời gian: {timer}s
              </span>
              <span className="font-mono text-sm font-black text-ink bg-amber border-2 border-ink rounded-xl px-3 py-1.5 shadow-brutal-sm">
                Điểm: {score} XP
              </span>
              <button
                type="button"
                onClick={() => handleStartGame(currentGameId)}
                className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Chơi lại</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('hub')}
                className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer text-ink-muted hover:text-ink"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Đổi game</span>
              </button>
            </div>
          </div>

          {/* GAME 1: WORD MATCH (NỐI TỪ SIÊU TỐC) */}
          {currentGameId === 'word-match' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-xs sm:text-sm text-ink-soft font-sans">
                  Hướng dẫn: Nhấp chọn một từ tiếng Anh ở cột trái, sau đó chọn nghĩa tiếng Việt tương ứng ở cột phải để hoàn thành cặp từ.
                </p>
                <span className="text-xs font-mono font-bold text-teal bg-teal/10 px-2 py-0.5 rounded border border-teal/20">
                  {matchedIds.length} / {matchPairs.length} cặp đã ghép
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-ink-muted block">
                    Từ Tiếng Anh:
                  </span>
                  {matchPairs.map((p) => {
                    const isMatched = matchedIds.includes(p.id);
                    const isSelected = selectedEn === p.en;
                    return (
                      <button
                        key={p.en}
                        type="button"
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

                <div className="space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-ink-muted block">
                    Nghĩa Tiếng Việt:
                  </span>
                  {shuffledViList.map((p) => {
                    const isMatched = matchedIds.includes(p.id);
                    const isSelected = selectedVi === p.vi;
                    return (
                      <button
                        key={`${p.id}-${p.vi}`}
                        type="button"
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

              {matchedIds.length === matchPairs.length && (
                <div className="p-6 bg-paper-2 border-2 border-ink rounded-2xl text-center space-y-3 animate-in fade-in duration-200 flex flex-col items-center">
                  <LingLing reaction="trophy" size={90} animate={true} />
                  <span className="text-xl font-black text-ink block font-sans">
                    Tuyệt vời! Bạn đã ghép đúng toàn bộ các cặp từ! (+100 XP)
                  </span>
                  <div className="flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleStartGame('word-match')}
                      className="btn btn-red text-xs font-black shadow-brutal"
                    >
                      Chơi ván tiếp theo
                    </button>
                    <button
                      type="button"
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

          {/* GAME 2: SCRAMBLE (XẾP CÂU TRẬT TỰ) */}
          {currentGameId === 'scramble' && (
            <div className="space-y-6">
              <div className="p-4 bg-paper-2 border-2 border-ink rounded-2xl space-y-1">
                <span className="text-xs font-black uppercase text-amber tracking-wider block">
                  Câu hỏi #{scrambleIdx + 1} / {scrambleSentences.length}
                </span>
                <p className="text-base font-bold text-ink font-serif italic">
                  &ldquo;{scrambleSentences[scrambleIdx % scrambleSentences.length]?.translation}&rdquo;
                </p>
              </div>

              {/* Khay câu đã ghép */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-ink-muted block">
                  Câu văn của bạn (nhấp vào từ để gỡ bỏ):
                </span>
                <div className="min-h-[64px] p-4 bg-paper border-2 border-dashed border-ink rounded-2xl flex flex-wrap gap-2 items-center">
                  {selectedWords.length === 0 ? (
                    <span className="text-xs font-mono text-ink-muted">
                      Nhấp chọn các từ bên dưới theo đúng thứ tự ngữ pháp...
                    </span>
                  ) : (
                    selectedWords.map((word, idx) => (
                      <button
                        key={`${word}-${idx}`}
                        type="button"
                        onClick={() => handleRemoveWord(word, idx)}
                        className="px-3 py-1.5 rounded-xl border-2 border-ink bg-amber text-ink font-bold text-sm shadow-brutal-sm hover:bg-red hover:text-white transition-all cursor-pointer"
                      >
                        {word} ✕
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Ngân hàng từ còn lại */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-ink-muted block">
                  Các khối từ vựng khả dụng:
                </span>
                <div className="flex flex-wrap gap-2.5 p-4 bg-card border-2 border-ink rounded-2xl min-h-[56px]">
                  {availableWords.map((word, idx) => (
                    <button
                      key={`${word}-${idx}`}
                      type="button"
                      onClick={() => handlePickWord(word, idx)}
                      className="px-3.5 py-1.5 rounded-xl border-2 border-ink bg-paper hover:bg-amber text-ink font-black text-sm shadow-brutal-sm transition-all cursor-pointer"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={selectedWords.length === 0 || scrambleStatus === 'correct'}
                  onClick={handleCheckScramble}
                  className="btn btn-red text-xs font-black shadow-brutal"
                >
                  Kiểm tra câu
                </button>
                <button
                  type="button"
                  onClick={() => setupScrambleQuestion(scrambleIdx)}
                  className="btn btn-paper text-xs font-black shadow-brutal"
                >
                  Xếp lại từ đầu
                </button>
              </div>

              {/* Phản hồi kết quả */}
              {scrambleStatus === 'correct' && (
                <div className="p-4 bg-teal/15 border-2 border-teal rounded-2xl text-teal font-black text-sm flex items-center justify-between">
                  <span>🎉 Xuất sắc! Bạn đã sắp xếp đúng câu văn! (+30 XP)</span>
                  <button
                    type="button"
                    onClick={handleNextScramble}
                    className="btn btn-red text-xs font-black shadow-brutal"
                  >
                    Câu tiếp theo →
                  </button>
                </div>
              )}
              {scrambleStatus === 'wrong' && (
                <div className="p-4 bg-red/15 border-2 border-red rounded-2xl text-red font-black text-sm">
                  ⚠️ Trật tự câu chưa chính xác. Hãy nhấp gỡ từ và thử lại nhé!
                </div>
              )}
            </div>
          )}

          {/* GAME 3: FAST TYPING (GÕ PHÍM THẦN TỐC) */}
          {currentGameId === 'fast-typing' && (
            <div className="space-y-6">
              <div className="p-6 bg-paper-2 border-2 border-ink rounded-2xl space-y-2 text-center">
                <span className="text-xs font-mono font-black text-red uppercase tracking-wider block">
                  TỪ VỰNG #{typingIdx + 1} / {typingWords.length}
                </span>
                <h3 className="text-3xl font-black text-ink font-serif tracking-wide">
                  {typingWords[typingIdx % typingWords.length]?.word}
                </h3>
                <span className="text-sm font-mono text-red block">
                  {typingWords[typingIdx % typingWords.length]?.phonetic}
                </span>
                <p className="text-xs font-bold text-ink-soft">
                  Ý nghĩa: {typingWords[typingIdx % typingWords.length]?.vi}
                </p>
              </div>

              <form onSubmit={handleTypingSubmit} className="space-y-4 max-w-lg mx-auto">
                <div className="space-y-1 text-center">
                  <label htmlFor="typing-input" className="text-xs font-black uppercase text-ink-muted">
                    Gõ chính xác từ trên vào ô bên dưới và nhấn Enter:
                  </label>
                  <input
                    id="typing-input"
                    type="text"
                    value={typingInput}
                    onChange={(e) => setTypingInput(e.target.value)}
                    placeholder="Gõ từ vào đây..."
                    autoFocus
                    className="w-full text-center text-xl font-mono font-black uppercase tracking-widest p-4 bg-card border-2 border-ink rounded-2xl shadow-brutal focus:outline-none focus:ring-2 focus:ring-red"
                  />
                </div>

                <div className="flex justify-center gap-3">
                  <button type="submit" className="btn btn-red text-sm font-black shadow-brutal">
                    Xác nhận gõ đúng
                  </button>
                  <button
                    type="button"
                    onClick={() => playSpeech(typingWords[typingIdx % typingWords.length]?.word || '')}
                    className="btn btn-paper text-sm font-black shadow-brutal flex items-center gap-1.5"
                  >
                    <Volume2 className="w-4 h-4 text-teal" /> Nghe phát âm
                  </button>
                </div>

                {typingFeedback === 'correct' && (
                  <div className="p-3 bg-teal/15 border-2 border-teal rounded-xl text-teal font-black text-center text-sm">
                    ✓ Chính xác! Phản xạ gõ tuyệt vời! (+40 XP)
                  </div>
                )}
                {typingFeedback === 'wrong' && (
                  <div className="p-3 bg-red/15 border-2 border-red rounded-xl text-red font-black text-center text-sm">
                    ✗ Chưa đúng chính tả, hãy đối chiếu kỹ từng ký tự và gõ lại!
                  </div>
                )}
              </form>
            </div>
          )}

          {/* GAME 4: WORD FILL (ĐIỀN KHUYẾT NGỮ CẢNH) */}
          {currentGameId === 'word-fill' && (
            <div className="space-y-6">
              <div className="p-6 bg-paper-2 border-2 border-ink rounded-2xl space-y-3">
                <span className="text-xs font-black uppercase text-amber tracking-wider block">
                  Thử thách Điền Khuyết #{clozeIdx + 1} / {clozeQuestions.length}
                </span>
                <p className="text-lg font-serif font-black text-ink leading-relaxed">
                  {clozeQuestions[clozeIdx % clozeQuestions.length]?.sentence}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {clozeQuestions[clozeIdx % clozeQuestions.length]?.options.map((opt) => {
                  const isSelected = selectedClozeOpt === opt;
                  const isCorrect = opt === clozeQuestions[clozeIdx % clozeQuestions.length]?.correct;
                  let btnColor = 'bg-paper hover:bg-paper-2 text-ink';
                  if (clozeFeedback !== 'idle' && isSelected) {
                    btnColor = isCorrect ? 'bg-teal text-white border-teal' : 'bg-red text-white border-red';
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectCloze(opt)}
                      className={`p-4 rounded-xl border-2 border-ink font-mono font-black text-base shadow-brutal-sm text-left transition-all cursor-pointer ${btnColor}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {clozeFeedback !== 'idle' && (
                <div className="p-4 bg-paper border-2 border-ink rounded-2xl space-y-2">
                  <p className="text-xs font-bold text-ink">
                    <strong>Giải thích:</strong> {clozeQuestions[clozeIdx % clozeQuestions.length]?.explanation}
                  </p>
                  <button
                    type="button"
                    onClick={handleNextCloze}
                    className="btn btn-red text-xs font-black shadow-brutal"
                  >
                    Câu tiếp theo →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* GAME 5: LISTENING CHALLENGE (ĐỐ VUI NGHE ÂM) */}
          {currentGameId === 'listening-challenge' && (
            <div className="space-y-6 text-center">
              <div className="p-8 bg-paper-2 border-2 border-ink rounded-2xl space-y-4 max-w-lg mx-auto">
                <span className="text-xs font-black uppercase text-teal tracking-wider block">
                  Câu hỏi #{audioIdx + 1} / {audioChallenges.length}
                </span>
                <button
                  type="button"
                  onClick={() => playSpeech(audioChallenges[audioIdx % audioChallenges.length]?.audioText || '')}
                  className="btn btn-red text-base font-black px-6 py-3 shadow-brutal-md inline-flex items-center gap-2 cursor-pointer"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Bấm để nghe phát âm</span>
                </button>
                <p className="text-xs text-ink-muted">
                  Nghe kỹ phát âm bản xứ và chọn cặp từ vựng chính xác bên dưới.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {audioChallenges[audioIdx % audioChallenges.length]?.options.map((opt) => {
                  const isSelected = selectedAudioOpt === opt.text;
                  let color = 'bg-card text-ink hover:bg-paper-2';
                  if (audioFeedback !== 'idle' && isSelected) {
                    color = opt.isCorrect ? 'bg-teal text-white border-teal' : 'bg-red text-white border-red';
                  }

                  return (
                    <button
                      key={opt.text}
                      type="button"
                      onClick={() => handleSelectAudioOpt(opt.text, opt.isCorrect)}
                      className={`p-4 rounded-xl border-2 border-ink shadow-brutal-sm transition-all cursor-pointer space-y-1 ${color}`}
                    >
                      <div className="font-serif font-black text-base">{opt.text}</div>
                      <div className="text-xs font-medium opacity-90">→ {opt.vi}</div>
                    </button>
                  );
                })}
              </div>

              {audioFeedback !== 'idle' && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleNextAudio}
                    className="btn btn-red text-xs font-black shadow-brutal"
                  >
                    Thử thách tiếp theo →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* GAME 6: WORD GUESS (ĐOÁN TỪ 5 CHỮ CÁI) */}
          {currentGameId === 'word-guess' && (
            <div className="space-y-6 max-w-md mx-auto text-center">
              <div className="p-4 bg-paper-2 border-2 border-ink rounded-2xl space-y-1">
                <span className="text-xs font-mono font-black text-amber uppercase block">
                  CÂU ĐỐ #{guessIdx + 1} / {guessWords.length}
                </span>
                <p className="text-sm font-bold text-ink font-serif">
                  Gợi ý: {guessWords[guessIdx % guessWords.length]?.hint}
                </p>
              </div>

              {/* Bảng các lượt đoán */}
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, rowIdx) => {
                  const attempt = guessAttempts[rowIdx] || '';
                  const targetWord = guessWords[guessIdx % guessWords.length]?.word || '';

                  return (
                    <div key={rowIdx} className="flex justify-center gap-2">
                      {Array.from({ length: 5 }).map((__, colIdx) => {
                        const letter = attempt[colIdx] || '';
                        let tileBg = 'bg-card border-ink text-ink';
                        if (attempt) {
                          if (targetWord[colIdx] === letter) {
                            tileBg = 'bg-teal text-white border-teal';
                          } else if (targetWord.includes(letter)) {
                            tileBg = 'bg-amber text-ink border-ink';
                          } else {
                            tileBg = 'bg-ink/20 text-ink-muted border-ink/40';
                          }
                        }

                        return (
                          <div
                            key={colIdx}
                            className={`w-12 h-12 border-2 rounded-xl flex items-center justify-center text-xl font-mono font-black shadow-brutal-sm ${tileBg}`}
                          >
                            {letter}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Ô nhập dự đoán */}
              {guessStatus === 'playing' && (
                <form onSubmit={handleGuessSubmit} className="space-y-3">
                  <input
                    type="text"
                    maxLength={5}
                    value={currentGuess}
                    onChange={(e) => setCurrentGuess(e.target.value.toUpperCase())}
                    placeholder="Nhập 5 chữ cái..."
                    className="w-full text-center text-xl font-mono font-black uppercase tracking-widest p-3 bg-card border-2 border-ink rounded-xl shadow-brutal focus:outline-none focus:ring-2 focus:ring-amber"
                  />
                  <button type="submit" className="btn btn-red text-xs font-black shadow-brutal w-full">
                    Đoán từ này
                  </button>
                </form>
              )}

              {guessStatus === 'won' && (
                <div className="p-4 bg-teal/15 border-2 border-teal rounded-2xl text-teal font-black text-sm space-y-2">
                  <div>🎉 Xuất sắc! Bạn đã đoán đúng từ khóa 5 chữ cái! (+50 XP)</div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = (guessIdx + 1) % guessWords.length;
                      setGuessIdx(next);
                      setCurrentGuess('');
                      setGuessAttempts([]);
                      setGuessStatus('playing');
                    }}
                    className="btn btn-red text-xs font-black shadow-brutal"
                  >
                    Đố từ tiếp theo →
                  </button>
                </div>
              )}
              {guessStatus === 'lost' && (
                <div className="p-4 bg-red/15 border-2 border-red rounded-2xl text-red font-black text-sm space-y-2">
                  <div>
                    Hết lượt! Đáp án chính xác là: <strong>{guessWords[guessIdx % guessWords.length]?.word}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentGuess('');
                      setGuessAttempts([]);
                      setGuessStatus('playing');
                    }}
                    className="btn btn-paper text-xs font-black shadow-brutal"
                  >
                  </button>
                </div>
              )}
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
