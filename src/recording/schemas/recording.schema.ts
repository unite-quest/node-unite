import * as mongoose from 'mongoose';

import { SpeakerSchema } from './speaker.schema.ts';

export const RecordingSchema = new mongoose.Schema({
  mediaPath: String,
  sampleRate: Number,
  phoneMetadata: String,
  length: String,
  speaker: SpeakerSchema,
});
