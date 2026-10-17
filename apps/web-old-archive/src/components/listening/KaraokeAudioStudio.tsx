'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, FastForward, Rewind, Sparkles, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import { arcadeAudio } from '@/lib/arcadeAudio';

interface KaraokeAudioStudioProps {
  text: string;
  audioUrl?: string;
  translation?: string;
  title?: string;
  locale?: string;
  onFinished?: () => void;
  className?: string;
}

export default function KaraokeAudioStudio({
  text,
  audioUrl,
  translation,
  title = 'Audio Dialogue Session',
  locale = 'vi',
  onFinished,
  className = '',
}: KaraokeAudioStudioProps) {
  const isVi = locale === 'vi';
  const words = text.split(/\s+/).filter(Boolean);

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [activeWordIdx, setActiveWordIdx] = useState<number>(-1);
  const [isMuted, setIsMuted] = useState(false);

  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(Math.max(3, words.length * 0.55));

  const totalDuration = durationRef.current / speed;

  const handlePlayPause = () => {
    arcadeAudio.playLaser();
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const playAudio = () => {
    if (typeof window === 'undefined') return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = speed * 0.95;

      utterance.onend = () => {
        setIsPlaying(false);
        setActiveWordIdx(-1);
        setProgress(1);
        clearInterval(timerRef.current);
        onFinished?.();
      };

      window.speechSynthesis.speak(utterance);
    }

    setIsPlaying(true);
    startTimeRef.current = Date.now() - progress * totalDuration * 1000;

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const curProg = Math.min(1, elapsed / totalDuration);
      setProgress(curProg);

      const curIdx = Math.min(words.length - 1, Math.floor(curProg * words.length));
      setActiveWordIdx(curIdx);

      if (curProg >= 1) {
        clearInterval(timerRef.current);
        setIsPlaying(false);
        onFinished?.();
      }
    }, 80);
  };

  const pauseAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    clearInterval(timerRef.current);
    setIsPlaying(false);
  };

  const handleRestart = () => {
    arcadeAudio.playLaser();
    pauseAudio();
    setProgress(0);
    setActiveWordIdx(-1);
    setTimeout(() => playAudio(), 100);
  };

  const handleSeek = (newProg: number) => {
    pauseAudio();
    setProgress(newProg);
    const curIdx = Math.min(words.length - 1, Math.floor(newProg * words.length));
    setActiveWordIdx(curIdx);
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950/20 border border-teal-500/30 backdrop-blur-2xl shadow-2xl space-y-6 ${className}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-teal-400 uppercase tracking-widest block">
              {isVi ? 'Phòng Thu Karaoke Sync' : 'Studio Karaoke Player'}
            </span>
            <h3 className="font-display font-extrabold text-lg text-white">{title}</h3>
          </div>
        </div>

        {/* Dynamic Waveform Visualizer Equalizer */}
        <div className="flex items-end gap-1 h-8 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
          {[16, 24, 32, 20, 28, 12, 26, 18, 30, 22].map((h, i) => (
            <motion.div
              key={i}
              animate={
                isPlaying
                  ? { height: [6, h, 8, h * 0.8, 6] }
                  : { height: 6 }
              }
              transition={{ repeat: Infinity, duration: 0.8 + (i % 3) * 0.2, ease: 'easeInOut' }}
              className="w-1 rounded-full bg-gradient-to-t from-teal-500 to-emerald-400"
            />
          ))}
        </div>
      </div>

      {/* KARAOKE TIMELINE TRANSCRIPT DISPLAY */}
      <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800/90 min-h-[140px] flex flex-col justify-between space-y-4 shadow-inner">
        <div className="flex flex-wrap gap-2 text-lg sm:text-xl font-display font-bold leading-relaxed">
          {words.map((word, idx) => {
            const isActive = idx === activeWordIdx;
            const isPassed = idx < activeWordIdx;

            return (
              <motion.span
                key={idx}
                animate={isActive ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
                className={`transition-all duration-150 rounded-lg px-1.5 py-0.5 cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-extrabold shadow-lg shadow-amber-400/30'
                    : isPassed
                    ? 'text-teal-300'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                onClick={() => handleSeek(idx / words.length)}
              >
                {word}
              </motion.span>
            );
          })}
        </div>

        {translation && (
          <p className="text-xs sm:text-sm text-slate-400 pt-2 border-t border-slate-850 font-sans">
            📌 <em>{translation}</em>
          </p>
        )}
      </div>

      {/* Scrub Slider Progress Bar */}
      <div className="space-y-1.5">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={progress}
          onChange={(e) => handleSeek(parseFloat(e.target.value))}
          className="w-full accent-teal-400 bg-slate-800 rounded-lg cursor-pointer h-2"
        />
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>{Math.round(progress * totalDuration)}s</span>
          <span>{Math.round(totalDuration)}s</span>
        </div>
      </div>

      {/* Main Studio Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {/* Speed Selector Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono font-bold">
          {[0.75, 1.0, 1.25].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                arcadeAudio.playLaser();
                setSpeed(s);
              }}
              className={`px-2.5 py-1 rounded-xl transition-all ${
                speed === s
                  ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Center Primary Play/Pause & Restart */}
        <div className="flex items-center gap-3 mx-auto sm:mx-0">
          <button
            type="button"
            onClick={handleRestart}
            aria-label="Nghe lại từ đầu"
            className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Dừng phát' : 'Bắt đầu phát'}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-display font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 fill-slate-950" />
                <span>{isVi ? 'Tạm Dừng' : 'Pause'}</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-slate-950" />
                <span>{isVi ? 'Phát Karaoke' : 'Play Karaoke'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
