import ThemePhrasesItemResponseDto from "./theme-phrases-item-response.dto";

export default class ThemePhrasesResponseDto {
  title: string;
  cover: string;
  stepsCap: number;
  total: number;
  phrases: ThemePhrasesItemResponseDto[];
}