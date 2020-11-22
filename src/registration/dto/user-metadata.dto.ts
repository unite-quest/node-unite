import DashboardNotificationDto from "src/dashboard/dto/dashboard-notification.dto";

export default class UserMetadataDto {
  nickname: string;
  gender: string;
  ageInterval: string;
  region: string;
  dialect: string;
  notifications: DashboardNotificationDto[];
}
