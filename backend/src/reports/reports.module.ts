import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReportsRepository } from './reports.repository';

@Module({
  providers: [ReportsService, ReportsRepository],
  exports: [ReportsService],
  imports: [PrismaModule],
})
export class ReportsModule {}
