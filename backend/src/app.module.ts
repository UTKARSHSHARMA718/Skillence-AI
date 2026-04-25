import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ResetTokenModule } from './reset-token/reset-token.module';
import { SessionsModule } from './sessions/sessions.module';
import { VideosModule } from './videos/videos.module';
import { ReportsModule } from './reports/reports.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AiModule } from './ai/ai.module';
import { VapiModule } from './vapi/vapi.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './env.validation';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './auth/guards/customThrottler.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    ScheduleModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: process.env.MAIL_FROM,
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.RATE_LIMIT_TTL), // 60 seconds
        limit: Number(process.env.RATE_LIMIT_COUNT), // 10 requests per 60 seconds
      },
    ]),
    UsersModule,
    PrismaModule,
    AuthModule,
    NotificationModule,
    ResetTokenModule,
    SessionsModule,
    VideosModule,
    ReportsModule,
    AiModule,
    VapiModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
