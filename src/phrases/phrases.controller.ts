import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import CreateThemeDto from './dto/create-theme.dto';
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
  getPhrasesByGroup(@Param('theme') theme): Promise<PhrasesInterface> {
    return this.phrasesService.getGroup(theme);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post(':theme')
  addPhraseToGroup(@Param('theme') theme, @Body() payload: CreateThemeDto): Promise<PhrasesInterface> {
    return this.phrasesService.createGroup({ ...payload, title: theme });
  }
}
