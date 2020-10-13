import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import UserRecordingTheme from 'src/recording/interfaces/user-recording-theme.interface';
import AuthUserModel from '../auth/auth-user.model';
import { UserRecordingService } from '../recording/user-recording.service';
import CreateThemeDto from './dto/create-theme.dto';
import RandomThemeResponseDto from './dto/random-theme-response.dto';
import ThemePhrasesItemResponseDto from './dto/theme-phrases-item-response.dto';
import ThemePhrasesResponseDto from './dto/theme-phrases-response.dto';
import PhrasesInterface from './interfaces/phrases.interface';

@Injectable()
export class PhrasesService {
  public static readonly MAXIMUM_SKIPS_COUNT: number = 4;

  constructor(
    @Inject('PHRASES_MODEL')
    private phrasesModel: Model<PhrasesInterface>,
    private userRecordingService: UserRecordingService,
  ) { }

  public createTheme(createThemeDto: CreateThemeDto): Promise<PhrasesInterface> {
    return this.phrasesModel.create(createThemeDto); //TODO error handling
  }

  public async getTheme(title: string, loggedUser: AuthUserModel): Promise<ThemePhrasesResponseDto> {
    const userTheme = await this.userRecordingService.getUserRecordingTheme(title, loggedUser);

    const themePhrases: PhrasesInterface = await this.phrasesModel.findOne({ title }).exec();
    return this.mergePhrasesWithUser(themePhrases, userTheme);
  }

  public async getRandomTheme(loggedUser: AuthUserModel): Promise<ThemePhrasesResponseDto> {
    // randomize theme
    const phrases = await this.phrasesModel.aggregate<PhrasesInterface>([{ $sample: { size: 1 } }]);
    if (phrases && phrases.length === 1) {
      const userTheme = await this.userRecordingService.getUserRecordingTheme(phrases[0].title, loggedUser);
      return this.mergePhrasesWithUser(phrases[0], userTheme);
    }
    throw new Error('Error during phrase randomization');
  }

  private mergePhrasesWithUser(themePhrases: PhrasesInterface, userTheme: UserRecordingTheme): ThemePhrasesResponseDto {
    const phrases = themePhrases?.phrases.map((phrase): ThemePhrasesItemResponseDto => {
      const userRecorded = userTheme?.recordings?.find((recording) => `${recording.phraseId}` === `${phrase._id}`)
      return {
        id: phrase._id,
        text: phrase.text,
        skipped: Boolean(userRecorded?.skipped),
        spoken: Boolean(userRecorded && !userRecorded.skipped),
      }
    }) || [];

    return {
      title: themePhrases.title,
      cover: themePhrases.cover,
      stepsCap: (phrases.length - PhrasesService.MAXIMUM_SKIPS_COUNT),
      total: phrases.length,
      phrases,
    };
  }

  public async getRandomGroups(include: string[], exclude: string[]): Promise<RandomThemeResponseDto[]> {
    const groups: PhrasesInterface[] = await this.phrasesModel.find({
      title: { $in: include, $nin: exclude }
    }).exec();

    return groups.map(group => {
      return {
        title: group.title,
        cover: group.cover,
      }
    });
  }
}
