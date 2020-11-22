import * as mongoose from 'mongoose';

export const UserNotificationSchema = new mongoose.Schema({
  type: String,
  dismissed: Boolean,
  follow: {
    scoringId: String,
    name: String,
  }
});
