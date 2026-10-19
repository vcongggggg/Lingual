/**
 * Speaking Feedback Provider Abstraction
 * Allows pluggable local deterministic feedback or future backend speech models.
 */

import {
  SpeakingPrompt,
  SpeakingSubmission,
  SpeakingFeedback,
  evaluateSpeakingSubmission,
} from '@linguaflow/domain';

export interface SpeakingFeedbackProvider {
  analyze(prompt: SpeakingPrompt, submission: SpeakingSubmission, locale?: string): Promise<SpeakingFeedback>;
}

export class LocalSpeakingFeedbackProvider implements SpeakingFeedbackProvider {
  public async analyze(
    prompt: SpeakingPrompt,
    submission: SpeakingSubmission,
    locale: string = 'vi'
  ): Promise<SpeakingFeedback> {
    return evaluateSpeakingSubmission(prompt, submission, locale);
  }
}

export const localSpeakingFeedbackProvider = new LocalSpeakingFeedbackProvider();
