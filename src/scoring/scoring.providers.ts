import { Connection, Model } from 'mongoose';
import { UserScore } from './interfaces/user-score.interface';
import { UserScoreSchema } from './schemas/user-score.schema';

export const scoringProviders = [
  {
    provide: 'USER_SCORING_MODEL',
    useFactory: (connection: Connection): Model<UserScore> =>
      connection.model<UserScore>('UserScore', UserScoreSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
