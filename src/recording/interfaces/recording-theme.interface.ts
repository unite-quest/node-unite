import { Recording } from './recording.interface';

export default interface RecordingTheme {
  readonly title: string;
  finished: boolean;
  readonly recordings: Recording[];
}
