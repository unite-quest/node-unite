import { ScoringTypes } from './scoring-types';

export interface UserScoreEntry {
  score: number;
  reason: ScoringTypes;
}