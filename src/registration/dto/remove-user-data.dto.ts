import { IsNotEmpty } from 'class-validator';

export default class RemoveUserDataDto {
  @IsNotEmpty()
  keepUserData: boolean;
  reason?: string;
}
