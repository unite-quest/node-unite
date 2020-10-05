import { Body, Controller, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from '../auth/auth.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import AppendUserRecordingDto from './dto/append-user-recording.dto';
import { SkipRecordingDto } from './dto/skip-recording.dto';
import { FileInterface } from './interfaces/file.interface';
import RecordingTheme from './interfaces/recording-theme.interface';
import { RecordingService } from './recording.service';

@Controller('user-recording')
export class RecordingController {
  constructor(
    private readonly recordingService: RecordingService,
  ) { }

  @UseGuards(FirebaseAuthGuard)
  @Post('send/:theme')
  @UseInterceptors(FileInterceptor('file'))
  appendRecording(@Body() data: AppendUserRecordingDto, @Param('theme') theme, @UploadedFile() file: FileInterface): Promise<RecordingTheme> {
    const user = AuthService.getLoggedUser();
    return this.recordingService.append(data, theme, file, user);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('skip/:theme')
  skipRecording(@Body() data: SkipRecordingDto, @Param('theme') theme): Promise<RecordingTheme> {
    const user = AuthService.getLoggedUser();
    return this.recordingService.skip(data, theme, user);
  }
}
