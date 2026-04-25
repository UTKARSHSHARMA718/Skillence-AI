import { Module } from '@nestjs/common';
import { ResetTokenService } from './reset-token.service';
import { ResetTokenRepository } from './resetToken.reposiotry';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [ResetTokenService, ResetTokenRepository],
  exports: [ResetTokenService],
  imports: [PrismaModule]
})
export class ResetTokenModule {}
