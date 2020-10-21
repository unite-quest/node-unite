import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import AuthUserModel from 'src/auth/auth-user.model';
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
    return await this.userScoringModel.find({}).sort(['total', -1]).limit(10);
  }

  public async getFriendScores(user: AuthUserModel): Promise<UserScore[]> {
    let scoring = await this.getOrCreateUserScoring(user);
    const ids = scoring.friends.map(friend => friend.firebaseId);
    return await this.userScoringModel
      .find({ 'firebaseId': { '$in': ids } }).sort(['total', -1]).limit(10);
  }

  public async getOrCreateUserScoring(user: AuthUserModel): Promise<UserScore> {
    const scoring = await this.userScoringModel.findOne({ 'firebaseId': user.uid });
    if (scoring) {
      return scoring;
    }

    const emptyUserScore: UserScoreBase = {
      firebaseId: user.uid,
      total: 0,
      entries: [],
      friends: [],
    }

    return this.userScoringModel.create(emptyUserScore);
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

  // getNextScore(user: UserRecording, currentValidRecordings: number): Promise<ScoreEntry | null> {
  //   if (!user || !user.scoring) {
  //     return;
  //   }


  //   const length = user.scoring.length;
  //   let entry: ScoreEntry = null;

  //   if (length === 0 && currentValidRecordings === 1) { // no recordings and no scores
  //     entry = {
  //       score: 100,
  //       reason: RecordingModalTypes.FIRST_RECORDING,
  //     };
  //   } else if (length === 1 && currentValidRecordings === 6) { // minimum recordings to finish theme and at least one score
  //     entry = {
  //       score: 300,
  //       reason: RecordingModalTypes.FIRST_THEME,
  //     };
  //   } else if (length > 1 && currentValidRecordings === 6) {
  //     entry = {
  //       score: 150,
  //       reason: RecordingModalTypes.FIRST_THEME,
  //     };
  //   }

  //   return Promise.resolve(entry);
  // }
}
