export default interface LeaderboardEntryDto {
  nickname: {
    full: string,
    short: string,
  };
  position?: number;
  score?: number;
  actions?: {
    follow: boolean,
    unfollow: boolean,
  };
}