import { BadRequestException, Injectable } from '@nestjs/common';
import { UserScore } from 'src/scoring/interfaces/user-score.interface';
import { ScoringService } from 'src/scoring/scoring.service';
import AuthUserModel from '../auth/auth-user.model';
import ActOnFriendsRequestDto from './dto/act-on-friends-request.dto';
import LeaderboardEntryDto from './dto/leaderboard-entry.dto copy';
import LeaderboardDto from './dto/leaderboard.dto';
import { LeaderboardService } from './leaderboard.service';

@Injectable()
export class FriendsService {
  constructor(
    private scoringService: ScoringService,
    private leaderboardService: LeaderboardService,
  ) { }

  public async searchUsersByNickname(nickname: string, loggedUser: AuthUserModel): Promise<LeaderboardDto> {
    const user = await this.scoringService.getOrCreateUserScoring(loggedUser);
    const search = await this.scoringService.searchUsersByNickname(nickname, user);
    if (!search || search.length == 0) {
      return {
        ranking: [],
      };
    }

    return this.parseUserList(search, user);
  }

  public async actOnFriend(actOnFriendsDto: ActOnFriendsRequestDto, loggedUser: AuthUserModel): Promise<void> {
    const user = await this.scoringService.getOrCreateUserScoring(loggedUser);
    const friend = await this.scoringService.searchUserById(actOnFriendsDto.friendId); // ObjectId !== firebaseId
    const firebaseId = friend.firebaseId;

    const foundFriend = user.friends.find(eachFriend => eachFriend.firebaseId === firebaseId);
    if (actOnFriendsDto.actions.follow) {
      if (!foundFriend) {
        user.friends.push({ firebaseId });
      } else {
        throw new BadRequestException('User already followed');
      }
    } else if (actOnFriendsDto.actions.unfollow) {
      if (foundFriend) {
        // sad remove
        user.friends = user.friends.filter(friend => friend.firebaseId !== firebaseId);
      } else {
        throw new BadRequestException('User already unfollowed');
      }
    }

    await user.save();
  }

  private async parseUserList(searchedUsers: UserScore[], user: UserScore): Promise<LeaderboardDto> {
    return {
      ranking: searchedUsers.map((each: UserScore): LeaderboardEntryDto => {
        const following = !!user.friends.find(friend => friend.firebaseId === each.firebaseId);
        return {
          id: each._id,
          nickname: {
            full: each.nickname,
            short: this.leaderboardService.shortifyNickname(each.nickname),
          },
          actions: {
            follow: !following,
            unfollow: following,
          }
        }
      }),
    };
  }
}
