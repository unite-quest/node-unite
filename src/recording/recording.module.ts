import { HttpModule, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { FileUploadService } from './file-upload.service';
import { RecordingController } from './recording.controller';
import { recordingProviders } from './recording.providers';
import { RecordingService } from './recording.service';
@Module({
  imports: [
    DatabaseModule,
    HttpModule,
    AuthModule,
  ],
  controllers: [RecordingController],
  providers: [
    RecordingService,
    FileUploadService,
    ...recordingProviders,
  ],
})
export class RecordingModule { }
