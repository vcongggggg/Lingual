/**
 * Browser Web Speech Recognition Safe Wrapper
 * Full SSR and permission guards for Shadowing mode.
 */

export type SpeechRecognitionErrorCode =
  | 'not-supported'
  | 'not-allowed'
  | 'no-speech'
  | 'network'
  | 'audio-capture'
  | 'aborted'
  | 'unknown';

export interface SpeechRecognitionErrorDetails {
  code: SpeechRecognitionErrorCode;
  message: string;
  userActionablePrompt: string;
}

export interface SpeechRecognizerOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export interface SpeechRecognizerCallbacks {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: SpeechRecognitionErrorDetails) => void;
  onEnd?: () => void;
}

export interface SpeechRecognizerInstance {
  start: () => boolean;
  stop: () => void;
  abort: () => void;
  isListening: () => boolean;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}

function mapSpeechError(errorEvent: any): SpeechRecognitionErrorDetails {
  const error = errorEvent?.error || 'unknown';

  switch (error) {
    case 'not-allowed':
    case 'service-not-allowed':
      return {
        code: 'not-allowed',
        message: 'Microphone access was denied by user or browser policy.',
        userActionablePrompt: 'Quyền truy cập micro đã bị từ chối. Vui lòng cho phép quyền micro trong cài đặt trình duyệt để tiếp tục luyện Shadowing.',
      };
    case 'no-speech':
      return {
        code: 'no-speech',
        message: 'No speech was detected.',
        userActionablePrompt: 'Chưa nhận diện được giọng nói. Hãy nói to, rõ ràng hơn gần micro và thử lại nhé!',
      };
    case 'audio-capture':
      return {
        code: 'audio-capture',
        message: 'No microphone was found or microphone is busy.',
        userActionablePrompt: 'Không tìm thấy thiết bị micro hoặc micro đang bận bởi ứng dụng khác.',
      };
    case 'network':
      return {
        code: 'network',
        message: 'Network error occurred during speech recognition.',
        userActionablePrompt: 'Lỗi kết nối mạng khi nhận diện giọng nói. Vui lòng kiểm tra đường truyền internet.',
      };
    case 'aborted':
      return {
        code: 'aborted',
        message: 'Speech recognition was cancelled.',
        userActionablePrompt: 'Đã hủy ghi âm.',
      };
    default:
      return {
        code: 'unknown',
        message: `Recognition error: ${error}`,
        userActionablePrompt: 'Không thể nhận diện giọng nói lúc này. Bạn có thể thử lại hoặc tiếp tục chế độ Chép chính tả.',
      };
  }
}

export function createSpeechRecognizer(
  options: SpeechRecognizerOptions = {},
  callbacks: SpeechRecognizerCallbacks = {}
): SpeechRecognizerInstance {
  if (!isSpeechRecognitionSupported()) {
    return {
      start: () => {
        callbacks.onError?.({
          code: 'not-supported',
          message: 'SpeechRecognition API is not supported in this browser.',
          userActionablePrompt: 'Trình duyệt hiện tại chưa hỗ trợ nhận diện giọng nói Web Speech. Hãy dùng Chrome, Edge hoặc Safari.',
        });
        return false;
      },
      stop: () => {},
      abort: () => {},
      isListening: () => false,
    };
  }

  const SpeechRecognitionClass =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  let recognition: any = null;
  let isCurrentlyListening = false;

  try {
    recognition = new SpeechRecognitionClass();
    recognition.lang = options.lang || 'en-US';
    recognition.continuous = options.continuous ?? false;
    recognition.interimResults = options.interimResults ?? true;
    recognition.maxAlternatives = options.maxAlternatives ?? 1;

    recognition.onstart = () => {
      isCurrentlyListening = true;
      callbacks.onStart?.();
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const activeText = finalTranscript || interimTranscript;
      callbacks.onResult?.(activeText.trim(), Boolean(finalTranscript));
    };

    recognition.onerror = (event: any) => {
      isCurrentlyListening = false;
      callbacks.onError?.(mapSpeechError(event));
    };

    recognition.onend = () => {
      isCurrentlyListening = false;
      callbacks.onEnd?.();
    };
  } catch (err) {
    console.warn('SpeechRecognition initialization error:', err);
  }

  return {
    start: () => {
      if (!recognition) return false;
      if (isCurrentlyListening) return true;
      try {
        recognition.start();
        return true;
      } catch (err: any) {
        if (err.name !== 'InvalidStateError') {
          callbacks.onError?.({
            code: 'unknown',
            message: err.message || 'Failed to start speech recognition',
            userActionablePrompt: 'Không thể bắt đầu ghi âm. Vui lòng thử lại.',
          });
        }
        return false;
      }
    },
    stop: () => {
      if (!recognition || !isCurrentlyListening) return;
      try {
        recognition.stop();
      } catch {}
      isCurrentlyListening = false;
    },
    abort: () => {
      if (!recognition) return;
      try {
        recognition.abort();
      } catch {}
      isCurrentlyListening = false;
    },
    isListening: () => isCurrentlyListening,
  };
}
