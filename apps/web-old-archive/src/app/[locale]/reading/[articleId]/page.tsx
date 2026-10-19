'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, BookOpen, Brain, Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { ReadingArticle } from '@linguaflow/domain';
import { MASTER_READING_ARTICLES } from '@/lib/reading/sampleData';
import { extractReadingVocabulary } from '@/lib/reading/extractReadingVocabulary';
import { saveLocalReadingProgress, getLocalReadingProgress } from '@/lib/reading/readingProgress';
import { readingApi } from '@/lib/api';
import ReadingToolbar from '@/components/reading/ReadingToolbar';
import ReadingText from '@/components/reading/ReadingText';
import ReadingVocabularyPanel from '@/components/reading/ReadingVocabularyPanel';
import { Badge, Button } from '@linguaflow/ui';

export default function ArticleReaderPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'vi';
  const articleId = params?.articleId as string;

  const [article, setArticle] = useState<ReadingArticle | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(1.0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(25);

  useEffect(() => {
    // 1. Find article from sample data or API
    const found = MASTER_READING_ARTICLES.find((a) => a.id === articleId) || MASTER_READING_ARTICLES[0];
    setArticle(found);

    // 2. Load previous reading progress
    const savedProgress = getLocalReadingProgress(articleId);
    if (savedProgress) {
      setProgressPercentage(savedProgress.scrollProgress || 25);
    }

    // 3. Track elapsed reading time
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [articleId]);

  // Audio Narration Handler (Web Speech API)
  const handleTogglePlayAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !article) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const fullText = article.paragraphs.map((p) => p.english).join(' ');
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.lang = 'en-US';
      utterance.rate = audioSpeed;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleChangeAudioSpeed = (speed: number) => {
    setAudioSpeed(speed);
    if (isPlayingAudio) {
      handleTogglePlayAudio();
    }
  };

  const handleStartPractice = () => {
    saveLocalReadingProgress({
      articleId,
      currentParagraph: 1,
      scrollProgress: 100,
      elapsedSeconds,
      completed: true,
      lastUpdatedAt: new Date().toISOString(),
    });

    router.push(`/${locale}/reading/${articleId}/practice?elapsed=${elapsedSeconds}`);
  };

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        <p>Đang tải bài đọc...</p>
      </div>
    );
  }

  const vocabularyList = extractReadingVocabulary(article);

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-4xl mx-auto space-y-8 pointer-events-auto">
      {/* Back Link & Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/${locale}/reading`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách bài đọc</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="teal" className="text-xs font-extrabold uppercase">
            {article.level}
          </Badge>
          <span className="text-xs font-semibold text-slate-400">{article.topic}</span>
        </div>
      </div>

      {/* Article Title & Subtitle */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white leading-tight">
          {article.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {article.subtitle}
        </p>

        <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
          <span>Tác giả: <strong className="text-slate-300">{article.author}</strong></span>
          <span>•</span>
          <span>Thời gian đọc: <strong className="text-amber-400">{article.estimatedMinutes} phút</strong></span>
          <span>•</span>
          <span>Độ dài: <strong className="text-teal-400">{article.wordCount} từ</strong></span>
        </div>
      </div>

      {/* Floating Sticky Reading Toolbar */}
      <ReadingToolbar
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        showTranslation={showTranslation}
        onToggleTranslation={() => setShowTranslation((prev) => !prev)}
        isPlayingAudio={isPlayingAudio}
        audioSpeed={audioSpeed}
        onTogglePlayAudio={handleTogglePlayAudio}
        onChangeAudioSpeed={handleChangeAudioSpeed}
        progressPercentage={progressPercentage}
      />

      {/* Article Paragraphs with Interactive Word Popover */}
      <ReadingText
        article={article}
        showTranslation={showTranslation}
        fontSize={fontSize}
      />

      {/* Vocabulary Panel (Key words in this article) */}
      <ReadingVocabularyPanel vocabulary={vocabularyList} />

      {/* CTA To Practice Reading Comprehension */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/30 backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-display font-bold text-xl text-white">
            Hoàn thành đọc bài?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Làm bài trắc nghiệm đọc hiểu ({article.questions?.length || 0} câu hỏi) để nhận XP và củng cố kiến thức!
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleStartPractice}
          icon={<ArrowRight className="w-4 h-4" />}
          className="shrink-0"
        >
          Luyện Đọc Hiểu Ngay
        </Button>
      </div>
    </main>
  );
}
