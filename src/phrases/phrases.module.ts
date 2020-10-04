import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { RecordingModule } from '../recording/recording.module';
import { PhrasesController } from './phrases.controller';
import { phrasesProviders } from './phrases.providers';
import { PhrasesService } from './phrases.service';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    RecordingModule,
  ],
  controllers: [
    PhrasesController,
  ],
  providers: [
    PhrasesService,
    ...phrasesProviders,
  ],
})
export class PhrasesModule { }
