import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import AuthUserModel from '../auth/auth-user.model';
import { RecordingModalTypes } from '../recording/dto/recording-modal-types';
import { ScoreEntry, ScoringValues } from '../recording/interfaces/score-entry.interface';
import UserRecordingTheme from '../recording/interfaces/user-recording-theme.interface';
import { UserRecording } from '../recording/interfaces/user-recording.interface';
import { UserRecordingService } from '../recording/user-recording.service';
import CreateThemeDto from './dto/create-theme.dto';
import RandomThemeResponseDto from './dto/random-theme-response.dto';
import ThemePhrasesItemResponseDto from './dto/theme-phrases-item-response.dto';
import { ThemePhrasesModalEventResponseDto } from './dto/theme-phrases-modal-event-response.dto';
import ThemePhrasesResponseDto from './dto/theme-phrases-response.dto';
import PhrasesInterface from './interfaces/phrases.interface';

@Injectable()
export class PhrasesService {
  public static readonly MAXIMUM_SKIPS_COUNT: number = 4;
  public static readonly DASHBOARD_LIMIT: number = 20;

  constructor(
    @Inject('PHRASES_MODEL')
    private phrasesModel: Model<PhrasesInterface>,
    private userRecordingService: UserRecordingService,
  ) { }

  public createTheme(createThemeDto: CreateThemeDto): Promise<PhrasesInterface> {
    return this.phrasesModel.create(createThemeDto); //TODO error handling
  }

  public async getTheme(theme: string, loggedUser: AuthUserModel): Promise<ThemePhrasesResponseDto> {
    // fetches user theme and scoring
    const user = await this.userRecordingService.getUser(loggedUser);
    const userTheme = this.userRecordingService.filterRecordingTheme(theme, user);
    if (userTheme?.finished) {
      throw new BadRequestException('Already finished recording');
    }
    const themePhrases: PhrasesInterface = await this.phrasesModel.findOne({ title: theme }).exec();
    return this.mergePhrasesWithUser(themePhrases, userTheme, user.scoring);
  }

  private mergePhrasesWithUser(themePhrases: PhrasesInterface, userTheme: UserRecordingTheme, scoring: ScoreEntry[]): ThemePhrasesResponseDto {
    const phrases = this.mergePhrases(themePhrases, userTheme);

    return {
      title: themePhrases.title,
      cover: themePhrases.cover,
      stepsCap: (phrases.length - PhrasesService.MAXIMUM_SKIPS_COUNT),
      total: phrases.length,
      phrases,
      modalEvents: this.getModalEvents(scoring),
    };
  }

  private mergePhrases(
    themePhrases: PhrasesInterface,
    userPhrases: UserRecordingTheme
  ): ThemePhrasesItemResponseDto[] {
    let spokenLength = 0;

    return themePhrases?.phrases.map((phrase): ThemePhrasesItemResponseDto => {
      const userRecorded = userPhrases?.recordings?.find((recording) => `${recording.phraseId}` === `${phrase._id}`)
      const spoken = Boolean(userRecorded && !userRecorded?.skipped?.reason);
      spokenLength = spoken ? spokenLength + 1 : spokenLength;
      return {
        id: phrase._id,
        text: phrase.text,
        skipped: Boolean(userRecorded?.skipped?.reason),
        spoken,
      }
    }) || [];
  }

  private getModalEvents(scoring: ScoreEntry[]): ThemePhrasesModalEventResponseDto[] {
    const modalEvents: ThemePhrasesModalEventResponseDto[] = [];

    if (!scoring.find(score => score.reason === RecordingModalTypes.FIRST_RECORDING)) {
      modalEvents.push({
        eventIndex: 1,
        type: RecordingModalTypes.FIRST_RECORDING,
        score: ScoringValues[RecordingModalTypes.FIRST_RECORDING],
      });
    }
    if (!scoring.find(score => score.reason === RecordingModalTypes.FIRST_THEME)) {
      modalEvents.push({
        eventIndex: 6,
        type: RecordingModalTypes.FIRST_THEME,
        score: ScoringValues[RecordingModalTypes.FIRST_THEME],
      });
    }

    return modalEvents;
  }

  public async getRandomTheme(loggedUser: AuthUserModel): Promise<{ title: string }> {
    const user = await this.userRecordingService.getUser(loggedUser);
    const themes = await this.getRandomGroupsForUserRecording(user);
    if (themes && themes.length > 0) {
      const randomIndex = Math.floor((Math.random() * themes.length));
      return {
        title: themes[randomIndex]?.title,
      };
    }
  }

  public async getRandomGroupsForUserRecording(user: UserRecording) {
    let unfinishedThemes: string[] = [];
    const finishedThemes: string[] = user?.themes?.filter(theme => {
      if (!theme.finished) {
        unfinishedThemes.push(theme.title);
      }
      return theme.finished;
    }).map(theme => theme.title);
    return this.getRandomNonRepeatingGroups(unfinishedThemes, finishedThemes);
  }

  private async getRandomNonRepeatingGroups(include: string[], exclude: string[]): Promise<RandomThemeResponseDto[]> {
    let query = {};
    if (include && include.length) {
      query['title'] = {
        ['$in']: include
      };
    }
    if (exclude && exclude.length) {
      query['title'] = {
        ...query['title'],
        ['$nin']: exclude,
      }
    }
    const groups: PhrasesInterface[] = await this.phrasesModel.find(query)
      .limit(PhrasesService.DASHBOARD_LIMIT).exec();

    return groups.map(group => {
      return {
        title: group.title,
        cover: group.cover,
      }
    });
  }
}
