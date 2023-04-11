import { Document } from 'mongoose';

export default interface PhrasesInterface extends Document {
  readonly themeId: string;
  readonly title: string;
  readonly cover: string;
  readonly phrases: {
    _id: string;
    text: string;
  }[];
}
