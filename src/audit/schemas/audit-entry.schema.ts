import * as mongoose from 'mongoose';

export const AuditEntrySchema = new mongoose.Schema({
  userId: String,
  entryType: String,
  timestamp: Date,
  payload: mongoose.Schema.Types.Mixed,
});
