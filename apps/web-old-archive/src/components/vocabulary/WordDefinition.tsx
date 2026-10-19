'use client';

import React from 'react';
import { Lightbulb, BookMarked, Tag } from 'lucide-react';
import { VocabularyWord } from '@linguaflow/domain';

interface WordDefinitionProps {
  word: VocabularyWord;
  className?: string;
}

export default function WordDefinition({ word, className = '' }: WordDefinitionProps) {
  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
        <Lightbulb className="w-4 h-4" />
        <span>Định nghĩa & Nghĩa tiếng Việt</span>
      </div>

      <div className="space-y-3">
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-teal-500/20 shadow-inner">
          <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Nghĩa tiếng Việt</span>
          <p className="text-2xl sm:text-3xl font-display font-extrabold text-amber-300">
            {word.translation}
          </p>
        </div>

        {word.definitionEn && (
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-500 uppercase font-bold block mb-1">English Definition</span>
            <p className="text-sm font-medium text-slate-200 leading-relaxed">
              {word.definitionEn}
            </p>
          </div>
        )}
      </div>

      {/* Synonyms & Tags */}
      {(word.synonyms?.length || word.tags?.length) && (
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          {word.synonyms && word.synonyms.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-400">Đồng nghĩa:</span>
              {word.synonyms.map((syn, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold"
                >
                  {syn}
                </span>
              ))}
            </div>
          )}

          {word.tags && word.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap ml-auto">
              {word.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400 font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
