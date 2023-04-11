import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import AuthUserModel from '../auth/auth-user.model';
import { RecordingModalTypes } from '../recording/dto/recording-modal-types';
import UserRecordingTheme from '../recording/interfaces/user-recording-theme.interface';
import { UserRecording } from '../recording/interfaces/user-recording.interface';
import { UserRecordingService } from '../recording/user-recording.service';
import { ScoringTypes } from '../scoring/interfaces/scoring-types';
import { ScoringValues } from '../scoring/interfaces/scoring-values';
import { UserScore } from '../scoring/interfaces/user-score.interface';
import { ScoringService } from '../scoring/scoring.service';
import CreateThemeDto from './dto/create-theme.dto';
import RandomThemeResponseDto from './dto/random-theme-response.dto';
import ThemePhrasesItemResponseDto from './dto/theme-phrases-item-response.dto';
import { ThemePhrasesModalEventResponseDto } from './dto/theme-phrases-modal-event-response.dto';
import ThemePhrasesResponseDto from './dto/theme-phrases-response.dto';
import PhrasesInterface from './interfaces/phrases.interface';

@Injectable()
export class PhrasesService {
  public static readonly MAXIMUM_SKIPS_COUNT = 4;
  public static readonly DASHBOARD_LIMIT = 20;
  public static readonly FIRST_RECORDING_MODAL_INDEX = 1;
  public static readonly FIRST_THEME_MODAL_INDEX = 6;

  constructor(
    @Inject('PHRASES_MODEL')
    private phrasesModel: Model<PhrasesInterface>,
    private userRecordingService: UserRecordingService,
    private scoringService: ScoringService,
  ) {}

  public createTheme(
    createThemeDto: CreateThemeDto,
  ): Promise<PhrasesInterface> {
    return this.phrasesModel.create(createThemeDto); //TODO error handling
  }

  public async getTheme(
    themeId: string,
    loggedUser: AuthUserModel,
  ): Promise<ThemePhrasesResponseDto> {
    const userTheme = await this.userRecordingService.getUserRecordingTheme(
      themeId,
      loggedUser,
    );
    const userScore = await this.scoringService.getOrCreateUserScoring(
      loggedUser,
    );

    if (userTheme?.finished) {
      throw new BadRequestException('Already finished recording');
    }

    const themePhrases: PhrasesInterface = await this.phrasesModel
      .findOne({ themeId })
      .exec();
    if (!themePhrases) {
      throw new BadRequestException('Theme does not exist');
    }

    const phrases = this.mergePhrases(themePhrases, userTheme);

    return {
      themeId: themePhrases.themeId,
      title: themePhrases.title,
      cover: themePhrases.cover,
      stepsCap: phrases.length - PhrasesService.MAXIMUM_SKIPS_COUNT,
      total: phrases.length,
      phrases,
      modalEvents: this.getModalEvents(userScore),
    };
  }

  private mergePhrases(
    themePhrases: PhrasesInterface,
    userPhrases: UserRecordingTheme,
  ): ThemePhrasesItemResponseDto[] {
    let spokenLength = 0;

    return (
      themePhrases?.phrases.map(
        (phrase): ThemePhrasesItemResponseDto => {
          const userRecorded = userPhrases?.recordings?.find(
            recording => `${recording.phraseId}` === `${phrase._id}`,
          );
          const spoken = Boolean(
            userRecorded && !userRecorded?.skipped?.reason,
          );
          spokenLength = spoken ? spokenLength + 1 : spokenLength;
          return {
            id: phrase._id,
            text: phrase.text,
            skipped: Boolean(userRecorded?.skipped?.reason),
            spoken,
          };
        },
      ) || []
    );
  }

  private getModalEvents(
    scoring: UserScore,
  ): ThemePhrasesModalEventResponseDto[] {
    if (!scoring) {
      return [];
    }

    const modalEvents: ThemePhrasesModalEventResponseDto[] = [];
    if (
      !(scoring.entries || []).find(
        entry => entry.reason === ScoringTypes.FIRST_RECORDING,
      )
    ) {
      modalEvents.push({
        eventIndex: PhrasesService.FIRST_RECORDING_MODAL_INDEX,
        type: RecordingModalTypes.FIRST_RECORDING,
        score: ScoringValues[ScoringTypes.FIRST_RECORDING],
      });
    }
    if (
      !(scoring.entries || []).find(
        entry => entry.reason === ScoringTypes.FIRST_THEME,
      )
    ) {
      modalEvents.push({
        eventIndex: PhrasesService.FIRST_THEME_MODAL_INDEX,
        type: RecordingModalTypes.FIRST_THEME,
        score: ScoringValues[ScoringTypes.FIRST_THEME],
      });
    }

    return modalEvents;
  }

  public async getRandomTheme(
    loggedUser: AuthUserModel,
  ): Promise<{ themeId: string }> {
    const user = loggedUser.uid
      ? await this.userRecordingService.getUser(loggedUser)
      : null;
    const themes = await this.getRandomGroupsForUserRecording(user);
    if (themes && themes.length > 0) {
      const randomIndex = Math.floor(Math.random() * themes.length);
      return {
        themeId: themes[randomIndex]?.themeId,
      };
    }
  }

  public async getRandomGroupsForUserRecording(user: UserRecording | null) {
    const unfinishedThemes: string[] = [];
    const finishedThemes: string[] = (user?.themes || [])
      .filter(theme => {
        if (!theme.finished) {
          unfinishedThemes.push(theme.themeId);
        }
        return theme.finished;
      })
      .map(theme => theme.themeId);
    return this.getRandomNonRepeatingGroups(unfinishedThemes, finishedThemes);
  }

  private async getRandomNonRepeatingGroups(
    include: string[],
    exclude: string[],
  ): Promise<RandomThemeResponseDto[]> {
    const includingGroups = await this.phrasesModel
      .find({ title: { $in: include } })
      .limit(PhrasesService.DASHBOARD_LIMIT)
      .exec();
    const excludingGroups = await this.phrasesModel
      .find({ title: { $nin: exclude } })
      .limit(PhrasesService.DASHBOARD_LIMIT)
      .exec();
    const removedDuplicates = excludingGroups.filter(eGroup => {
      return !includingGroups.find(iGroup => iGroup.themeId === eGroup.themeId);
    });

    return includingGroups.concat(removedDuplicates).map(group => {
      return {
        themeId: group.themeId,
        title: group.title,
        cover: group.cover,
      };
    });
  }
}
