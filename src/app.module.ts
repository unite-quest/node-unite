import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RecordingModule } from './recording/recording.module';
import { SuggestionsModule } from './suggestions/suggestions.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    RecordingModule,
    SuggestionsModule,
    AuthModule,
  ],
})
export class AppModule { }
