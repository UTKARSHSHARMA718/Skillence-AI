import { useQuery } from "@tanstack/react-query";
import { getUserProfiles } from "../api";
import { UserProfileResponse } from "../users.type";
import { ApiClientResponse } from "@/common/api/client";

const useGetUserProfiles = () => {
  return useQuery<ApiClientResponse<UserProfileResponse>>({
    queryKey: ["user-profiles"],
    queryFn: getUserProfiles,
  });
};

export default useGetUserProfiles;
