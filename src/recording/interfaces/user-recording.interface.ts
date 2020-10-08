import { Document } from 'mongoose';
import RecordingTheme from './recording-theme.interface';
import { ScoreEntry } from './score-entry.interface';
import { UserMetadata } from './user-data.interface';

export interface UserRecording extends Document {
  readonly user: UserMetadata;
  readonly themes: RecordingTheme[];
  readonly scoring: ScoreEntry[];
}
