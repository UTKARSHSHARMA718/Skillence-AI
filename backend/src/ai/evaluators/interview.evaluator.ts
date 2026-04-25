import { Injectable } from '@nestjs/common';
import { OpenAIService } from '../openai/openai.service';
import { CandidateProfile } from '@prisma/client';
import {
  buildInterviewEvaluationPrompt,
  EVAL_CRITERIA_CONCEPTUAL,
  EVAL_CRITERIA_STRATEGIC,
  EVAL_CRITERIA_TECHNICAL,
} from '../prompts/interview-evaluation.prompt';

const PROFILE_CATEGORIES = {
  conceptual: ['product_manager', 'business_analyst'],
  strategic: ['strategy_manager'],
  technical: ['software_engineer', 'data_engineer'],
};

@Injectable()
export class InterviewEvaluator {
  constructor(private readonly openaiService: OpenAIService) {}

  async getProfileCategory(profile: string) {
    for (const [category, profiles] of Object.entries(PROFILE_CATEGORIES)) {
      if (profiles.includes(profile)) {
        return category;
      }
    }

    return 'strategic';
  }

  convertTopicsToString(topics) {
    let result = '';

    topics.forEach((topic) => {
      result += `ID: ${topic.id}\n`; // Include the ID of the topic
      result += `Title: ${topic.title}\n`;
      result += 'Subtopics:\n';
      topic.topics.forEach((subtopic) => {
        result += `- ${subtopic}\n`;
      });
      result += '\n'; // Add a newline between topics for separation
    });

    return result.trim();
  }

  async evaluateRound(
    transcript: string,
    topics: {
      title: string;
      id: string;
      topics: string[];
    }[],
    profileCategory: CandidateProfile,
  ): Promise<TInterviewEvaluation> {
    let profileEvalCriteria = '';

    switch (profileCategory) {
      case CandidateProfile.HR:
      case CandidateProfile.DESIGNING:
      case CandidateProfile.DEMAND_GENERATION:
        profileEvalCriteria = EVAL_CRITERIA_CONCEPTUAL;
        break;
      case CandidateProfile.PRODUCT_MANAGER:
      case CandidateProfile.PRESALES:
        profileEvalCriteria = EVAL_CRITERIA_STRATEGIC;
        break;
      case CandidateProfile.DEVELOPER:
        profileEvalCriteria = EVAL_CRITERIA_TECHNICAL;
        break;
      default:
        profileEvalCriteria = EVAL_CRITERIA_STRATEGIC;
    }

    const topicsList = this.convertTopicsToString(topics);

    const evaluationContext = buildInterviewEvaluationPrompt({
      transcript,
      topicsList,
      profileCategory,
      profileEvalCriteria,
    });

    const response = await this.openaiService.chatCompletion([
      {
        role: 'system',
        content:
          'You are an expert technical reviewer evaluating candidate performance. Always return valid JSON responses.',
      },
      {
        role: 'user',
        content: evaluationContext,
      },
    ]);

    let evaluationData;
    try {
      evaluationData = JSON.parse(response?.content || '{}');
    } catch (error) {
      console.error('Error parsing evaluation response:', error);
      // Handle parsing error, maybe return a default evaluation or throw an error
      evaluationData = {
        topic_evaluations: topics.map((topic) => ({
          topicId: topic.id,
          passed: 0,
          topicFeedback: 'Evaluation failed due to response parsing error.',
        })),
        overall_feedback: 'Evaluation failed due to response parsing error.',
        overall_result: false,
      };
    }

    return { evaluationData, totalCost: response?.totalCost };
  }
}

type TInterviewEvaluation = {
  evaluationData: {
    topic_evaluations: {
      topicId: string;
      passed: 0 | 1;
      topicFeedback: string;
    }[];
    overall_feedback: string;
    overall_passed: boolean;
  };
  totalCost: number;
};
