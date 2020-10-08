import * as mongoose from 'mongoose';

export const ScoreEntrySchema = new mongoose.Schema({
  score: Number,
  reason: String,
});
