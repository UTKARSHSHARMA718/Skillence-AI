import { useQuery } from "@tanstack/react-query";
import { getSessionDetails } from "../api";
import {
  GetSessionDetailsPayload,
  GetSessionDetailsResponse,
} from "../sessions.types";
import { ApiClientResponse, ApiErrorResponse } from "@/common/api/client";

const useGetSessionDetails = ({ sessionId }: GetSessionDetailsPayload) => {
  return useQuery<ApiClientResponse<GetSessionDetailsResponse>, ApiErrorResponse>({
    queryKey: ["sessionDetails", sessionId],
    queryFn: () => getSessionDetails(sessionId),
  });
};

export default useGetSessionDetails;
