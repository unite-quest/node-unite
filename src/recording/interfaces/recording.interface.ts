import { Document } from 'mongoose';
import { Speaker } from './speaker.interface';


export interface Recording extends Document {
  readonly word: string;
  readonly recordingPath: string;
  readonly sampleRate: number;
  readonly additionalMetadata: {
    userAgent: string;
  };
  readonly speaker: Speaker;
}