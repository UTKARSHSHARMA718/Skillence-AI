import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VapiRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createWebhookEntry(data: Prisma.MissedWebhooksCreateInput) {
    return this.prisma.missedWebhooks.create({ data });
  }

  async delete(where: Prisma.MissedWebhooksWhereUniqueInput) {
    return this.prisma.missedWebhooks.delete({ where });
  }

  async find(where: Prisma.MissedWebhooksWhereInput) {
    return this.prisma.missedWebhooks.findMany({ where });
  }
}
