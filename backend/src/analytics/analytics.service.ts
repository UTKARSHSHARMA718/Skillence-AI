import { Injectable } from '@nestjs/common';
import { CandidateProfile, Role } from '@prisma/client';
import { SessionsService } from 'src/sessions/sessions.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
  ) {}

  async getUsersAnalytics() {
    const totalUsers = await this.usersService.getUserCount({
      where: {
        role: Role.USER,
      },
    });

    const { users } = await this.usersService.getUsers({
      where: {
        role: Role.USER,
      },
      include: {
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });

    // find users with 0, 5 and in between sessions count
    const usersWithSomeSessions = users.filter(
      (user) => user._count.sessions < 5,
    ).length;
    const maxSessions = parseInt(process.env.MAX_SESSION_COUNT);
    const userCompletedAllSessions = users.filter(
      (user) => user._count.sessions == maxSessions,
    ).length;

    const allProfiles = Object.keys(CandidateProfile);

    const profiles = await Promise.all(
      allProfiles.map(async (profile) => {
        const ans = { profile: profile, count: 0 };
        ans.count = await this.usersService.getUserCount({
          where: {
            role: Role.USER,
            profile: profile as CandidateProfile,
          },
        });
        return ans;
      }),
    );

    return {
      totalUsers,
      userCompletedAllSessions,
      profiles,
      usersWithSomeSessions,
    };
  }

  async getSessionAnalytics() {
    const totalSessions = await this.sessionsService.getSessionsCount({
      where: {},
    });

    const passedSessions = await this.sessionsService.getSessionsCount({
      where: {
        report: {
          overAllResult: true,
        },
      },
    });

    function transformSessionData(data) {
      return data.map((item) => {
        const date = new Date(item.date);

        const formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
        });

        return {
          date: formattedDate,
          count: item.totalSessions,
        };
      });
    }

    const last30DaysSessionsWithDate =
      await this.sessionsService.getSessionGroupByDate();

    return {
      totalSessions,
      passedSessions,
      failedSessions: totalSessions - passedSessions,
      last30DaysSessionsWithDate: transformSessionData(
        last30DaysSessionsWithDate,
      ),
    };
  }

  async getCostAnalytics() {
    const callCostResult = await this.sessionsService.getSessionsAggregate({
      where: {
        status: 'COMPLETED',
      },
      _sum: {
        callCost: true,
      },
      _count: {
        id: true,
      },
    });

    const evaluationCostResult =
      await this.sessionsService.getSessionsAggregate({
        where: {
          status: 'COMPLETED',
        },
        _sum: {
          evaluationCost: true,
        },
        _count: {
          id: true,
        },
      });

    const totalCallCost = (callCostResult._sum.callCost ?? 0) / 1000;
    const averageCallCost =
      totalCallCost / ((callCostResult as any)._count.id || 1);
    const totalEvaluationCost =
      (evaluationCostResult._sum.evaluationCost ?? 0) / 1000;
    const averageEvaluationCost =
      totalEvaluationCost / ((evaluationCostResult as any)._count.id || 1);
    const totalCost = totalCallCost + totalEvaluationCost;
    const averageTotalCost =
      totalCost / ((callCostResult as any)._count.id || 1);

    return {
      totalCallCost,
      averageCallCost,
      totalEvaluationCost,
      averageEvaluationCost,
      totalCost,
      averageTotalCost,
    };
  }
}
