import { Document } from 'mongoose';
import { UserMetadata } from './user-data.interface';
import UserRecordingTheme from './user-recording-theme.interface';

export interface UserRecording extends Document {
  readonly user: UserMetadata;
  readonly themes: UserRecordingTheme[];
}
