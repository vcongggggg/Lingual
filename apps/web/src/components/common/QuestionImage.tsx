'use client';

import React, { useState } from 'react';

export interface QuestionImageProps {
  imageRef?: string | null;
  alt?: string;
  className?: string;
}

export function QuestionImage({ imageRef, alt, className = '' }: QuestionImageProps) {
  const [loadError, setLoadError] = useState(false);

  if (!imageRef || typeof imageRef !== 'string' || !imageRef.trim()) {
    return null;
  }

  const cleanRef = imageRef.trim();
  const imageUrl = `/api/question-image?file=${encodeURIComponent(cleanRef)}`;
  const displayAlt = alt || `Hình ảnh câu hỏi: ${cleanRef}`;

  if (loadError) {
    return (
      <div
        data-testid="question-image-error"
        className={`p-3 rounded-xl border border-dashed border-red/40 bg-red/5 text-xs text-red font-medium flex items-center gap-2 ${className}`}
      >
        <span>⚠️ [Không thể tải hình ảnh minh họa câu hỏi: {cleanRef}]</span>
      </div>
    );
  }

  return (
    <div
      data-testid="question-image-container"
      className={`relative overflow-hidden rounded-xl border-2 border-ink/20 bg-paper-2 my-2.5 shadow-sm ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={displayAlt}
        onError={() => setLoadError(true)}
        className="w-full max-h-[450px] object-contain rounded-lg block mx-auto transition-opacity"
        loading="lazy"
      />
    </div>
  );
}

export default QuestionImage;
