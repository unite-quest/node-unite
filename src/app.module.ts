import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecordingModule } from './recording/recording.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RecordingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
