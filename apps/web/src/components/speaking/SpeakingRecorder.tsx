'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LinguaSpeechRecognition } from '@/lib/speaking/speechRecognition';
import { safeAudioRecorder } from '@/lib/speaking/audioRecorder';
import LiveTranscript from './LiveTranscript';
import SpeakingTimer from './SpeakingTimer';
import SpeakingControls from './SpeakingControls';
import MicrophonePermission from './MicrophonePermission';

interface SpeakingRecorderProps {
  maxDurationSeconds?: number;
  sampleText?: string;
  onSubmit: (transcript: string, durationMs: number) => void;
  isSubmitting?: boolean;
  locale?: string;
  className?: string;
}

export default function SpeakingRecorder({
  maxDurationSeconds = 60,
  sampleText,
  onSubmit,
  isSubmitting = false,
  locale = 'vi',
  className = '',
}: SpeakingRecorderProps) {
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<LinguaSpeechRecognition | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const rec = new LinguaSpeechRecognition('en-US');
    setIsSupported(rec.isSupported());
    recognitionRef.current = rec;

    return () => {
      rec.reset();
      safeAudioRecorder.release();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const handleStartRecording = async () => {
    setPermissionDenied(false);
    setInterim('');
    startTimeRef.current = Date.now();

    // Start native audio recorder for local audio buffer
    await safeAudioRecorder.startRecording();

    if (recognitionRef.current && isSupported) {
      recognitionRef.current.start({
        onStart: () => {
          setIsRecording(true);
        },
        onTranscript: (text) => {
          setTranscript((prev) => (prev ? `${prev} ${text}` : text));
          setInterim('');
        },
        onInterimTranscript: (text) => {
          setInterim(text);
        },
        onPermissionDenied: () => {
          setPermissionDenied(true);
          setIsRecording(false);
        },
        onError: () => {
          setIsRecording(false);
        },
        onEnd: () => {
          setIsRecording(false);
        },
      });
    } else {
      setIsRecording(true);
    }

    // Start timer interval
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev + 1 >= maxDurationSeconds) {
          handleStopRecording();
          return maxDurationSeconds;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    await safeAudioRecorder.stopRecording();
  };

  const handleReset = () => {
    handleStopRecording();
    setTranscript('');
    setInterim('');
    setSeconds(0);
    safeAudioRecorder.release();
  };

  const handleSubmit = () => {
    const durationMs = Math.max(1000, seconds * 1000);
    onSubmit(transcript.trim(), durationMs);
  };

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-5 ${className}`}>
      <div className="flex items-center justify-between">
        <SpeakingTimer
          seconds={seconds}
          maxSeconds={maxDurationSeconds}
          isRecording={isRecording}
          locale={locale}
        />

        <span className="text-xs text-slate-400 font-mono">
          {isRecording ? '• Đang ghi âm' : 'Sẵn sàng'}
        </span>
      </div>

      {/* Permission & Privacy Notification */}
      <MicrophonePermission
        isSupported={isSupported}
        permissionDenied={permissionDenied}
        locale={locale}
      />

      {/* Live Transcript Display */}
      <LiveTranscript
        transcript={transcript}
        interimTranscript={interim}
        isRecording={isRecording}
        locale={locale}
      />

      {/* Action Controls */}
      <SpeakingControls
        isRecording={isRecording}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        onReset={handleReset}
        onSubmit={handleSubmit}
        sampleText={sampleText}
        hasTranscript={Boolean(transcript.trim())}
        isSubmitting={isSubmitting}
        locale={locale}
      />
    </div>
  );
}
