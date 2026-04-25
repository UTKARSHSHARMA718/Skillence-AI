import { ApiClientResponse } from "@/common/api/client";
import { useQuery } from "@tanstack/react-query";
import { GetSessionPromptPayload, GetSessionPromptResponse } from "../session.types";
import { getSessionPrompt } from "../api";


const useGetPrompt = ({ sessionId }: GetSessionPromptPayload) => {
  return useQuery<ApiClientResponse<GetSessionPromptResponse>>({
    queryKey: ["sessionPrompt", sessionId],
    queryFn: ()=> getSessionPrompt({ sessionId }),
  });
};

export default useGetPrompt;
