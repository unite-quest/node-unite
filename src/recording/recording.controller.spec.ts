import mockingoose from 'mockingoose';
import { Model, model } from 'mongoose';

import { CreateRecordingDto } from './dto/create-recording.dto';
import { Recording } from './interfaces/recording.interface';
import { RecordingController } from './recording.controller';
import { RecordingService } from './recording.service';
import { RecordingSchema } from './schemas/recording.schema';

describe('RecordingController', () => {
  let recordingController: RecordingController;
  let recordingService: RecordingService;
  let recordingModel: Model<Recording>;

  const _id = '507f191e810c19729de860ea';
  const data: CreateRecordingDto = {
    mediaPath: 'test/path',
    sampleRate: 16000,
    phoneMetadata: 'Android',
    speaker: {
      age: 26,
      sex: 'M',
      origin: 'SP',
      motherLanguage: 'EN_US',
    },
  };

  beforeEach(() => {
    recordingModel = model('Recording', RecordingSchema);
    mockingoose(recordingModel).toReturn({ _id, ...data }, 'save');
    recordingService = new RecordingService(recordingModel);
    recordingController = new RecordingController(recordingService);
  });

  describe('create', () => {
    it('should create a recording to database', async () => {
      const recording = await recordingController.createRecording(data);
      expect(recording._id.toString()).toEqual(_id);
      expect(recording.mediaPath).toEqual('test/path');
      expect(recording.sampleRate).toEqual(16000);
      expect(recording.phoneMetadata).toEqual('Android');
      expect(recording.speaker.age).toEqual(26);
      expect(recording.speaker.sex).toEqual('M');
      expect(recording.speaker.origin).toEqual('SP');
      expect(recording.speaker.motherLanguage).toEqual('EN_US');
    });
  });
});