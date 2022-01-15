import { Model, model } from 'mongoose';
import { UserRecording } from '../recording/interfaces/user-recording.interface';
import { UserRecordingSchema } from '../recording/schemas/user-recording.schema';
import { UserRecordingService } from '../recording/user-recording.service';
import { StatsService } from './stats.service';

describe('StatsService', () => {
  let service: StatsService;

  let userRecordingService: UserRecordingService;
  let userRecordingModel: Model<UserRecording>;

  beforeEach(() => {
    userRecordingModel = model<UserRecording>(
      'UserRecording',
      UserRecordingSchema,
    );
    userRecordingService = new UserRecordingService(userRecordingModel);
    service = new StatsService(userRecordingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
