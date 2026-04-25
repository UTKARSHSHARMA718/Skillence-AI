import { DeleteUserPayload, DeleteUserResponse } from "../users.type";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {  deleteUser } from "../api";
import { ApiClientResponse } from "@/common/api/client";

const useDeleteUser = (
  options?: UseMutationOptions<
    ApiClientResponse<DeleteUserResponse>,
    Error,
    DeleteUserPayload
  >,
) => {
  return useMutation(
    {
      mutationFn: deleteUser,
      ...options,
    },
  );
};

export default useDeleteUser;
