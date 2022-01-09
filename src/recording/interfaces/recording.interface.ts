export interface Recording {
  phraseId: string;
  sampleRate?: number;
  format?: 'wav' | 'webm'; // web compatibility layer
  duration?: number;
  recordingPath?: string;
  skipped?: {
    reason: string;
  };
}
