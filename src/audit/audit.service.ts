import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import AuthUserModel from '../auth/auth-user.model';
import { AuditEntry, AuditEntryBase, AuditEntryTypes } from './interfaces/audit-entry.interface';


@Injectable()
export class AuditService {
  constructor(
    @Inject('AUDIT_ENTRY_MODEL')
    private auditModel: Model<AuditEntry>,
  ) { }

  public async addRemoveUserDataEntry(keepUserData: boolean, reason: string, user: AuthUserModel): Promise<void> {
    const entry: AuditEntryBase = {
      userId: user.uid,
      entryType: AuditEntryTypes.REMOVE_USER_DATA,
      timestamp: new Date(),
      payload: {
        keepUserData,
        reason,
      }
    };

    await this.auditModel.create(entry);
  }
}
