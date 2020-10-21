import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import LeaderboardDto from './dto/leaderboard.dto';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    private readonly leaderboardService: LeaderboardService,
  ) { }

  @UseGuards(FirebaseAuthGuard)
  @Get('friends')
  async getFriendLeaderboard(): Promise<LeaderboardDto> {
    const user = AuthService.getLoggedUser();
    return this.leaderboardService.getFriendLeaderboard(user);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('global')
  async getGlobalLeaderboard(): Promise<LeaderboardDto> {
    const user = AuthService.getLoggedUser();
    return this.leaderboardService.getGlobalLeaderboard(user);
  }

}
