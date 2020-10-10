import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { DashboardService } from './dashboard.service';
import DashboardResponseDto from './dto/dashboard-response.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) { }

  @UseGuards(FirebaseAuthGuard)
  @Get()
  public getDashboard(): Promise<DashboardResponseDto> {
    const user = AuthService.getLoggedUser();
    return this.dashboardService.getActions(user);
  }
}
