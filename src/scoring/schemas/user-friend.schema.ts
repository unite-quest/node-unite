import * as mongoose from 'mongoose';

export const UserFriendSchema = new mongoose.Schema({
  firebaseId: String,
});
