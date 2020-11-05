import mockingoose from 'mockingoose';
import { Model, model } from 'mongoose';
import { ScoringService } from '../scoring/scoring.service';
import AppendUserRecordingDto from './dto/append-user-recording.dto';
import { FileDownloadService } from './file-download.service';
import { FileUploadService } from './file-upload.service';
import { FileInterface } from './interfaces/file.interface';
import { UserRecording } from './interfaces/user-recording.interface';
import { RecordingController } from './recording.controller';
import { RecordingService } from './recording.service';
import { UserRecordingSchema } from './schemas/user-recording.schema';
import { UserRecordingService } from './user-recording.service';

jest.mock('./file-upload.service');
jest.mock('./file-download.service');
jest.mock('../auth/auth.service');
jest.mock('../scoring/scoring.service');

describe('RecordingController', () => {
  let recordingController: RecordingController;
  let recordingService: RecordingService;
  let fileUploadService: FileUploadService;
  let fileDownloadService: FileDownloadService;
  let scoringService: ScoringService;
  let userRecordingService: UserRecordingService;
  let userRecordingModel: Model<UserRecording>;

  const _id = '507f191e810c19729de860ea';
  const data: AppendUserRecordingDto = {
    phraseId: 'phraseId--222',
    themeId: 'theme-t',
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
    fileUploadService = new FileUploadService(null);
    fileDownloadService = new FileDownloadService(null);
    scoringService = new ScoringService(null);
    userRecordingService = new UserRecordingService(userRecordingModel);

    mockingoose(userRecordingModel).toReturn({ _id, ...userRecording }, 'findOne');
    recordingService = new RecordingService(
      userRecordingService, fileUploadService, fileDownloadService, scoringService,
    );
    recordingController = new RecordingController(recordingService);
  });

  describe('create', () => {
    it('should create a recording to database', async () => {
      const file: FileInterface = {
        size: 10, buffer: [], encoding: 'utf-8', mimetype: 'audio/wave', fieldname: 'file', originalname: 'test.wav'
      };
      const response = await recordingController.appendRecording(data, file);
      expect(response.hasNext).toEqual(true);
      expect(response.modal.score).toEqual(100);
      expect(response.modal.type).toEqual('FIRST_RECORDING');
    });
  });
});