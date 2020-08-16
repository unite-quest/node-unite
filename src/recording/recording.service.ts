import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateRecordingDto } from './dto/create-recording.dto';
import { FileUploadService } from './file-upload.service';
import { Recording } from './interfaces/recording.interface';


@Injectable()
export class RecordingService {
  constructor(
    @Inject('RECORDING_MODEL')
    private recordingModel: Model<Recording>,
    private fileUploadService: FileUploadService,
  ) { }

  create(recordingDto: CreateRecordingDto, file: any): Observable<any> {
    return this.fileUploadService.upload(file)
      .pipe(map((fileName) => {
        recordingDto.mediaPath = fileName;
        const createdRecording = new this.recordingModel(recordingDto);
        return createdRecording.save();
      }));
  }
}
