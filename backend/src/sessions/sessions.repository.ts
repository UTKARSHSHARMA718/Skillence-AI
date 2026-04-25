import { Injectable } from '@nestjs/common';
import { Prisma, SessionStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async count({ where }: { where: Prisma.SessionsWhereInput }) {
    return this.prisma.sessions.count({
      where,
    });
  }

  async getSessionGroupByDate() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await this.prisma.$runCommandRaw({
      aggregate: 'Sessions',
      pipeline: [
        {
          $match: {
            status: SessionStatus.COMPLETED,
          },
        },
        {
          $match: {
            createdAt: {
              $gte: { $date: thirtyDaysAgo.toISOString() },
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            totalSessions: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ],
      cursor: {},
    });

    return (result?.cursor as any).firstBatch.map((item) => ({
      date: item._id,
      totalSessions: item.totalSessions,
    }));
  }

  async aggregate(params: {
    where?: Prisma.SessionsWhereInput;
    orderBy?: Prisma.SessionsOrderByWithRelationInput;
    cursor?: Prisma.SessionsWhereUniqueInput;
    take?: number;
    skip?: number;
    _sum?: Prisma.SessionsSumAggregateInputType;
    _avg?: Prisma.SessionsAvgAggregateInputType;
    _min?: Prisma.SessionsMinAggregateInputType;
    _max?: Prisma.SessionsMaxAggregateInputType;
    _count?: Prisma.SessionsCountAggregateInputType | true;
  }) {
    const {
      where,
      orderBy,
      cursor,
      take,
      skip,
      _sum,
      _avg,
      _min,
      _max,
      _count,
    } = params;

    return this.prisma.sessions.aggregate({
      where,
      orderBy,
      cursor,
      take,
      skip,
      ...(_sum && { _sum }),
      ...(_avg && { _avg }),
      ...(_min && { _min }),
      ...(_max && { _max }),
      ...(_count && { _count }),
    });
  }

  async find(
    where: Prisma.SessionsWhereInput,
    options?: {
      omit?: Prisma.SessionsOmit;
      include?: Prisma.SessionsInclude;
      select?: Prisma.SessionsSelect;
      orderBy?: Prisma.SessionsOrderByWithRelationInput;
    },
  ) {
    if (options?.include) {
      return this.prisma.sessions.findMany({
        where,
        include: options.include,
        orderBy: options.orderBy,
      });
    }
    if (options?.select) {
      return this.prisma.sessions.findMany({
        where,
        select: options.select,
        orderBy: options.orderBy,
      });
    }
    return this.prisma.sessions.findMany({
      where,
      omit: options?.omit,
      orderBy: options?.orderBy,
    });
  }

  async findUnique(
    where: Prisma.SessionsWhereUniqueInput,
    options?: {
      omit?: Prisma.SessionsOmit;
      include?: Prisma.SessionsInclude;
      select?: Prisma.SessionsSelect;
    },
  ) {
    if (options?.include) {
      return this.prisma.sessions.findUnique({
        where,
        include: options?.include,
      });
    }
    if (options?.select) {
      return this.prisma.sessions.findUnique({
        where,
        select: options?.select,
      });
    }
    return this.prisma.sessions.findUnique({
      where,
      omit: options?.omit,
    });
  }

  async createSession(data: Prisma.SessionsCreateInput) {
    return this.prisma.sessions.create({
      data,
    });
  }

  async deleteSession(where: Prisma.SessionsWhereUniqueInput) {
    return this.prisma.sessions.delete({
      where,
    });
  }

  async updateSession(params: {
    where: Prisma.SessionsWhereUniqueInput;
    data: Prisma.SessionsUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.sessions.update({
      where,
      data,
    });
  }
}
