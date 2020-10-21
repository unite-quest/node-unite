import { Injectable } from '@nestjs/common';
import { ScoringService } from 'src/scoring/scoring.service';
import AuthUserModel from '../auth/auth-user.model';
import LeaderboardDto from './dto/leaderboard.dto';

@Injectable()
export class LeaderboardService {
  constructor(
    private scoringService: ScoringService,
  ) { }

  public async getGlobalLeaderboard(user: AuthUserModel): Promise<LeaderboardDto> {
    const data = await this.scoringService.getTopScores();
    console.log(data);
    return;
  }

  public async getFriendLeaderboard(user: AuthUserModel): Promise<LeaderboardDto> {
    const data = await this.scoringService.getFriendScores(user);
    console.log(data);
    return;
  }
}
