import * as mongoose from 'mongoose';

export const SuggestionsBlacklistSchema = new mongoose.Schema({
  word: String,
});
