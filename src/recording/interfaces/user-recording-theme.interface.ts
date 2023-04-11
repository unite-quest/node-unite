import { Recording } from './recording.interface';

export default interface UserRecordingTheme {
  readonly themeId: string;
  finished: boolean;
  readonly recordings: Recording[];
}
