export default interface DashboardNotificationDto {
  type: 'FOLLOW' | 'REFER';
  follow?: {
    id: string,
    name: string,
  };
}