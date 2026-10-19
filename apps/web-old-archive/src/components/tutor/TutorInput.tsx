'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';

interface TutorInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  locale?: string;
  className?: string;
}

export default function TutorInput({
  onSend,
  disabled = false,
  locale = 'vi',
  className = '',
}: TutorInputProps) {
  const isVi = locale === 'vi';
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    sfx.playClick();
    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className={`relative p-3 rounded-3xl bg-slate-900/95 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-2 ${className}`}>
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={
            isVi
              ? 'Hỏi AI Tutor về ngữ pháp, bài tập, phát âm hoặc kế hoạch học tập hôm nay...'
              : 'Ask your AI Tutor about grammar, practice, pronunciation, or your daily plan...'
          }
          maxLength={2000}
          rows={1}
          disabled={disabled}
          className="w-full resize-none bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none max-h-[120px] font-sans"
        />

        <Button
          variant="primary"
          size="sm"
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          icon={<Send className="w-4 h-4" />}
          className="shrink-0 bg-gradient-to-r from-teal-500 to-indigo-600 font-bold"
        >
          {isVi ? 'Gửi' : 'Send'}
        </Button>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-500 px-2">
        <span>Nhấn Enter để gửi, Shift + Enter để xuống dòng</span>
        <span>{text.length} / 2000</span>
      </div>
    </div>
  );
}
