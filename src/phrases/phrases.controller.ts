import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { LooseFirebaseAuthGuard } from '../auth/loose-firebase-auth.guard';
import CreateThemeDto from './dto/create-theme.dto';
import ThemePhrasesResponseDto from './dto/theme-phrases-response.dto';
import PhrasesInterface from './interfaces/phrases.interface';
import { PhrasesService } from './phrases.service';

@Controller('phrases')
export class PhrasesController {
  constructor(private readonly phrasesService: PhrasesService) {}

  /**
   * On first get, creates empty user
   *
   * @param {*} theme
   * @returns {Promise<PhrasesInterface>}
   * @memberof PhrasesController
   */
  @UseGuards(FirebaseAuthGuard)
  @Get('theme/:themeId')
  async getPhrasesByGroup(
    @Param('themeId') themeId,
  ): Promise<ThemePhrasesResponseDto> {
    const user = AuthService.getLoggedUser();
    return this.phrasesService.getTheme(themeId, user);
  }

  @Post('theme')
  addPhraseToGroup(@Body() payload: CreateThemeDto): Promise<PhrasesInterface> {
    return this.phrasesService.createTheme(payload);
  }

  @UseGuards(LooseFirebaseAuthGuard)
  @Get('random')
  async getRandomTheme(): Promise<{ themeId: string }> {
    const user = AuthService.getLoggedUser();
    return await this.phrasesService.getRandomTheme(user);
  }
}
