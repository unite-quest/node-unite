import { Module } from '@nestjs/common';
import { PhrasesModule } from 'src/phrases/phrases.module';
import { AuthModule } from '../auth/auth.module';
import { RecordingModule } from '../recording/recording.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    RecordingModule,
    PhrasesModule,
    AuthModule,
  ],
  providers: [
    DashboardService,
  ],
  controllers: [
    DashboardController,
  ]
})
export class DashboardModule { }
