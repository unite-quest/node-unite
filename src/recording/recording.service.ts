import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { CreateRecordingDto } from './dto/create-recording.dto';
import { Recording } from './interfaces/recording.interface';

@Injectable()
export class RecordingService {
  constructor(
    @Inject('RECORDING_MODEL')
    private recordingModel: Model<Recording>,
  ) { }

  async create(recordingDto: CreateRecordingDto): Promise<Recording> {
    const createdRecording = new this.recordingModel(recordingDto);
    return createdRecording.save();
  }
}
