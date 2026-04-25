import { ApiClientResponse } from "@/common/api/client";
import { useQuery } from "@tanstack/react-query";
import { GetAllSessionsOfUserPayload, GetAllSessionsOfUserResponse } from "../users.type";
import { getAllSessionsOfUser } from "../api";

const useGetAllSessionsOfUser = ({ userId }: GetAllSessionsOfUserPayload) => {
  return useQuery<ApiClientResponse<GetAllSessionsOfUserResponse>>({
    queryKey: ["allSessionsOfUser", userId],
    queryFn: () => getAllSessionsOfUser({ userId }),
  });
};

export default useGetAllSessionsOfUser;
