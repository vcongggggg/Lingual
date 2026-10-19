'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Mic,
  ListOrdered,
  BookOpen,
  Volume2,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Award,
  Lightbulb,
  MessageSquare,
  Flame,
  Gem,
  Languages,
  Bug,
  FileEdit,
  Settings,
  Plus,
  Send,
  Save,
  Check,
  Trash2,
  Zap,
  Radio,
} from 'lucide-react';
import { Button, Card, Badge, XPBadge } from '@linguaflow/ui';
import { DictationVideo, VideoSegment } from '@/lib/listening/videoDictationData';
import { VideoPlayerMode } from './VideoModeSelectModal';
import LingLingMascot, { MascotState } from '@/components/LingLingMascot';
import { arcadeAudio } from '@/lib/arcadeAudio';
import { sfx } from '@/lib/soundEffects';

interface VideoDictationStudioProps {
  video: DictationVideo;
  initialMode?: VideoPlayerMode;
  onClose: () => void;
  locale?: string;
}

export const VideoDictationStudio: React.FC<VideoDictationStudioProps> = ({
  video,
  initialMode = 'dictation',
  onClose,
  locale = 'vi',
}) => {
  const isVi = locale === 'vi';
  const [mounted, setMounted] = useState(false);
  const [activeMode, setActiveMode] = useState<VideoPlayerMode>(initialMode);
  const [currentSegmentIdx, setCurrentSegmentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [videoSize, setVideoSize] = useState<'50' | '75' | '100'>('100');
  const [hintsLeft, setHintsLeft] = useState(10);

  // LinguaFlow Gamification: Streak Combo & Mascot Reaction
  const [streakCombo, setStreakCombo] = useState(0);
  const [mascotState, setMascotState] = useState<MascotState>('speaking');
  const [mascotSpeech, setMascotSpeech] = useState<string>('Luyện tai nào! Lắng nghe thật kỹ nhé 🎧');
  const [showGemReward, setShowGemReward] = useState(false);
  const [totalScoreXP, setTotalScoreXP] = useState(0);

  // Dictation Mode State
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [activeInputIdx, setActiveInputIdx] = useState(1);
  const [isDictationCorrect, setIsDictationCorrect] = useState(false);
  const [hasCheckedDictation, setHasCheckedDictation] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Scrambled Words State
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [selectedWordPills, setSelectedWordPills] = useState<string[]>([]);
  const [isOrderCorrect, setIsOrderCorrect] = useState(false);

  // Shadowing Mode State
  const [isRecording, setIsRecording] = useState(false);
  const [shadowingScore, setShadowingScore] = useState<number | null>(null);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [showTranslation, setShowTranslation] = useState(true);
  const [showIPA, setShowIPA] = useState(true);

  // Transcript Mode State
  const [transcriptLang, setTranscriptLang] = useState<'vi' | 'en'>('vi');

  // Modal 1: Report Bug State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('Nội dung sai');
  const [reportDesc, setReportDesc] = useState('');
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);

  // Modal 2: Notes Notebook State
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [notesList, setNotesList] = useState<{ id: string; title: string; content: string; segment: number }[]>([
    {
      id: '1',
      title: 'Lưu ý từ vựng',
      content: 'Cụm từ "struggling" phát âm /ˈstrʌɡ.lɪŋ/ nuốt âm g nhẹ khi nói nhanh.',
      segment: 1,
    },
  ]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  // Modal 3: Settings State
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [dictationDifficulty, setDictationDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [replayTimes, setReplayTimes] = useState('Không');
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [hintProperNouns, setHintProperNouns] = useState(true);
  const [soundFeedback, setSoundFeedback] = useState(true);
  const [soundVolume, setSoundVolume] = useState(70);
  const [voiceUS, setVoiceUS] = useState('Tự động chọn');
  const [voiceUK, setVoiceUK] = useState('Tự động chọn');

  const currentSegment: VideoSegment = video.segments[currentSegmentIdx] || video.segments[0];
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  // Clean raw words for comparison (remove punctuation)
  const cleanWord = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Initialize segment states
  useEffect(() => {
    if (!currentSegment) return;
    // Reveal the first word by default to give learners initial momentum!
    const cleanWordList = currentSegment.words.map((w, idx) => (idx === 0 ? w : ''));
    setTypedWords(cleanWordList);
    setActiveInputIdx(1);
    setIsDictationCorrect(false);
    setHasCheckedDictation(false);
    setIsOrderCorrect(false);
    setAiExplanation(null);

    // Scramble words for Word Order Mode
    const shuffled = [...currentSegment.words]
      .map((w) => ({ w, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((item) => item.w);
    setScrambledWords(shuffled);
    setSelectedWordPills([]);
    setShadowingScore(null);
    setSpokenTranscript('');
    setMascotState('thinking');
    setMascotSpeech(`Đoạn ${currentSegmentIdx + 1}: Tập trung bắt từng từ khoá nhé!`);

    setTimeout(() => {
      inputRefs.current[1]?.focus();
    }, 150);
  }, [currentSegmentIdx, video]);

  // YouTube Player controller
  const playerRef = useRef<any>(null);
  const timeCheckIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const initPlayer = () => {
        if ((window as any).YT && (window as any).YT.Player) {
          try {
            playerRef.current = new (window as any).YT.Player('youtube-dictation-player-container', {
              videoId: video.youtubeId,
              playerVars: {
                autoplay: 1,
                controls: 1,
                rel: 0,
                modestbranding: 1,
                start: Math.floor(currentSegment.start),
              },
              events: {
                onReady: (event: any) => {
                  event.target.seekTo(currentSegment.start, true);
                  event.target.playVideo();
                  setIsPlaying(true);
                },
                onStateChange: (event: any) => {
                  if (event.data === 1) {
                    setIsPlaying(true);
                  } else {
                    setIsPlaying(false);
                  }
                },
              },
            });
          } catch (e) {}
        } else {
          setTimeout(initPlayer, 200);
        }
      };

      const timer = setTimeout(initPlayer, 400);
      return () => {
        clearTimeout(timer);
        if (timeCheckIntervalRef.current) clearInterval(timeCheckIntervalRef.current);
        if (playerRef.current && typeof playerRef.current.destroy === 'function') {
          try {
            playerRef.current.destroy();
          } catch {}
        }
      };
    }
  }, [video.youtubeId]);

  // Auto-pause when segment ends
  useEffect(() => {
    if (timeCheckIntervalRef.current) clearInterval(timeCheckIntervalRef.current);

    timeCheckIntervalRef.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime >= currentSegment.end) {
          playerRef.current.pauseVideo();
          setIsPlaying(false);
        }
      }
    }, 100);

    return () => {
      if (timeCheckIntervalRef.current) clearInterval(timeCheckIntervalRef.current);
    };
  }, [currentSegment]);

  // Auto-seek video to new segment start when currentSegmentIdx changes
  useEffect(() => {
    if (!currentSegment) return;
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        playerRef.current.seekTo(currentSegment.start, true);
        playerRef.current.playVideo();
        setIsPlaying(true);
      } catch (e) {}
    }
  }, [currentSegmentIdx]);

  // Replay Segment from its start
  const handleReplaySegment = () => {
    arcadeAudio.playLaser();
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(currentSegment.start, true);
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const handleTogglePlayVideo = () => {
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        const cur = playerRef.current.getCurrentTime();
        if (cur >= currentSegment.end || cur < currentSegment.start) {
          playerRef.current.seekTo(currentSegment.start, true);
        }
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    }
  };

  // Handle typing in Dictation mode
  const handleWordChange = (idx: number, val: string) => {
    const newWords = [...typedWords];
    newWords[idx] = val;
    setTypedWords(newWords);

    const targetClean = cleanWord(currentSegment.words[idx]);
    const inputClean = cleanWord(val);

    if (inputClean === targetClean && idx < currentSegment.words.length - 1) {
      setActiveInputIdx(idx + 1);
      inputRefs.current[idx + 1]?.focus();
      arcadeAudio.playLaser();
    }
  };

  const handleRevealWord = (idx: number) => {
    const newWords = [...typedWords];
    newWords[idx] = currentSegment.words[idx];
    setTypedWords(newWords);
    arcadeAudio.playCoin();
    setMascotSpeech('Đã mở gợi ý từ giúp bạn nè! Cố lên nhé 💡');
  };

  const handleCheckDictation = () => {
    setHasCheckedDictation(true);
    const allMatch = typedWords.every((w, i) => cleanWord(w) === cleanWord(currentSegment.words[i]));
    if (allMatch) {
      setIsDictationCorrect(true);
      arcadeAudio.playVictoryFanfare();
      setTotalScoreXP((prev) => prev + 25);
      setStreakCombo((prev) => prev + 1);
      setMascotState('celebrating');
      setMascotSpeech('Tuyệt đỉnh! Bạn gõ chính xác 100% rồi 🎉');
      triggerGemReward();
    } else {
      arcadeAudio.playBuzzer();
      setStreakCombo(0);
      setMascotState('apologetic');
      setMascotSpeech('Có vài từ chưa khớp, nghe lại một lần nữa nhé! 🎧');
    }
  };

  // Word Ordering Logic
  const handleSelectScrambledWord = (word: string) => {
    arcadeAudio.playLaser();
    const newSelected = [...selectedWordPills, word];
    setSelectedWordPills(newSelected);

    if (newSelected.length === currentSegment.words.length) {
      const isMatch = newSelected.every((w, i) => cleanWord(w) === cleanWord(currentSegment.words[i]));
      if (isMatch) {
        setIsOrderCorrect(true);
        arcadeAudio.playVictoryFanfare();
        setTotalScoreXP((prev) => prev + 20);
        setStreakCombo((prev) => prev + 1);
        setMascotState('celebrating');
        setMascotSpeech('Xuất sắc! Xếp câu chuẩn xác hoàn hảo ✨');
        triggerGemReward();
      } else {
        arcadeAudio.playBuzzer();
        setStreakCombo(0);
        setMascotState('apologetic');
        setMascotSpeech('Thứ tự chưa đúng rồi, bấm "Làm lại" để thử lại nhé!');
      }
    }
  };

  const handleWordOrderHint = () => {
    if (hintsLeft <= 0 || isOrderCorrect) return;
    const currentSelectedCount = selectedWordPills.length;
    if (currentSelectedCount < currentSegment.words.length) {
      const nextCorrectWord = currentSegment.words[currentSelectedCount];
      handleSelectScrambledWord(nextCorrectWord);
      setHintsLeft((prev) => prev - 1);
      arcadeAudio.playCoin();
      setMascotSpeech(`LingLing đã gợi ý từ "${nextCorrectWord}" cho bạn rồi nè! 💡`);
    }
  };

  const triggerGemReward = () => {
    setShowGemReward(true);
    setTimeout(() => setShowGemReward(false), 3000);
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (idx < currentSegment.words.length - 1) {
        setActiveInputIdx(idx + 1);
        inputRefs.current[idx + 1]?.focus();
      }
    } else if (e.key === 'Backspace' && !typedWords[idx] && idx > 0) {
      e.preventDefault();
      setActiveInputIdx(idx - 1);
      inputRefs.current[idx - 1]?.focus();
    }
  };

  // Play Sample Audio via SpeechSynthesis
  const handlePlaySampleAudio = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // AI Explanation Generator
  const handleGenerateAiExplain = () => {
    setIsLoadingAi(true);
    setMascotState('thinking');
    setMascotSpeech('LingLing AI đang giải mã ngữ pháp câu này cho bạn...');
    setTimeout(() => {
      setAiExplanation(
        `💡 Phân tích từ LinguaFlow AI: Cấu trúc "${currentSegment.text}" thường được dùng trong giao tiếp đời thường để diễn đạt cảm xúc tự nhiên, lịch sự. Lưu ý cách nối âm và ngữ điệu tự nhiên của người bản xứ.`
      );
      setIsLoadingAi(false);
      arcadeAudio.playCoin();
      setMascotState('speaking');
      setMascotSpeech('Đã xong giải nghĩa AI! Bạn có thể lưu vào Sổ tay nhé 📝');
    }, 600);
  };

  // Shadowing Web Speech Recognition
  const handleStartShadowingRecord = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói Web Speech API.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      arcadeAudio.playLaser();
      setMascotState('speaking');
      setMascotSpeech('LingLing đang lắng nghe bạn phát âm...');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSpokenTranscript(transcript);

      const targetWords = currentSegment.text.toLowerCase().split(/\s+/);
      const spokenWords = transcript.toLowerCase().split(/\s+/);
      let matches = 0;
      targetWords.forEach((tw) => {
        if (spokenWords.some((sw: string) => sw.includes(cleanWord(tw)))) {
          matches++;
        }
      });
      const score = Math.min(100, Math.round((matches / targetWords.length) * 100));
      setShadowingScore(score);
      setIsRecording(false);

      if (score >= 70) {
        arcadeAudio.playCoin();
        setTotalScoreXP((prev) => prev + 30);
        setStreakCombo((prev) => prev + 1);
        setMascotState('celebrating');
        setMascotSpeech(`Ngữ điệu quá chuẩn! Bạn đạt ${score}% độ tương đồng 🌟`);
        triggerGemReward();
      } else {
        arcadeAudio.playBuzzer();
        setMascotState('thinking');
        setMascotSpeech(`Đạt ${score}%. Nghe lại mẫu và nhấn nhá đúng nhịp hơn nhé!`);
      }
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  // Next / Prev Segment
  const handleNextSegment = () => {
    if (currentSegmentIdx < video.segments.length - 1) {
      setCurrentSegmentIdx((prev) => prev + 1);
      arcadeAudio.playLaser();
    }
  };

  const handlePrevSegment = () => {
    if (currentSegmentIdx > 0) {
      setCurrentSegmentIdx((prev) => prev - 1);
      arcadeAudio.playLaser();
    }
  };

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen z-[999999] bg-slate-950 flex flex-col overflow-hidden text-slate-100 font-sans select-none">
      {/* Subtle Cyber Cosmic Background Ambient Aura */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Gem Reward Popup Toast */}
      <AnimatePresence>
        {showGemReward && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-5 right-5 z-[100000] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-xs shadow-2xl shadow-teal-500/30 flex items-center gap-2 border border-teal-200"
          >
            <Gem className="w-4 h-4 fill-slate-950" />
            <span>+1 Gem • +25 XP Chính xác!</span>
            {streakCombo > 1 && (
              <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded-lg text-[10px] font-mono font-extrabold flex items-center gap-0.5">
                <Flame className="w-3 h-3 fill-amber-400" />
                {streakCombo}x Combo
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TOP NAVIGATION HEADER (3-COLUMN BALANCED GRID) */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl px-4 sm:px-6 grid grid-cols-12 items-center shrink-0 z-20">
        {/* Left Column (4 cols): Close Button + Video Title & LinguaFlow XP Badge */}
        <div className="col-span-4 flex items-center gap-3 min-w-0 pr-2">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-850 transition-colors shrink-0"
            title="Đóng phòng luyện nghe"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-extrabold text-white truncate">
              {video.title}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] font-mono text-cyan-400 block truncate font-bold">
                {currentSegmentIdx + 1}/{video.segments.length} đoạn
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-extrabold">
                +{totalScoreXP} XP
              </span>
              {streakCombo > 1 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-extrabold flex items-center gap-0.5">
                  <Flame className="w-3 h-3 fill-amber-400" />
                  {streakCombo}x
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center Column (4 cols): Perfectly Centered 4 Mode Switcher Tabs (LinguaFlow Neon Cyber Style) */}
        <div className="col-span-4 flex items-center justify-center">
          <div className="hidden md:flex items-center gap-1 p-1 bg-slate-900/90 rounded-2xl border border-cyan-500/20 shadow-lg shadow-cyan-500/5 backdrop-blur-md">
            <button
              onClick={() => setActiveMode('dictation')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                activeMode === 'dictation'
                  ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Dictation</span>
            </button>

            <button
              onClick={() => setActiveMode('shadowing')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                activeMode === 'shadowing'
                  ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Shadowing</span>
            </button>

            <button
              onClick={() => setActiveMode('word_order')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                activeMode === 'word_order'
                  ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Xếp từ</span>
            </button>

            <button
              onClick={() => setActiveMode('transcript')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                activeMode === 'transcript'
                  ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Transcript</span>
            </button>
          </div>
        </div>

        {/* Right Column (4 cols): Utility Icons & Video Toggle */}
        <div className="col-span-4 flex items-center justify-end gap-2">
          <button
            onClick={() => setShowVideo(!showVideo)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 shadow-sm"
          >
            {showVideo ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
            <span className="hidden sm:inline">Video</span>
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors hidden sm:block"
            title="Báo cáo lỗi đoạn này"
          >
            <Bug className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsNotesModalOpen(true)}
            className="p-2 rounded-xl text-slate-500 hover:text-cyan-400 hover:bg-slate-900 transition-colors hidden sm:block"
            title="Ghi chú bài học"
          >
            <FileEdit className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-2 rounded-xl text-slate-500 hover:text-purple-400 hover:bg-slate-900 transition-colors hidden sm:block"
            title="Cài đặt phát lại"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. MAIN 2-COLUMN STAGE (SMOOTH 500ms CUBIC-BEZIER RESIZING) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full">
        {/* LEFT COLUMN: YOUTUBE PLAYER (SMOOTH FLUID TRANSITION) */}
        <div
          style={{
            flex: typeof window !== 'undefined' && window.innerWidth >= 1024
              ? videoSize === '50' ? '0 0 35%' : videoSize === '75' ? '0 0 48%' : '0 0 58%'
              : '1 1 100%',
            width: typeof window !== 'undefined' && window.innerWidth >= 1024
              ? videoSize === '50' ? '35%' : videoSize === '75' ? '48%' : '58%'
              : '100%',
            transition: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="p-4 sm:p-6 flex flex-col justify-between overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-slate-950/60 relative shrink-0"
        >
          <div className="space-y-3 relative">
            {/* Top Toolbar: Video Toggle & Layout Size Switcher (50%, 75%, 100%) */}
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={() => setShowVideo(!showVideo)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 shadow-sm"
              >
                {showVideo ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
                <span>Video</span>
              </button>

              <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] font-bold">
                {(['50', '75', '100'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setVideoSize(sz)}
                    className={`px-2.5 py-0.5 rounded-lg transition-all ${
                      videoSize === sz
                        ? 'bg-cyan-500/20 text-cyan-300 font-extrabold border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sz}%
                  </button>
                ))}
              </div>
            </div>

            {showVideo ? (
              <div
                style={{ transition: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)' }}
                className="relative group w-full"
              >
                {/* Diffused Pulsating Ambient Glow behind video */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-70 transition-opacity ${
                    isPlaying ? 'opacity-100 animate-pulse' : 'opacity-40'
                  } -z-10`}
                />

                <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-cyan-500/20 bg-black shadow-2xl">
                  <div id="youtube-dictation-player-container" className="w-full h-full" />
                </div>
              </div>
            ) : (
              <div className="w-full aspect-video rounded-3xl border border-dashed border-cyan-500/30 flex flex-col items-center justify-center text-center p-6 space-y-3 bg-slate-900/40 relative">
                <div className="p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 animate-pulse">
                  <Headphones className="w-12 h-12 text-cyan-400" />
                </div>
                <h4 className="font-extrabold text-white text-base">Chế độ Thử Thách Luyện Tai Siêu Cấp 🎧</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Hình ảnh đã được ẩn để rèn luyện phản xạ thính giác 100% theo phương pháp LinguaFlow.
                </p>
              </div>
            )}

            {/* Subtitle Caption Strip */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-center space-y-1 backdrop-blur-md">
              <p className="text-sm font-semibold text-slate-300">
                {currentSegment.vietnamese}
              </p>
            </div>
          </div>

          {/* LinguaFlow Reactive Mascot Bar in Bottom Left */}
          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/30 border border-cyan-500/20 flex items-center gap-3 shadow-lg">
            <LingLingMascot state={mascotState} size={48} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black uppercase text-cyan-400 tracking-wider">LingLing AI Companion</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <p className="text-xs text-slate-200 font-medium truncate mt-0.5">
                {mascotSpeech}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE MODE STUDIO (SMOOTH FLUID TRANSITION) */}
        <div
          style={{
            flex: typeof window !== 'undefined' && window.innerWidth >= 1024
              ? videoSize === '50' ? '0 0 65%' : videoSize === '75' ? '0 0 52%' : '0 0 42%'
              : '1 1 100%',
            width: typeof window !== 'undefined' && window.innerWidth >= 1024
              ? videoSize === '50' ? '65%' : videoSize === '75' ? '52%' : '42%'
              : '100%',
            transition: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="p-4 sm:p-6 flex flex-col justify-between overflow-y-auto bg-slate-900/30 space-y-5 min-w-0"
        >
          {/* Top Control Bar: LinguaFlow Cyber Deck with Glassmorphism & Audio Visualizer */}
          <div className="p-3.5 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 text-slate-100 flex items-center justify-between shadow-2xl border border-cyan-500/30 backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlayVideo}
                className="w-10 h-10 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 transition-all text-slate-950 font-black flex items-center justify-center shadow-lg shadow-cyan-500/25 active:scale-95"
                title={isPlaying ? 'Tạm dừng' : 'Phát đoạn này'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-slate-950" />
                ) : (
                  <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                )}
              </button>

              <button
                onClick={() => handlePlaySampleAudio(currentSegment.text)}
                className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 text-cyan-300 border border-cyan-500/20 transition-colors"
                title="Nghe mẫu giọng AI chuẩn"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              {/* Dynamic Animated Audio Spectrum Bars */}
              {isPlaying && (
                <div className="hidden sm:flex items-center gap-1 px-2">
                  <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce" />
                  <span className="w-1 h-5 bg-teal-400 rounded-full animate-pulse" />
                  <span className="w-1 h-2.5 bg-purple-400 rounded-full animate-bounce" />
                </div>
              )}
            </div>

            {/* Center Segment Navigation & Quick Jump Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-950/70 px-2 py-1 rounded-2xl border border-slate-800">
              <button
                onClick={handlePrevSegment}
                disabled={currentSegmentIdx === 0}
                className="p-1.5 rounded-xl hover:bg-slate-800 disabled:opacity-30 text-slate-300 transition-colors"
                title="Đoạn trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <select
                value={currentSegmentIdx}
                onChange={(e) => {
                  const newIdx = Number(e.target.value);
                  setCurrentSegmentIdx(newIdx);
                }}
                className="bg-transparent text-cyan-300 font-extrabold text-xs font-mono px-1 py-0.5 cursor-pointer focus:outline-none border-0"
                title="Chọn nhảy nhanh đến đoạn"
              >
                {video.segments.map((_, idx) => (
                  <option key={idx} value={idx} className="bg-slate-900 text-white font-bold">
                    {idx + 1} / {video.segments.length}
                  </option>
                ))}
              </select>

              <button
                onClick={handleNextSegment}
                disabled={currentSegmentIdx === video.segments.length - 1}
                className="p-1.5 rounded-xl hover:bg-slate-800 disabled:opacity-30 text-slate-300 transition-colors"
                title="Đoạn kế tiếp"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleReplaySegment}
              className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-750 transition-colors"
              title="Phát lại từ đầu đoạn này"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* ========================================================================= */}
          {/* MODE 1: DICTATION (GÕ NHỮNG GÌ BẠN NGHE) */}
          {/* ========================================================================= */}
          {activeMode === 'dictation' && (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5" />
                    <span>GÕ NHỮNG GÌ BẠN NGHE ĐƯỢC</span>
                  </span>
                  <span className="text-[11px] text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
                    • Chuẩn LinguaFlow
                  </span>
                </div>

                {/* Underlined Word Input Slots with Eye Reveal */}
                <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-inner flex flex-wrap items-center gap-3 min-h-[120px]">
                  {currentSegment.words.map((targetWord, idx) => {
                    const isMatched = cleanWord(typedWords[idx] || '') === cleanWord(targetWord);
                    return (
                      <div key={idx} className="relative inline-flex flex-col items-center gap-1">
                        {/* Eye reveal icon button */}
                        <button
                          type="button"
                          onClick={() => handleRevealWord(idx)}
                          className={`p-1 rounded-md transition-colors ${
                            isMatched ? 'text-cyan-400 opacity-50' : 'text-slate-500 hover:text-amber-400 hover:bg-slate-900'
                          }`}
                          title="Bấm để xem gợi ý từ này"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <input
                          ref={(el) => {
                            inputRefs.current[idx] = el;
                          }}
                          type="text"
                          value={typedWords[idx] || ''}
                          onChange={(e) => handleWordChange(idx, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(idx, e)}
                          placeholder="______"
                          className={`w-20 sm:w-24 text-center text-sm font-extrabold py-2 rounded-2xl border transition-all focus:outline-none ${
                            isMatched
                              ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-black ring-1 ring-cyan-400 shadow-sm shadow-cyan-500/20'
                              : hasCheckedDictation && !isMatched
                              ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                              : activeInputIdx === idx
                              ? 'bg-slate-900 border-teal-400 text-white ring-2 ring-teal-500/30'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300'
                          }`}
                        />
                        {isMatched && (
                          <span className="text-[9px] font-mono text-cyan-400 mt-0.5 font-extrabold">✓ {targetWord}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <p className="text-[11px] text-slate-500 text-center">
                  Space để sang từ tiếp theo · Backspace ở ô trống để quay lại
                </p>

                {/* ACTION BUTTONS (Bỏ qua / Kiểm tra or Làm lại / Tiếp theo) */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  {!hasCheckedDictation ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setTypedWords([...currentSegment.words]);
                          setHasCheckedDictation(true);
                          setIsDictationCorrect(true);
                          setMascotSpeech('Đã mở đáp án câu này giúp bạn!');
                        }}
                        className="px-4 py-2.5 rounded-2xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                      >
                        Bỏ qua
                      </button>
                      <button
                        type="button"
                        onClick={handleCheckDictation}
                        className="px-7 py-2.5 rounded-2xl bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 text-slate-950 font-black text-xs hover:opacity-95 shadow-xl shadow-cyan-500/20 active:scale-95 transition-all"
                      >
                        Kiểm tra
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setTypedWords(currentSegment.words.map((w, idx) => (idx === 0 ? w : '')));
                          setIsDictationCorrect(false);
                          setHasCheckedDictation(false);
                        }}
                        className="px-4 py-2.5 rounded-2xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                      >
                        Làm lại
                      </button>
                      <button
                        type="button"
                        onClick={handleNextSegment}
                        disabled={currentSegmentIdx >= video.segments.length - 1}
                        className="px-7 py-2.5 rounded-2xl bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 text-slate-950 font-black text-xs hover:opacity-95 shadow-xl shadow-cyan-500/20 active:scale-95 transition-all"
                      >
                        Tiếp theo
                      </button>
                    </>
                  )}
                </div>

                {/* RICH FEEDBACK BOX WHEN ANSWERED */}
                {isDictationCorrect && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-3xl bg-slate-950/90 border border-cyan-500/40 space-y-3.5 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-2 text-cyan-400 font-black text-xs">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      <span>Bạn trả lời chính xác!</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-extrabold text-white">
                      {currentSegment.text}
                    </div>

                    {/* Translation Box */}
                    <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">文 Bản dịch</span>
                      <p className="text-xs font-semibold text-slate-200">{currentSegment.vietnamese}</p>
                    </div>

                    {/* AI Translation Explainer */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Dịch bằng LinguaFlow AI</span>
                      </span>
                      <button
                        onClick={handleGenerateAiExplain}
                        disabled={isLoadingAi}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500/20 transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{isLoadingAi ? 'Đang phân tích...' : 'Giải thích AI'}</span>
                      </button>
                    </div>

                    {aiExplanation && (
                      <p className="text-xs text-slate-300 bg-slate-900/90 p-3 rounded-2xl border border-cyan-500/20 leading-relaxed shadow-inner">
                        {aiExplanation}
                      </p>
                    )}

                    {/* Word Pronunciations Pills */}
                    <div className="space-y-1.5 border-t border-slate-850 pt-2.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Pronunciation</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {currentSegment.words.map((w, i) => (
                          <button
                            key={i}
                            onClick={() => handlePlaySampleAudio(w)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 hover:border-cyan-500/40 transition-all"
                          >
                            <span>{w}</span>
                            <Volume2 className="w-3 h-3 text-slate-500" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODE 2: XẾP TỪ (WORD ORDER / SCRAMBLED) */}
          {/* ========================================================================= */}
          {activeMode === 'word_order' && (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                    <ListOrdered className="w-3.5 h-3.5" />
                    <span>XẾP CÂU THEO THỨ TỰ BẠN NGHE ({selectedWordPills.length}/{currentSegment.words.length})</span>
                  </span>
                  <button
                    onClick={() => {
                      setSelectedWordPills([]);
                      setIsOrderCorrect(false);
                    }}
                    className="text-[11px] text-slate-400 hover:text-white font-bold"
                  >
                    Làm lại
                  </button>
                </div>

                {/* Target Slots */}
                <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800 min-h-[90px] flex flex-wrap items-center gap-2.5">
                  {selectedWordPills.map((w, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedWordPills((prev) => prev.filter((_, i) => i !== idx))}
                      className="px-4 py-2 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 font-black text-xs hover:bg-rose-500/20 hover:border-rose-500 transition-all shadow-sm shadow-cyan-500/10"
                    >
                      {w}
                    </button>
                  ))}
                  {selectedWordPills.length === 0 && (
                    <span className="text-xs text-slate-600 italic">Chạm vào các từ bên dưới theo đúng thứ tự bạn nghe được...</span>
                  )}
                </div>

                {/* Scrambled Pills */}
                {!isOrderCorrect && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 block">Các từ bị xáo trộn:</span>
                    <div className="flex flex-wrap gap-2.5">
                      {scrambledWords.map((word, idx) => {
                        const countInSelected = selectedWordPills.filter((w) => w === word).length;
                        const countInScrambled = scrambledWords.filter((w) => w === word).length;
                        const isUsed = countInSelected >= countInScrambled;

                        return (
                          <button
                            key={idx}
                            disabled={isUsed}
                            onClick={() => handleSelectScrambledWord(word)}
                            className={`px-4 py-2.5 rounded-2xl border text-xs font-black transition-all ${
                              isUsed
                                ? 'bg-slate-950 border-slate-850 text-slate-600 opacity-30 cursor-not-allowed'
                                : 'bg-slate-900 border-slate-750 hover:border-cyan-400 hover:scale-105 text-white shadow-md'
                            }`}
                          >
                            {word}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Feedback Box when Scrambled Order is Correct */}
                {isOrderCorrect && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-3xl bg-slate-950 border border-cyan-500/40 space-y-3.5 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-cyan-400 font-black text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Chính xác!</span>
                      </div>
                      <span className="text-[10px] text-cyan-300 font-mono bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20 font-bold">
                        100% chính xác
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">文 BẢN DỊCH</span>
                      <p className="text-xs font-semibold text-slate-200">{currentSegment.vietnamese}</p>
                    </div>

                    <div className="space-y-1.5 border-t border-slate-850 pt-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Phát âm</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {currentSegment.words.map((w, i) => (
                          <button
                            key={i}
                            onClick={() => handlePlaySampleAudio(w)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-cyan-300 flex items-center gap-1"
                          >
                            <span>{w}</span>
                            <Volume2 className="w-3 h-3 text-slate-500" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Word Order Bottom Actions */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedWordPills([]);
                      setIsOrderCorrect(false);
                    }}
                    className="px-4 py-2.5 rounded-2xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Làm lại
                  </button>

                  {!isOrderCorrect && (
                    <button
                      type="button"
                      onClick={handleWordOrderHint}
                      disabled={hintsLeft <= 0}
                      className="px-4 py-2.5 rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      <span>Gợi ý (còn {hintsLeft})</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={handleNextSegment}
                  disabled={currentSegmentIdx >= video.segments.length - 1}
                  className="px-7 py-2.5 rounded-2xl bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 text-slate-950 font-black text-xs hover:opacity-95 shadow-xl shadow-cyan-500/20 active:scale-95 transition-all"
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODE 3: SHADOWING (LUYỆN NÓI & NHẠI GIỌNG AI) */}
          {/* ========================================================================= */}
          {activeMode === 'shadowing' && (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                {/* Control Toolbars */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handlePlaySampleAudio(currentSegment.text)}
                    className="px-3.5 py-2 rounded-2xl bg-slate-950 border border-cyan-500/30 text-xs font-bold text-cyan-300 hover:text-white flex items-center gap-1.5 shadow-sm"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Nghe mẫu</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowTranslation(!showTranslation)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                        showTranslation ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      Dịch
                    </button>
                    <button
                      onClick={() => setShowIPA(!showIPA)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                        showIPA ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      IPA
                    </button>
                  </div>
                </div>

                {/* Target Sentence Box */}
                <div className="p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/30 text-center space-y-3 shadow-2xl backdrop-blur-md">
                  <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight leading-relaxed">
                    {currentSegment.text}
                  </h3>
                  {showIPA && currentSegment.ipa && (
                    <p className="text-xs font-mono text-cyan-400/90">{currentSegment.ipa}</p>
                  )}
                  {showTranslation && (
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">文 BẢN DỊCH NGHĨA</span>
                      <p className="text-xs font-semibold text-slate-200">{currentSegment.vietnamese}</p>
                    </div>
                  )}
                </div>

                {/* Live Recorded Feedback */}
                {spokenTranscript && (
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Bạn vừa đọc:</span>
                    <p className="text-xs font-bold text-cyan-300">"{spokenTranscript}"</p>
                    {shadowingScore !== null && (
                      <span className={`text-sm font-black block mt-1 ${shadowingScore >= 70 ? 'text-cyan-400' : 'text-amber-400'}`}>
                        Độ chính xác: {shadowingScore}%
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Big Center Microphone Button (LinguaFlow Neon Pulse) */}
              <div className="flex flex-col items-center space-y-3 pt-2">
                <button
                  onClick={handleStartShadowingRecord}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-ping ring-4 ring-rose-500/40'
                      : 'bg-gradient-to-r from-teal-400 via-cyan-400 to-purple-500 text-slate-950 hover:scale-110 shadow-cyan-500/30 ring-4 ring-cyan-500/20'
                  }`}
                  title="Bấm để thu âm nhại giọng"
                >
                  <Mic className="w-8 h-8 stroke-[2.5]" />
                </button>
                <span className="text-xs font-bold text-slate-400">
                  {isRecording ? 'Đang lắng nghe bạn đọc...' : 'Chạm vào Micro để nhại lại câu'}
                </span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODE 4: TRANSCRIPT (PHỤ ĐỀ SONG NGỮ TƯƠNG TÁC DẠNG CUỘN TẬP TRUNG) */}
          {/* ========================================================================= */}
          {activeMode === 'transcript' && (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              {/* Header Bar: Language dropdown + Counter + Show/Hide Translation */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
                <button
                  onClick={() => setTranscriptLang(transcriptLang === 'vi' ? 'en' : 'vi')}
                  className="px-3.5 py-1.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5"
                >
                  <Languages className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{transcriptLang === 'vi' ? 'Tiếng Việt ▾' : 'English ▾'}</span>
                </button>

                <span className="text-xs font-mono font-extrabold text-cyan-400 bg-slate-950 px-3 py-1 rounded-xl border border-cyan-500/20">
                  {currentSegmentIdx + 1} / {video.segments.length}
                </span>

                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={`px-3.5 py-1.5 rounded-2xl border text-xs font-bold transition-colors ${
                    showTranslation ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  {showTranslation ? '文 Ẩn dịch' : '文 Hiện dịch'}
                </button>
              </div>

              {/* Seamless Transcript Stream (Only active sentence is boxed with Cyan Neon) */}
              <div className="flex-1 overflow-y-auto space-y-2 max-h-[380px] px-2 py-4 scrollbar-thin flex flex-col items-center">
                {video.segments.map((seg, idx) => {
                  const isCurrent = idx === currentSegmentIdx;
                  return (
                    <div
                      key={seg.id}
                      onClick={() => {
                        setCurrentSegmentIdx(idx);
                        handleReplaySegment();
                      }}
                      className={`w-full text-center cursor-pointer transition-all duration-300 ${
                        isCurrent
                          ? 'p-5 my-2 rounded-3xl border border-cyan-400/60 bg-gradient-to-r from-teal-500/15 via-cyan-500/15 to-purple-500/15 shadow-2xl shadow-cyan-500/15 scale-[1.02]'
                          : 'p-3.5 hover:bg-slate-950/40 rounded-2xl opacity-60 hover:opacity-90'
                      }`}
                    >
                      <p
                        className={`font-display transition-all ${
                          isCurrent
                            ? 'text-base sm:text-lg font-black text-cyan-300 leading-snug tracking-tight'
                            : 'text-sm sm:text-base font-semibold text-slate-300'
                        }`}
                      >
                        {seg.text}
                      </p>
                      {showTranslation && transcriptLang === 'vi' && (
                        <p
                          className={`mt-1.5 transition-all ${
                            isCurrent
                              ? 'text-xs sm:text-sm font-bold text-cyan-400/90'
                              : 'text-xs text-slate-500'
                          }`}
                        >
                          {seg.vietnamese}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Large Play Bar */}
              <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-850 shrink-0">
                <button
                  onClick={handlePrevSegment}
                  disabled={currentSegmentIdx === 0}
                  className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 disabled:opacity-30 hover:bg-slate-850 hover:text-white transition-colors text-slate-400"
                  title="Đoạn trước"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleTogglePlayVideo}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 text-slate-950 flex items-center justify-center shadow-xl shadow-cyan-500/30 hover:scale-105 transition-transform"
                  title={isPlaying ? 'Tạm dừng' : 'Phát'}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-slate-950" />
                  ) : (
                    <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                  )}
                </button>
                <button
                  onClick={handleNextSegment}
                  disabled={currentSegmentIdx === video.segments.length - 1}
                  className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 disabled:opacity-30 hover:bg-slate-850 hover:text-white transition-colors text-slate-400"
                  title="Đoạn kế tiếp"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: BÁO LỖI (REPORT BUG MODAL) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isReportModalOpen && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-extrabold text-base">
                  <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <Bug className="w-5 h-5" />
                  </div>
                  <span>Báo lỗi</span>
                </div>
                <button
                  onClick={() => setIsReportModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Trang đang báo lỗi
                  </label>
                  <input
                    type="text"
                    disabled
                    value={video.title}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-300 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Loại lỗi
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  >
                    <option value="Nội dung sai">Nội dung sai</option>
                    <option value="Phụ đề lệch">Phụ đề lệch</option>
                    <option value="Video không chạy">Video không chạy</option>
                    <option value="Âm thanh lỗi">Âm thanh lỗi</option>
                    <option value="Khác...">Khác...</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Mô tả lỗi *
                  </label>
                  <textarea
                    rows={4}
                    value={reportDesc}
                    onChange={(e) => setReportDesc(e.target.value)}
                    maxLength={2000}
                    placeholder="Ví dụ: câu 12 đáp án đúng phải là B vì..."
                    className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  />
                  <div className="text-right text-[10px] text-slate-500 font-mono">
                    {reportDesc.length}/2000
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>Hoặc liên hệ trực tiếp để được hỗ trợ nhanh nhất</span>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs">
                      f
                    </button>
                    <button className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center justify-center text-xs">
                      ♪
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    arcadeAudio.playVictoryFanfare();
                    setIsReportSubmitted(true);
                    setTimeout(() => {
                      setIsReportSubmitted(false);
                      setIsReportModalOpen(false);
                      setReportDesc('');
                    }, 1200);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs hover:opacity-95 flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isReportSubmitted ? 'Đã gửi thành công!' : 'Gửi báo lỗi'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: SỔ TAY GHI CHÚ (STUDY NOTEBOOK MODAL) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isNotesModalOpen && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-base">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <FileEdit className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-extrabold text-sm sm:text-base">Sổ tay ghi chú</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Lưu giữ các ghi chú học tập của bạn</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCreatingNote(!isCreatingNote)}
                    className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-colors"
                    title="Tạo ghi chú mới"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsNotesModalOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Sub-form: Create Note */}
              {isCreatingNote ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-cyan-400 flex items-center gap-1.5">
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Tạo ghi chú mới</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      TRANSCRIPT - SEGMENT {currentSegmentIdx + 1}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Tiêu đề</label>
                    <input
                      type="text"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      placeholder="Tiêu đề ghi chú..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Nội dung</label>
                    <textarea
                      rows={3}
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      placeholder="Viết ghi chú..."
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCreatingNote(false)}
                      className="px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-400 hover:text-white"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (newNoteTitle.trim() || newNoteContent.trim()) {
                          setNotesList([
                            {
                              id: Date.now().toString(),
                              title: newNoteTitle.trim() || `Ghi chú đoạn ${currentSegmentIdx + 1}`,
                              content: newNoteContent.trim(),
                              segment: currentSegmentIdx + 1,
                            },
                            ...notesList,
                          ]);
                          setNewNoteTitle('');
                          setNewNoteContent('');
                          setIsCreatingNote(false);
                          arcadeAudio.playCoin();
                        }
                      }}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-bold text-xs hover:opacity-95 flex items-center gap-1"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Lưu ghi chú</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Notes List */
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                  {notesList.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      Chưa có ghi chú nào. Bấm nút "+" ở trên để thêm ghi chú mới!
                    </div>
                  ) : (
                    notesList.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-1 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-extrabold text-cyan-300">{item.title}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-500">
                              Đoạn {item.segment}
                            </span>
                            <button
                              onClick={() => setNotesList(notesList.filter((n) => n.id !== item.id))}
                              className="text-slate-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{item.content}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              <div className="flex justify-end pt-2 border-t border-slate-800">
                <button
                  onClick={() => setIsNotesModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-bold text-white transition-colors"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 3: CÀI ĐẶT (SETTINGS MODAL) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isSettingsModalOpen && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5 max-h-[90vh] overflow-y-auto scrollbar-thin"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-base">
                  <Settings className="w-5 h-5" />
                  <span>Cài đặt</span>
                </div>
                <button
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. Hotkeys Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-850">
                  <span className="text-xs text-slate-300 font-semibold">Phím Nghe lại</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
                    Ctrl
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-850">
                  <span className="text-xs text-slate-300 font-semibold">Phím Phát/Dừng</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
                    Space
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-850">
                  <span className="text-xs text-slate-300 font-semibold">Phím Chuyển Câu</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
                    Arrow Right (→)
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-850">
                  <span className="text-xs text-slate-300 font-semibold">Phím Bỏ qua</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
                    Ctrl + Enter
                  </span>
                </div>
              </div>

              {/* 2. Practice Configs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-850">
                  <span className="text-xs text-slate-300 font-semibold">Số lần replay</span>
                  <select
                    value={replayTimes}
                    onChange={(e) => setReplayTimes(e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="Không">Không</option>
                    <option value="1">1 lần</option>
                    <option value="2">2 lần</option>
                    <option value="3">3 lần</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-850">
                  <span className="text-xs text-slate-300 font-semibold">Độ khó Dictation</span>
                  <select
                    value={dictationDifficulty}
                    onChange={(e) => setDictationDifficulty(e.target.value as any)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="easy">Dễ</option>
                    <option value="normal">Thường</option>
                    <option value="hard">Khó</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-850">
                  <span className="text-xs text-slate-300 font-semibold">Ngôn ngữ dịch</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-white">
                    Tiếng Việt
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-850">
                  <span className="text-xs text-slate-300 font-semibold">Tự động chạy</span>
                  <input
                    type="checkbox"
                    checked={autoAdvance}
                    onChange={(e) => setAutoAdvance(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-850">
                  <span className="text-xs text-slate-300 font-semibold">Hiện gợi ý tên riêng</span>
                  <input
                    type="checkbox"
                    checked={hintProperNouns}
                    onChange={(e) => setHintProperNouns(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-850">
                  <span className="text-xs text-slate-300 font-semibold">Âm thanh phản hồi</span>
                  <input
                    type="checkbox"
                    checked={soundFeedback}
                    onChange={(e) => setSoundFeedback(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* 3. Audio Volume Slider */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Âm lượng hiệu ứng</span>
                  <span className="text-cyan-400 font-mono">{soundVolume}%</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Điều chỉnh độ lớn của tiếng báo đúng, sai và hoàn thành.
                </p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soundVolume}
                  onChange={(e) => setSoundVolume(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* 4. TTS Voices Selection */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 block">
                  Giọng đọc AI
                </span>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-850">
                  <span className="text-xs text-slate-300 font-semibold">Giọng Mỹ (US)</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={voiceUS}
                      onChange={(e) => setVoiceUS(e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none"
                    >
                      <option value="Tự động chọn">Tự động chọn</option>
                      <option value="Samantha">Samantha (Nữ)</option>
                      <option value="Alex">Alex (Nam)</option>
                    </select>
                    <button
                      onClick={() => handlePlaySampleAudio('Hello! This is American English with LinguaFlow.')}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-cyan-400 flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Nghe thử</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-300 font-semibold">Giọng Anh (UK)</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={voiceUK}
                      onChange={(e) => setVoiceUK(e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none"
                    >
                      <option value="Tự động chọn">Tự động chọn</option>
                      <option value="Daniel">Daniel (Nam)</option>
                      <option value="Serena">Serena (Nữ)</option>
                    </select>
                    <button
                      onClick={() => handlePlaySampleAudio('Hello! This is British English with LinguaFlow.')}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-cyan-400 flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Nghe thử</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Shortcut Summary & Auto-saved notification */}
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 font-mono">
                  Phím tắt: Space: Phát/Dừng • Ctrl: Nghe lại • Ctrl+Enter: Bỏ qua • ←→: ±5 giây
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold">
                  <Check className="w-4 h-4" />
                  <span>Đã tự động lưu cài đặt!</span>
                </div>
                <button
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  Xong
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
};
export default VideoDictationStudio;
