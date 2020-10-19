import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import AssignNameDto from './dto/assign-name.dto';
import RegistrationDataDto from './dto/registration-data.dto';
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
  registration(@Body() data: RegistrationDataDto): Promise<void> {
    const user = AuthService.getLoggedUser();
    return this.registrationService.register(data, user);
  }

  @Post('validate-nickname')
  validateNickname(@Body() data: ValidateNicknameDto): Promise<void> {
    return this.registrationService.validateNickname(data);
  }

  @Get('random-names')
  getRandomName(): Promise<string> {
    return this.registrationService.getRandomName();
  }
}
