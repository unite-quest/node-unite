import { IsNotEmpty } from 'class-validator';

export default class ValidateNicknameDto {
  @IsNotEmpty()
  nickname: string;
}
