import * as mongoose from 'mongoose';

export const SpeakerSchema = new mongoose.Schema({
  age: Number,
  sex: String,
  origin: String,
  motherLanguage: String,
});
