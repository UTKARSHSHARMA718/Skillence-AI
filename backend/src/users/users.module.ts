import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
  imports: [PrismaModule],
})
export class UsersModule {}
