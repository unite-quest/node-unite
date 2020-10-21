import { BadRequestException, Injectable } from '@nestjs/common';
import AuthUserModel from '../auth/auth-user.model';
import { UserRecordingService } from '../recording/user-recording.service';
import { UserScoreEntry } from '../scoring/interfaces/user-score-entry.interface';
import { ScoringService } from '../scoring/scoring.service';
import AssignNameDto from './dto/assign-name.dto';
import RegistrationDataDto from './dto/registration-data.dto';
import ValidateNicknameDto from './dto/validate-nickname.dto';
import { FoulLanguageService } from './foul-language.service';

@Injectable()
export class RegistrationService {
  constructor(
    private userRecordingService: UserRecordingService,
    private foulLanguageService: FoulLanguageService,
    private scoringService: ScoringService,
  ) { }

  public async assignName(assignNameDto: AssignNameDto, loggedUser: AuthUserModel): Promise<void> {
    const user = await this.userRecordingService.getOrCreateUser(loggedUser);

    // check for foul language
    await this.validateNickname({ nickname: assignNameDto.name });
    await this.scoringService.assignScoreName(loggedUser, assignNameDto.name);

    user.user.nickname = assignNameDto.name;
    await user.save();
  }

  public async register(registrationDataDto: RegistrationDataDto, loggedUser: AuthUserModel): Promise<UserScoreEntry> {
    const user = await this.userRecordingService.getOrCreateUser(loggedUser);
    await this.validateNickname({ nickname: registrationDataDto.name });
    user.user.nickname = registrationDataDto.name;
    user.user.ageInterval = registrationDataDto.age;
    user.user.gender = registrationDataDto.gender;
    user.user.region = registrationDataDto.region;
    user.user.dialect = registrationDataDto.dialect;

    const entry = await this.scoringService.scoreForRegistration(loggedUser);
    await this.scoringService.assignScoreName(loggedUser, registrationDataDto.name);
    await user.save();
    return entry;
  }

  public async validateNickname(nicknameDto: ValidateNicknameDto): Promise<void> {
    const name = nicknameDto.nickname;
    const badWord = this.foulLanguageService.check(name);
    if (badWord) {
      throw new BadRequestException('BAD_WORD');
    }

    const user = await this.userRecordingService.getUserByNickname(name);
    if (user) {
      throw new BadRequestException('USER_EXISTS');
    }
  }

  public async getRandomName(): Promise<string> {
    return 'random';
  }
}
