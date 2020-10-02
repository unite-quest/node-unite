export interface UserMetadata {
  readonly firebaseId: string;
  readonly nickname?: string;
  readonly sex?: 'F' | 'M' | 'O';
  readonly ageInterval?: string;
  readonly region?: string;
  readonly dialect?: string;
}
