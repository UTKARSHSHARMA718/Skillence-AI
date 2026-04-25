import { AddUserPayload, AddUserResponse } from "../users.type";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { addNewUser } from "../api";
import { ApiClientResponse } from "@/common/api/client";

const useAddUser = (
  options?: UseMutationOptions<
    ApiClientResponse<AddUserResponse>,
    Error,
    AddUserPayload
  >,
) => {
  return useMutation<ApiClientResponse<AddUserResponse>, Error, AddUserPayload>(
    {
      mutationFn: addNewUser,
      ...options,
    },
  );
};

export default useAddUser;
