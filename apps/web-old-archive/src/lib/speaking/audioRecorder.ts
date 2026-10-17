/**
 * Safe Browser MediaRecorder for Local Pronunciation Playback
 * Privacy-first: Recordings remain strictly in local memory and are NEVER uploaded to any server.
 */

export class SafeAudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private audioUrl: string | null = null;

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(navigator?.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function' && (window as any).MediaRecorder);
  }

  public async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch {
      return false;
    }
  }

  public async startRecording(): Promise<boolean> {
    if (!this.isSupported()) return false;

    // Clear previous recording URL
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = null;
    }
    this.audioChunks = [];

    try {
      if (!this.stream || !this.stream.active) {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      this.mediaRecorder = new MediaRecorder(this.stream);
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100);
      return true;
    } catch (err) {
      this.cleanup();
      return false;
    }
  }

  public stopRecording(): Promise<string | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioUrl = URL.createObjectURL(audioBlob);
        this.cleanup();
        resolve(this.audioUrl);
      };

      this.mediaRecorder.stop();
    });
  }

  public cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
  }

  public release() {
    this.cleanup();
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = null;
    }
    this.audioChunks = [];
  }
}

export const safeAudioRecorder = new SafeAudioRecorder();
