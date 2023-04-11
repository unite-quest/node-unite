import * as mongoose from 'mongoose';

export const PhrasesSchema = new mongoose.Schema({
  themeId: {
    type: String,
    index: true,
    unique: true,
  },
  title: String,
  cover: String,
  phrases: [
    new mongoose.Schema({
      text: String,
    }),
  ],
});
