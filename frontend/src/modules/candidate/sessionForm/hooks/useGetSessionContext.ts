import { useQuery } from "@tanstack/react-query";
import { getSessionsContext } from "../api";
import { SessionsContextResponse } from "../sessions.types";
import { ApiClientResponse, ApiErrorResponse } from "@/common/api/client";


const useGetSessionsContext = () => {
  return useQuery<ApiClientResponse<SessionsContextResponse>, ApiErrorResponse>({
    queryKey: ["sessionsContext"],
    queryFn:getSessionsContext,
  });
};

export default useGetSessionsContext;
