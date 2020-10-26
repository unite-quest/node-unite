import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PhrasesModule } from '../phrases/phrases.module';
import { RecordingModule } from '../recording/recording.module';
import { ScoringModule } from '../scoring/scoring.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    RecordingModule,
    PhrasesModule,
    AuthModule,
    ScoringModule,
  ],
  providers: [
    DashboardService,
  ],
  controllers: [
    DashboardController,
  ]
})
export class DashboardModule { }
