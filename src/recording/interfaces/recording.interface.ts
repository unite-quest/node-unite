import { Document } from 'mongoose';

import { Speaker } from './speaker.interface';

export interface Recording extends Document {
  readonly mediaPath: string;
  readonly sampleRate: number;
  readonly phoneMetadata: string;
  readonly speaker: Speaker;
}