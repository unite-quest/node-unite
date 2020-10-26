import { HttpModule, Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { RecordingModule } from '../recording/recording.module';
import { ScoringModule } from '../scoring/scoring.module';
import { FoulLanguageService } from './foul-language.service';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
@Module({
  imports: [
    DatabaseModule,
    HttpModule,
    AuthModule,
    RecordingModule,
    ScoringModule,
    AuditModule,
  ],
  controllers: [
    RegistrationController,
  ],
  providers: [
    RegistrationService,
    FoulLanguageService,
  ],
  exports: [
  ]
})
export class RegistrationModule { }
