import { Document } from 'mongoose';
import { ScoreEntry } from './score-entry.interface';
import { UserMetadata } from './user-data.interface';
import UserRecordingTheme from './user-recording-theme.interface';

export interface UserRecording extends Document {
  readonly user: UserMetadata;
  readonly themes: UserRecordingTheme[];
  readonly scoring: ScoreEntry[];
}
