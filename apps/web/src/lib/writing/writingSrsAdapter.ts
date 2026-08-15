/**
 * Writing SRS Adapter
 * Integrates writing outcomes and upgraded vocabulary suggestions with existing SM-2 Spaced Repetition contracts.
 */

import { mapWritingPerformanceToSRSQuality, WritingVocabularySuggestion } from '@linguaflow/domain';
import { srsApi, vocabularyApi } from '@/lib/api';

export async function addWritingVocabularyToSRS(suggestion: WritingVocabularySuggestion): Promise<boolean> {
  try {
    // 1. Add to Spaced Repetition queue
    await srsApi.addWord({
      targetText: suggestion.word,
      translation: suggestion.meaning,
      cefrLevel: suggestion.difficulty,
      exampleSentence: `Key writing vocabulary: ${suggestion.word}`,
    });

    // 2. Save into personal vocabulary collection
    await vocabularyApi.saveWord({
      wordId: suggestion.vocabularyId || `vocab-${suggestion.word.toLowerCase()}`,
      targetText: suggestion.word,
      translation: suggestion.meaning,
      cefrLevel: suggestion.difficulty,
    });

    return true;
  } catch {
    return false;
  }
}

export function calculateWritingSrsQuality(score: number): number {
  return mapWritingPerformanceToSRSQuality(score);
}
