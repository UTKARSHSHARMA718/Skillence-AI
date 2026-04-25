import { useQuery } from "@tanstack/react-query";
import { GetUserAnalyticsResponse } from "../dashboard.types";
import { ApiClientResponse, ApiErrorResponse } from "@/common/api/client";
import { getUserAnalytics } from "../api";

const useGetUserAnalytics = () => {
  return useQuery<ApiClientResponse<GetUserAnalyticsResponse>, ApiErrorResponse>({
    queryKey: ["usersAnalytics"],
    queryFn: getUserAnalytics,
  });
};

export default useGetUserAnalytics;
