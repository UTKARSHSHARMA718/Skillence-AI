import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Roles(Role.ADMIN)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('/users')
  async getUsersAnalytics() {
    return this.analyticsService.getUsersAnalytics();
  }

  @Get('/sessions')
  async getSessionAnalytics() {
    return this.analyticsService.getSessionAnalytics();
  }

  @Get('/cost')
  async getCostAnalytics() {
    return this.analyticsService.getCostAnalytics();
  }
}
