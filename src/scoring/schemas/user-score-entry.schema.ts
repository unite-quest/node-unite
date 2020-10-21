import * as mongoose from 'mongoose';

export const UserScoreEntrySchema = new mongoose.Schema({
  score: Number,
  reason: String,
});
