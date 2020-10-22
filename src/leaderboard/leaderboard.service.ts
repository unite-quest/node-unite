import { BadRequestException, Injectable } from '@nestjs/common';
import { UserScore } from 'src/scoring/interfaces/user-score.interface';
import { ScoringService } from 'src/scoring/scoring.service';
import AuthUserModel from '../auth/auth-user.model';
import LeaderboardEntryDto from './dto/leaderboard-entry.dto copy';
import LeaderboardDto from './dto/leaderboard.dto';

@Injectable()
export class LeaderboardService {
  constructor(
    private scoringService: ScoringService,
  ) { }

  public async getGlobalLeaderboard(loggedUser: AuthUserModel): Promise<LeaderboardDto> {
    const top = await this.scoringService.getTopScores();
    const user = await this.scoringService.getOrCreateUserScoring(loggedUser);
    return this.parseLeaderboard(top, user);
  }

  public async getFriendLeaderboard(loggedUser: AuthUserModel): Promise<LeaderboardDto> {
    const topFriends = await this.scoringService.getFriendScores(loggedUser);
    const user = await this.scoringService.getOrCreateUserScoring(loggedUser);
    return this.parseLeaderboard(topFriends, user);
  }

  private async parseLeaderboard(topScores: UserScore[], user: UserScore): Promise<LeaderboardDto> {
    return {
      ranking: topScores.map((each: UserScore, index: number): LeaderboardEntryDto => {
        return {
          id: each._id,
          nickname: {
            full: each.nickname,
            short: this.shortifyNickname(each.nickname),
          },
          position: index,
          score: each.total,
        }
      }),
      user: {
        id: user._id,
        nickname: {
          full: user.nickname,
          short: this.shortifyNickname(user.nickname),
        },
        position: await this.getUserRanking(topScores, user),
        score: user.total,
      }
    };
  }

  private async getUserRanking(topScores: UserScore[], user: UserScore): Promise<number> {
    if (!user || !user.firebaseId) {
      throw new BadRequestException('Invalid user requesting ranking');
    }

    let inTop10 = -1;
    topScores.find((each: UserScore, index: number) => { // find breaks after first true
      if (each.firebaseId === user.firebaseId) {
        inTop10 = index;
        return true;
      }
      return false;
    });

    return inTop10 !== -1 ?
      inTop10 :
      await this.scoringService.getUserPositionInLeaderboard(user);
  }

  public shortifyNickname(full: string): string {
    if (!full) {
      return '';
    }

    if (full.indexOf(' ') >= 0) {
      const [first, last] = full.split(' ');
      return first.charAt(0) + last.charAt(0);
    }
    return full.charAt(0);
  }

}
