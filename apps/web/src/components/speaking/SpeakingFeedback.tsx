'use client';

import React from 'react';
import { SpeakingFeedback as ISpeakingFeedback } from '@linguaflow/domain';
import { Award, Sparkles, Activity, BookOpen, PenTool, Compass, MessageSquare } from 'lucide-react';
import PronunciationScore from './PronunciationScore';
import FluencyScore from './FluencyScore';
import SpeakingCorrections from './SpeakingCorrections';
import SpeakingPronunciationIssues from './SpeakingPronunciationIssues';
import SpeakingVocabularySuggestions from './SpeakingVocabularySuggestions';
import PhonemeColorVisualizer from './PhonemeColorVisualizer';
import { ProgressBar, Badge } from '@linguaflow/ui';

interface SpeakingFeedbackProps {
  feedback: ISpeakingFeedback;
  wpm?: number;
  onSaveToSRS?: (word: string) => void;
  savedWords?: string[];
  locale?: string;
  className?: string;
}

export default function SpeakingFeedback({
  feedback,
  wpm = 110,
  onSaveToSRS,
  savedWords = [],
  locale = 'vi',
  className = '',
}: SpeakingFeedbackProps) {
  const isVi = locale === 'vi';

  return (
    <div className={`p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-extrabold text-xl text-white">
                {feedback.overallScore} <span className="text-xs font-mono text-slate-400">/ 100 Điểm</span>
              </h3>
              <Badge variant="teal" className="text-xs uppercase font-bold">
                {feedback.grade}
              </Badge>
            </div>
            <span className="text-xs text-slate-400">
              {isVi ? 'Đánh giá năng lực nói toàn diện' : 'Comprehensive Speaking Evaluation'}
            </span>
          </div>
        </div>
      </div>

      {/* Component Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PronunciationScore score={feedback.pronunciationScore} locale={locale} />
        <FluencyScore score={feedback.fluencyScore} wpm={wpm} locale={locale} />
      </div>

      {/* Phoneme Color Visualizer */}
      <PhonemeColorVisualizer
        sentence={feedback.corrections?.[0]?.original || 'Good morning! How are you doing today?'}
        locale={locale}
      />

      {/* Grammar, Vocabulary, Coherence Mini-bars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <PenTool className="w-3.5 h-3.5 text-purple-400" />
              <span>{isVi ? 'Ngữ pháp (20%)' : 'Grammar (20%)'}</span>
            </span>
            <span className="font-mono font-bold text-white">{feedback.grammarScore}%</span>
          </div>
          <ProgressBar value={feedback.grammarScore} max={100} color="teal" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>{isVi ? 'Từ vựng (15%)' : 'Vocabulary (15%)'}</span>
            </span>
            <span className="font-mono font-bold text-white">{feedback.vocabularyScore}%</span>
          </div>
          <ProgressBar value={feedback.vocabularyScore} max={100} color="teal" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isVi ? 'Mạch lạc (10%)' : 'Coherence (10%)'}</span>
            </span>
            <span className="font-mono font-bold text-white">{feedback.coherenceScore}%</span>
          </div>
          <ProgressBar value={feedback.coherenceScore} max={100} color="teal" />
        </div>
      </div>

      {/* Advice Banner */}
      {feedback.advice && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/40 via-slate-950 to-indigo-950/40 border border-teal-500/30 text-xs text-teal-200 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-sans">{feedback.advice}</p>
        </div>
      )}

      {/* Detailed Diagnostics Lists */}
      {feedback.corrections && feedback.corrections.length > 0 && (
        <SpeakingCorrections corrections={feedback.corrections} locale={locale} />
      )}

      {feedback.pronunciationIssues && feedback.pronunciationIssues.length > 0 && (
        <SpeakingPronunciationIssues issues={feedback.pronunciationIssues} locale={locale} />
      )}

      {feedback.vocabularySuggestions && feedback.vocabularySuggestions.length > 0 && (
        <SpeakingVocabularySuggestions
          suggestions={feedback.vocabularySuggestions}
          onSaveToSRS={onSaveToSRS}
          savedWords={savedWords}
          locale={locale}
        />
      )}
    </div>
  );
}
