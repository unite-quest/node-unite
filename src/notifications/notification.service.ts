import { Injectable } from '@nestjs/common';
import AuthUserModel from '../auth/auth-user.model';
import UserNotification from '../recording/interfaces/user-notification.interface';
import { UserRecordingService } from '../recording/user-recording.service';

@Injectable()
export class NotificationService {
  constructor(
    private userRecordingService: UserRecordingService,
  ) { }

  public async notifyFollowAction(
    scoringId: string,
    payload: {
      friendFirebaseId: string,
      nickname: string
    }
  ) {
    const friend = await this.userRecordingService.getUser(new AuthUserModel({
      user_id: payload.friendFirebaseId,
    }));
    const notification: UserNotification = {
      type: 'FOLLOW',
      dismissed: false,
      follow: {
        scoringId,
        name: payload.nickname,
      }
    };

    const found = friend?.notifications?.find(n => n.type === 'FOLLOW' && n.follow.scoringId === payload.friendFirebaseId);
    if (!found) {
      if (friend.notifications) {
        friend.notifications.push(notification);
      } else {
        friend.notifications = [notification];
      }
    }
    return await friend.save();
  }

  public async cleanNotifications(loggedUser: AuthUserModel): Promise<void> {
    const user = await this.userRecordingService.getOrCreateUser(loggedUser);
    user.notifications = user.notifications.map(notification => {
      notification.dismissed = true;
      return notification;
    });
    await user.save();
  }
}
