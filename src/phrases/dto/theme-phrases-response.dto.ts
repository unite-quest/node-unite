import ThemePhrasesItemResponseDto from './theme-phrases-item-response.dto';
import { ThemePhrasesModalEventResponseDto } from './theme-phrases-modal-event-response.dto';

export default interface ThemePhrasesResponseDto {
  title: string;
  cover: string;
  stepsCap: number;
  total: number;
  phrases: ThemePhrasesItemResponseDto[];
  modalEvents: ThemePhrasesModalEventResponseDto[];
}
