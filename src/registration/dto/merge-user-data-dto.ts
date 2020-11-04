import { IsNotEmpty } from 'class-validator';

export default class MergeUserDataDto {
  @IsNotEmpty()
  oldToken: string;
}
