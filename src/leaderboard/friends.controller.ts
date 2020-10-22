import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import ActOnFriendsRequestDto from './dto/act-on-friends-request.dto';
import LeaderboardDto from './dto/leaderboard.dto';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(
    private readonly friendsService: FriendsService,
  ) { }

  @UseGuards(FirebaseAuthGuard)
  @Get()
  async searchForFriends(@Query('q') searchTerm: string): Promise<LeaderboardDto> {
    const user = AuthService.getLoggedUser();
    return this.friendsService.searchUsersByNickname(searchTerm, user);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('actions')
  async actOnFriends(@Body() actOnFriendsDto: ActOnFriendsRequestDto): Promise<void> {
    const user = AuthService.getLoggedUser();
    return this.friendsService.actOnFriend(actOnFriendsDto, user);
  }
}
