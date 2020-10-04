import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import CreateThemeDto from './dto/create-theme.dto';
import ThemePhrasesResponseDto from './dto/theme-phrases-response.dto';
import PhrasesInterface from './interfaces/phrases.interface';
import { PhrasesService } from './phrases.service';


@Controller('phrases')
export class PhrasesController {
  constructor(
    private readonly phrasesService: PhrasesService,
  ) { }


  /**
   * On first get, populates phrases in user recording
   *
   * @param {*} theme
   * @returns {Promise<PhrasesInterface>}
   * @memberof PhrasesController
   */
  @UseGuards(FirebaseAuthGuard)
  @Get(':theme')
  getPhrasesByGroup(@Param('theme') theme): Promise<ThemePhrasesResponseDto> {
    const user = AuthService.getLoggedUser();
    return this.phrasesService.getGroup(theme, user);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post(':theme')
  addPhraseToGroup(@Param('theme') theme, @Body() payload: CreateThemeDto): Promise<PhrasesInterface> {
    return this.phrasesService.createGroup({ ...payload, title: theme });
  }
}
