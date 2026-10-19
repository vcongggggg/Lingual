/**
 * Reading SRS Adapter
 * Connects reading vocabulary and comprehension outcomes with SM-2 Spaced Repetition and personal folders.
 */

import { mapReadingPerformanceToSRSQuality } from '@linguaflow/domain';
import { srsApi, vocabularyApi } from '@/lib/api';
import { ReadingWordDefinition } from './extractReadingVocabulary';

export async function addReadingWordToSRS(def: ReadingWordDefinition): Promise<boolean> {
  try {
    // 1. Add to Spaced Repetition queue
    await srsApi.addWord({
      targetText: def.word,
      translation: def.meaning,
      phonetic: def.phonetic,
      cefrLevel: def.cefrLevel,
      exampleSentence: def.example,
    });

    // 2. Save into personal vocabulary collection
    await vocabularyApi.saveWord({
      wordId: `vocab-${def.word.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      targetText: def.word,
      translation: def.meaning,
      phonetic: def.phonetic,
      cefrLevel: def.cefrLevel,
    });

    return true;
  } catch {
    return false;
  }
}

export function calculateReadingSrsQuality(
  isCorrect: boolean,
  responseTimeMs?: number,
  usedHint?: boolean
): number {
  return mapReadingPerformanceToSRSQuality(isCorrect, responseTimeMs, usedHint);
}
