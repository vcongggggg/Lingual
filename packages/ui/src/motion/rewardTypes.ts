/**
 * Lingual Cinematic Reward System — Semantic Reward Types & Intensity Levels
 */

export type RewardType =
  | 'lesson_complete'
  | 'daily_goal_complete'
  | 'streak_milestone'
  | 'achievement_unlock'
  | 'level_up';

export type RewardIntensity = 'MICRO' | 'NORMAL' | 'MAJOR' | 'EPIC';

export interface RewardEventPayload {
  id?: string;
  type: RewardType;
  title: string;
  subtitle?: string;
  xpAmount?: number;
  milestoneText?: string;
  icon?: string;
  intensity?: RewardIntensity;
}

export const REWARD_INTENSITY_MAP: Record<RewardType, RewardIntensity> = {
  lesson_complete: 'NORMAL',
  daily_goal_complete: 'MAJOR',
  streak_milestone: 'MAJOR',
  achievement_unlock: 'MAJOR',
  level_up: 'EPIC',
};

export const REWARD_PRIORITY_ORDER: Record<RewardIntensity, number> = {
  EPIC: 4,
  MAJOR: 3,
  NORMAL: 2,
  MICRO: 1,
};
