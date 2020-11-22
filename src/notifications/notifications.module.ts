import { Module } from '@nestjs/common';
import { RecordingModule } from '../recording/recording.module';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    RecordingModule,
  ],
  providers: [
    NotificationService,
  ],
  exports: [
    NotificationService,
  ]
})
export class NotificationsModule { }
