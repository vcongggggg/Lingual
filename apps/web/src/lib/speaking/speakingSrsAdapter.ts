/**
 * Speaking SRS & Personal Vocabulary Integration Adapter
 */

import { apiFetch } from '../api';

export const speakingSrsAdapter = {
  saveVocabularyToSRS: async (words: string[], attemptId?: string) => {
    if (!words || words.length === 0) return { success: false };

    try {
      if (attemptId) {
        await apiFetch(`/speaking/attempts/${attemptId}/srs`, {
          method: 'POST',
          body: JSON.stringify({ words }),
        });
      }

      // Save each word into personal vocabulary deck
      for (const w of words) {
        await apiFetch('/vocabulary/save', {
          method: 'POST',
          body: JSON.stringify({ word: w }),
        }).catch(() => {});
      }

      return { success: true, count: words.length };
    } catch {
      return { success: false };
    }
  },
};
