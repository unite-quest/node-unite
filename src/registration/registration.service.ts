import { BadRequestException, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { AuditService } from '../audit/audit.service';
import AuthUserModel from '../auth/auth-user.model';
import { AuthService } from '../auth/auth.service';
import { FirebaseService } from '../auth/firebase.service';
import { UserRecordingService } from '../recording/user-recording.service';
import { UserScoreEntry } from '../scoring/interfaces/user-score-entry.interface';
import { ScoringService } from '../scoring/scoring.service';
import AssignNameDto from './dto/assign-name.dto';
import MergeUserDataDto from './dto/merge-user-data-dto';
import RegistrationDataDto from './dto/registration-data.dto';
import RemoveUserDataDto from './dto/remove-user-data.dto';
import UserMetadataDto from './dto/user-metadata.dto';
import ValidateNicknameDto from './dto/validate-nickname.dto';
import { FoulLanguageService } from './foul-language.service';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly userRecordingService: UserRecordingService,
    private readonly foulLanguageService: FoulLanguageService,
    private readonly scoringService: ScoringService,
    private readonly auditService: AuditService,
    private readonly firebaseService: FirebaseService,
  ) { }

  public async assignName(assignNameDto: AssignNameDto, loggedUser: AuthUserModel): Promise<void> {
    const user = await this.userRecordingService.getOrCreateUser(loggedUser);

    // check for foul language
    await this.validateNickname({ nickname: assignNameDto.name }, loggedUser);
    await this.scoringService.assignScoreName(loggedUser, assignNameDto.name);

    user.user.nickname = assignNameDto.name;
    await user.save();
  }

  public async register(registrationDataDto: RegistrationDataDto, loggedUser: AuthUserModel): Promise<UserScoreEntry> {
    const user = await this.userRecordingService.getOrCreateUser(loggedUser);
    await this.validateNickname({ nickname: registrationDataDto.name }, loggedUser);

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

  public async mergeData(mergeUserDataDto: MergeUserDataDto, loggedUser: AuthUserModel): Promise<void> {
    const token = mergeUserDataDto.oldToken;
    const oldUser = await this.firebaseService.validateToken(token).pipe(
      map((proceed) => {
        const decoded = AuthService.decodeJwt(token);
        return proceed && new AuthUserModel(decoded);
      })
    ).toPromise();

    if (oldUser && oldUser.isAnonymous) {
      await this.userRecordingService.mergeUsers(oldUser.uid, loggedUser);
      await this.scoringService.mergeUser(oldUser.uid, loggedUser);
    }
  }

  public async validateNickname(nicknameDto: ValidateNicknameDto, loggedUser: AuthUserModel): Promise<void> {
    const name = nicknameDto.nickname;
    const badWord = this.foulLanguageService.check(name);
    if (badWord) {
      throw new BadRequestException('BAD_WORD');
    }

    const foundByNick = await this.userRecordingService.getUserByNickname(name);

    if (loggedUser) { // logged flow
      const user = await this.userRecordingService.getUser(loggedUser);
      if (user.user.nickname !== name && foundByNick) { // validating own nickname
        throw new BadRequestException('USER_EXISTS');
      }
    } else { // anon flow
      if (foundByNick) {
        throw new BadRequestException('USER_EXISTS');
      }
    }
  }

  public async getRandomName(): Promise<string> {
    return 'random';
  }

  public async getUserMetadata(loggedUser: AuthUserModel): Promise<UserMetadataDto> {
    const user = await this.userRecordingService.getUser(loggedUser);
    if (!user) {
      throw new BadRequestException('User does not have metadata');
    }

    return {
      nickname: user.user.nickname,
      gender: user.user.gender,
      ageInterval: user.user.ageInterval,
      region: user.user.region,
      dialect: user.user.dialect,
    };
  }

  public async removeUserData(removeUserDataDto: RemoveUserDataDto, loggedUser: AuthUserModel): Promise<void> {
    const user = await this.userRecordingService.getUser(loggedUser);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    await this.auditService.addRemoveUserDataEntry(
      removeUserDataDto.keepUserData,
      removeUserDataDto.reason,
      loggedUser
    );

    if (!removeUserDataDto.keepUserData) {
      await this.scoringService.removeScoringData(loggedUser);
      await user.remove();
      //@TODO remove recordings afterwards
    }

    return;
  }
}
