import { useQuery } from "@tanstack/react-query";
import { GetCostAnalyticsResponse } from "../dashboard.types";
import { ApiClientResponse, ApiErrorResponse } from "@/common/api/client";
import { getCostAnalytics } from "../api";

const useGetCostAnalytics = () => {
  return useQuery<ApiClientResponse<GetCostAnalyticsResponse>, ApiErrorResponse>({
    queryKey: ["costAnalytics"],
    queryFn: getCostAnalytics,
  });
};

export default useGetCostAnalytics;
