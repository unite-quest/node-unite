import * as mongoose from 'mongoose';

export const PhrasesSchema = new mongoose.Schema({
  title: {
    type: String,
    index: true,
    unique: true,
  },
  phrases: [
    new mongoose.Schema({
      text: String,
    }),
  ],
});
