import { Injectable } from '@nestjs/common';
import { VapiRepository } from './vapi.repository';
import { VapiEndOfCallReport } from './vapi.types';
import { SessionsService } from 'src/sessions/sessions.service';
import { Prisma, WebhookType } from '@prisma/client';
import { getVapiConfig } from './vapi.config';

@Injectable()
export class VapiService {
  constructor(
    private readonly vapiRepository: VapiRepository,
    private readonly sessionsService: SessionsService,
  ) {}

  async handleVapiWebhook(sessionId: string, payload: VapiEndOfCallReport) {
    const eventType = payload.message.type;
    const tag = `[VAPI][${sessionId}][${eventType}]`;

    console.log(`${tag} ⚙️ START SERVICE`);

    console.log(`${tag} Saving webhook entry`);

    const webHookType =
      eventType === 'assistant.started'
        ? WebhookType.CALL_STARTED
        : WebhookType.CALL_ENDED;

    const newWebhookEntry = await this.vapiRepository.createWebhookEntry({
      session: {
        connect: { id: sessionId },
      },
      payload: payload as any,
      webhookType: webHookType,
    });

    console.log(`${tag} Webhook saved → ID: ${newWebhookEntry.id}`);

    switch (eventType) {
      case 'assistant.started':
        console.log(`${tag} 🎤 Assistant started`);

        await this.sessionsService.startSessionFromWebhook(
          sessionId,
          payload.message.call.id,
        );

        console.log(`${tag} ✅ Session start handled`);
        break;

      case 'end-of-call-report':
        console.log(`${tag} 🛑 Assistant ended`);

        const totalCost = payload.message.cost * 1000;

        console.log(`${tag} 💰 Cost calculated`, {
          totalCost,
          durationMs: payload.message.durationMs,
        });

        await this.sessionsService.endSessionFromWebhook({
          sessionId,
          messages: payload.message.messages,
          recordingUrl: payload.message.recordingUrl,
          cost: totalCost,
          callDurationInMs: payload.message.durationMs,
        });

        console.log(`${tag} ✅ Session end handled`);
        break;

      default:
        console.warn(`${tag} ⚠️ No handler for event`);
        break;
    }

    console.log(`${tag} 🧹 Cleaning up webhook entry`);

    await this.vapiRepository.delete({
      id: newWebhookEntry.id,
    });

    console.log(`${tag} ✅ Cleanup done`);
  }

  async getWebhooksForSession(where: Prisma.MissedWebhooksWhereInput) {
    return this.vapiRepository.find(where);
  }

  async deleteWebhooksForSession(where: Prisma.MissedWebhooksWhereUniqueInput) {
    return this.vapiRepository.delete(where);
  }

  // Same helper function (kept inside controller)
  async getAssistantConfig(sessionId: string) {
    const { prompt, userName } =
      await this.sessionsService.getAiPromptForSession(sessionId);

    const vapiConfig = getVapiConfig({
      sessionId,
      prompt,
      userName,
    });

    console.log('-------------VAPI PROMPT--------------------------');
    console.log(`[VAPI][${sessionId}]: PROMPT: ${prompt}`);
    console.log('---------------------------------------');

    return vapiConfig;
  }
}
