import { Connection, Model } from 'mongoose';
import { UserRecording } from './interfaces/user-recording.interface';
import { UserRecordingSchema } from './schemas/user-recording.schema';


export const recordingProviders = [
  {
    provide: 'USER_RECORDING_MODEL',
    useFactory: (connection: Connection): Model<UserRecording> => connection.model('UserRecording', UserRecordingSchema),
    inject: ['DATABASE_CONNECTION'],
  }
];
