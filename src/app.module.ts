import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RecordingModule } from './recording/recording.module';
import { SuggestionsModule } from './suggestions/suggestions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RecordingModule,
    SuggestionsModule,
  ],
})
export class AppModule { }
