import { Document } from 'mongoose';

import { Speaker } from './speaker.interface';

export interface Recording extends Document {
  readonly mediaPath: string;
  readonly phoneMetadata: string;
  readonly length: string;
  readonly speaker: Speaker;
}