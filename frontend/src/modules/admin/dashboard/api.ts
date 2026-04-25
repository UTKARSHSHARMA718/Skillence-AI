import { apiClient } from "@/common/api/client";
import {
  GetCostAnalyticsResponse,
  GetSessionAnalyticsResponse,
  GetUserAnalyticsResponse,
} from "./dashboard.types";

export const getUserAnalytics = () => {
  return apiClient<GetUserAnalyticsResponse>("/analytics/users", {
    method: "GET",
  });
};

export const getCostAnalytics = () => {
  return apiClient<GetCostAnalyticsResponse>("/analytics/cost", {
    method: "GET",
  });
};

export const getSessionAnalytics = () => {
  return apiClient<GetSessionAnalyticsResponse>("/analytics/sessions", {
    method: "GET",
  });
};
