'use client';

import React, { useState } from 'react';
import { ReadingArticle } from '@linguaflow/domain';
import ReadingParagraph from './ReadingParagraph';
import ReadingWordPopover from './ReadingWordPopover';
import { lookupReadingWord, ReadingWordDefinition } from '@/lib/reading/extractReadingVocabulary';

interface ReadingTextProps {
  article: ReadingArticle;
  showTranslation: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
}

export default function ReadingText({
  article,
  showTranslation,
  fontSize,
}: ReadingTextProps) {
  const [activeDefinition, setActiveDefinition] = useState<ReadingWordDefinition | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | undefined>(undefined);

  const handleWordClick = (rawWord: string, rect: DOMRect) => {
    const def = lookupReadingWord(rawWord);
    setActiveDefinition(def);
    setPopoverPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left,
    });
  };

  return (
    <div className="space-y-6 relative">
      {/* Article Paragraphs */}
      <div className="space-y-4">
        {article.paragraphs.map((para) => (
          <ReadingParagraph
            key={para.id}
            paragraph={para}
            showTranslation={showTranslation}
            fontSize={fontSize}
            onWordClick={handleWordClick}
          />
        ))}
      </div>

      {/* Floating Interactive Word Popover */}
      {activeDefinition && (
        <ReadingWordPopover
          definition={activeDefinition}
          onClose={() => setActiveDefinition(null)}
          position={popoverPosition}
        />
      )}
    </div>
  );
}
