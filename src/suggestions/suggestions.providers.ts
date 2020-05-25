import { Connection } from 'mongoose';

import { SuggestionsBlacklistSchema } from './schemas/suggestions-blacklist.schema';

export const suggestionsProviders = [
  {
    provide: 'SUGGESTIONS_BLACKLIST_MODEL',
    useFactory: (connection: Connection) => connection.model('SuggestionsBlacklist', SuggestionsBlacklistSchema),
    inject: ['DATABASE_CONNECTION'],
  }
];
