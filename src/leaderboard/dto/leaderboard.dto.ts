import LeaderboardEntryDto from "./leaderboard-entry.dto copy";

export default interface LeaderboardDto {
  ranking: LeaderboardEntryDto[];
  user: LeaderboardEntryDto;
}
