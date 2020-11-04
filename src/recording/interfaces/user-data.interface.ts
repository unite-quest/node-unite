export interface UserMetadata {
  firebaseId: string;
  nickname?: string;
  gender?: 'F' | 'M' | 'O';
  ageInterval?: string;
  region?: string;
  dialect?: string;
}
