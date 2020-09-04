import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { extname } from 'path';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthUserModel } from '../auth/auth-user.model';
import { CreateRecordingDto } from './dto/create-recording.dto';
import { FileUploadService } from './file-upload.service';
import { FileInterface } from './interfaces/file.interface';
import { Recording } from './interfaces/recording.interface';

@Injectable()
export class RecordingService {
  constructor(
    @Inject('RECORDING_MODEL')
    private recordingModel: Model<Recording>,
    private fileUploadService: FileUploadService,
  ) { }

  public create(recordingDto: CreateRecordingDto, file: FileInterface, user: AuthUserModel): Observable<any> {
    const filename = this._getFilename(recordingDto, file);
    return this.fileUploadService.upload(file, filename)
      .pipe(
        map((id: string) => {
          recordingDto.recordingPath = id;
          const createdRecording = new this.recordingModel(recordingDto);
          return createdRecording.save();
        }),
      );
  }

  private _getFilename(recording: CreateRecordingDto, file: FileInterface): string {
    return `${new Date().toISOString()}${extname(file.originalname)}`;
  }
}
