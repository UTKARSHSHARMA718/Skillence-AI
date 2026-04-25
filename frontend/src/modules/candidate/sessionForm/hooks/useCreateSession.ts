import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ApiClientResponse, ApiErrorResponse } from "@/common/api/client";
import {
  CreateNewSessionPayload,
  CreateNewSessionResponse,
} from "../sessions.types";
import { createNewSession } from "../api";

const useCreateSession = (
  options?: UseMutationOptions<
    ApiClientResponse<CreateNewSessionResponse>,
    ApiErrorResponse,
    CreateNewSessionPayload
  >,
) => {
  return useMutation({
    mutationFn: (payload) => createNewSession(payload.topicIds),
    ...options,
  });
};

export default useCreateSession;
