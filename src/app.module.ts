import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PhrasesModule } from './phrases/phrases.module';
import { RecordingModule } from './recording/recording.module';
import { DashboardModule } from './dashboard/dashboard.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    RecordingModule,
    PhrasesModule,
    AuthModule,
    DashboardModule,
  ],
})
export class AppModule { }
