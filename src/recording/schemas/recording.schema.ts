import * as mongoose from 'mongoose';


export const RecordingSchema = new mongoose.Schema({
  word: String,
  recordingPath: String,
  sampleRate: Number,
  additionalMetadata: {
    userAgent: String,
  },
  length: String,
});
