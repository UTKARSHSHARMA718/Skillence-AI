import { useQuery } from "@tanstack/react-query";
import { GetSessionAnalyticsResponse } from "../dashboard.types";
import { ApiClientResponse, ApiErrorResponse } from "@/common/api/client";
import { getSessionAnalytics } from "../api";

const useGetSessionAnalytics = () => {
  return useQuery<ApiClientResponse<GetSessionAnalyticsResponse>, ApiErrorResponse>({
    queryKey: ["sessionsAnalytics"],
    queryFn: getSessionAnalytics,
  });
};

export default useGetSessionAnalytics;
