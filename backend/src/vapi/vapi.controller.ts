import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpStatus,
  Options,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { VapiEndOfCallReport } from './vapi.types';
import { VapiService } from './vapi.service';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Public()
@Controller('vapi')
export class VapiController {
  private readonly VAPI_PUBLIC_KEY = process.env.VAPI_PUBLIC_KEY;

  // CORS headers (same as your worker)
  private corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  constructor(
    private readonly vapiService: VapiService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('webhook/:sessionId')
  async webhook(
    @Body() body: VapiEndOfCallReport,
    @Param('sessionId') sessionId: string,
    @Headers() headers: Record<string, string>,
  ) {
    console.log({
      header: headers['x-vapi-header'],
      myToken: process.env.VAPI_WEBHOOK_AUTH_TOKEN,
    });
    if (headers['x-vapi-header'] !== process.env.VAPI_WEBHOOK_AUTH_TOKEN) {
      throw new BadRequestException('Invalid auth token in headers');
    }
    const eventType = body.message.type;
    const tag = `[VAPI][${sessionId}][${eventType}]`;

    console.log(`${tag} 🚀 START`);

    console.log(`${tag} Incoming webhook payload received`);

    if (
      eventType === 'end-of-call-report' ||
      eventType === 'assistant.started'
    ) {
      await this.vapiService.handleVapiWebhook(sessionId, body);
    } else {
      console.warn(`${tag} ⚠️ Unsupported event type → skipping`);
    }

    console.log(`${tag} ✅ Successfully processed`);

    return { status: 'ok' };
  }

  // Handle OPTIONS (preflight)
  @Options('/call*')
  handleOptions(@Res() res: Response) {
    return res.status(204).set(this.corsHeaders).send();
  }

  // Handle POST /call*
  @Post('/call/web')
  async handleCall(@Req() req: Request, @Res() res: Response) {
    try {
      const { ...rest } = req.body;
      const sessionId = rest?.assistant?.sessionId;
      const authToken = rest?.assistant?.authToken;

      if (!sessionId || !authToken) {
        throw new BadRequestException(
          'Missing sessionId or authToken in request body',
        );
      }

      await this.jwtService.verifyAsync(authToken, {
        secret: process.env.JWT_SECRET,
      });

      const assistantConfig =
        await this.vapiService.getAssistantConfig(sessionId);

      let urlPath = req.originalUrl; // preserves /call or /call/xyz
      urlPath = urlPath.replace('/api/vapi', ''); // remove /vapi prefix

      const response = await fetch(
        `${process.env.VAPI_BACKEND_BASE_URL}${urlPath}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.VAPI_PUBLIC_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ assistant: assistantConfig }),
        },
      );

      const data = await response.text();

      return res
        .status(response.status)
        .set({
          'Content-Type': 'application/json',
          ...this.corsHeaders,
        })
        .send(data);
    } catch (error) {
      console.error('Error in /call/web handler:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Proxy error',
        details: String(error),
      });
    }
  }

  // Default route
  @Post('/')
  root(@Res() res: Response) {
    return res.set(this.corsHeaders).send('Proxy running');
  }
}
