import * as mongoose from 'mongoose';

export const RecordingSchema = new mongoose.Schema({
  technology: String,
}, {
  strict: false
});
