import {
  classifyTutorIntent,
  generateTutorResponse,
  TutorContext,
  TutorResponse,
} from '@linguaflow/domain';
import { TutorProvider } from './TutorProvider';

export class LocalTutorProvider implements TutorProvider {
  public name = 'Local Deterministic Tutor Engine';

  public isAvailable(): boolean {
    return true; // Always available offline without external API keys
  }

  public async respond(
    message: string,
    context: TutorContext,
    locale: string = 'vi'
  ): Promise<TutorResponse> {
    const intent = classifyTutorIntent(message, context);
    return generateTutorResponse(intent, context, message, locale);
  }
}

export const localTutorProvider = new LocalTutorProvider();
