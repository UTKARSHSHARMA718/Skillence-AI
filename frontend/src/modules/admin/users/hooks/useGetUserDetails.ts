import { useQuery } from "@tanstack/react-query";
import { GetUserDetailsPayload } from "../users.type";
import { getUserDetails } from "../api";

const useGetUserDetails = ({ userId }: GetUserDetailsPayload) => {
  return useQuery({
    queryKey: ["userDetails", userId],
    queryFn: () => getUserDetails({ userId }),
  });
};

export default useGetUserDetails;
