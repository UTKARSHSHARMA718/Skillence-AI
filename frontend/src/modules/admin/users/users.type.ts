import { USER_ROLE } from "@/common/types/user.types";

export interface AddUserPayload {
  name: string;
  email: string;
  profile: string;
}

export interface AddUserResponse {
  message: string;
}

export interface UserProfile {
  id: string;
  name: string;
  slug: string;
}

export interface UserProfileResponse {
  profiles: UserProfile[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: USER_ROLE;
  profile: string;
  createdAt: string;
  updatedAt: string;
  totalPassSession: number;
  totalFailedSession: number;
  totalSessions: number;
  totalInProgressSession: number;
}

export interface GetUsersResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GetUsersPayload {
  page: number;
  perPage: number;
}

export interface DeleteUserPayload {
  userId: string;
}

export interface DeleteUserResponse {
  message: string;
}

export interface GetUserDetailsPayload {
  userId: string;
}

export type GetUserDetailsResponse = User;

export interface GetAllSessionsOfUserPayload {
  userId: string;
}

export type GetAllSessionsOfUserResponse = {
  completedSessions: LightSessionDetails[];
  inProgressSessions: LightSessionDetails[];
  totalFailedSession: number;
  totalPassedSession: number;
  totalSessionCompleted: number;
  totalSessions: number;
};

export type SessionStatus = "CREATED" | "COMPLETED" | "IN_PROGRESS";

export interface LightSessionDetails {
  id: string;
  status: SessionStatus;
  createdAt: string;
  sessionNumber: number;
  overAllResult: boolean;
  topicEvaluations: TopicEvaluation[];
}

export interface SessionDetails {
  id: string;
  userId: string;
  status: SessionStatus;
  videoIds: string[];
  callId: string | null;
  transcript: TranscriptEntry[] | null;
  audioUrl: string | null;
  createdAt: string;
  updatedAt: string;
  report: Report;
}

export type TranscriptRole = "bot" | "user";

export interface TranscriptEntry {
  role: TranscriptRole;
  message: string;
  time: number;
  secondsFromStart: number;
  endTime: number;

  // optional fields (not always present)
  duration?: number;
  source?: string;
  metadata?: TranscriptMetadata;
}

export interface TranscriptMetadata {
  wordLevelConfidence: WordConfidence[];
}

export interface WordConfidence {
  word: string;
  start: number;
  end: number;
  confidence: number;
  language: string;
  punctuated_word: string;
}

export interface Report {
  id: string;
  sessionId: string;
  overAllResult: boolean;
  overAllFeedback: string;
  createdAt: string;
  updatedAt: string;
  topicEvaluations: TopicEvaluation[];
}

export interface TopicEvaluation {
  topicId: string;
  passed: boolean;
  title: string;
  topicFeedback: string;
}

export interface DeleteUserSessionPayload {
  sessionId: string;
}

export interface DeleteUserSessionResponse {
  message: string;
}
