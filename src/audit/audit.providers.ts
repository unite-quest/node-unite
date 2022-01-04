import { Connection, Model } from 'mongoose';
import { AuditEntry } from './interfaces/audit-entry.interface';
import { AuditEntrySchema } from './schemas/audit-entry.schema';

export const auditProviders = [
  {
    provide: 'AUDIT_ENTRY_MODEL',
    useFactory: (connection: Connection): Model<AuditEntry> =>
      connection.model<AuditEntry>('AuditEntry', AuditEntrySchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
