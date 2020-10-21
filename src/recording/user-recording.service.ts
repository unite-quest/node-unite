import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import AuthUserModel from '../auth/auth-user.model';
import UserRecordingTheme from './interfaces/user-recording-theme.interface';
import { UserRecording } from './interfaces/user-recording.interface';

@Injectable()
export class UserRecordingService {
  constructor(
    @Inject('USER_RECORDING_MODEL')
    private userRecordingModel: Model<UserRecording>,
  ) { }

  public async getOrCreateUser(user: AuthUserModel): Promise<UserRecording> {
    const dbUser = await this.getUser(user);
    if (dbUser) {
      return dbUser;
    }

    return this.userRecordingModel.create({
      user: {
        firebaseId: user.uid,
      },
      themes: [],
    });
  }

  public async getUser(user: AuthUserModel): Promise<UserRecording | null> {
    return await this.userRecordingModel.findOne({ 'user.firebaseId': user.uid }).exec();
  }

  public async getUserRecordingTheme(theme: string, loggedUser: AuthUserModel): Promise<UserRecordingTheme | null> {
    const user = await this.userRecordingModel.findOne({ 'user.firebaseId': loggedUser.uid }).exec();
    return this.filterRecordingTheme(theme, user);
  }

  public async getUserByNickname(nickname: string): Promise<UserRecording | null> {
    return await this.userRecordingModel.findOne({ 'user.nickname': nickname }).exec()
  }

  public filterRecordingTheme(theme: string, user: UserRecording): UserRecordingTheme | null {
    return user ? user.themes.find((each) => each.title === theme) : null;
  }
}
