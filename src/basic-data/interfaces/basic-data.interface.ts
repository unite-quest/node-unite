import { Document } from 'mongoose';

export interface BasicData extends Document {
  email: string;
  firstName: string;
  sex: 'F' | 'M' | 'O';
  age: string;
  region: string;
  dialect: string;
}