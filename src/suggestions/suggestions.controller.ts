import { Body, Controller, Get, Post } from '@nestjs/common';

import { SuggestionsService } from './suggestions.service';

@Controller('suggestions')
export class SuggestionsController {
  constructor(
    private readonly suggestionsService: SuggestionsService,
  ) { }

  @Get()
  getWordSuggestion() {
    return this.suggestionsService.getRandomizedWord();
  }

  @Post('blacklist')
  blacklistWord(@Body() payload: any) {
    return this.suggestionsService.blacklistWord(payload.word);
  }
}
