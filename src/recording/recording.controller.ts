import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { RecordingService } from './recording.service';

@Controller('recording')
export class RecordingController {
  constructor(
    private readonly recordingService: RecordingService,
  ) { }

  @Get(':id')
  getRecording(@Param() params): Promise<any> {
    return this.recordingService.findByUser(params.id);
  }

  @Post()
  createRecording(@Body() data: any) {
    return this.recordingService.create(data);
  }
}
