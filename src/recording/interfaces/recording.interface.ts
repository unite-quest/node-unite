export interface Recording {
  phraseId: string;
  sampleRate: number;
  format: 'wav' | 'webm'; // web compatibility layer
  duration: string
  recordingPath: string;
  skipped: boolean;
}
