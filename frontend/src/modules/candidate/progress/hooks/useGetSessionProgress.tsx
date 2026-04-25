import { ApiClientResponse, ApiErrorResponse } from "@/common/api/client";
import { useQuery } from "@tanstack/react-query";
import { GetSessionProgressResponse } from "../progress.types";
import { GetSessionDetailsPayload } from "../../sessionForm/sessions.types";
import { getSessionProgress } from "../api";

const useGetSessionProgress = ({ sessionId }: GetSessionDetailsPayload) => {
  return useQuery<ApiClientResponse<GetSessionProgressResponse>, ApiErrorResponse>({
    queryKey: ["sessionProgress", sessionId],
    queryFn: ()=> getSessionProgress({ sessionId }),
  });
};

export default useGetSessionProgress;
