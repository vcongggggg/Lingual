'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Headphones,
  Volume2,
  VolumeX,
  RotateCcw,
  AlertTriangle,
  Bot,
  Sparkles,
} from 'lucide-react';

export type AudioPlaybackMode =
  | 'REAL_AUDIO_SEGMENT' // Trường hợp (a): Có audioUrl VÀ có start/end hợp lệ
  | 'TTS_PENDING_TIMESTAMP' // Trường hợp (b): Có audioUrl nhưng CHƯA CÓ start/end -> TẠM DÙNG TTS (tránh lộ đáp án)
  | 'TTS_NO_AUDIO'; // Trường hợp (c): audioUrl NULL -> Dùng TTS như hiện tại

export interface ListeningAudioPlayerProps {
  /** URL file audio nếu có */
  audioUrl?: string | null;
  /** Giây bắt đầu của đoạn trích */
  audioStartSec?: number | null;
  /** Giây kết thúc của đoạn trích */
  audioEndSec?: number | null;
  /** Nội dung văn bản/transcript để đọc TTS khi fallback */
  ttsText?: string | null;
  /** Tiêu đề bài nghe */
  title?: string;
  /** Nguồn tham chiếu (vd: Cambridge 11 Test 1 Section 4) */
  sourceRef?: string;
  /** Số lần nghe */
  playCount?: number;
  /** Callback khi số lần nghe thay đổi */
  onPlayCountChange?: (count: number) => void;
  /** Callback khi kết thúc phát */
  onEnded?: () => void;
  /** Custom className hoặc styles */
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Hàm phân loại chế độ phát âm thanh theo đúng đặc tả kỹ thuật:
 * (a) Có audioUrl VÀ có start/end -> 'REAL_AUDIO_SEGMENT'
 * (b) Có audioUrl nhưng chưa có start/end -> 'TTS_PENDING_TIMESTAMP' (TUYỆT ĐỐI KHÔNG phát file full)
 * (c) audioUrl NULL -> 'TTS_NO_AUDIO'
 */
export function determinePlaybackMode(
  audioUrl?: string | null,
  start?: number | null,
  end?: number | null
): AudioPlaybackMode {
  const hasUrl = !!audioUrl && audioUrl.trim().length > 0;
  const hasValidTimestamp =
    typeof start === 'number' &&
    typeof end === 'number' &&
    end > start;

  if (hasUrl && hasValidTimestamp) {
    return 'REAL_AUDIO_SEGMENT';
  }
  if (hasUrl && !hasValidTimestamp) {
    return 'TTS_PENDING_TIMESTAMP';
  }
  return 'TTS_NO_AUDIO';
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const ListeningAudioPlayer: React.FC<ListeningAudioPlayerProps> = ({
  audioUrl,
  audioStartSec,
  audioEndSec,
  ttsText,
  title = 'Bài nghe hiểu',
  sourceRef,
  playCount: externalPlayCount,
  onPlayCountChange,
  onEnded,
  className,
  style,
}) => {
  const mode = determinePlaybackMode(audioUrl, audioStartSec, audioEndSec);

  // Audio element reference for Real Audio
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Thời gian tương đối trong đoạn [0, segmentDuration]
  const [isMuted, setIsMuted] = useState(false);
  const [internalPlayCount, setInternalPlayCount] = useState(0);

  const playCount = externalPlayCount ?? internalPlayCount;

  // Segment boundaries
  const startSec = typeof audioStartSec === 'number' ? audioStartSec : 0;
  const endSec = typeof audioEndSec === 'number' ? audioEndSec : 0;
  const segmentDuration = mode === 'REAL_AUDIO_SEGMENT' ? Math.max(1, endSec - startSec) : 0;

  // Dừng mọi âm thanh khi chuyển câu hoặc unmount
  const stopAllAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = startSec;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentTime(0);
  }, [startSec]);

  useEffect(() => {
    stopAllAudio();
    return () => {
      stopAllAudio();
    };
  }, [audioUrl, audioStartSec, audioEndSec, stopAllAudio]);

  const incrementPlayCount = () => {
    const newCount = playCount + 1;
    setInternalPlayCount(newCount);
    if (onPlayCountChange) {
      onPlayCountChange(newCount);
    }
  };

  // --------------------------------------------------------------------------
  // XỬ LÝ CHẾ ĐỘ 1: PHÁT AUDIO THẬT THEO TIMESTAMP [startSec, endSec]
  // --------------------------------------------------------------------------
  const togglePlayRealAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Đảm bảo tua đến đúng audioStartSec trước khi phát
      const currentAbsTime = audioRef.current.currentTime;
      if (currentAbsTime < startSec || currentAbsTime >= endSec) {
        audioRef.current.currentTime = startSec;
      }

      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          incrementPlayCount();
        })
        .catch((err) => {
          console.warn('[ListeningAudioPlayer] Real audio play failed:', err);
          setIsPlaying(false);
        });
    }
  };

  const onRealTimeUpdate = () => {
    if (!audioRef.current || mode !== 'REAL_AUDIO_SEGMENT') return;

    const absTime = audioRef.current.currentTime;

    // Giới hạn tuyệt đối không phát vượt quá endSec
    if (absTime >= endSec) {
      audioRef.current.pause();
      audioRef.current.currentTime = startSec;
      setIsPlaying(false);
      setCurrentTime(segmentDuration);
      if (onEnded) onEnded();
      return;
    }

    if (absTime < startSec) {
      audioRef.current.currentTime = startSec;
      setCurrentTime(0);
      return;
    }

    // Cập nhật relative time trong phân đoạn
    setCurrentTime(absTime - startSec);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'REAL_AUDIO_SEGMENT' || !audioRef.current || segmentDuration <= 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetRelative = clickRatio * segmentDuration;
    const targetAbsolute = startSec + targetRelative;

    audioRef.current.currentTime = targetAbsolute;
    setCurrentTime(targetRelative);
  };

  const handleRestart = () => {
    if (mode === 'REAL_AUDIO_SEGMENT' && audioRef.current) {
      audioRef.current.currentTime = startSec;
      setCurrentTime(0);
      if (!isPlaying) {
        togglePlayRealAudio();
      }
    } else if (mode.startsWith('TTS')) {
      stopAllAudio();
      togglePlayTTS();
    }
  };

  // --------------------------------------------------------------------------
  // XỬ LÝ CHẾ ĐỘ 2 & 3: PHÁT GIỌNG ĐỌC MÁY TTS (SpeechSynthesis API)
  // --------------------------------------------------------------------------
  const togglePlayTTS = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ tính năng Web Speech TTS.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const textToRead = ttsText?.trim() || title || 'Audio listening comprehension passage.';
    window.speechSynthesis.cancel(); // Hủy lời đọc trước nếu có

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'en-US';
    utterance.rate = 0.95; // Tốc độ chuẩn bài thi IELTS Listening

    // Cố gắng chọn giọng chuẩn tiếng Anh bản xứ nếu có
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(
      (v) => (v.lang === 'en-US' || v.lang === 'en-GB') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.default)
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (enVoice) {
      utterance.voice = enVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      incrementPlayCount();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    utterance.onerror = (e) => {
      console.warn('[ListeningAudioPlayer] TTS error:', e);
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const togglePlay = () => {
    if (mode === 'REAL_AUDIO_SEGMENT') {
      togglePlayRealAudio();
    } else {
      togglePlayTTS();
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      className={className}
      style={{
        backgroundColor: '#FAF5FF',
        border: '1px solid #E9D5FF',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        ...style,
      }}
    >
      {/* Real HTML5 Audio Element for REAL_AUDIO_SEGMENT */}
      {mode === 'REAL_AUDIO_SEGMENT' && audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          onTimeUpdate={onRealTimeUpdate}
          onEnded={() => {
            setIsPlaying(false);
            if (onEnded) onEnded();
          }}
        />
      )}

      {/* Header & Badges */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B21A8', fontWeight: 700 }}>
          <Headphones size={20} />
          <span style={{ fontSize: '0.95rem' }}>{title}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Badge Chế độ */}
          {mode === 'REAL_AUDIO_SEGMENT' && (
            <span
              style={{
                fontSize: '0.75rem',
                color: '#065F46',
                backgroundColor: '#D1FAE5',
                border: '1px solid #A7F3D0',
                padding: '2px 8px',
                borderRadius: '6px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={12} />
              Audio gốc ({formatTime(startSec)} - {formatTime(endSec)})
            </span>
          )}

          {mode === 'TTS_PENDING_TIMESTAMP' && (
            <span
              style={{
                fontSize: '0.75rem',
                color: '#92400E',
                backgroundColor: '#FEF3C7',
                border: '1px solid #FDE68A',
                padding: '2px 8px',
                borderRadius: '6px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <AlertTriangle size={12} />
              TTS (Chờ timestamp)
            </span>
          )}

          {mode === 'TTS_NO_AUDIO' && (
            <span
              style={{
                fontSize: '0.75rem',
                color: '#4B5563',
                backgroundColor: '#F3F4F6',
                border: '1px solid #E5E7EB',
                padding: '2px 8px',
                borderRadius: '6px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Bot size={12} />
              Giọng máy TTS
            </span>
          )}

          {/* Số lần nghe */}
          <span
            style={{
              fontSize: '0.75rem',
              color: '#7E22CE',
              backgroundColor: '#F3E8FF',
              padding: '2px 8px',
              borderRadius: '6px',
              fontWeight: 500,
            }}
          >
            Số lần nghe: {playCount}
          </span>
        </div>
      </div>

      {/* Thông báo trạng thái nếu là Fallback */}
      {mode === 'TTS_PENDING_TIMESTAMP' && (
        <div
          style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FCD34D',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '0.8rem',
            color: '#B45309',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span>
            File audio full đang chờ đồng bộ mốc thời gian (timestamp). Hệ thống tự động chuyển sang giọng đọc máy TTS để tránh phát tràn làm lộ đáp án câu sau.
          </span>
        </div>
      )}

      {mode === 'TTS_NO_AUDIO' && (
        <div
          style={{
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '0.8rem',
            color: '#4B5563',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Bot size={16} style={{ flexShrink: 0 }} />
          <span>Phần Nghe đang dùng giọng đọc máy tạm thời (sẽ được thay bằng audio phòng thu khi hoàn tất).</span>
        </div>
      )}

      {/* Player Controls Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Tạm dừng' : 'Phát âm thanh'}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: isPlaying ? '#9333EA' : '#7C3AED',
            color: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(124, 58, 237, 0.3)',
            flexShrink: 0,
            transition: 'transform 0.1s, background-color 0.2s',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
        </button>

        {/* Restart Button */}
        <button
          onClick={handleRestart}
          title="Nghe lại từ đầu đoạn"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#F3E8FF',
            color: '#7C3AED',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <RotateCcw size={15} />
        </button>

        {/* Timeline / Progress Bar */}
        {mode === 'REAL_AUDIO_SEGMENT' ? (
          <div style={{ flexGrow: 1 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: '#6B21A8',
                marginBottom: '4px',
                fontWeight: 600,
              }}
            >
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(segmentDuration)}</span>
            </div>
            <div
              style={{
                height: '8px',
                backgroundColor: '#E9D5FF',
                borderRadius: '4px',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
              }}
              onClick={handleSeek}
            >
              <div
                style={{
                  width: `${segmentDuration > 0 ? (currentTime / segmentDuration) * 100 : 0}%`,
                  backgroundColor: '#7C3AED',
                  height: '100%',
                  borderRadius: '4px',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
          </div>
        ) : (
          <div style={{ flexGrow: 1 }}>
            <div style={{ fontSize: '0.8rem', color: '#6B21A8', fontWeight: 600 }}>
              {isPlaying ? '🔊 Đang đọc kịch bản bài nghe...' : '▶ Nhấn nút phát để nghe giọng đọc máy'}
            </div>
            <div style={{ fontSize: '0.725rem', color: '#9CA3AF', marginTop: '2px' }}>
              Tốc độ: 0.95x | Chuẩn phát âm bản ngữ
            </div>
          </div>
        )}

        {/* Mute Button (Real Audio only) */}
        {mode === 'REAL_AUDIO_SEGMENT' && (
          <button
            onClick={toggleMute}
            title={isMuted ? 'Bật âm lượng' : 'Tắt tiếng'}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#7C3AED',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
            }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        )}
      </div>

      {/* Source Reference Footer */}
      {sourceRef && (
        <div style={{ fontSize: '0.725rem', color: '#9333EA', marginTop: '10px', fontStyle: 'italic' }}>
          Nguồn: {sourceRef}
        </div>
      )}
    </div>
  );
};

