import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SessionsRepository } from './sessions.repository';

import { VideosService } from 'src/videos/videos.service';
import { InterviewEvaluator } from 'src/ai/evaluators/interview.evaluator';
import { Prisma, Reports, Users } from '@prisma/client';
import { ReportsService } from 'src/reports/reports.service';
import { VapiMessage } from 'src/vapi/vapi.types';
import {
  GET_NEW_AGENT_PROMPT,
  getQuestionRules,
} from 'src/ai/prompts/interview.prompt';
import { UsersService } from 'src/users/users.service';
import { formatTopics } from './utils/utils';

@Injectable()
export class SessionsService {
  private readonly MAX_SESSION_COUNT = parseInt(process.env.MAX_SESSION_COUNT);
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly videosService: VideosService,
    private readonly evaluationService: InterviewEvaluator,
    private readonly reportsService: ReportsService,
    private readonly userService: UsersService,
  ) {}

  async getSessionsCount({ where }: { where: Prisma.SessionsWhereInput }) {
    return this.sessionsRepository.count({
      where,
    });
  }

  async getSessionGroupByDate() {
    return this.sessionsRepository.getSessionGroupByDate();
  }

  async getSessionsAggregate(params: {
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
    return this.sessionsRepository.aggregate(params);
  }

  async getSessions(
    where: Prisma.SessionsWhereInput,
    options?: {
      omit?: Prisma.SessionsOmit;
      include?: Prisma.SessionsInclude;
      select?: Prisma.SessionsSelect;
    },
  ) {
    return this.sessionsRepository.find(where, {
      ...options,
    });
  }

  async getTopicsStatus(topicsIds: string[], userId: string) {
    const reports = await this.reportsService.getReports({ userId });

    if (!reports.length) {
      return topicsIds.map((topicId) => ({
        id: topicId,
        covered: false,
        isPass: null,
      }));
    }

    const coveredTopics = new Set<string>();
    const passedTopics = new Set<string>();

    for (const report of reports) {
      // covered topics
      const evalutationTopics = report.topicEvaluations;
      evalutationTopics.forEach((evaluation) => {
        coveredTopics.add(evaluation.topicId);
        if (evaluation.passed) {
          passedTopics.add(evaluation.topicId);
        }
      });
    }

    return topicsIds.map((topicId) => ({
      id: topicId,
      covered: coveredTopics.has(topicId),
      isPass: coveredTopics.has(topicId) ? passedTopics.has(topicId) : null,
    }));
  }

  private buildSessionContext(data: Reports[]) {
    if (!data) return '';

    const allTopicsEvaluations = data.flatMap(
      (report) => report.topicEvaluations,
    );

    const topicsMap = new Map<
      string,
      { topicId: string; passed: boolean; topicFeedback: string }
    >();

    for (const evaluation of allTopicsEvaluations) {
      topicsMap.set(evaluation.topicId, evaluation);
    }

    const topics = [];
    for (const [key, value] of topicsMap) {
      if (!value.passed) {
        topics.push(
          `- TopicId: ${key}\n  Topics Result: ${value.passed ? 'Passed' : 'Failed'}\n  Feedback: ${value.topicFeedback}`,
        );
      }
    }

    const resultString = `
    Previous Session Context:

    Topic Evaluations:
    ${topics}
      `.trim();

    return resultString;
  }

  async getPreviousSessionsDetails(userId: string) {
    const reports = await this.reportsService.getReports({
      userId: userId,
    });
    const context = this.buildSessionContext(reports);
    const sessions = await this.sessionsRepository.find(
      {
        userId,
      },
      {
        select: {
          id: true,
        },
      },
    );

    return { sessions: { context }, currentSessionNumber: sessions.length };
  }

  async getSessionsByUserId(userId: string) {
    const completedSessions = await this.sessionsRepository.find(
      {
        userId,
        status: 'COMPLETED',
      },
      {
        include: null,
        select: {
          status: true,
          id: true,
          createdAt: true,
        },
        omit: null,
      },
    );

    const inProgressSessions = await this.sessionsRepository.find(
      {
        userId,
        status: 'IN_PROGRESS',
      },
      {
        select: {
          id: true,
          createdAt: true,
          status: true,
        },
      },
    );

    const totalFailedSession = await this.sessionsRepository.find(
      {
        userId,
        status: 'COMPLETED',
        report: {
          overAllResult: false,
        },
      },
      {
        select: {
          id: true,
        },
      },
    );

    const totalPassedSession =
      completedSessions.length - totalFailedSession.length;

    let sessionCount = 1;

    const allCompletedSessionIds = completedSessions.map((s) => s.id);

    const completedSessionReports = await this.reportsService.getReports({
      sessionId: {
        in: allCompletedSessionIds,
      },
    });

    const allEvaluationTopicsIds = completedSessionReports.flatMap((report) =>
      report.topicEvaluations.map((te) => te.topicId),
    );

    const videos = await this.videosService.getTopicByIds(
      allEvaluationTopicsIds,
    );

    const videosMap = new Map(videos.map((v) => [v.id, v]));

    const UpdatedCompletedSessions = completedSessions.map((session) => {
      const report = completedSessionReports.find(
        (r) => r.sessionId === session.id,
      );
      return {
        id: session.id,
        status: session.status,
        createdAt: session.createdAt,
        sessionNumber: sessionCount++,
        overAllResult: report?.overAllResult ?? null,
        topicEvaluations:
          report?.topicEvaluations.map((te) => ({
            topicId: te.topicId,
            passed: te.passed,
            title: videosMap.get(te.topicId)?.title || 'Unknown Topic',
          })) ?? null,
      };
    });

    const UpdatedInProgressSessions = inProgressSessions.map((session) => ({
      id: session.id,
      status: session.status,
      createdAt: session.createdAt,
      sessionNumber: sessionCount++,
    }));

    return {
      completedSessions: UpdatedCompletedSessions,
      inProgressSessions: UpdatedInProgressSessions,
      totalFailedSession: totalFailedSession.length,
      totalPassedSession,
      totalSessionCompleted: completedSessions.length,
      totalSessions: this.MAX_SESSION_COUNT,
    };
  }

  async getSessionsHistory(userId: string) {
    const sessions = await this.sessionsRepository.find({
      userId,
      status: {
        in: ['COMPLETED', 'IN_PROGRESS'],
      },
    });

    const sessionCompleted = sessions.length;
    const sessionRemaining = this.MAX_SESSION_COUNT - sessionCompleted;
    let currentSession = sessionCompleted + 1;
    if (sessionRemaining == 0) {
      currentSession = -1;
    }

    const reports = await this.reportsService.getReports({
      userId,
    });

    const topicsCovered = Array.from(
      new Set(
        reports.flatMap((report) =>
          report.topicEvaluations.map((te) => te.topicId),
        ),
      ),
    );

    const { failedTopics } = await this.getFailedTopics(userId);

    return {
      sessionCompleted,
      sessionRemaining,
      currentSession,
      maxLimitReached: sessionRemaining == 0,
      topicsCovered,
      totalFailedTopics: failedTopics.length,
    };
  }

  async getFailedTopics(userId: string) {
    const reports = await this.reportsService.getReports({
      userId,
    });

    const topicsMap = new Map<
      String,
      { topicId: string; passed: boolean; topicFeedback: string }
    >();

    for (const report of reports) {
      const evalutationTopics = report.topicEvaluations;
      for (const evaluation of evalutationTopics) {
        topicsMap.set(evaluation.topicId, evaluation);
      }
    }

    const failedTopics = [];
    const passedTopics = [];
    for (const [key, value] of topicsMap) {
      if (value.passed) {
        passedTopics.push({
          topicId: key,
          passed: value.passed,
          topicFeedback: value.topicFeedback,
        });
      } else {
        failedTopics.push({
          topicId: key,
          passed: value.passed,
          topicFeedback: value.topicFeedback,
        });
      }
    }

    return { failedTopics, passedTopics };
  }

  async createSession({
    videoIds,
    userId,
  }: {
    videoIds: string[];
    userId: string;
  }) {
    try {
      // 1. Remove any unfinished (CREATED) sessions
      const activeSessions = await this.sessionsRepository.find({
        userId,
        status: 'CREATED',
      });

      if (activeSessions.length) {
        await Promise.all(
          activeSessions.map((session) =>
            this.sessionsRepository.deleteSession({ id: session.id }),
          ),
        );
      }

      // 2. Get all user sessions
      const allSessions = await this.sessionsRepository.find({ userId });
      const sessionCount = allSessions.length;

      // 3. Enforce max session limit
      if (sessionCount >= this.MAX_SESSION_COUNT) {
        throw new BadRequestException('Maximum session limit reached!');
      }

      // 4. Check if this is the final (5th) session
      const isFinalSession = sessionCount === this.MAX_SESSION_COUNT - 1;

      // Fetch reports
      const { failedTopics, passedTopics } = await this.getFailedTopics(userId);

      if (isFinalSession) {
        // Get passed topic IDs
        const passedTopicIds = new Set(
          passedTopics.map((topic) => topic.topicId),
        );

        // Fetch all topics
        const { topics } = await this.videosService.getTopics({
          select: { id: true },
          pageSize: 150,
        });

        // Get remaining (not passed) topic IDs
        const remainingTopicIds = topics
          .map((topic) => topic.id)
          .filter((id) => !passedTopicIds.has(id));

        // Override videoIds for final session
        videoIds = [...new Set(remainingTopicIds)];
      } else {
        const failedTopicIds = failedTopics.map((topic) => topic.topicId);
        if (failedTopicIds.length) {
          videoIds = [...new Set([...videoIds, ...failedTopicIds])];
        }
      }

      // 5. Create new session
      const newSession = await this.sessionsRepository.createSession({
        videoIds,
        user: {
          connect: { id: userId },
        },
      });

      return {
        newSession,
        count: sessionCount + 1,
      };
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  }

  async startSessionFromWebhook(sessionId: string, callId: string) {
    const session = await this.sessionsRepository.findUnique({
      id: sessionId,
    });

    if (!session) {
      throw new BadRequestException('Session not found');
    }

    if (session.status !== 'CREATED') {
      throw new BadRequestException('Session already started');
    }

    const updatedSession = await this.sessionsRepository.updateSession({
      where: { id: sessionId },
      data: { status: 'IN_PROGRESS', callId },
    });

    return updatedSession;
  }

  async endSessionFromWebhook({
    sessionId,
    messages,
    recordingUrl,
    cost,
    callDurationInMs,
  }: {
    sessionId: string;
    messages: VapiMessage[];
    recordingUrl: string;
    cost: number;
    callDurationInMs: number;
  }) {
    const session = await this.sessionsRepository.findUnique(
      {
        id: sessionId,
      },
      {
        omit: {},
        include: {
          user: true,
        },
      },
    );

    if (!session) {
      throw new BadRequestException('Session not found');
    }

    await this.sessionsRepository.updateSession({
      where: { id: sessionId },
      data: {
        transcript: messages as any,
        audioUrl: recordingUrl,
        callCost: cost,
        callDurationInMs: callDurationInMs,
      },
    });

    const topics = await this.videosService.getTopicByIds(session.videoIds);

    // complete the report evaluation and update the session with the report result asynchronously
    const transcript = messages
      .slice(1)
      .map((msg) => `${msg.role}: ${msg.message}`)
      .join('\n');

    const { evaluationData, totalCost } =
      await this.evaluationService.evaluateRound(
        transcript,
        topics,
        session && 'user' in session
          ? (session.user as Users)?.profile
          : undefined,
      );

    await this.reportsService.createReport({
      overAllFeedback: evaluationData.overall_feedback,
      overAllResult: Boolean(evaluationData.overall_passed),
      user: {
        connect: {
          id: session.userId,
        },
      },
      session: {
        connect: {
          id: sessionId,
        },
      },
      topicEvaluations: evaluationData.topic_evaluations.map((te) => ({
        ...te,
        passed: Boolean(te.passed), // Convert 0/1 to boolean
      })),
    });

    await this.sessionsRepository.updateSession({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        evaluationCost: totalCost,
      },
    });

    return {
      message: 'Session ended and report created successfully',
    };
  }

  async getCandidateSessionDetails(sessionId: string) {
    const report = await this.reportsService.getUniqueReport({
      sessionId,
    });

    if (!report) {
      throw new NotFoundException('Report not found for the given session ID');
    }

    const evaluations = report.topicEvaluations;

    const topicsIds = evaluations.map((evaluation) => evaluation.topicId);

    const videos = await this.videosService.getTopicByIds(topicsIds);

    const videosMap = new Map(videos.map((v) => [v.id, v]));

    const updatedEvaluations = evaluations.map((evaluation) => ({
      ...evaluation,
      title: videosMap.get(evaluation.topicId)?.title || 'Unknown Topic',
    }));

    return {
      ...report,
      topicEvaluations: updatedEvaluations,
    };
  }

  async getSession(sessionId: string) {
    const session = await this.sessionsRepository.findUnique(
      { id: sessionId },
      {
        include: {
          report: true,
        },
      },
    );

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const { failedTopics } = await this.getFailedTopics(session.userId);
    const newlySelectedVideoIds = session.videoIds.filter(
      (id) => !failedTopics.some((topic) => topic.topicId === id),
    );
    const newlySelectedVideos = await this.videosService.getTopicByIds(
      newlySelectedVideoIds,
    );
    const failedVideos = await this.videosService.getTopicByIds(
      failedTopics.map((topic) => topic.topicId),
    );

    // Build map for faster lookup
    const videosMap = new Map(
      [...newlySelectedVideos, ...failedVideos].map((v) => [v.id, v]),
    );

    const report = (session as any).report as Reports;
    const topicEvaluations = report?.topicEvaluations ?? [];
    const updatedTopicEvaluations = topicEvaluations.map((te) => ({
      ...te,
      title: videosMap.get(te.topicId)?.title || 'Unknown Topic',
    }));

    const updatedTranscription = Array.isArray(session.transcript)
      ? session.transcript.slice(1)
      : [];

    return {
      ...session,
      transcript: updatedTranscription,
      report: report
        ? {
            ...report,
            topicEvaluations: updatedTopicEvaluations,
          }
        : null,
      videoIds: undefined,
      topics: newlySelectedVideos,
      previousSessionTopics: failedVideos,
    };
  }

  async getAiPromptForSession(sessionId: string) {
    if (!sessionId) {
      throw new BadRequestException(
        'Session ID is required in prompt generation!',
      );
    }

    const session = await this.getSession(sessionId);

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const user = await this.userService.getUniqueUser({
      id: session.userId,
    });

    const previousReviewString = formatTopics(session.previousSessionTopics);
    const currentReviewString = formatTopics(session.topics);

    const result = GET_NEW_AGENT_PROMPT({
      candidateName: user.name,
      candidateProfile: user.profile,
      currentTopics: currentReviewString,
      previousReviewTopics: previousReviewString,
      questionRules: getQuestionRules(user.profile),
    });

    return {
      prompt: result,
      userName: user.name,
    };
  }

  async test(
    transcript: string,
    topics: {
      title: string;
      id: string;
      topics: string[];
    }[],
    profile: any,
  ) {
    return this.evaluationService.evaluateRound(transcript, topics, profile);
  }

  async deleteSession(sessionId: string) {
    const session = await this.sessionsRepository.findUnique({
      id: sessionId,
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    await this.sessionsRepository.deleteSession({ id: sessionId });

    return { message: 'Session deleted successfully' };
  }
}
