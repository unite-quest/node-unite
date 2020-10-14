import { IsNotEmpty } from "class-validator";

export class SkipRecordingDto {
  @IsNotEmpty()
  themeId: string;
  @IsNotEmpty()
  phraseId: string;
  @IsNotEmpty()
  reason: string;
}
