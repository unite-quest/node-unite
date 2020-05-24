import { Body, Controller, Post } from '@nestjs/common';

import { CreateRecordingDto } from './dto/create-recording.dto';
import { RecordingService } from './recording.service';

@Controller('recording')
export class RecordingController {
  constructor(
    private readonly recordingService: RecordingService,
  ) { }

  @Post()
  createRecording(@Body() data: CreateRecordingDto) {
    return this.recordingService.create(data);
  }
}
