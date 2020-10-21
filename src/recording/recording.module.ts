import { HttpModule, Module } from '@nestjs/common';
import { ScoringModule } from 'src/scoring/scoring.module';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { FileUploadService } from './file-upload.service';
import { RecordingController } from './recording.controller';
import { recordingProviders } from './recording.providers';
import { RecordingService } from './recording.service';
import { UserRecordingService } from './user-recording.service';
@Module({
  imports: [
    DatabaseModule,
    HttpModule,
    AuthModule,
    ScoringModule,
  ],
  controllers: [
    RecordingController
  ],
  providers: [
    RecordingService,
    UserRecordingService,
    FileUploadService,
    ...recordingProviders,
  ],
  exports: [
    RecordingService,
    UserRecordingService,
  ]
})
export class RecordingModule { }
