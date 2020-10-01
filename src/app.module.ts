import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PhrasesModule } from './phrases/phrases.module';
import { RecordingModule } from './recording/recording.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    RecordingModule,
    PhrasesModule,
    AuthModule,
  ],
})
export class AppModule { }
