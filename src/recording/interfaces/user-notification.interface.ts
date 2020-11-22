
export default interface UserNotification {
  readonly type: 'FOLLOW' | 'REFER';
  dismissed: boolean;
  follow?: {
    scoringId: string,
    name: string,
  };
}
