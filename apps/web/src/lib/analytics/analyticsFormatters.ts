/**
 * Analytics formatters and display helpers
 */

import { LearningSkill, SkillTrend, ConsistencyLevel } from './analyticsTypes';

export function formatSkillName(skill: LearningSkill, locale: string = 'vi'): string {
  const isVi = locale === 'vi';
  switch (skill) {
    case 'listening':
      return isVi ? 'Luyện Nghe' : 'Listening';
    case 'speaking':
      return isVi ? 'Luyện Nói' : 'Speaking';
    case 'vocabulary':
      return isVi ? 'Từ Vựng' : 'Vocabulary';
    case 'writing':
      return isVi ? 'Luyện Viết' : 'Writing';
    case 'reading':
      return isVi ? 'Luyện Đọc' : 'Reading';
    case 'grammar':
      return isVi ? 'Ngữ Pháp' : 'Grammar';
    case 'exam':
      return isVi ? 'Thi Thử' : 'Exam Practice';
    case 'community':
      return isVi ? 'Cộng Đồng' : 'Community';
    default:
      return skill;
  }
}

export function formatTrendIcon(trend: SkillTrend): string {
  switch (trend) {
    case 'up':
      return '↑';
    case 'down':
      return '↓';
    case 'stable':
    default:
      return '→';
  }
}

export function formatConsistencyLabel(level: ConsistencyLevel, locale: string = 'vi'): string {
  const isVi = locale === 'vi';
  switch (level) {
    case 'highly_consistent':
      return isVi ? 'Rất Chăm Chỉ' : 'Highly Consistent';
    case 'consistent':
      return isVi ? 'Đều Đặn' : 'Consistent';
    case 'developing':
      return isVi ? 'Đang Hình Thành' : 'Developing';
    case 'inconsistent':
    default:
      return isVi ? 'Cần Cải Thiện' : 'Inconsistent';
  }
}

export function formatGoalTypeLabel(type: string, locale: string = 'vi'): string {
  const isVi = locale === 'vi';
  switch (type) {
    case 'daily_minutes':
      return isVi ? 'Phút học mỗi ngày' : 'Daily Study Minutes';
    case 'weekly_minutes':
      return isVi ? 'Phút học mỗi tuần' : 'Weekly Study Minutes';
    case 'weekly_xp':
      return isVi ? 'XP mỗi tuần' : 'Weekly XP';
    case 'vocabulary':
      return isVi ? 'Từ vựng cần học' : 'Vocabulary Words';
    case 'reading':
      return isVi ? 'Bài đọc hoàn thành' : 'Articles Read';
    case 'writing':
      return isVi ? 'Bài viết hoàn thành' : 'Writing Submissions';
    case 'listening':
      return isVi ? 'Bài nghe hoàn thành' : 'Listening Sessions';
    case 'exam':
      return isVi ? 'Đề thi thử' : 'Mock Exams';
    default:
      return type;
  }
}
