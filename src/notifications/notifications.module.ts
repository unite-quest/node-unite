import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RecordingModule } from '../recording/recording.module';
import { NotificationService } from './notification.service';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [
    AuthModule,
    RecordingModule,
  ],
  providers: [
    NotificationService,
  ],
  controllers: [
    NotificationsController,
  ],
  exports: [
    NotificationService,
  ]
})
export class NotificationsModule { }
