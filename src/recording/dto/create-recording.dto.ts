import { CreateSpeakerDto } from "./create-speaker.dto";

export class CreateRecordingDto {
  word: string;
  sampleRate: number;
  noiseLevel: string;
  recordingPath: string;
  additionalMetadata: {
    userAgent: string;
  };
  speaker: CreateSpeakerDto;
}