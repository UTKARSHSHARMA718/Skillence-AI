import { apiClient } from "@/common/api/client";

import {
  AddUserPayload,
  AddUserResponse,
  DeleteUserPayload,
  DeleteUserResponse,
  DeleteUserSessionPayload,
  DeleteUserSessionResponse,
  GetAllSessionsOfUserPayload,
  GetAllSessionsOfUserResponse,
  GetUserDetailsPayload,
  GetUserDetailsResponse,
  GetUsersPayload,
  GetUsersResponse,
  UserProfileResponse,
} from "./users.type";

export const addNewUser = (data: AddUserPayload) => {
  return apiClient<AddUserResponse>("/auth/candidate/register", {
    method: "POST",
    data: data,
  });
};

export const getUserProfiles = () => {
  return apiClient<UserProfileResponse>("/users/profiles/list", {
    method: "GET",
  });
};

export const getUsers = ({ page, perPage }: GetUsersPayload) => {
  return apiClient<GetUsersResponse>(
    `/users?page=${page}&pageSize=${perPage}`,
    {
      method: "GET",
    },
  );
};

export const deleteUser = ({ userId }: DeleteUserPayload) => {
  return apiClient<DeleteUserResponse>(`/users/${userId}`, {
    method: "DELETE",
  });
};

export const getUserDetails = ({ userId }: GetUserDetailsPayload) => {
  return apiClient<GetUserDetailsResponse>(`/users/${userId}`, {
    method: "GET",
  });
};

export const getAllSessionsOfUser = ({
  userId,
}: GetAllSessionsOfUserPayload) => {
  return apiClient<GetAllSessionsOfUserResponse>(`/sessions/user/${userId}`, {
    method: "GET",
  });
};

export const deleteUserSession = ({ sessionId }: DeleteUserSessionPayload) => {
  return apiClient<DeleteUserSessionResponse>(`/sessions/${sessionId}`, {
    method: "DELETE",
  });
};
