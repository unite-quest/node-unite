import { Controller, Get } from '@nestjs/common';
import SimpleStatsResponseDto from './dto/simple-stats-response.dto';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('simple')
  getSimpleStats(): Promise<SimpleStatsResponseDto> {
    return this.statsService.getSimpleStats();
  }
}
