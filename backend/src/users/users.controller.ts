import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { GetUsersDto } from './dtos/get-users.dto';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Roles(Role.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getUserProfile(@Req() req: Request) {
    const { userId } = req.user;
    return this.usersService.getUserProfile({
      id: userId,
    });
  }

  @Get('/:id')
  async getUserDetails(@Param('id') userId: string) {
    return this.usersService.getUserDetails({
      id: userId,
    });
  }

  @Get('')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )
  async getUsers(@Query() query: GetUsersDto) {
    const { users, total } = await this.usersService.getUsersWithMetadata({
      where: {
        role: {
          in: [Role.USER],
        },
      },
      include: {
        sessions: {
          select: {
            report: {
              select: {
                overAllResult: true,
              },
            },
            status: true,
          },
        },
      },
      page: query.page,
      pageSize: query.pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { users, total, page: query.page, pageSize: query.pageSize };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser({ id });
  }

  @Get('profiles/list')
  async getUserProfiles() {
    const profiles = await this.usersService.getUserProfiles();
    return { profiles };
  }
}
