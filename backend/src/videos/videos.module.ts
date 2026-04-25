import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VideosRepository } from './videos.repository';

@Module({
  providers: [VideosService, VideosRepository],
  exports: [VideosService],
  imports: [PrismaModule]
})
export class VideosModule {}
