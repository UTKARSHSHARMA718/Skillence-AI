import { useQuery } from "@tanstack/react-query";
import { ApiClientResponse, ApiErrorResponse } from "@/common/api/client";
import { getTopics } from "../api";
import { GetTopicsPayload, GetTopicsResponse } from "../sessions.types";

const useGetTopics = ({ page, perPage }: GetTopicsPayload) => {
  return useQuery<ApiClientResponse<GetTopicsResponse>, ApiErrorResponse>({
    queryKey: ["topics", page, perPage],
    queryFn: () => getTopics({ page, perPage }),
  });
};

export default useGetTopics;
