export interface TopicEvaluations {
  topicId: string;
  passed: boolean;
  topicFeedback: string;
  title: string;
}

export interface GetSessionsProgressPayload {
  sessionId: string;
}

export interface GetSessionProgressResponse {
  topicEvaluations: TopicEvaluations[];
  id: string;
  sessionId: string;
  userId: string;
  overAllResult: boolean;
  overAllFeedback: string;
  createdAt: string;
  updatedAt: string;
}
