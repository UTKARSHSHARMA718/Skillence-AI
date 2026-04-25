import { apiClient } from "@/common/api/client";
import {
  CreateNewSessionResponse,
  GetSessionDetailsResponse,
  GetTopicsPayload,
  GetTopicsResponse,
  GetUserSessionsHistoryResponse,
  SessionsContextResponse,
} from "./sessions.types";

export const getTopics = (data: GetTopicsPayload) => {
  return apiClient<GetTopicsResponse>(
    `/sessions/topics?page=${data.page}&pageSize=${data.perPage}`,
    {
      method: "GET",
    },
  );
};

export const getUserSessionHistory = () => {
  return apiClient<GetUserSessionsHistoryResponse>(`/sessions/history`, {
    method: "GET",
  });
};

export const createNewSession = (topicIds: string[]) => {
  return apiClient<CreateNewSessionResponse>(`/sessions`, {
    method: "POST",
    data: { topicIds },
  });
};

export const getSessionDetails = (sessionId: string) => {
  return apiClient<GetSessionDetailsResponse>(`/sessions/c/${sessionId}`, {
    method: "GET",
  });
};

export const getSessionsContext = () => {
  return apiClient<SessionsContextResponse>(`/sessions/prompt-context`, {
    method: "GET",
  });
};
