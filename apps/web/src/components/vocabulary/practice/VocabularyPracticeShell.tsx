'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, ArrowRight, RotateCcw } from 'lucide-react';
import {
  VocabularyPracticeQuestion,
  VocabularyPracticeAnswer,
  VocabularyPracticeResult as IVocabularyPracticeResult,
} from '@linguaflow/domain';
import { vocabularyApi } from '@/lib/api';
import { sfx } from '@/lib/soundEffects';
import MeaningChoicePractice from './MeaningChoicePractice';
import ClozePractice from './ClozePractice';
import ListeningSpellingPractice from './ListeningSpellingPractice';
import RecognitionPractice from './RecognitionPractice';
import VocabularyPracticeResult from './VocabularyPracticeResult';
import LingLingMascot, { MascotState } from '../../LingLingMascot';
import { ProgressBar, Button } from '@linguaflow/ui';

interface VocabularyPracticeShellProps {
  folderId?: string;
  word?: string;
  limit?: number;
  locale: string;
}

export default function VocabularyPracticeShell({
  folderId,
  word,
  limit = 10,
  locale,
}: VocabularyPracticeShellProps) {
  const [questions, setQuestions] = useState<VocabularyPracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<VocabularyPracticeAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<IVocabularyPracticeResult | null>(null);
  const [mascotState, setMascotState] = useState<MascotState>('idle');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [answeredCurrent, setAnsweredCurrent] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [folderId, word, limit]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await vocabularyApi.getPractice({ folderId, limit });
      if (data?.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        // Fallback default questions if API is initializing
        setQuestions([
          {
            id: 'q-demo-1',
            wordId: 'vocab-hello',
            mode: 'meaning_choice',
            prompt: 'Nghĩa tiếng Việt của từ "Hello" là gì?',
            targetWord: 'Hello',
            options: ['Xin chào', 'Tạm biệt', 'Cảm ơn', 'Chào buổi sáng'],
            correctAnswer: 'Xin chào',
            cefrLevel: 'A1',
          },
          {
            id: 'q-demo-2',
            wordId: 'vocab-travel',
            mode: 'cloze',
            prompt: 'Chọn từ thích hợp điền vào chỗ trống:',
            clozeSentence: 'I usually _____ to work by bus.',
            targetWord: 'travel',
            options: ['travel', 'student', 'coffee', 'hospital'],
            correctAnswer: 'travel',
            cefrLevel: 'A2',
          },
          {
            id: 'q-demo-3',
            wordId: 'vocab-coffee',
            mode: 'listening_spelling',
            prompt: 'Nghe phát âm và gõ lại từ vựng:',
            subPrompt: 'Gợi ý: Cà phê',
            targetWord: 'coffee',
            correctAnswer: 'coffee',
            cefrLevel: 'A1',
          },
        ]);
      }
      setCurrentIndex(0);
      setAnswers([]);
      setResult(null);
      setAnsweredCurrent(false);
      setStartTime(Date.now());
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (userAnswer: string) => {
    if (answeredCurrent || !questions[currentIndex]) return;
    setAnsweredCurrent(true);

    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const currentQ = questions[currentIndex];
    const isCorrect = userAnswer.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

    if (isCorrect) {
      setMascotState('celebrating');
      sfx.playCorrect();
    } else {
      setMascotState('apologetic');
      sfx.playWrong();
    }

    const newAnswer: VocabularyPracticeAnswer = {
      questionId: currentQ.id,
      wordId: currentQ.wordId,
      userAnswer,
      isCorrect,
      responseTimeSeconds: elapsedSeconds,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    // Auto advance or show Next button
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setAnsweredCurrent(false);
        setMascotState('thinking');
        setStartTime(Date.now());
      } else {
        handleFinishPractice(updatedAnswers);
      }
    }, 1200);
  };

  const handleFinishPractice = async (allAnswers: VocabularyPracticeAnswer[]) => {
    setSubmitting(true);
    try {
      const res = await vocabularyApi.submitPractice({
        questions,
        answers: allAnswers,
      });
      if (res?.result) {
        setResult(res.result);
      }
    } catch {
      // Local fallback calculation if backend request fails
      const correct = allAnswers.filter((a) => a.isCorrect).length;
      setResult({
        totalQuestions: questions.length,
        correctCount: correct,
        incorrectCount: questions.length - correct,
        accuracy: Math.round((correct / questions.length) * 100),
        score: correct * 20,
        xpEarned: correct * 5 + 10,
        evaluatedQuestions: [],
        missedWords: [],
        masteredWords: [],
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-teal-400 border-t-transparent animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-400">Đang khởi tạo bài luyện tập từ vựng...</p>
      </div>
    );
  }

  if (result) {
    return (
      <VocabularyPracticeResult
        result={result}
        onRetry={loadQuestions}
        locale={locale}
      />
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Progress & Header Bar with Mascot Guide */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-lg bg-teal-500/15 text-teal-300 border border-teal-500/30">
              {currentQuestion.cefrLevel || 'A1'}
            </span>
            <span className="text-xs font-bold text-slate-300">
              Luyện từ vựng đa phương thức
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 font-mono">
              Câu <strong className="text-white text-sm">{currentIndex + 1}</strong> / {questions.length}
            </span>
            <LingLingMascot state={mascotState} size={40} />
          </div>
        </div>

        <ProgressBar value={currentIndex + 1} max={questions.length} color="teal" />
      </div>

      {/* Dynamic Question Renderer by Mode */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
        {currentQuestion.mode === 'meaning_choice' && (
          <MeaningChoicePractice
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={answeredCurrent || submitting}
          />
        )}

        {currentQuestion.mode === 'cloze' && (
          <ClozePractice
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={answeredCurrent || submitting}
          />
        )}

        {currentQuestion.mode === 'listening_spelling' && (
          <ListeningSpellingPractice
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={answeredCurrent || submitting}
          />
        )}

        {currentQuestion.mode === 'recognition' && (
          <RecognitionPractice
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={answeredCurrent || submitting}
          />
        )}
      </div>
    </div>
  );
}
