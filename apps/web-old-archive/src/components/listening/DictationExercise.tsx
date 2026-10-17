'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, RotateCcw, ArrowRight, Sparkles, PlusCircle, Check, Eye } from 'lucide-react';
import { ListeningExercise, DictationResult } from '@linguaflow/domain';
import { compareDictation } from '@/lib/listening/compareDictation';
import { sfx } from '@/lib/soundEffects';
import AudioPlayer from './AudioPlayer';
import DictationFeedback from './DictationFeedback';
import LingLingMascot, { MascotState } from '../LingLingMascot';
import { Button, Card, useMotionAccessibility } from '@linguaflow/ui';

interface DictationExerciseProps {
  exercise: ListeningExercise;
  onComplete: (result: DictationResult) => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export type DictationState =
  | 'IDLE'
  | 'PLAYING'
  | 'READY'
  | 'CHECKING'
  | 'CORRECT'
  | 'PARTIAL'
  | 'INCORRECT'
  | 'COMPLETED';

export default function DictationExercise({
  exercise,
  onComplete,
  onNext,
  hasNext = false,
}: DictationExerciseProps) {
  const { shouldReduceMotion } = useMotionAccessibility();

  const [inputVal, setInputVal] = useState('');
  const [exerciseState, setExerciseState] = useState<DictationState>('READY');
  const [result, setResult] = useState<DictationResult | null>(null);
  const [mascotState, setMascotState] = useState<MascotState>('idle');
  const [addedWords, setAddedWords] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Reset state when exercise changes
  useEffect(() => {
    setInputVal('');
    setExerciseState('READY');
    setResult(null);
    setMascotState('idle');
    setAddedWords({});
    setShowHint(false);

    // Auto-focus input on desktop
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
    return () => clearTimeout(timer);
  }, [exercise.id]);

  const handleAudioPlayState = (isPlaying: boolean) => {
    if (isPlaying) {
      setMascotState('speaking');
    } else {
      if (exerciseState === 'READY' || exerciseState === 'PLAYING') {
        setMascotState('thinking');
      }
    }
  };

  const handleCheck = () => {
    if (!inputVal.trim() || exerciseState === 'CHECKING') return;

    setExerciseState('CHECKING');
    setMascotState('thinking');

    const evalResult = compareDictation(exercise.transcript, inputVal);
    setResult(evalResult);

    if (evalResult.accuracy >= 80) {
      setExerciseState('CORRECT');
      setMascotState('celebrating');
      sfx.playCorrect();
    } else if (evalResult.accuracy >= 50) {
      setExerciseState('PARTIAL');
      setMascotState('speaking');
      sfx.playCorrect();
    } else {
      setExerciseState('INCORRECT');
      setMascotState('apologetic');
      sfx.playWrong();
    }

    onComplete(evalResult);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCheck();
    }
  };

  const handleRetry = () => {
    setInputVal('');
    setResult(null);
    setExerciseState('READY');
    setMascotState('thinking');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleAddToSRS = async (vocab: { targetText: string; translation: string; phonetic?: string }) => {
    try {
      setAddedWords((prev) => ({ ...prev, [vocab.targetText]: true }));
      await fetch('/api/v1/srs/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetText: vocab.targetText,
          translation: vocab.translation,
          phonetic: vocab.phonetic,
          exampleSentence: exercise.transcript,
          cefrLevel: exercise.difficulty,
        }),
      });
    } catch {}
  };

  const isEvaluated = result !== null;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Studio Audio Player Section with Mascot Guide */}
      <div className="relative">
        <div className="absolute -top-12 right-4 z-20 pointer-events-none">
          <LingLingMascot state={mascotState} size={72} />
        </div>

        <AudioPlayer
          text={exercise.transcript}
          audioUrl={exercise.audioUrl}
          durationSeconds={exercise.durationSeconds}
          onPlayStateChange={handleAudioPlayState}
          autoPlay={true}
        />
      </div>

      {/* Dictation Input Arena */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-5 sm:p-7 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="dictation-input" className="font-display font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
            <span>Bạn vừa nghe thấy gì?</span>
            <span className="text-xs font-normal text-slate-400 hidden sm:inline">(Gõ bằng tiếng Anh)</span>
          </label>

          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1.5 p-1 rounded-lg hover:bg-teal-500/10"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showHint ? 'Ẩn bản dịch' : 'Gợi ý nghĩa tiếng Việt'}</span>
          </button>
        </div>

        {showHint && (
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 font-medium">
            🇻🇳 Gợi ý dịch: "{exercise.translation}"
          </div>
        )}

        <div className="relative">
          <textarea
            id="dictation-input"
            ref={inputRef}
            rows={3}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isEvaluated}
            placeholder="Nhập chính xác từng từ bạn nghe được... (Nhấn Enter để kiểm tra)"
            className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-white font-medium text-base sm:text-lg focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all placeholder:text-slate-600 disabled:opacity-75 resize-none shadow-inner"
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500 hidden sm:block">
            Mẹo: Nhấn phím <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">Enter</kbd> để nộp bài
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            {isEvaluated ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  icon={<RotateCcw className="w-4 h-4" />}
                >
                  Thử lại câu này
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
              </>
            ) : (
              <Button
                variant="primary"
                onClick={handleCheck}
                disabled={!inputVal.trim()}
                icon={<Send className="w-4 h-4" />}
              >
                Kiểm tra kết quả
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Visual Diff Feedback */}
      {result && (
        <DictationFeedback
          result={result}
          expectedTranscript={exercise.transcript}
          vietnameseTranslation={exercise.translation}
        />
      )}

      {/* Target Vocabulary SRS Quick Integration */}
      {isEvaluated && exercise.vocabulary && exercise.vocabulary.length > 0 && (
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Từ vựng trọng tâm trong câu</span>
            </h4>
            <span className="text-xs text-slate-500">Lưu vào thẻ nhớ Spaced Repetition (SRS)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {exercise.vocabulary.map((vocab, idx) => {
              const isAdded = Boolean(addedWords[vocab.targetText]);

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{vocab.targetText}</span>
                      {vocab.phonetic && (
                        <span className="text-xs text-teal-400 font-mono">{vocab.phonetic}</span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{vocab.translation}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToSRS(vocab)}
                    disabled={isAdded}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isAdded
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : 'bg-slate-800 hover:bg-teal-500/20 hover:text-teal-300 border border-slate-700 text-slate-300'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-teal-400" />
                        <span>Đã lưu SRS</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Lưu SRS</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
