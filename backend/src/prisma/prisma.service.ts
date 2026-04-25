import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    await this.createTTLIndexesForResetTokenTable();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async createTTLIndexesForResetTokenTable() {
    const indexes = await this.$runCommandRaw({
      listIndexes: 'ResetToken',
    });

    let firstBatch = [];
    if (
      typeof indexes.cursor === 'object' &&
      indexes.cursor !== null &&
      'firstBatch' in indexes.cursor
    ) {
      firstBatch = (indexes.cursor as any).firstBatch;
    } else {
      firstBatch = [];
    }

    let ttlExists = false;
    if (Array.isArray(firstBatch)) {
      ttlExists = firstBatch.some(
        (index: any) => index.name === 'expiresAt_ttl_index',
      );
    } else {
      ttlExists = false;
    }

    if (!ttlExists) {
      await this.$runCommandRaw({
        createIndexes: 'ResetToken',
        indexes: [
          {
            key: { expiresAt: 1 },
            name: 'expiresAt_ttl_index',
            expireAfterSeconds: 0,
          },
        ],
      });
    }
  }
}
