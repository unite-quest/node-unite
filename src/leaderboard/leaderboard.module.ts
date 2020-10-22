import { Module } from '@nestjs/common';
import { ScoringModule } from 'src/scoring/scoring.module';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
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
    FriendsController,
  ],
  providers: [
    LeaderboardService,
    FriendsService,
  ],
  exports: [
  ]
})
export class LeaderboardModule { }
