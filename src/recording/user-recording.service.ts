import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import AuthUserModel from '../auth/auth-user.model';
import { UserRecording } from './interfaces/user-recording.interface';

@Injectable()
export class UserRecordingService {
  constructor(
    @Inject('USER_RECORDING_MODEL')
    private userRecordingModel: Model<UserRecording>,
  ) { }

  public async createEmptyUserIfNonExistent(user: AuthUserModel): Promise<UserRecording> {
    const dbUser = await this.userRecordingModel.findOne({ 'user.firebaseId': user.uid }).exec();
    if (dbUser) {
      return dbUser;
    }

    return this.userRecordingModel.create({
      user: {
        firebaseId: user.uid,
      },
      themes: [],
      scoring: [],
    });
  }
}
