import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationService: NotificationService,
  ) { }

  @UseGuards(FirebaseAuthGuard)
  @Post('clean')
  async getFriendLeaderboard(): Promise<void> {
    const user = AuthService.getLoggedUser();
    return this.notificationService.cleanNotifications(user);
  }
}
