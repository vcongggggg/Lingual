/**
 * Browser-native Web Speech Recognition Engine
 * SSR-safe, with graceful fallbacks for unsupported browsers.
 * NOTE: Transcript Match only. Audio is never sent to external servers.
 */

export interface SpeechRecognitionCallbacks {
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onInterimTranscript?: (interim: string) => void;
  onError?: (error: string) => void;
  onPermissionDenied?: () => void;
  onUnsupported?: () => void;
  onEnd?: () => void;
  onStart?: () => void;
}

export class LinguaSpeechRecognition {
  private recognition: any = null;
  private isListening: boolean = false;
  private callbacks: SpeechRecognitionCallbacks = {};
  private lang: string = 'en-US';

  constructor(lang: string = 'en-US') {
    this.lang = lang;
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.lang;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.callbacks.onStart?.();
      };

      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTranscript += res[0].transcript;
          } else {
            interimTranscript += res[0].transcript;
          }
        }

        if (finalTranscript) {
          this.callbacks.onTranscript?.(finalTranscript, true);
        } else if (interimTranscript) {
          this.callbacks.onInterimTranscript?.(interimTranscript);
        }
      };

      this.recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          this.callbacks.onPermissionDenied?.();
        } else {
          this.callbacks.onError?.(event.error);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.callbacks.onEnd?.();
      };
    } catch (e: any) {
      this.recognition = null;
    }
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  public setLanguage(lang: 'en-US' | 'en-GB' | 'vi-VN') {
    this.lang = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public start(callbacks: SpeechRecognitionCallbacks = {}) {
    this.callbacks = callbacks;

    if (!this.isSupported() || !this.recognition) {
      this.callbacks.onUnsupported?.();
      return;
    }

    if (this.isListening) {
      return;
    }

    try {
      this.recognition.start();
    } catch (err: any) {
      if (err.name === 'InvalidStateError') {
        // Recognition already started
      } else {
        this.callbacks.onError?.(err.message || 'Speech recognition start error');
      }
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
      this.isListening = false;
    }
  }

  public abort() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.abort();
      } catch {}
      this.isListening = false;
    }
  }

  public reset() {
    this.stop();
    this.callbacks = {};
  }
}

export const linguaSpeechRecognition = new LinguaSpeechRecognition('en-US');
