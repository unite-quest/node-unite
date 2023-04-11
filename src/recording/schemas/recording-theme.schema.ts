import * as mongoose from 'mongoose';
import { RecordingPhraseSchema } from './recording-phrase.schema';

export const RecordingThemeSchema = new mongoose.Schema({
  themeId: String,
  finished: Boolean,
  recordings: [RecordingPhraseSchema],
});
