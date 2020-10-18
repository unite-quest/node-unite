import { Injectable } from '@nestjs/common';
import * as additionalFilters from './foul-language/additional-filters';
const Piii = require("piii");
const piiiFilters = require("piii-filters");

@Injectable()
export class FoulLanguageService {
  private validator: any;

  constructor() {
    this.validator = new Piii({
      filters: [
        ...Object.values(piiiFilters),
        ...Object.values(additionalFilters),
      ]
    });
  }

  public check(text: string): boolean {
    return this.validator.has(text);
  }
}
