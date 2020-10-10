import DashboardResponseActionDto from "./dashboard-response-action.dto";

export default interface DashboardResponseDto {
  user: {
    name: string,
  };
  score: {
    total: number,
  };
  actions: DashboardResponseActionDto[];
}