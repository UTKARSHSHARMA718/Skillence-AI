import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { resetPassword } from "../api";
import {
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "../types/auth.types";
import { ApiClientResponse, ApiErrorResponse } from "@/common/api/client";

export const useResetPassword = (
  options?: UseMutationOptions<
    ApiClientResponse<ResetPasswordResponse>,
    ApiErrorResponse,
    ResetPasswordPayload
  >
) => {
  return useMutation({
    mutationFn: resetPassword,
    ...options,
  });
};