import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find(where: Prisma.ReportsWhereInput) {
    return this.prisma.reports.findMany({ where });
  }

  async create(data: Prisma.ReportsCreateInput) {
    return this.prisma.reports.create({ data });
  }

  async findUnique(where: Prisma.ReportsWhereUniqueInput) {
    return this.prisma.reports.findUnique({ where });
  }

  async update(params: {
    where: Prisma.ReportsWhereUniqueInput;
    data: Prisma.ReportsUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.reports.update({
      where,
      data,
    });
  }
}
