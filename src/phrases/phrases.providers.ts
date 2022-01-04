import { Connection } from 'mongoose';
import PhrasesInterface from './interfaces/phrases.interface';
import { PhrasesSchema } from './schemas/phrases.schema';

export const phrasesProviders = [
  {
    provide: 'PHRASES_MODEL',
    useFactory: (connection: Connection) =>
      connection.model<PhrasesInterface>('Phrases', PhrasesSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
