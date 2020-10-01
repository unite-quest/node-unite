export default class AppendUserRecordingDto {
  phraseId: string;
  sampleRate: number;
  duration: string;
  additionalMetadata: {
    userAgent: string;
  };
}
