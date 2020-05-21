import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { Recording } from './interfaces/recording.interface';

@Injectable()
export class RecordingService {
  constructor(
    @Inject('RECORDING_MODEL')
    private recordingModel: Model<Recording>,
  ) { }

  async create(data: any): Promise<any> {
    return this.recordingModel.create({});
  }

  async findByUser(formId: string): Promise<Recording[]> {
    return this.recordingModel.find({ formId }).exec();
  }
}
