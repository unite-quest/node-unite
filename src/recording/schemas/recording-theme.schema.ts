import * as mongoose from 'mongoose';
import { RecordingPhraseSchema } from './recording-phrase.schema';

export const RecordingThemeSchema = new mongoose.Schema({
  title: String,
  recordings: [
    RecordingPhraseSchema,
  ],
});
