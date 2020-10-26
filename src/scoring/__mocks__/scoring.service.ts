import { Injectable } from '@nestjs/common';
import AuthUserModel from '../../auth/auth-user.model';
import { ScoringTypes } from '../interfaces/scoring-types';
import { UserScoreEntry } from '../interfaces/user-score-entry.interface';
import { UserScoreBase } from '../interfaces/user-score.interface';

@Injectable()
export class ScoringService {
  public async getOrCreateUserScoring(user: AuthUserModel): Promise<UserScoreBase> {
    return {
      firebaseId: user.uid,
      nickname: '',
      total: 0,
      entries: [],
      friends: [],
    };
  }

  public async scoreForRecordingOnce(user: AuthUserModel): Promise<UserScoreEntry> {
    return {
      score: 100,
      reason: ScoringTypes.FIRST_RECORDING,
    };
  }

}
