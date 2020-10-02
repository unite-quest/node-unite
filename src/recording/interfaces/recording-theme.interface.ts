import { Recording } from './recording.interface';

export default interface RecordingTheme {
  readonly title: string;
  readonly recordings: Recording[];
}
