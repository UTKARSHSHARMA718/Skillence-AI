import { apiClient } from "@/common/api/client";
import { GetSessionPromptPayload, GetSessionPromptResponse } from "./session.types";


export const getSessionPrompt = ({ sessionId }: GetSessionPromptPayload) => {
  return apiClient<GetSessionPromptResponse>(`/sessions/prompt/${sessionId}`, {
    method: "GET",
  });
};
