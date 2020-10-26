import { Document } from 'mongoose';

export enum AuditEntryTypes {
  REMOVE_USER_DATA = 'REMOVE_USER_DATA',
}

export interface AuditEntry extends Document, AuditEntryBase { }

export interface AuditEntryBase {
  readonly userId: string;
  readonly entryType: AuditEntryTypes;
  readonly timestamp: Date;
  payload: any;
}
