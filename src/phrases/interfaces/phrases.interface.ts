import { Document } from 'mongoose';

export default interface PhrasesInterface extends Document {
  readonly title: string;
  readonly cover: string;
  readonly phrases: {
    _id: string,
    text: string,
  }[];
}
