import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { UsersModule } from 'src/users/users.module';
import { SessionsModule } from 'src/sessions/sessions.module';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  imports: [UsersModule, SessionsModule],
})
export class AnalyticsModule {}
