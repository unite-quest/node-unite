import { RecordingModalTypes } from '../../recording/dto/recording-modal-types';

export interface ThemePhrasesModalEventResponseDto {
  type: RecordingModalTypes,
  eventIndex: number;
  score: number;
}
