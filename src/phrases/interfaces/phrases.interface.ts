import { Document } from 'mongoose';

export default interface PhrasesInterface extends Document {
  readonly title: string;
  readonly phrases: {
    text: String
  }[];
}
