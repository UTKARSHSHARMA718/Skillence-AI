import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { logout } from "../api";
import { LogoutUserResponse } from "../types/auth.types";
import { ApiClientResponse } from "@/common/api/client";

const useAuth = (
  options?: UseMutationOptions<ApiClientResponse<LogoutUserResponse>, Error>,
) => {
  return useMutation<any, Error>({
    mutationFn: logout,
    ...options,
  });
};

export default useAuth;
