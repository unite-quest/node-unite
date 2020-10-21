import { ScoringTypes } from "./scoring-types";

export const ScoringValues: { [type in ScoringTypes]: number } = {
  [ScoringTypes.FIRST_RECORDING]: 100,
  [ScoringTypes.FIRST_THEME]: 300,
  [ScoringTypes.REGISTRATION]: 500,
  [ScoringTypes.FINISHED_THEME]: 150,
  [ScoringTypes.RECOMMENDATION]: 100,
}