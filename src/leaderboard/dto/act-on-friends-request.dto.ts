import { IsNotEmpty } from "class-validator";

export default class ActOnFriendsRequestDto {
  @IsNotEmpty()
  friendId: string;
  @IsNotEmpty()
  actions: {
    follow: boolean,
    unfollow: boolean,
  };
}