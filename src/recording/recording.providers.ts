import { ConfigService } from '@nestjs/config';
import { GridFSBucket } from 'mongodb';
import { Connection, createConnection, Model } from 'mongoose';
import { UserRecording } from './interfaces/user-recording.interface';
import { UserRecordingSchema } from './schemas/user-recording.schema';

export const recordingProviders = [
  {
    provide: 'USER_RECORDING_MODEL',
    useFactory: (connection: Connection): Model<UserRecording> =>
      connection.model<UserRecording>('UserRecording', UserRecordingSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'RECORDINGS_BUCKET',
    useFactory: async (configService: ConfigService): Promise<GridFSBucket> => {
      const connection = await createConnection(configService.get('DB_URL'));

      return new GridFSBucket(connection.db, {
        bucketName: 'recordings',
      });
    },
    inject: [ConfigService],
  },
];
