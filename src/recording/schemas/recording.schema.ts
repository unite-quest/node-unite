import * as mongoose from 'mongoose';
import { SpeakerSchema } from './speaker.schema.ts';


export const RecordingSchema = new mongoose.Schema({
  word: String,
  recordingPath: String,
  sampleRate: Number,
  additionalMetadata: {
    userAgent: String,
  },
  length: String,
  speaker: SpeakerSchema,
});
