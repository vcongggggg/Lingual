/**
 * Vocabulary Search & Filter Utilities
 */

import {
  searchVocabularyWords as domainSearchVocabularyWords,
  VocabularyWord,
} from '@linguaflow/domain';

export type { VocabularyWord };

export interface VocabularySearchFilters {
  cefrLevel?: string;
  category?: string;
  partOfSpeech?: string;
}

export function searchVocabulary(
  words: VocabularyWord[],
  query: string = '',
  filters?: VocabularySearchFilters
): VocabularyWord[] {
  return domainSearchVocabularyWords(words, query, filters);
}
