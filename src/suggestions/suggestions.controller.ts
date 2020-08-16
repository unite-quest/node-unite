import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { SuggestionsService } from './suggestions.service';


@Controller('suggestions')
export class SuggestionsController {
  constructor(
    private readonly suggestionsService: SuggestionsService,
  ) { }

  @UseGuards(FirebaseAuthGuard)
  @Get()
  getWordSuggestion() {
    return this.suggestionsService.getRandomizedWord();
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('blacklist')
  blacklistWord(@Body() payload: any) {
    return this.suggestionsService.blacklistWord(payload.word);
  }
}
