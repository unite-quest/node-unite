import * as mongoose from 'mongoose';
import { RecordingThemeSchema } from './recording-theme.schema';
import { UserDataSchema } from './user-data.schema';
import { UserNotificationSchema } from './user-notification.schema';

export const UserRecordingSchema = new mongoose.Schema({
  user: UserDataSchema,
  themes: [RecordingThemeSchema],
  notifications: [UserNotificationSchema],
});
