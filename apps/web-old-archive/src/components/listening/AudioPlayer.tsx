'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Gauge } from 'lucide-react';
import { sfx } from '@/lib/soundEffects';
import { useMotionAccessibility } from '@linguaflow/ui';

interface AudioPlayerProps {
  text: string;
  audioUrl?: string;
  durationSeconds?: number;
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
  autoPlay?: boolean;
}

export default function AudioPlayer({
  text,
  audioUrl,
  durationSeconds = 5,
  onPlayStateChange,
  className = '',
  autoPlay = false,
}: AudioPlayerProps) {
  const { shouldReduceMotion } = useMotionAccessibility();

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(durationSeconds);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressTimerRef = useRef<any>(null);

  // Sync mute state on mount
  useEffect(() => {
    setIsMuted(sfx.isMuted());
  }, []);

  const handleStateChange = useCallback((playing: boolean) => {
    setIsPlaying(playing);
    onPlayStateChange?.(playing);
  }, [onPlayStateChange]);

  const clearTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const stopAllPlayback = useCallback(() => {
    clearTimer();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    handleStateChange(false);
  }, [handleStateChange]);

  // Handle Web Speech Synthesis playback
  const playSpeechSynthesis = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    clearTimer();

    if (sfx.isMuted()) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = playbackRate * 0.92;
    speechUtteranceRef.current = utterance;

    const estimatedDuration = Math.max(2, Math.round((text.split(' ').length / (2.5 * playbackRate))));
    setTotalDuration(estimatedDuration);
    setCurrentTime(0);

    const startTime = Date.now();
    progressTimerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed >= estimatedDuration) {
        setCurrentTime(estimatedDuration);
        clearTimer();
      } else {
        setCurrentTime(elapsed);
      }
    }, 100);

    utterance.onstart = () => {
      handleStateChange(true);
    };

    utterance.onend = () => {
      clearTimer();
      setCurrentTime(estimatedDuration);
      handleStateChange(false);
    };

    utterance.onerror = () => {
      clearTimer();
      handleStateChange(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [text, playbackRate, handleStateChange]);

  // Main Play Action
  const handlePlay = useCallback(() => {
    if (isPlaying) {
      stopAllPlayback();
      return;
    }

    if (audioUrl && audioUrl.startsWith('http')) {
      if (!audioRef.current) {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onloadedmetadata = () => {
          if (audio.duration && !isNaN(audio.duration)) {
            setTotalDuration(audio.duration);
          }
        };

        audio.ontimeupdate = () => {
          setCurrentTime(audio.currentTime);
        };

        audio.onended = () => {
          handleStateChange(false);
          setCurrentTime(audio.duration || durationSeconds);
        };

        audio.onerror = () => {
          // Fallback to speech synthesis if audio file fails
          playSpeechSynthesis();
        };
      }

      audioRef.current.playbackRate = playbackRate;
      audioRef.current.muted = sfx.isMuted();
      audioRef.current.play()
        .then(() => handleStateChange(true))
        .catch(() => playSpeechSynthesis());
    } else {
      playSpeechSynthesis();
    }
  }, [isPlaying, audioUrl, durationSeconds, playbackRate, playSpeechSynthesis, stopAllPlayback, handleStateChange]);

  const handleReplay = () => {
    stopAllPlayback();
    setCurrentTime(0);
    setTimeout(() => {
      handlePlay();
    }, 50);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    if (isPlaying) {
      handleReplay();
    }
  };

  const toggleMute = () => {
    const nextMuted = sfx.toggleMuted();
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
    if (nextMuted && isPlaying) {
      stopAllPlayback();
    }
  };

  // Cleanup on unmount or text change
  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => {
        handlePlay();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [text, autoPlay, handlePlay]);

  useEffect(() => {
    return () => {
      stopAllPlayback();
    };
  }, [stopAllPlayback]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalDuration > 0
    ? Math.min(100, (currentTime / totalDuration) * 100)
    : 0;

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4 ${className}`}>
      {/* Waveform / Progress Display */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-mono text-slate-400">
          <span className="text-teal-400 font-bold">{formatTime(currentTime)}</span>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 uppercase">
            <Volume2 className="w-3.5 h-3.5 text-teal-400" />
            <span>Studio Master Audio</span>
          </div>
          <span>{formatTime(totalDuration)}</span>
        </div>

        <div className="relative w-full h-2 rounded-full bg-slate-800/80 overflow-hidden border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-300 transition-all duration-100 ease-linear rounded-full shadow-sm shadow-teal-500/50"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Control Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Play / Replay Primary Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePlay}
            aria-label={isPlaying ? 'Tạm dừng bài nghe' : 'Phát bài nghe'}
            className={`p-3.5 sm:px-5 sm:py-3 rounded-xl font-display font-extrabold text-sm inline-flex items-center gap-2 transition-all select-none shadow-lg active:scale-95 ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25'
                : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-teal-500/25'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 fill-slate-950" />
                <span className="hidden sm:inline">Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                <span className="hidden sm:inline">Phát âm</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReplay}
            title="Nghe lại từ đầu"
            aria-label="Nghe lại từ đầu"
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-90"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleMute}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className={`p-3 rounded-xl border transition-all active:scale-90 ${
              isMuted
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Speed Selector (0.75x, 1x, 1.25x) */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <div className="px-2 text-slate-500 hidden lg:flex items-center gap-1 text-xs">
            <Gauge className="w-3 h-3" />
            <span>Tốc độ:</span>
          </div>

          {[0.75, 1, 1.25].map((speed) => {
            const isSpeedActive = playbackRate === speed;
            return (
              <button
                key={speed}
                type="button"
                onClick={() => handleSpeedChange(speed)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                  isSpeedActive
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {speed}x
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
