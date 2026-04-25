import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { forgotPassword } from "../api";
import {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
} from "../types/auth.types";
import { ApiClientResponse, ApiErrorResponse } from "@/common/api/client";

export const useForgotPassword = (
  options?: UseMutationOptions<
    ApiClientResponse<ForgotPasswordResponse>,
    ApiErrorResponse,
    ForgotPasswordPayload
  >
) => {
  return useMutation<
    ApiClientResponse<ForgotPasswordResponse>,
    ApiErrorResponse,
    ForgotPasswordPayload
  >({
    mutationFn: forgotPassword,
    // You can keep default behavior here if you want
    ...options,
  });
};