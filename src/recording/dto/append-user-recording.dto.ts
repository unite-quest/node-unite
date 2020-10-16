import { IsNotEmpty } from 'class-validator';

export default class AppendUserRecordingDto {
  @IsNotEmpty()
  themeId: string;
  @IsNotEmpty()
  phraseId: string;
  sampleRate: number;
  duration: string;
  additionalMetadata: {
    userAgent: string;
  };
}
