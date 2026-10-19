/**
 * Speech Similarity Matcher for LinguaFlow Shadowing Lab
 * Calculates deterministic "Transcript Match" score without claiming phoneme-level AI pronunciation analysis.
 */

import {
  calculateSpeechSimilarity as domainCalculateSpeechSimilarity,
  ShadowingResult,
} from '@linguaflow/domain';

export type { ShadowingResult };

export function compareSpeech(transcript: string, recognizedText: string): ShadowingResult {
  return domainCalculateSpeechSimilarity(transcript, recognizedText);
}
