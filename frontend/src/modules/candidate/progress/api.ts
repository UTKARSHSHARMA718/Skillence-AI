import { apiClient } from "@/common/api/client"
import { GetSessionProgressResponse, GetSessionsProgressPayload } from "./progress.types";

export const getSessionProgress = (data: GetSessionsProgressPayload) => {
  return apiClient<GetSessionProgressResponse>(`/sessions/candidate/${data.sessionId}`, {
    method: "GET",
  });
};