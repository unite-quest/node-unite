export default interface LeaderboardEntryDto {
  id: string;
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
