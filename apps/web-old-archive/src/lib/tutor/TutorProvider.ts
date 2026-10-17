import { TutorContext, TutorResponse } from '@linguaflow/domain';

export interface TutorProvider {
  name: string;
  isAvailable(): boolean;
  respond(
    message: string,
    context: TutorContext,
    locale?: string
  ): Promise<TutorResponse>;
}
