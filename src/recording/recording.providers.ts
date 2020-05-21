import { Connection } from 'mongoose';

import { RecordingSchema } from './schemas/recording.schema';

export const recordingProviders = [
  {
    provide: 'RECORDING_MODEL',
    useFactory: (connection: Connection) => connection.model('Recording', RecordingSchema),
    inject: ['DATABASE_CONNECTION'],
  }
];
