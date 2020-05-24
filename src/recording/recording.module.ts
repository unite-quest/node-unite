import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { RecordingController } from './recording.controller';
import { recordingProviders } from './recording.providers';
import { RecordingService } from './recording.service';


@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [RecordingController],
  providers: [
    RecordingService,
    ...recordingProviders,
  ],
})
export class RecordingModule { }