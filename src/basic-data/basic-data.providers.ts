import { Connection } from 'mongoose';
import { BasicDataSchema } from './schemas/basic-data.schema';


export const basicDataProviders = [
  {
    provide: 'BASIC_DATA_MODEL',
    useFactory: (connection: Connection) => connection.model('BasicData', BasicDataSchema),
    inject: ['DATABASE_CONNECTION'],
  }
];
