'use client';

import React from 'react';

interface ReadingFiltersProps {
  selectedLevel: string;
  onSelectLevel: (level: string) => void;
  selectedTopic: string;
  onSelectTopic: (topic: string) => void;
}

const CEFR_LEVELS = ['all', 'A1', 'A2', 'B1', 'B2', 'C1'];
const TOPICS = [
  { id: 'all', label: 'Tất cả chủ đề' },
  { id: 'Daily Life', label: 'Đời sống' },
  { id: 'Travel', label: 'Du lịch' },
  { id: 'Technology', label: 'Công nghệ' },
  { id: 'Education', label: 'Giáo dục' },
  { id: 'Environment', label: 'Môi trường' },
  { id: 'Health', label: 'Sức khỏe' },
  { id: 'Science', label: 'Khoa học' },
  { id: 'Work', label: 'Công việc' },
  { id: 'Culture', label: 'Văn hóa' },
];

export default function ReadingFilters({
  selectedLevel,
  onSelectLevel,
  selectedTopic,
  onSelectTopic,
}: ReadingFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Level Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Cấp độ CEFR:
        </span>
        {CEFR_LEVELS.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onSelectLevel(level)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 border ${
              selectedLevel === level
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            {level === 'all' ? 'Tất cả' : level}
          </button>
        ))}
      </div>

      {/* Topic Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Chủ đề:
        </span>
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => onSelectTopic(topic.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 border ${
              selectedTopic === topic.id
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border-slate-850'
            }`}
          >
            {topic.label}
          </button>
        ))}
      </div>
    </div>
  );
}
