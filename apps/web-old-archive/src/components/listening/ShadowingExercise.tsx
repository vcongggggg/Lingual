'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, RotateCcw, ArrowRight, Sparkles, Volume2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ListeningExercise, ShadowingResult } from '@linguaflow/domain';
import { compareSpeech } from '@/lib/listening/compareSpeech';
import {
  isSpeechRecognitionSupported,
  createSpeechRecognizer,
  SpeechRecognizerInstance,
  SpeechRecognitionErrorDetails,
} from '@/lib/listening/speechRecognition';
import { sfx } from '@/lib/soundEffects';
import AudioPlayer from './AudioPlayer';
import LingLingMascot, { MascotState } from '../LingLingMascot';
import { Button, Card, useMotionAccessibility } from '@linguaflow/ui';
import { motion, AnimatePresence } from 'framer-motion';

interface ShadowingExerciseProps {
  exercise: ListeningExercise;
  onComplete: (result: ShadowingResult) => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export default function ShadowingExercise({
  exercise,
  onComplete,
  onNext,
  hasNext = false,
}: ShadowingExerciseProps) {
  const { shouldReduceMotion } = useMotionAccessibility();

  const [isSupported, setIsSupported] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [result, setResult] = useState<ShadowingResult | null>(null);
  const [errorDetails, setErrorDetails] = useState<SpeechRecognitionErrorDetails | null>(null);
  const [mascotState, setMascotState] = useState<MascotState>('idle');

  const recognizerRef = useRef<SpeechRecognizerInstance | null>(null);

  // Check Web Speech support on mount
  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());
  }, []);

  // Reset state when exercise changes
  useEffect(() => {
    if (recognizerRef.current) {
      recognizerRef.current.abort();
    }
    setIsRecording(false);
    setRecognizedText('');
    setResult(null);
    setErrorDetails(null);
    setMascotState('idle');
  }, [exercise.id]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.abort();
      }
    };
  }, []);

  const handleStartRecording = () => {
    setErrorDetails(null);
    setRecognizedText('');
    setResult(null);
    setMascotState('thinking');

    const recognizer = createSpeechRecognizer(
      { lang: 'en-US', continuous: false, interimResults: true },
      {
        onStart: () => {
          setIsRecording(true);
          setMascotState('speaking');
        },
        onResult: (text: string, isFinal: boolean) => {
          setRecognizedText(text);
          if (isFinal) {
            evaluateShadowing(text);
          }
        },
        onError: (err) => {
          setIsRecording(false);
          setErrorDetails(err);
          setMascotState('apologetic');
          sfx.playWrong();
        },
        onEnd: () => {
          setIsRecording(false);
          if (!result && recognizedText) {
            evaluateShadowing(recognizedText);
          }
        },
      }
    );

    recognizerRef.current = recognizer;
    const started = recognizer.start();
    if (!started && !isSpeechRecognitionSupported()) {
      setIsSupported(false);
    }
  };

  const handleStopRecording = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
    }
    setIsRecording(false);
  };

  const evaluateShadowing = (text: string) => {
    if (!text.trim()) return;

    const evalResult = compareSpeech(exercise.transcript, text);
    setResult(evalResult);

    if (evalResult.similarity >= 80) {
      setMascotState('celebrating');
      sfx.playCorrect();
    } else if (evalResult.similarity >= 50) {
      setMascotState('speaking');
      sfx.playCorrect();
    } else {
      setMascotState('apologetic');
      sfx.playWrong();
    }

    onComplete(evalResult);
  };

  const handleRetry = () => {
    if (recognizerRef.current) {
      recognizerRef.current.abort();
    }
    setRecognizedText('');
    setResult(null);
    setErrorDetails(null);
    setMascotState('idle');
  };

  const isEvaluated = result !== null;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Native Audio Reference with Mascot Guide */}
      <div className="relative">
        <div className="absolute -top-12 right-4 z-20 pointer-events-none">
          <LingLingMascot state={mascotState} size={72} />
        </div>

        <AudioPlayer
          text={exercise.transcript}
          audioUrl={exercise.audioUrl}
          durationSeconds={exercise.durationSeconds}
          autoPlay={true}
        />
      </div>

      {/* Target Sentence Card */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <span>Câu mẫu cần nhại giọng (Target Speech)</span>
          </span>
          <span className="text-xs text-slate-400">Nghe kỹ ngữ điệu và phát âm lại</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/90 border border-teal-500/30 text-center space-y-2 shadow-inner">
          <p className="text-xl sm:text-2xl font-display font-extrabold text-white leading-relaxed tracking-wide">
            "{exercise.transcript}"
          </p>
          <p className="text-sm font-medium text-teal-300/90">
            🇻🇳 {exercise.translation}
          </p>
        </div>

        {/* Browser Unsupported or Permission Denied Alert */}
        {(!isSupported || (errorDetails && errorDetails.code === 'not-allowed')) && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-white">
                {!isSupported
                  ? 'Trình duyệt chưa hỗ trợ Web Speech API'
                  : 'Yêu cầu quyền truy cập Micro'}
              </p>
              <p className="text-slate-300">
                {errorDetails?.userActionablePrompt ||
                  'Để có trải nghiệm ghi âm tốt nhất, hãy sử dụng trình duyệt Google Chrome, Edge hoặc Safari và cho phép quyền truy cập Micro.'}
              </p>
            </div>
          </div>
        )}

        {/* Microphone Recording Action Station */}
        <div className="flex flex-col items-center justify-center py-4 space-y-3">
          <button
            type="button"
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={!isSupported}
            aria-label={isRecording ? 'Dừng ghi âm' : 'Bắt đầu ghi âm nhại giọng'}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all select-none shadow-2xl active:scale-95 ${
              isRecording
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/40 ring-4 ring-rose-500/30'
                : 'bg-gradient-to-tr from-amber-500 to-coral-500 hover:brightness-110 text-slate-950 shadow-amber-500/30 ring-4 ring-amber-500/20'
            }`}
          >
            {isRecording ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}

            {isRecording && !shouldReduceMotion && (
              <span className="absolute inset-0 rounded-full border-2 border-rose-400 animate-ping pointer-events-none" />
            )}
          </button>

          <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">
            {isRecording
              ? 'Đang lắng nghe bạn nói... (Chạm để dừng)'
              : isEvaluated
              ? 'Chạm micro để ghi âm lại'
              : 'Chạm micro để bắt đầu nhại giọng'}
          </span>
        </div>

        {/* Live Recognized Transcript Display */}
        {(recognizedText || isRecording) && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 shadow-inner">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Văn bản hệ thống nhận diện từ giọng của bạn:
            </span>
            <p className="text-base font-semibold text-amber-300 italic">
              "{recognizedText || 'Đang thu âm...'}"
            </p>
          </div>
        )}
      </div>

      {/* Transcript Match Evaluation Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl shadow-2xl space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display font-extrabold text-2xl shadow-lg ${
                  result.similarity >= 85
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                    : result.similarity >= 60
                    ? 'bg-amber-500 text-slate-950 shadow-amber-500/30'
                    : 'bg-rose-500 text-white shadow-rose-500/30'
                }`}
              >
                {result.similarity}%
              </div>

              <div>
                <span className="font-display font-extrabold text-lg text-white">
                  Độ khớp văn bản (Speech Match):{' '}
                  {result.matchRating === 'excellent'
                    ? 'Xuất sắc'
                    : result.matchRating === 'good'
                    ? 'Rất tốt'
                    : result.matchRating === 'fair'
                    ? 'Tạm ổn'
                    : 'Cần luyện thêm'}
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Điểm số so sánh mức độ trùng khớp giữa giọng nói thu được và câu mẫu.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>+{result.xpEarned} XP</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={handleRetry}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Ghi âm lại
            </Button>

            {hasNext && onNext && (
              <Button
                variant="primary"
                onClick={onNext}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Câu tiếp theo
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
