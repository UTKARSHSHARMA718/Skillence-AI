import { apiClient } from "@/common/api/client";
import {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LogoutUserResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "./types/auth.types";
import { signOut } from "next-auth/react";

export const forgotPassword = (data: ForgotPasswordPayload) => {
  return apiClient<ForgotPasswordResponse>("/auth/forgot-password", {
    method: "POST",
    data: data,
  });
};

export const resetPassword = (data: ResetPasswordPayload) => {
  return apiClient<ResetPasswordResponse>("/auth/reset-password", {
    method: "POST",
    data: data,
  });
};

export const logout = async () => {
  let result;
  try {
    result = await apiClient<LogoutUserResponse>("/auth/logout", {
      method: "POST",
    });
  } catch (err) {
    console.error("Error during logout:", { err });
    result = {
      success: true,
    };
  }

  if (result.success) {
    signOut({
      redirect: true,
      callbackUrl: "/login",
    });
  }
  return result;
};
