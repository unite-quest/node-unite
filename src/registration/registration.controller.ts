import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { LooseFirebaseAuthGuard } from '../auth/loose-firebase-auth.guard';
import { UserScoreEntry } from '../scoring/interfaces/user-score-entry.interface';
import AssignNameDto from './dto/assign-name.dto';
import MergeUserDataDto from './dto/merge-user-data-dto';
import ReferCodeDto from './dto/refer-code.dto';
import RegistrationDataDto from './dto/registration-data.dto';
import RemoveUserDataDto from './dto/remove-user-data.dto';
import UserMetadataDto from './dto/user-metadata.dto';
import ValidateNicknameDto from './dto/validate-nickname.dto';
import { RegistrationService } from './registration.service';

@Controller('registration')
export class RegistrationController {
  constructor(
    private readonly registrationService: RegistrationService,
  ) { }

  @UseGuards(FirebaseAuthGuard)
  @Post('assign-name')
  assignName(@Body() data: AssignNameDto): Promise<void> {
    const user = AuthService.getLoggedUser();
    return this.registrationService.assignName(data, user);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('register')
  registration(@Body() data: RegistrationDataDto): Promise<UserScoreEntry> {
    const user = AuthService.getLoggedUser();
    return this.registrationService.register(data, user);
  }

  @UseGuards(LooseFirebaseAuthGuard)
  @Post('validate-nickname')
  validateNickname(@Body() data: ValidateNicknameDto): Promise<void> {
    const user = AuthService.getLoggedUser();
    return this.registrationService.validateNickname(data, user);
  }

  @Get('random-names')
  getRandomName(): Promise<string> {
    return this.registrationService.getRandomName();
  }

  @UseGuards(LooseFirebaseAuthGuard)
  @Get('metadata')
  getUserMetadata(): Promise<UserMetadataDto> {
    const user = AuthService.getLoggedUser();
    return this.registrationService.getUserMetadata(user);
  }

  @UseGuards(LooseFirebaseAuthGuard)
  @Post('remove-user-data')
  removeUserData(@Body() data: RemoveUserDataDto): Promise<void> {
    const user = AuthService.getLoggedUser();
    return this.registrationService.removeUserData(data, user);
  }

  @UseGuards(LooseFirebaseAuthGuard)
  @Post('merge-user-data')
  mergeUserData(@Body() data: MergeUserDataDto): Promise<void> {
    const user = AuthService.getLoggedUser();
    return this.registrationService.mergeData(data, user);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('referral-code')
  getReferCode(): Promise<ReferCodeDto> {
    const user = AuthService.getLoggedUser();
    return this.registrationService.getReferralCode(user);
  }
}
