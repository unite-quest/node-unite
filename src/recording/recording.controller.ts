import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CreateRecordingDto } from './dto/create-recording.dto';
import { FileInterface } from './interfaces/file.interface';
import { RecordingService } from './recording.service';


@Controller('recording')
export class RecordingController {
  constructor(
    private readonly recordingService: RecordingService,
  ) { }

  @UseGuards(FirebaseAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createRecording(@Body() data: CreateRecordingDto, @UploadedFile() file: FileInterface) {
    return this.recordingService.create(data, file);
  }
}
