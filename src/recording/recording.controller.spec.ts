import mockingoose from 'mockingoose';
import { Model, model } from 'mongoose';
import AppendUserRecordingDto from './dto/append-user-recording.dto';
import { FileUploadService } from './file-upload.service';
import { FileInterface } from './interfaces/file.interface';
import { UserRecording } from './interfaces/user-recording.interface';
import { RecordingController } from './recording.controller';
import { RecordingService } from './recording.service';
import { UserRecordingSchema } from './schemas/user-recording.schema';
import { ScoringService } from './scoring.service';
import { UserRecordingService } from './user-recording.service';

jest.mock('./file-upload.service');
jest.mock('../auth/auth.service');

describe('RecordingController', () => {
  let recordingController: RecordingController;
  let recordingService: RecordingService;
  let fileUploadService: FileUploadService;
  let scoringService: ScoringService;
  let userRecordingService: UserRecordingService;
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
    scoringService = new ScoringService();
    userRecordingService = new UserRecordingService(userRecordingModel);

    mockingoose(userRecordingModel).toReturn({ _id, ...userRecording }, 'findOne');
    recordingService = new RecordingService(userRecordingService, fileUploadService, scoringService);
    recordingController = new RecordingController(recordingService);
  });

  describe('create', () => {
    it('should create a recording to database', async () => {
      const theme = 'theme-t';
      const file: FileInterface = {
        size: 10, buffer: [], encoding: 'utf-8', mimetype: 'audio/wave', fieldname: 'file', originalname: 'test.wav'
      };
      const response = await recordingController.appendRecording(data, theme, file);
      expect(response.hasNext).toEqual(true);
      expect(response.modal.score).toEqual(100);
      expect(response.modal.type).toEqual('FIRST_RECORDING');
    });
  });
});