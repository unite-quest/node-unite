import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PhrasesModule } from './phrases/phrases.module';
import { RecordingModule } from './recording/recording.module';
import { RegistrationModule } from './registration/registration.module';
import { ScoringModule } from './scoring/scoring.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    RecordingModule,
    PhrasesModule,
    RegistrationModule,
    AuthModule,
    DashboardModule,
    ScoringModule,
    LeaderboardModule,
    NotificationsModule,
  ],
})
export class AppModule { }
