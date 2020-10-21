import { Injectable } from '@nestjs/common';
import AuthUserModel from '../../auth/auth-user.model';
import { UserMetadata } from '../interfaces/user-data.interface';
import UserRecordingTheme from '../interfaces/user-recording-theme.interface';
import { UserRecording } from '../interfaces/user-recording.interface';


export interface MockUserRecording {
  readonly user: UserMetadata;
  readonly themes: UserRecordingTheme[];
}


@Injectable()
export class UserRecordingService {
  public async getOrCreateUser(user: AuthUserModel): Promise<MockUserRecording> {
    return {
      user: {
        firebaseId: 'firebaseId',
      },
      themes: [],
    }
  }

  public async getUser(user: AuthUserModel): Promise<MockUserRecording> {
    return {
      user: {
        firebaseId: 'firebaseId',
      },
      themes: [],
    }
  }

  public async getUserRecordingTheme(theme: string, loggedUser: AuthUserModel): Promise<UserRecordingTheme> {
    return {
      finished: false,
      title: 'asd',
      recordings: [],
    }
  }

  public filterRecordingTheme(theme: string, user: UserRecording): UserRecordingTheme {
    return user ? user.themes.find((each) => each.title === theme) : null;
  }
}
