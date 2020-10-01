import { Connection } from 'mongoose';
import { PhrasesSchema } from './schemas/phrases.schema';

export const phrasesProviders = [
  {
    provide: 'PHRASES_MODEL',
    useFactory: (connection: Connection) => connection.model('Phrases', PhrasesSchema),
    inject: ['DATABASE_CONNECTION'],
  }
];
