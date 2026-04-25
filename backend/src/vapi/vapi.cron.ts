import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SessionsService } from 'src/sessions/sessions.service';
import { VapiService } from './vapi.service';
import { VapiEndOfCallReport } from './vapi.types';
import { WebhookType } from '@prisma/client';

@Injectable()
export class VapiCron {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly vapiService: VapiService,
  ) {}

  @Cron('*/5 * * * *') // Every 5 minutes (adjust the cron timing as needed)
  async retryFailedWebhooks() {
    console.log('Running VapiCron to retry failed webhooks');
    const missedStartCallWebhooks =
      await this.vapiService.getWebhooksForSession({
        webhookType: WebhookType.CALL_STARTED,
      });

    if (missedStartCallWebhooks.length) {
      let processedCount = 0;
      for (const webhook of missedStartCallWebhooks) {
        const sessionId = webhook.sessionId;
        const payload = (webhook as any).payload as VapiEndOfCallReport;
        await this.sessionsService.startSessionFromWebhook(
          sessionId,
          payload.message.call.id,
        );

        await this.vapiService.deleteWebhooksForSession({
          id: webhook.id,
        });
        processedCount++;
      }
      console.log(`Processed ${processedCount} missed start call webhooks`);
    }

    const missedEndCallWebhooks = await this.vapiService.getWebhooksForSession({
      webhookType: WebhookType.CALL_ENDED,
    });

    if (missedEndCallWebhooks.length) {
      let processedCount = 0;
      for (const webhook of missedEndCallWebhooks) {
        const sessionId = webhook.sessionId;
        const payload = (webhook as any).payload as VapiEndOfCallReport;
        const totalCost = payload.message.cost * 1000;
        await this.sessionsService.endSessionFromWebhook({
          sessionId,
          messages: payload.message.messages,
          recordingUrl: payload.message.recordingUrl,
          cost: totalCost, // fallback to top-level cost if call.cost is not available
          callDurationInMs: payload.message.durationMs,
        });

        await this.vapiService.deleteWebhooksForSession({
          id: webhook.id,
        });
        processedCount++;
      }
      console.log(`Processed ${processedCount} missed end call webhooks`);
    }
  }
}
