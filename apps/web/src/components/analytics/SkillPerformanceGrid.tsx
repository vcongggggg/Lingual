'use client';

import React from 'react';
import { SkillPerformance } from '@linguaflow/domain';
import SkillPerformanceCard from './SkillPerformanceCard';

interface SkillPerformanceGridProps {
  skills: SkillPerformance[];
  locale?: string;
  className?: string;
}

export default function SkillPerformanceGrid({
  skills,
  locale = 'vi',
  className = '',
}: SkillPerformanceGridProps) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 ${className}`}>
      {skills.map((skill) => (
        <SkillPerformanceCard key={skill.skill} performance={skill} locale={locale} />
      ))}
    </div>
  );
}
