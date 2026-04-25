import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { VideosService } from 'src/videos/videos.service';
import { GetTopicsDto } from './dtos/get-topics.dto';
import { StartSessionDto } from './dtos/start-session.dto';
import { SessionsService } from './sessions.service';
import { Request, Response } from 'express';
import { GetSessionDto } from './dtos/get-session.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';

@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly videosService: VideosService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Roles(Role.USER)
  @Get('prompt-context')
  async getPromptContext(@Req() req: Request) {
    const userId = req.user.userId;
    return this.sessionsService.getPreviousSessionsDetails(userId);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Get('/c/:sessionId')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  async getSession(@Param() param: GetSessionDto) {
    const { sessionId } = param;
    return this.sessionsService.getSession(sessionId);
  }

  @Roles(Role.USER)
  @Get('candidate/:sessionId')
  async getCandidateSessionDetails(@Param() param: GetSessionDto) {
    const { sessionId } = param;
    return this.sessionsService.getCandidateSessionDetails(sessionId);
  }

  @Roles(Role.USER)
  @Get('topics')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )
  async getTopics(@Query() body: GetTopicsDto, @Req() req: Request) {
    const userId = req.user.userId;
    const topics = await this.videosService.getTopics({
      page: body.page,
      pageSize: body.pageSize,
      select: {
        title: true,
        id: true,
      },
    });

    const topicIds = topics.topics.map((t) => t.id);

    const topicsStatus = await this.sessionsService.getTopicsStatus(
      topicIds,
      userId,
    );

    // Convert to map for O(1) lookup
    const statusMap = new Map(
      topicsStatus.map((status) => [status.id, status]),
    );

    const topicsWithStatus = topics.topics.map((topic) => {
      const status = statusMap.get(topic.id);

      return {
        ...topic,
        covered: status?.covered ?? false,
        isPass: status?.isPass ?? null,
      };
    });

    return {
      ...topics,
      topics: topicsWithStatus,
    };
  }

  @Roles(Role.USER)
  @Post('')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  async startSession(@Body() body: StartSessionDto, @Req() req: Request) {
    const userId = req.user.userId;
    return this.sessionsService.createSession({
      videoIds: body.topicIds,
      userId,
    });
  }

  @Roles(Role.USER)
  @Get('history')
  async getSessionsHistory(@Req() req: Request) {
    const userId = req.user.userId;
    return this.sessionsService.getSessionsHistory(userId);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get('user/:userId')
  async getSessionsByUserId(@Param('userId') userId: string) {
    return this.sessionsService.getSessionsByUserId(userId);
  }

  @Post('test/report')
  @Public()
  async testReport(@Body() body: any) {
    return this.sessionsService.test(
      body.transcript,
      body.topics,
      body.profile,
    );
  }

  @Get('prompt/:sessionId')
  @Roles(Role.USER)
  async getPrompt(@Param('sessionId') sessionId: string) {
    return this.sessionsService.getAiPromptForSession(sessionId);
  }

  @Delete('/:sessionId')
  @Roles(Role.ADMIN)
  async deleteSession(@Param('sessionId') sessionId: string) {
    return this.sessionsService.deleteSession(sessionId);
  }

  @Public()
  @Get('download/test-file')
  async getFile(@Res() res: Response) {
    const filePath = join(process.cwd(), 'files', 'SampleJPGImage_5mb.jpg');

    // Check if file exists first
    if (!existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="SampleJPGImage_5mb.jpg"',
      'Cache-Control': 'no-store',
    });

    const stream = createReadStream(filePath);

    // CRITICAL: Handle stream errors (prevents crash)
    stream.on('error', (err) => {
      console.error('Stream error:', err);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error while reading file',
        });
      } else {
        res.end();
      }
    });

    // Optional: log when finished
    stream.on('end', () => {
      console.log('File sent successfully');
    });

    stream.pipe(res);
  }

  @Public()
  @Post('upload/test-file')
  async uploadFile(@Req() req: Request, @Res() res: Response) {
    let totalBytes = 0;

    req.on('data', (chunk) => {
      totalBytes += chunk.length;
    });

    console.log({ totalBytes });
    req.on('end', () => {
      res.set({
        'Cache-Control': 'no-store',
      });

      return res.status(200).json({
        message: 'Upload received',
        bytesReceived: totalBytes,
      });
    });

    req.on('error', () => {
      return res.status(500).json({
        message: 'Upload failed',
      });
    });
  }
}
