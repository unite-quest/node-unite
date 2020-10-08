import * as mongoose from 'mongoose';
import { RecordingThemeSchema } from './recording-theme.schema';
import { ScoreEntrySchema } from './score-entry.schema';
import { UserDataSchema } from './user-data.schema';

export const UserRecordingSchema = new mongoose.Schema({
  user: UserDataSchema,
  themes: [RecordingThemeSchema],
  scoring: [ScoreEntrySchema],
});
