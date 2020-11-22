import { Document } from 'mongoose';
import { UserMetadata } from './user-data.interface';
import UserNotification from './user-notification.interface';
import UserRecordingTheme from './user-recording-theme.interface';

export interface UserRecording extends UserRecordingBase, Document { }

export interface UserRecordingBase {
  user: UserMetadata;
  themes: UserRecordingTheme[];
  notifications: UserNotification[];
}
