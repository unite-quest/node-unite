import { Document } from 'mongoose';


export interface Recording extends Document {
  readonly word: string;
  readonly recordingPath: string;
  readonly sampleRate: number;
  readonly additionalMetadata: {
    userAgent: string;
  };
}