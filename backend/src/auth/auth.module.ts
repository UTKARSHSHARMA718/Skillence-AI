import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule, } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from 'src/notification/notification.module';
import { JwtStrategy } from './jwt.strategy';
import { ResetTokenModule } from 'src/reset-token/reset-token.module';

@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: 60 * 15 }, // 15 minutes
    }),
    UsersModule,
    NotificationModule,
    ResetTokenModule
  ],
})
export class AuthModule {}
