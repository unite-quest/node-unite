import { UserScoreEntry } from "../../scoring/interfaces/user-score-entry.interface";

export default class AppendUserRecordingResponseDto {
  modal?: {
    type: string, // fix "any"
    score: number;
  };
  hasNext: boolean;

  constructor(score: UserScoreEntry, hasNext: boolean) {
    if (score) {
      this.modal = {
        type: score.reason,
        score: score.score
      }
    }
    this.hasNext = hasNext;
  }
}
