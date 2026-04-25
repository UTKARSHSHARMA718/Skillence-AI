import { Module, forwardRef } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { VideosModule } from 'src/videos/videos.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SessionsRepository } from './sessions.repository';
import { VapiModule } from 'src/vapi/vapi.module';
import { AiModule } from 'src/ai/ai.module';
import { ReportsModule } from 'src/reports/reports.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [SessionsService, SessionsRepository],
  controllers: [SessionsController],
  imports: [
    AiModule,
    ReportsModule,
    VideosModule,
    UsersModule,
    PrismaModule,
    forwardRef(() => VapiModule), // Use forwardRef here as well
  ],
  exports: [SessionsService],
})
export class SessionsModule {}
