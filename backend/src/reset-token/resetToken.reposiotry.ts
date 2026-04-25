import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResetTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(where: Prisma.ResetTokenWhereUniqueInput) {
    return this.prisma.resetToken.findUnique({ where });
  }

  async delete(where: Prisma.ResetTokenWhereUniqueInput) {
    return this.prisma.resetToken.delete({ where });
  }

  async create(data: Prisma.ResetTokenCreateInput) {
    return this.prisma.resetToken.create({ data });
  }
}
