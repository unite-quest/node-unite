import CreateThemePhraseDto from './create-theme-phrase.dto';

export default class CreateThemeDto {
  title: string;
  cover: string;
  phrases: CreateThemePhraseDto[];
}
