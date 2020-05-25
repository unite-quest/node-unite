import { CreateSpeakerDto } from './create-speaker.dto';

export class CreateRecordingDto {
  mediaPath: string;
  sampleRate: number;
  phoneMetadata: string;
  speaker: CreateSpeakerDto;
}