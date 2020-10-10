import { Injectable } from '@nestjs/common';
import { RecordingModalTypes } from './dto/recording-modal-types';
import { ScoreEntry } from './interfaces/score-entry.interface';
import { UserRecording } from './interfaces/user-recording.interface';

@Injectable()
export class ScoringService {
  /**
   * Based on user data, returns next score if available
   *
   * @param {UserRecording} user
   * @returns {(Promise<ScoreEntry | null>)}
   * @memberof ScoringService
   */
  getNextScore(user: UserRecording, currentValidRecordings: number): Promise<ScoreEntry | null> {
    if (!user || !user.scoring) {
      return;
    }

    const length = user.scoring.length;
    let entry: ScoreEntry = null;

    if (currentValidRecordings === 1 && length === 0) { // no recordings and no scores
      entry = {
        score: 100,
        reason: RecordingModalTypes.FIRST_RECORDING,
      };
    } else if (currentValidRecordings === 6 && length === 1) { // minimum recordings to finish theme and at least one score
      entry = {
        score: 300,
        reason: RecordingModalTypes.FIRST_THEME,
      };
    }

    return Promise.resolve(entry);
  }

  calculateTotal(user: UserRecording): number {
    return user.scoring.reduce((acc, cur) => {
      return acc + cur.score;
    }, 0);
  }
}
