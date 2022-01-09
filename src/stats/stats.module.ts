import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { RecordingModule } from '../recording/recording.module';

@Module({
  imports: [RecordingModule],
  providers: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}
