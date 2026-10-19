/**
 * Reading Progress Tracker with Local Storage Persistence and Throttle
 */

export interface ReadingProgressState {
  articleId: string;
  currentParagraph: number;
  scrollProgress: number; // 0 - 100
  elapsedSeconds: number;
  completed: boolean;
  lastUpdatedAt: string;
}

const STORAGE_PREFIX = 'linguaflow_reading_progress_';

export function saveLocalReadingProgress(state: ReadingProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${state.articleId}`, JSON.stringify(state));
  } catch {}
}

export function getLocalReadingProgress(articleId: string): ReadingProgressState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${articleId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
