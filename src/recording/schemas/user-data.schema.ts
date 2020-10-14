import * as mongoose from 'mongoose';

export const UserDataSchema = new mongoose.Schema({
  firebaseId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  nickname: String,
  gender: String,
  ageInterval: String,
  region: String,
  dialect: String,
});
