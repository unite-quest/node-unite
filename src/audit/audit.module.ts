import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { auditProviders } from './audit.providers';
import { AuditService } from './audit.service';

@Module({
  imports: [
    DatabaseModule,
  ],
  providers: [
    ...auditProviders,
    AuditService,
  ],
  exports: [
    AuditService,
  ]
})
export class AuditModule { }
