import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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

    const emptyUserScore: UserScoreBase = this.getEmptyUserScore(user.uid);
    return this.userScoringModel.create(emptyUserScore);
  }

  private getEmptyUserScore(firebaseId: string): UserScoreBase {
    return {
      firebaseId,
      nickname: '',
      total: 0,
      entries: [],
      friends: [],
    };
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

  public async removeScoringData(user: AuthUserModel): Promise<void> {
    const scoring = await this.userScoringModel.findOne({ 'firebaseId': user.uid });
    if (!scoring) {
      return;
    }

    await scoring.remove();
  }

  public async mergeUser(oldUid: string, loggedUser: AuthUserModel): Promise<void> {
    if (!oldUid || !loggedUser) {
      return;
    }

    const oldScoring = await this.userScoringModel.findOne({ 'firebaseId': oldUid });
    const newScoring = await this.userScoringModel.findOne({ 'firebaseId': loggedUser.uid });

    if (!oldScoring) {
      throw new BadRequestException('Unable to merge scoring, invalid old user provided');
    }

    if (!newScoring) { // first time scoring on new user
      const migratedScoring = this.getEmptyUserScore(loggedUser.uid);
      if (oldScoring) { // if old user exists, migrate data
        migratedScoring.total = oldScoring.total;
        migratedScoring.nickname = oldScoring.nickname;
        migratedScoring.entries = oldScoring.entries;
        migratedScoring.friends = oldScoring.friends;
        await oldScoring.remove();
      } // if not, just create user
      await this.userScoringModel.create(migratedScoring);
    } else { } // user exists, no need to migrate (even if score differs)
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
