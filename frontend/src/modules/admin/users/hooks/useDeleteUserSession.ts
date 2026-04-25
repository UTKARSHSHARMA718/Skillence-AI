import {
  DeleteUserSessionPayload,
  DeleteUserSessionResponse,
} from "../users.type";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { deleteUserSession } from "../api";
import { ApiClientResponse } from "@/common/api/client";

const useDeleteUserSession = (
  options?: UseMutationOptions<
    ApiClientResponse<DeleteUserSessionResponse>,
    Error,
    DeleteUserSessionPayload
  >,
) => {
  return useMutation({
    mutationFn: deleteUserSession,
    ...options,
  });
};

export default useDeleteUserSession;
