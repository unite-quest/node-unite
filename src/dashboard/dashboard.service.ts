import { Injectable } from '@nestjs/common';
import AuthUserModel from '../auth/auth-user.model';
import { PhrasesService } from '../phrases/phrases.service';
import { UserRecording } from '../recording/interfaces/user-recording.interface';
import { ScoringService } from '../recording/scoring.service';
import { UserRecordingService } from '../recording/user-recording.service';
import DashboardResponseActionDto from './dto/dashboard-response-action.dto';
import DashboardResponseDto from './dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(
    private userRecordingService: UserRecordingService,
    private phrasesService: PhrasesService,
    private scoringService: ScoringService,
  ) { }


  public async getActions(loggedUser: AuthUserModel): Promise<DashboardResponseDto> {
    const user = await this.userRecordingService.getUser(loggedUser);
    const registration = await this.getRegistrationActions(user);
    const theme = await this.getThemeActions(user);
    const extra = await this.getExtraActions(user);

    return {
      user: {
        name: user?.user?.nickname || '',
      },
      score: {
        total: this.scoringService.calculateTotal(user),
      },
      actions: registration.concat(theme).concat(extra)
        .sort((a, b) => b.points - a.points), // order by points desc
    };
  }

  private async getRegistrationActions(user: UserRecording): Promise<DashboardResponseActionDto[]> {
    if (user && user.user && user.user.dialect && user.user.ageInterval) {
      return [];
    }

    return [{
      id: 'REGISTER',
      type: 'REGISTER',
      points: 500,
      isRecording: false,
      background: {
        src: '/square-cover.jpg',
        alt: 'cadastro',
      },
      banner: {
        src: '/logo_light.png',
        alt: 'caneta',
        title: 'Faça seu cadastro',
      },
    }];
  }

  private async getThemeActions(user: UserRecording): Promise<DashboardResponseActionDto[]> {
    const randomGroups = await this.phrasesService.getRandomGroupsForUserRecording(user);
    return randomGroups.map(group => {
      return {
        id: group.title,
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
      id: 'Extra',
      type: 'EXTRA',
      points: 150,
      isRecording: false,
      background: {
        src: '/square-cover.jpg',
        alt: 'cadastro',
      },
    }];
  }
}
