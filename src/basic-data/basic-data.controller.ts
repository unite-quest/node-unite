import { Body, Controller, Get, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { BasicDataService } from './basic-data.service';
import { CreateBasicDataDto } from './dto/create-basic-data.dto';

@Controller('basic-data')
export class BasicDataController {
  constructor(
    private readonly basicDataService: BasicDataService,
  ) { }

  @UseGuards(FirebaseAuthGuard)
  @Post()
  createBasicData(@Body() data: CreateBasicDataDto) {
    const user = AuthService.getLoggedUser();
    return this.basicDataService.create(data, user);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('exists')
  async userExists() {
    const user = AuthService.getLoggedUser();
    const found = await this.basicDataService.find(user);
    if (!found) {
      throw new NotFoundException('Logged user does not have basic data registered');
    }
  }
}
