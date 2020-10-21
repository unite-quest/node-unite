import { Module } from '@nestjs/common';
import { ScoringModule } from 'src/scoring/scoring.module';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ScoringModule,
  ],
  controllers: [
    LeaderboardController,
  ],
  providers: [
    LeaderboardService,
  ],
  exports: [
  ]
})
export class LeaderboardModule { }
