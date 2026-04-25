import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Put,
  Req,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/resgiter.dto';
import { Public } from './decorators/public.decorator';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Request } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Throttle } from '@nestjs/throttler';
import { Roles } from './decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    const userId = req.user.userId;
    return this.authService.logout(userId);
  }

  @Roles(Role.ADMIN)
  @Post('candidate/register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() registerDto: RegisterUserDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('admin/register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async registerAdmin(@Body() registerDto: RegisterAdminDto) {
    return this.authService.createAdmin(registerDto);
  }

  @Public()
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Post('forgot-password')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Post('reset-password')
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async resetPassword(@Body() payload: ResetPasswordDto) {
    const { token, newPassword } = payload;
    return this.authService.resetPassword(token, newPassword);
  }

  @Put('change-password')
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async changePassword(
    @Body('currentPassword') payload: ChangePasswordDto,
    @Req() req: Request,
  ) {
    const userId = req.user.userId;
    return this.authService.changePassword(payload, userId);
  }

  @Public()
  @Post('refresh-token')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async refreshToken(
    @Body() body: { refreshToken: string },
  ) {
    const { refreshToken } = body;
    return this.authService.refreshToken(refreshToken);
  }
}
