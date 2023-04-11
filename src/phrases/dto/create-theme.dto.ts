import CreateThemePhraseDto from './create-theme-phrase.dto';

export default class CreateThemeDto {
  themeId: string;
  title: string;
  cover: string;
  phrases: CreateThemePhraseDto[];
}
