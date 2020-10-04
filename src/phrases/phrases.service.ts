import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import AuthUserModel from 'src/auth/auth-user.model';
import { RecordingService } from '../recording/recording.service';
import CreateThemeDto from './dto/create-theme.dto';
import ThemePhrasesItemResponseDto from './dto/theme-phrases-item-response.dto';
import ThemePhrasesResponseDto from './dto/theme-phrases-response.dto';
import PhrasesInterface from './interfaces/phrases.interface';

@Injectable()
export class PhrasesService {
  constructor(
    @Inject('PHRASES_MODEL')
    private phrasesModel: Model<PhrasesInterface>,
    private recordingService: RecordingService,
  ) { }

  public createGroup(createThemeDto: CreateThemeDto): Promise<PhrasesInterface> {
    return this.phrasesModel.create(createThemeDto); //TODO error handling
  }

  public async getGroup(title: string, user: AuthUserModel): Promise<ThemePhrasesResponseDto> {
    const themeRecordings = await this.recordingService.getUserRecordingsForTheme(title, user);
    const themePhrases: PhrasesInterface = await this.phrasesModel.findOne({ title }).exec();
    const phrases = themePhrases?.phrases.map((phrase): ThemePhrasesItemResponseDto => {
      const userRecorded = themeRecordings?.recordings?.find((recording) => `${recording.phraseId}` === `${phrase._id}`)
      return {
        id: phrase._id,
        text: phrase.text,
        skipped: Boolean(userRecorded?.skipped),
        spoken: Boolean(userRecorded),
      }
    }) || [];

    return {
      title: themePhrases.title,
      cover: themePhrases.cover,
      stepsCap: 6,
      total: 10,
      phrases,
    };
  }
}
