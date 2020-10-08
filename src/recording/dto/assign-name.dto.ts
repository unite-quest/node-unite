import { IsNotEmpty } from 'class-validator';

export default class AssignNameDto {
  @IsNotEmpty()
  name: string;
}
