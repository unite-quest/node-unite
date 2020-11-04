import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import AuthUserModel from '../auth/auth-user.model';
import UserRecordingTheme from './interfaces/user-recording-theme.interface';
import { UserRecording, UserRecordingBase } from './interfaces/user-recording.interface';

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
    const emptyUser: UserRecordingBase = {
      user: {
        firebaseId: user.uid,
      },
      themes: [],
    };
    return this.userRecordingModel.create(emptyUser);
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

  public async mergeUsers(oldUserUid: string, loggedUser: AuthUserModel): Promise<void> {
    if (!oldUserUid || !loggedUser) {
      return;
    }

    const newUser = await this.getOrCreateUser(loggedUser);
    // should only migrate anon users
    const oldUser = await this.userRecordingModel.findOne({ 'user.firebaseId': oldUserUid }).exec();

    if (!newUser || !oldUser) {
      return;
    }

    const backupId = newUser.user.firebaseId;
    newUser.themes = oldUser.themes;
    newUser.user = oldUser.user;
    newUser.user.firebaseId = backupId;

    await oldUser.remove()
    await newUser.save();
  }
}
