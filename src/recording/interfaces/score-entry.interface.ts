import { RecordingModalTypes } from "../dto/recording-modal-types";

export const ScoringValues: { [type in RecordingModalTypes]: number } = {
  [RecordingModalTypes.FIRST_RECORDING]: 100,
  [RecordingModalTypes.FIRST_THEME]: 300,
}

export interface ScoreEntry {
  score: number;
  reason: RecordingModalTypes;
}
