import { Document } from 'mongoose';
import RecordingTheme from './recording-theme.interface';
import { UserMetadata } from './user-data.interface';

export interface UserRecording extends Document {
  readonly user: UserMetadata;
  readonly themes: RecordingTheme[];
}
