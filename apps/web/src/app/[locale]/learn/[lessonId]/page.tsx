'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, ProgressBar, speakText, getWordImage, AudioButton, localShakeVariants, checkMarkPopVariants, canPlayFeedbackAudio, useMotionAccessibility, RewardOverlay, RewardEventPayload } from '@linguaflow/ui';
import { curriculumApi } from '../../../../lib/api';
import { sfx } from '@/lib/soundEffects';
import { ArrowLeft, CheckCircle2, XCircle, Sparkles, Trophy, Volume2, ArrowRight, BookOpen, Brain, Play } from 'lucide-react';
import MascotPopup from '@/components/MascotPopup';
import { MascotReactionKey } from '@linguaflow/config';

export default function LessonQuizPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const lessonId = (params?.lessonId as string) || '1';
  const router = useRouter();

  const [attemptId, setAttemptId] = useState<string>('');
  const [lesson, setLesson] = useState<any>(null);
  const [mode, setMode] = useState<'intro' | 'quiz'>('intro');
  const [vocabIndex, setVocabIndex] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ exerciseId: string; userAnswer: string }[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [scrambleTokens, setScrambleTokens] = useState<string[]>([]);
  const [typingInput, setTypingInput] = useState<string>('');
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [activeReward, setActiveReward] = useState<RewardEventPayload | null>(null);
  const [popupState, setPopupState] = useState<{ show: boolean; key: MascotReactionKey; title?: string; msg?: string }>({
    show: false,
    key: 'greet',
  });


  useEffect(() => {
    const init = async () => {
      try {
        const [attemptData, lessonData] = await Promise.allSettled([
          curriculumApi.startAttempt('lesson', lessonId),
          curriculumApi.getLesson(lessonId),
        ]);

        if (attemptData.status === 'fulfilled' && attemptData.value?.attemptId) {
          setAttemptId(attemptData.value.attemptId);
        } else {
          setAttemptId(`att-fallback-${Date.now()}`);
        }

        if (lessonData.status === 'fulfilled' && lessonData.value?.lesson) {
          setLesson(lessonData.value.lesson);
        }
      } catch {
        setAttemptId(`att-fallback-${Date.now()}`);
      }
    };

    init();
  }, [lessonId]);

  const currentEx = lesson?.exercises?.[currentIndex];
  const words = lesson?.words || [];
  const currentWord = words[vocabIndex];

  const handleCheckAnswer = () => {
    if (!currentEx) return;

    let answer = selectedOption;
    if (currentEx.type === 'scramble') {
      answer = scrambleTokens.join(' ');
    } else if (currentEx.type === 'typing') {
      answer = typingInput;
    }

    const correct = answer.trim().toLowerCase() === currentEx.correctAnswer.trim().toLowerCase();
    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (canPlayFeedbackAudio()) {
      if (correct) {
        sfx.playCorrect();
      } else {
        sfx.playWrong();
      }
    }

    if (correct) {
      setConsecutiveWrong(0);
      setPopupState({
        show: true,
        key: 'greet',
        title: 'Chính xác rồi! 🎉',
        msg: 'Bò LingLing tặng bạn 1 tim ủng hộ!',
      });
    } else {
      const newWrongCount = consecutiveWrong + 1;
      setConsecutiveWrong(newWrongCount);
      if (newWrongCount >= 2) {
        setPopupState({
          show: true,
          key: 'wrong_severe',
          title: 'Tiếc quá! 😭',
          msg: 'Cố gắng lên nhé, coi chừng mất streak đó!',
        });
      } else {
        setPopupState({
          show: true,
          key: 'wrong_mild',
          title: 'Chưa đúng rồi... 🥺',
          msg: 'Xem kỹ đáp án và thử lại câu sau nhé!',
        });
      }
    }

    // Auto play pronunciation on check
    speakText(currentEx.correctAnswer);

    setUserAnswers((prev) => [...prev, { exerciseId: currentEx.id || `ex-${currentIndex}`, userAnswer: answer }]);
  };

  const handleNextQuestion = async () => {
    setIsAnswerChecked(false);
    setSelectedOption('');
    setScrambleTokens([]);
    setTypingInput('');

    if (currentIndex + 1 < (lesson?.exercises?.length || 0)) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Submit attempt results to API
      try {
        const data = await curriculumApi.submitLesson(lessonId, { attemptId, answers: userAnswers });
        setResultData(data);

        window.dispatchEvent(
          new CustomEvent('linguaflow_xp_update', {
            detail: { totalXP: data.totalXP, streakDays: data.streakDays },
          })
        );
      } catch {}

      setIsFinished(true);

      if (canPlayFeedbackAudio()) {
        sfx.playVictory();
      }

      setActiveReward({
        type: 'lesson_complete',
        intensity: 'NORMAL',
        title: 'Hoàn Thành Bài Học! 🎉',
        subtitle: `Bạn đã xuất sắc vượt qua bài học ${lesson?.title || ''}`,
        xpAmount: 50,
        icon: '🎓',
      });
    }
  };

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-10 h-10 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-semibold text-sm">Đang tải nội dung bài học...</p>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // MODE 1: VOCABULARY INTRO SLIDES BEFORE QUIZ
  // --------------------------------------------------------------------------
  if (mode === 'intro' && words.length > 0) {
    const img = getWordImage(currentWord?.targetText, currentWord?.imageUrl);

    return (
      <div className="max-w-xl mx-auto py-6 space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link href={`/${locale}/dashboard`}>
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Thoát
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-400" />
            <span className="font-display font-bold text-sm text-white">Học Từ Vựng Mới</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {vocabIndex + 1} / {words.length}
          </span>
        </div>

        {/* Vocabulary Intro Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={vocabIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card glow="teal" className="p-6 space-y-6 text-center">
              {/* Illustration Image */}
              <div className="relative w-48 h-48 rounded-3xl overflow-hidden border-2 border-teal-500/20 mx-auto shadow-xl bg-slate-950">
                <img src={img} alt={currentWord?.targetText} className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 border border-teal-500/30 text-[10px] font-extrabold text-teal-300 uppercase">
                  {currentWord?.cefrLevel || 'A1'}
                </span>
              </div>

              {/* Word Title & Audio */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
                    {currentWord?.targetText}
                  </h2>
                  <AudioButton text={currentWord?.targetText} className="p-2.5" />
                </div>
                {currentWord?.phonetic && (
                  <p className="text-xs font-mono text-teal-400 bg-teal-500/10 px-3 py-1 rounded-lg inline-block border border-teal-500/20">
                    {currentWord.phonetic}
                  </p>
                )}
                <p className="text-2xl font-bold text-amber-300">{currentWord?.translation}</p>
              </div>

              {/* Example Sentence */}
              {currentWord?.exampleSentence && (
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-left text-xs space-y-1">
                  <p className="text-slate-100 font-semibold">🇬🇧 "{currentWord.exampleSentence}"</p>
                  {currentWord?.exampleTranslation && (
                    <p className="text-amber-400 font-medium">🇻🇳 ({currentWord.exampleTranslation})</p>
                  )}
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex justify-between items-center pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={vocabIndex === 0}
                  onClick={() => setVocabIndex((prev) => prev - 1)}
                >
                  Từ trước
                </Button>

                {vocabIndex + 1 < words.length ? (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => {
                      setVocabIndex((prev) => prev + 1);
                      speakText(words[vocabIndex + 1]?.targetText);
                    }}
                  >
                    Từ tiếp theo
                  </Button>
                ) : (
                  <Button
                    variant="accent"
                    size="md"
                    icon={<Play className="w-4 h-4 fill-slate-950" />}
                    onClick={() => setMode('quiz')}
                  >
                    Làm Bài Tập Ngay
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // MODE 2: INTERACTIVE QUIZ EXERCISES
  // --------------------------------------------------------------------------
  if (!currentEx) return null;
  const options = JSON.parse(currentEx.optionsJson || '[]');

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-8">
      {/* Top Bar Progress */}
      <div className="flex items-center justify-between gap-4">
        <Link href={`/${locale}/dashboard`}>
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Thoát
          </Button>
        </Link>
        <div className="flex-1 max-w-xs">
          <ProgressBar value={currentIndex + 1} max={lesson.exercises.length} color="teal" />
        </div>
        <span className="text-xs font-mono text-slate-400">
          {currentIndex + 1} / {lesson.exercises.length}
        </span>
      </div>

      {!isFinished ? (
        <Card className={`space-y-6 transition-colors duration-300 ${
          isAnswerChecked
            ? isCorrect
              ? 'border-emerald-500/50 bg-emerald-950/20'
              : 'border-rose-500/50 bg-rose-950/20'
            : ''
        }`}>
          {/* Question Prompt */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400">
              {lesson.title}
            </span>
            <h2 className="text-2xl font-display font-bold text-white">{currentEx.prompt}</h2>
          </div>

          {/* Exercise Types */}
          {currentEx.type === 'multiple_choice' || currentEx.type === 'fill_blank' ? (
            <div className="space-y-3">
              {options.map((opt: string, idx: number) => {
                const isSelected = selectedOption === opt;
                const isThisCorrect = opt.trim().toLowerCase() === currentEx.correctAnswer.trim().toLowerCase();

                let cardStyle = 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10';
                if (isAnswerChecked) {
                  if (isThisCorrect) cardStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/10';
                  else if (isSelected && !isCorrect) cardStyle = 'bg-rose-500/20 border-rose-400 text-rose-300';
                } else if (isSelected) {
                  cardStyle = 'bg-teal-500/20 border-teal-400 text-white shadow-lg shadow-teal-500/10';
                }

                return (
                  <div
                    key={idx}
                    onClick={() => !isAnswerChecked && setSelectedOption(opt)}
                    className={`p-4 rounded-2xl border font-semibold cursor-pointer transition-all ${cardStyle}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{opt}</span>
                      {isAnswerChecked && isThisCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      {isAnswerChecked && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : currentEx.type === 'scramble' ? (
            <div className="space-y-4">
              {/* Selected Tokens Pool */}
              <div className="min-h-16 p-4 rounded-2xl bg-slate-950 border border-dashed border-teal-500/40 flex flex-wrap gap-2">
                {scrambleTokens.map((tok, idx) => (
                  <button
                    key={idx}
                    onClick={() => setScrambleTokens(scrambleTokens.filter((_, i) => i !== idx))}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-sm shadow-md active:scale-95"
                  >
                    {tok}
                  </button>
                ))}
              </div>
              {/* Options Tokens Pool */}
              <div className="flex flex-wrap gap-2">
                {options.map((tok: string, idx: number) => {
                  const countInSelected = scrambleTokens.filter((t) => t === tok).length;
                  const countInOptions = options.filter((t: string) => t === tok).length;
                  const isUsed = countInSelected >= countInOptions;

                  return (
                    <button
                      key={idx}
                      disabled={isUsed}
                      onClick={() => setScrambleTokens([...scrambleTokens, tok])}
                      className={`px-3.5 py-2 rounded-xl font-bold text-sm border transition-all ${
                        isUsed
                          ? 'bg-slate-900 border-slate-800 text-slate-600 opacity-40'
                          : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200 active:scale-95'
                      }`}
                    >
                      {tok}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <input
              type="text"
              value={typingInput}
              onChange={(e) => setTypingInput(e.target.value)}
              placeholder="Nhập câu trả lời tiếng Anh..."
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white font-medium focus:border-teal-500 outline-none"
            />
          )}

          {/* Action Check Button */}
          {!isAnswerChecked ? (
            <Button
              variant="accent"
              size="lg"
              className="w-full"
              onClick={handleCheckAnswer}
            >
              Kiểm Tra Đáp Án
            </Button>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border space-y-3 ${
                  isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-base">
                  <div className="flex items-center gap-2">
                    {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />}
                    <span>{isCorrect ? 'Chính xác! Xuất sắc lắm!' : 'Chưa chính xác!'}</span>
                  </div>
                  <AudioButton text={currentEx.correctAnswer} />
                </div>
                {!isCorrect && (
                  <p className="text-xs text-slate-300">
                    Đáp án đúng: <strong className="text-emerald-400 font-bold">{currentEx.correctAnswer}</strong>
                  </p>
                )}
                {currentEx.explanation && (
                  <p className="text-xs text-slate-300">{currentEx.explanation}</p>
                )}
                <Button
                  variant={isCorrect ? 'primary' : 'secondary'}
                  size="lg"
                  className="w-full mt-2"
                  icon={<ArrowRight className="w-4 h-4" />}
                  onClick={handleNextQuestion}
                >
                  Tiếp Tục
                </Button>
              </motion.div>
            </AnimatePresence>
          )}
        </Card>
      ) : (
        /* LESSON FINISHED CELEBRATION */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md mx-auto rounded-3xl bg-slate-900 border border-amber-500/40 p-8 text-center space-y-6 shadow-2xl shadow-amber-500/20"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-coral-500 to-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
            <Trophy className="w-10 h-10 text-slate-950" />
          </div>
          <h2 className="text-3xl font-display font-extrabold text-white">Bài Học Hoàn Thành!</h2>
          <p className="text-sm text-slate-300">
            Kết quả: <strong className="text-amber-400">{resultData?.score || lesson.exercises.length}</strong> / {lesson.exercises.length} câu đúng
          </p>
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 inline-flex items-center gap-2 text-amber-400 font-extrabold text-lg">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>+{resultData?.xpEarned || lesson.xpReward} XP Đã Nhận</span>
          </div>
          <Link href={`/${locale}/dashboard`} className="block">
            <Button variant="accent" size="lg" className="w-full">
              Trở Về Lộ Trình Học
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Mascot Corner Popup Reaction */}
      <MascotPopup
        isVisible={popupState.show}
        reactionKey={popupState.key}
        title={popupState.title}
        message={popupState.msg}
        autoDismissMs={3500}
        onClose={() => setPopupState((prev) => ({ ...prev, show: false }))}
      />

      {/* Cinematic Reward Overlay */}
      <RewardOverlay event={activeReward} onDismiss={() => setActiveReward(null)} />
    </div>
  );
}

