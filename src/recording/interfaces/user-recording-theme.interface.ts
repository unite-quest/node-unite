import { Recording } from './recording.interface';

export default interface UserRecordingTheme {
  readonly title: string;
  finished: boolean;
  readonly recordings: Recording[];
}
