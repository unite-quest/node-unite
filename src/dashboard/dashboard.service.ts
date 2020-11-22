import { Injectable } from '@nestjs/common';
import AuthUserModel from '../auth/auth-user.model';
import { PhrasesService } from '../phrases/phrases.service';
import { UserRecording } from '../recording/interfaces/user-recording.interface';
import { UserRecordingService } from '../recording/user-recording.service';
import { ScoringTypes } from '../scoring/interfaces/scoring-types';
import { UserScore } from '../scoring/interfaces/user-score.interface';
import { ScoringService } from '../scoring/scoring.service';
import DashboardResponseActionDto from './dto/dashboard-response-action.dto';
import DashboardResponseDto from './dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(
    private userRecordingService: UserRecordingService,
    private phrasesService: PhrasesService,
    private scoringService: ScoringService,
  ) { }

  public async getDashboardForUser(loggedUser: AuthUserModel): Promise<DashboardResponseDto> {
    const user = await this.userRecordingService.getUser(loggedUser);
    const userScore = await this.scoringService.getOrCreateUserScoring(loggedUser);
    const registration = await this.getRegistrationActions(userScore);
    const theme = await this.getThemeActions(user);
    const extra = await this.getExtraActions(user);

    return {
      user: {
        name: user?.user?.nickname || '',
      },
      score: {
        total: userScore.total,
      },
      actions: registration.concat(theme).concat(extra)
        .sort((a, b) => b.points - a.points), // order by points desc
    };
  }

  private async getRegistrationActions(score: UserScore): Promise<DashboardResponseActionDto[]> {
    const registration = score.entries.find(entry => entry.reason === ScoringTypes.REGISTRATION);
    if (registration) {
      return [];
    }

    return [{
      id: 'REGISTER',
      type: 'REGISTER',
      points: 500,
      isRecording: false,
      background: {
        src: '/covers/registration.jpg',
        alt: 'cadastro',
      },
      banner: {
        src: '/icons/pencil.png',
        alt: 'caneta',
        title: 'Faça seu cadastro',
      },
    }];
  }

  private async getThemeActions(user: UserRecording): Promise<DashboardResponseActionDto[]> {
    const randomGroups = await this.phrasesService.getRandomGroupsForUserRecording(user);
    return randomGroups.map(group => {
      return {
        id: `THEME_${group.title}`,
        type: 'RECORDING',
        points: 150,
        isRecording: true,
        background: {
          src: group.cover,
          alt: `gravação de ${group.title}`,
        },
      };
    });
  }

  private async getExtraActions(user: UserRecording): Promise<DashboardResponseActionDto[]> {
    return [{
      id: 'RECOMMENDATION',
      type: 'EXTRA',
      points: 100,
      isRecording: false,
      background: {
        src: '/covers/friendship.jpg',
        alt: 'cadastro',
      },
      banner: {
        src: '/icons/pencil.png',
        alt: 'caneta',
        title: 'Indique um amigo',
      },
    }, {
      id: 'KNOW_MORE',
      type: 'EXTRA',
      points: 100,
      isRecording: false,
      background: {
        src: '/covers/recording.jpg',
        alt: 'gravacao',
      },
      banner: {
        src: '/icons/people.svg',
        alt: 'pessoas',
        title: 'Conheça mais',
      },
    }];
  }

}
