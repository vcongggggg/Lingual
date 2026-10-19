/**
 * Local Deterministic Speaking Analysis Engine
 */

import {
  SpeakingPrompt,
  SpeakingSubmission,
  SpeakingFeedback,
  evaluateSpeakingSubmission,
} from '@linguaflow/domain';
import { localSpeakingFeedbackProvider } from './SpeakingFeedbackProvider';

export class SpeakingAnalysisEngine {
  public static async analyze(
    prompt: SpeakingPrompt,
    submission: SpeakingSubmission,
    locale: string = 'vi'
  ): Promise<SpeakingFeedback> {
    return localSpeakingFeedbackProvider.analyze(prompt, submission, locale);
  }
}
