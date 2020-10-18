import { HttpModule, Module } from '@nestjs/common';
import { RecordingModule } from 'src/recording/recording.module';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { FoulLanguageService } from './foul-language.service';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
@Module({
  imports: [
    DatabaseModule,
    HttpModule,
    AuthModule,
    RecordingModule,
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
