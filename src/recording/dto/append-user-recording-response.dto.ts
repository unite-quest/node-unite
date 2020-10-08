import { ScoreEntry, ScoringValues } from "../interfaces/score-entry.interface";
import { RecordingModalTypes } from "./recording-modal-types";

export default class AppendUserRecordingResponseDto {
  modal?: {
    type: RecordingModalTypes,
    score: number;
  };
  hasNext: boolean;

  constructor(score: ScoreEntry, hasNext: boolean) {
    if (score) {
      this.modal = {
        type: score.reason,
        score: ScoringValues[score.reason],
      }
    }
    this.hasNext = hasNext;
  }
}
