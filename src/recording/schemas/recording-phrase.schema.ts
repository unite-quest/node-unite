import * as mongoose from 'mongoose';

export const RecordingPhraseSchema = new mongoose.Schema({
  phraseId: String,
  sampleRate: Number,
  format: String,
  duration: Number,
  recordingPath: String,
  skipped: {
    reason: String,
  },
});
