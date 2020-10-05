import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { UserRecordingService } from '../recording/user-recording.service';
import CreateThemeDto from './dto/create-theme.dto';
import ThemePhrasesResponseDto from './dto/theme-phrases-response.dto';
import PhrasesInterface from './interfaces/phrases.interface';
import { PhrasesService } from './phrases.service';

@Controller('phrases')
export class PhrasesController {
  constructor(
    private readonly phrasesService: PhrasesService,
    private readonly userRecordingService: UserRecordingService,
  ) { }

  /**
   * On first get, creates empty user
   *
   * @param {*} theme
   * @returns {Promise<PhrasesInterface>}
   * @memberof PhrasesController
   */
  @UseGuards(FirebaseAuthGuard)
  @Get(':theme')
  async getPhrasesByGroup(@Param('theme') theme): Promise<ThemePhrasesResponseDto> {
    const user = AuthService.getLoggedUser();
    await this.userRecordingService.createEmptyUserIfNonExistent(user); // fire and forget user creation (should move this to guard...)
    return this.phrasesService.getGroup(theme, user);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post(':theme')
  addPhraseToGroup(@Param('theme') theme, @Body() payload: CreateThemeDto): Promise<PhrasesInterface> {
    return this.phrasesService.createGroup({ ...payload, title: theme });
  }
}
