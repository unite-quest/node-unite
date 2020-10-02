import { Body, Controller, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from '../auth/auth.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import AppendUserRecordingDto from './dto/append-user-recording.dto';
import { FileInterface } from './interfaces/file.interface';
import { RecordingService } from './recording.service';


@Controller('user-recording')
export class RecordingController {
  constructor(
    private readonly recordingService: RecordingService,
  ) { }

  @UseGuards(FirebaseAuthGuard)
  @Post('user')
  createUser() {
    const user = AuthService.getLoggedUser();
    return this.recordingService.createEmptyUserIfNonExistent(user);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post(':theme/send')
  @UseInterceptors(FileInterceptor('file'))
  appendRecording(@Body() data: AppendUserRecordingDto, @Param('theme') theme, @UploadedFile() file: FileInterface) {
    const user = AuthService.getLoggedUser();
    return this.recordingService.append(data, theme, file, user);
  }


  @UseGuards(FirebaseAuthGuard)
  @Post('skip')
  skipRecording(@Body() data: AppendUserRecordingDto) {
    const user = AuthService.getLoggedUser();
    return this.recordingService.skip(undefined, user);
  }
}
