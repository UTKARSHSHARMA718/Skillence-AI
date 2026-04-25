import { useQuery } from "@tanstack/react-query";
import { getUserSessionHistory } from "../api";

const useGetUserSessionsHistory = () => {
  return useQuery({
    queryKey: ["userSessionHistory"],
    queryFn: getUserSessionHistory,
  });
};

export default useGetUserSessionsHistory;
