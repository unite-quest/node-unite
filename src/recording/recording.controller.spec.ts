import mockingoose from 'mockingoose';
import { Model, model } from 'mongoose';
import { CreateRecordingDto } from './dto/create-recording.dto';
import { FileUploadService } from './file-upload.service';
import { FileInterface } from './interfaces/file.interface';
import { Recording } from './interfaces/recording.interface';
import { RecordingController } from './recording.controller';
import { RecordingService } from './recording.service';
import { RecordingSchema } from './schemas/recording.schema';

jest.mock('./file-upload.service');

describe('RecordingController', () => {
  let recordingController: RecordingController;
  let recordingService: RecordingService;
  let fileUploadService: FileUploadService;
  let recordingModel: Model<Recording>;

  const _id = '507f191e810c19729de860ea';
  const data: CreateRecordingDto = {
    mediaPath: 'test/path',
    sampleRate: 16000,
    phoneMetadata: 'Android',
    speaker: {
      initials: 'AB',
      age: 26,
      sex: 'M',
      origin: 'SP',
      motherLanguage: 'EN_US',
    },
  };

  beforeEach(() => {
    recordingModel = model('Recording', RecordingSchema);
    fileUploadService = new FileUploadService(null)
    mockingoose(recordingModel).toReturn({ _id, ...data }, 'save');
    recordingService = new RecordingService(recordingModel, fileUploadService);
    recordingController = new RecordingController(recordingService);
  });

  describe('create', () => {
    it('should create a recording to database', async () => {
      const file: FileInterface = {
        size: 10, buffer: [], encoding: 'utf-8', mimetype: 'audio/wave', fieldname: 'file', originalname: 'test.wav'
      };
      const recording = await recordingController.createRecording(data, file).toPromise();
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