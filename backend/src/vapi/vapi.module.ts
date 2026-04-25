import { Module, forwardRef } from '@nestjs/common';
import { VapiService } from './vapi.service';
import { VapiController } from './vapi.controller';
import { SessionsModule } from 'src/sessions/sessions.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VapiCron } from './vapi.cron';
import { VapiRepository } from './vapi.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [VapiService, VapiCron, VapiRepository],
  exports: [VapiService],
  controllers: [VapiController],
  imports: [forwardRef(() => SessionsModule), PrismaModule, JwtModule], // Use forwardRef to handle the circular dependency
})
export class VapiModule {}
