import { Document } from 'mongoose';
import { UserFriend } from './user-friend.interface';
import { UserScoreEntry } from './user-score-entry.interface';

export interface UserScore extends UserScoreBase, Document { }

export interface UserScoreBase {
  readonly firebaseId: string;
  nickname: string;
  total: number;
  entries: UserScoreEntry[];
  friends: UserFriend[];
}
