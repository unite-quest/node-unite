import mockingoose from 'mockingoose';
import { Model, model } from 'mongoose';
import AppendUserRecordingDto from './dto/append-user-recording.dto';
import { FileUploadService } from './file-upload.service';
import { FileInterface } from './interfaces/file.interface';
import RecordingTheme from './interfaces/recording-theme.interface';
import { UserRecording } from './interfaces/user-recording.interface';
import { RecordingController } from './recording.controller';
import { RecordingService } from './recording.service';
import { UserRecordingSchema } from './schemas/user-recording.schema';

jest.mock('./file-upload.service');
jest.mock('../auth/auth.service');

describe('RecordingController', () => {
  let recordingController: RecordingController;
  let recordingService: RecordingService;
  let fileUploadService: FileUploadService;
  let userRecordingModel: Model<UserRecording>;

  const _id = '507f191e810c19729de860ea';
  const data: AppendUserRecordingDto = {
    phraseId: 'phraseId--222',
    sampleRate: 16000,
    duration: '1234',
    additionalMetadata: {
      userAgent: 'Android',
    },
  };

  const userRecording = {
    user: {
      firebaseId: 'firebased',
    },
    themes: [],
  }

  beforeEach(() => {
    userRecordingModel = model('UserRecording', UserRecordingSchema);
    fileUploadService = new FileUploadService(null)
    mockingoose(userRecordingModel).toReturn({ _id, ...userRecording }, 'findOne');
    recordingService = new RecordingService(userRecordingModel, fileUploadService);
    recordingController = new RecordingController(recordingService);
  });

  describe('create', () => {
    it('should create a recording to database', async () => {
      const theme = 'theme-t';
      const file: FileInterface = {
        size: 10, buffer: [], encoding: 'utf-8', mimetype: 'audio/wave', fieldname: 'file', originalname: 'test.wav'
      };
      const recording: RecordingTheme = (await recordingController.appendRecording(data, theme, file) as RecordingTheme);
      expect(recording.title).toEqual(theme);
      expect(recording.recordings[0].phraseId).toEqual('phraseId--222');
      expect(recording.recordings[0].recordingPath).toEqual('path-to-wav.wav');
      expect(recording.recordings[0].sampleRate).toEqual(16000);
      expect(recording.recordings[0].format).toEqual('wav');
      expect(recording.recordings[0].duration).toEqual('1234');
      expect(recording.recordings[0].skipped).toEqual(false);
    });
  });
});