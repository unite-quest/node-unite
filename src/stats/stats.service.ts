import { Injectable } from '@nestjs/common';
import { UserRecordingService } from '../recording/user-recording.service';
import SimpleStatsResponseDto from './dto/simple-stats-response.dto';

@Injectable()
export class StatsService {
  constructor(private userRecordingService: UserRecordingService) {}

  public async getSimpleStats(): Promise<SimpleStatsResponseDto> {
    return {
      hoursRecorded: await this.userRecordingService.getHoursRecorded(),
      uniqueUsers: await this.userRecordingService.count(),
    };
  }
}
