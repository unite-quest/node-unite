import { Document } from 'mongoose';

export interface SuggestionsBlacklist extends Document {
  readonly word: string;
}