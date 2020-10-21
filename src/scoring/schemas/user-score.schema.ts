import * as mongoose from 'mongoose';
import { UserFriendSchema } from './user-friend.schema';
import { UserScoreEntrySchema } from './user-score-entry.schema';

export const UserScoreSchema = new mongoose.Schema({
  firebaseId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  nickname: String,
  total: Number,
  entries: [UserScoreEntrySchema],
  friends: [UserFriendSchema],
});
