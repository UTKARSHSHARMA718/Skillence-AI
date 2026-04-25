import axios from "axios";
import { getSession, signOut } from "next-auth/react";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiClientResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiErrorResponse {
  response: {
    data: {
      success: boolean;
      error: string;
      message: string;
    };
  };

  message: string;
}

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  if (config.headers) config.headers["ngrok-skip-browser-warning"] = "true";

  // Note: getSession() is async, so you cannot await here.
  // If you need to add the token, do it before making the request or use a custom solution.
  return config;
});

export async function apiClient<T>(
  url: string,
  options?: {
    method?: HttpMethod;
    data?: any;
    params?: any;
    headers?: Record<string, string>;
  },
): Promise<ApiClientResponse<T>> {
  const session = await getSession();

  if (session?.error === "AccessTokenExpired") {
    signOut({ callbackUrl: "/login" });
  }

  if (session?.accessToken) {
    options = {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      ...options,
    };
  }

  const response = await axiosInstance({
    url,
    ...options,
  });

  return response.data as ApiClientResponse<T>;
}
