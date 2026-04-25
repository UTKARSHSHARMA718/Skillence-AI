import { SessionDetails } from "@/modules/admin/users/users.type";

export interface GetTopicsPayload {
  page: number;
  perPage: number;
}

export interface Topic {
  id: string;
  title: string;
  status: string;
  url: string;
  topics: string[];
  covered: boolean;
  isPass?: boolean;
}

export interface GetTopicsResponse {
  topics: Topic[];
  total: number;
  page: number;
  perPage: number;
}

export interface GetUserSessionsHistoryResponse {
  sessionCompleted: number;
  sessionRemaining: number;
  currentSession: number;
  maxLimitReached: boolean;
  topicsCovered: string[];
  totalFailedTopics: number;
}

export interface CreateNewSessionPayload {
  topicIds: string[];
}

export interface CreateNewSessionResponse {
  newSession: {
    id: string;
    userId: string;
    status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    videoIds: string[];
  };
  count: number;
}

export interface GetSessionDetailsPayload {
  sessionId: string;
}

export type GetSessionDetailsResponse = {
  id: string;
  userId: string;
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  videoIds: string[];
  topics: Topic[];
  previousSessionTopics: Topic[];
} & SessionDetails;

export interface SessionsContextResponse {
  sessions: {
    context: string;
  };
  currentSessionNumber: number;
}
