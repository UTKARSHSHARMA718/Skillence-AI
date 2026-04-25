import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api";
import { ApiClientResponse } from "@/common/api/client";
import { GetUsersPayload, GetUsersResponse } from "../users.type";

const useGetUsers = ({ page, perPage }: GetUsersPayload) => {
  return useQuery<ApiClientResponse<GetUsersResponse>>({
    queryKey: ["users", page, perPage],
    queryFn: ()=> getUsers({ page, perPage }),
  });
};

export default useGetUsers;
