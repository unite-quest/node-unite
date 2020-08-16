import { Document } from 'mongoose';

export interface Speaker extends Document {
  readonly initials: number;
  readonly age: number;
  readonly sex: string;
  readonly origin: string;
  readonly motherLanguage: string;
}