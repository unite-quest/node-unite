import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import AuthUserModel from '../auth/auth-user.model';
import { ScoringTypes } from './interfaces/scoring-types';
import { ScoringValues } from './interfaces/scoring-values';
import { UserScoreEntry } from './interfaces/user-score-entry.interface';
import { UserScore, UserScoreBase } from './interfaces/user-score.interface';

@Injectable()
export class ScoringService {
  constructor(
    @Inject('USER_SCORING_MODEL')
    private userScoringModel: Model<UserScore>,
  ) { }

  public async assignScoreName(user: AuthUserModel, nickname: string): Promise<void> {
    const scoring = await this.getOrCreateUserScoring(user);
    scoring.nickname = nickname;
    await scoring.save();
  }

  public async scoreForRegistration(user: AuthUserModel): Promise<UserScoreEntry> {
    let scoring = await this.getOrCreateUserScoring(user);

    const type = ScoringTypes.REGISTRATION;
    const registrationEntry = scoring.entries.find(entry => entry.reason === type);
    if (registrationEntry) {
      return null;
    }

    const entry = this.getScoreEntryFor(type);
    scoring = this.pushEntry(scoring, entry);
    await scoring.save();
    return entry;
  }

  public async scoreForRecordingTheme(user: AuthUserModel): Promise<UserScoreEntry> {
    let scoring = await this.getOrCreateUserScoring(user);

    const firstTheme = scoring.entries.find(entry => entry.reason === ScoringTypes.FIRST_THEME);
    let entry: UserScoreEntry;
    if (!firstTheme) { // never recorded
      entry = this.getScoreEntryFor(ScoringTypes.FIRST_THEME);
    } else {
      entry = this.getScoreEntryFor(ScoringTypes.FINISHED_THEME);
    }

    scoring = this.pushEntry(scoring, entry);
    await scoring.save();
    return entry;
  }

  public async scoreForRecordingOnce(user: AuthUserModel): Promise<UserScoreEntry> {
    let scoring = await this.getOrCreateUserScoring(user);
    const type = ScoringTypes.FIRST_RECORDING;

    const firstTheme = scoring.entries.find(entry => entry.reason === type);
    if (!firstTheme) { // never recorded
      const entry = this.getScoreEntryFor(type);
      scoring = this.pushEntry(scoring, entry);
      await scoring.save();
      return entry;
    }

    return null;
  }

  public async scoreForRecommendation(user: AuthUserModel): Promise<UserScoreEntry> {
    let scoring = await this.getOrCreateUserScoring(user);
    const entry = this.getScoreEntryFor(ScoringTypes.RECOMMENDATION);
    scoring = this.pushEntry(scoring, entry);
    await scoring.save();
    return entry;
  }

  public async getTopScores(): Promise<UserScore[]> {
    return await this.userScoringModel
      .find({ nickname: { '$nin': [null, ''] } })
      .sort({ total: -1 })
      .limit(10);
  }

  public async getFriendScores(user: AuthUserModel): Promise<UserScore[]> {
    const scoring = await this.getOrCreateUserScoring(user);

    // also include self
    const ids = scoring.friends.map(friend => friend.firebaseId).concat([scoring.firebaseId]);
    return await this.userScoringModel
      .find({ 'firebaseId': { '$in': ids } })
      .sort({ total: -1 })
      .limit(10);
  }

  // badly badly badly optimized
  public async getUserPositionInLeaderboard(user: UserScore): Promise<number> {
    const userScores = await this.userScoringModel
      .find() // pls help
      .sort({ total: -1 })
      .exec();

    const ids: string[] = userScores.map(user => user.firebaseId);
    return ids.indexOf(user.firebaseId);
  }

  public async getOrCreateUserScoring(user: AuthUserModel): Promise<UserScore> {
    const scoring = await this.userScoringModel.findOne({ 'firebaseId': user.uid });
    if (scoring) {
      return scoring;
    }

    const emptyUserScore: UserScoreBase = {
      firebaseId: user.uid,
      nickname: '',
      total: 0,
      entries: [],
      friends: [],
    }

    return this.userScoringModel.create(emptyUserScore);
  }

  public async searchUsersByNickname(nickname: string, loggedUser: UserScore): Promise<UserScore[]> {
    if (!nickname) {
      return [];
    }

    return await this.userScoringModel.find({
      nickname: { $regex: nickname, $options: 'i' },
      firebaseId: { $nin: [loggedUser.firebaseId] }, // excludes self
    });
  }

  public async searchUserById(_id: string): Promise<UserScore> {
    if (!_id) {
      return null;
    }

    return await this.userScoringModel.findOne({ _id });
  }

  public async removeScoringData(user: AuthUserModel): Promise<UserScore> {
    const scoring = await this.userScoringModel.findOne({ 'firebaseId': user.uid });
    if (!scoring) {
      return;
    }

    return scoring.remove();
  }

  public async mergeUser(oldUid: string, user: AuthUserModel): Promise<void> {
    if (!oldUid || !user) {
      return;
    }

    const oldScoring = await this.userScoringModel.findOne({ 'firebaseId': oldUid });
    const newScoring = await this.getOrCreateUserScoring(user);

    if (!oldScoring || !newScoring) {
      return;
    }

    if (newScoring.total > oldScoring.total) {
      console.log('Since new scoring has more points than old scoring, no need to merge');
      return;
    }

    newScoring.total = oldScoring.total;
    newScoring.nickname = oldScoring.nickname;
    newScoring.entries = oldScoring.entries;
    newScoring.friends = oldScoring.friends;
    await oldScoring.remove();
    await newScoring.save()
  }

  private pushEntry(scoring: UserScore, entry: UserScoreEntry): UserScore {
    if (entry) {
      scoring.entries.push(entry);
      scoring.total += entry.score; // update total
    }
    return scoring;
  }

  private getScoreEntryFor(type: ScoringTypes): UserScoreEntry {
    if (!ScoringValues[type]) {
      return;
    }

    return {
      score: ScoringValues[type],
      reason: type,
    }
  }
}
