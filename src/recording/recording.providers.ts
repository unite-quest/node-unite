import { Connection, Model } from 'mongoose';

import { Recording } from './interfaces/recording.interface';
import { RecordingSchema } from './schemas/recording.schema';

export const recordingProviders = [
  {
    provide: 'RECORDING_MODEL',
    useFactory: (connection: Connection): Model<Recording> => connection.model('Recording', RecordingSchema),
    inject: ['DATABASE_CONNECTION'],
  }
];
