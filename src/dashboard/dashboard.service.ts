import { Injectable } from '@nestjs/common';
import AuthUserModel from '../auth/auth-user.model';
import { PhrasesService } from '../phrases/phrases.service';
import { UserRecording } from '../recording/interfaces/user-recording.interface';
import { UserRecordingService } from '../recording/user-recording.service';
import { ScoringService } from '../scoring/scoring.service';
import DashboardResponseActionDto from './dto/dashboard-response-action.dto';
import DashboardResponseDto from './dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(
    private userRecordingService: UserRecordingService,
    private phrasesService: PhrasesService,
    private scoringService: ScoringService,
  ) {}

  public async getDashboardForUser(
    loggedUser: AuthUserModel,
  ): Promise<DashboardResponseDto> {
    const user = await this.userRecordingService.getUser(loggedUser);
    const userScore = await this.scoringService.getOrCreateUserScoring(
      loggedUser,
    );
    const registration = await this.getRegistrationActions();
    const theme = await this.getThemeActions(user);
    const extra = await this.getExtraActions();

    return {
      user: {
        name: user?.user?.nickname || '',
      },
      score: {
        total: userScore.total,
      },
      actions: registration
        .concat(theme)
        .concat(extra)
        .sort((a, b) => b.points - a.points), // order by points desc
    };
  }

  private async getRegistrationActions(): Promise<
    DashboardResponseActionDto[]
  > {
    return [];
  }

  private async getThemeActions(
    user: UserRecording,
  ): Promise<DashboardResponseActionDto[]> {
    const randomGroups = await this.phrasesService.getRandomGroupsForUserRecording(
      user,
    );
    return randomGroups.map(group => {
      return {
        themeId: group.themeId,
        title: group.title,
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

  private async getExtraActions(): Promise<DashboardResponseActionDto[]> {
    return [];
  }
}
