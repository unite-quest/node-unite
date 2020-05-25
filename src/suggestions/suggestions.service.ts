import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { Model } from 'mongoose';

import { SuggestionsBlacklist } from './interfaces/suggestions-blacklist.interface';

@Injectable()
export class SuggestionsService {
  private _listCache: string[] = null;

  constructor(
    @Inject('SUGGESTIONS_BLACKLIST_MODEL')
    private suggestionsBlacklistModel: Model<SuggestionsBlacklist>,
  ) { }

  getRandomizedWord() {
    if (!this._listCache) {
      var data = fs.readFileSync('assets/corpus.txt');
      this._listCache = data.toString().split('\r\n');
    }
    const randomizedIndex: number = Math.floor(Math.random() * this._listCache.length);
    return this._listCache[randomizedIndex].toLowerCase();
  }

  blacklistWord(word: string): Promise<SuggestionsBlacklist> {
    return this.suggestionsBlacklistModel.create({ word });
  }
}
