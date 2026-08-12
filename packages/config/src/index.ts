/**
 * LinguaFlow Configuration Package
 * Feature flags, supported language pairs, locale defaults, and CEFR levels.
 */

export const SUPPORTED_LOCALES = ['vi', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = 'vi';

export const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh';

export interface LanguagePair {
  id: string;
  sourceLanguageCode: string;
  targetLanguageCode: string;
  title: string;
  enabled: boolean;
}

export const LANGUAGE_PAIRS: LanguagePair[] = [
  {
    id: 'vi-en',
    sourceLanguageCode: 'vi',
    targetLanguageCode: 'en',
    title: 'Tiếng Việt → Tiếng Anh',
    enabled: true,
  },
  {
    id: 'vi-ja',
    sourceLanguageCode: 'vi',
    targetLanguageCode: 'ja',
    title: 'Tiếng Việt → Tiếng Nhật',
    enabled: false, // Future phase
  },
];

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export type CEFRLevel = (typeof CEFR_LEVELS)[number];

export const FEATURE_FLAGS = {
  STREAK_FREEZE_ENABLED: true,
  AI_EXPLAINER_ENABLED: true,
  ANTI_CHEAT_ENABLED: true,
  OFFLINE_PWA_ENABLED: false,
};
