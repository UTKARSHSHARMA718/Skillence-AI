"use client";

import UsersDatatable from "@/modules/admin/users/components/UsersDatatable";
import useUsersDatatable from "../hooks/useUsersDatatable";
import AddUserModal from "./AddUserModal";
import useGetUsers from "../hooks/useGetUsers";
import ConfirmationModal from "@/common/components/ConfirmationModal";
import useDeleteUser from "../hooks/useDeleteUser";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const UsersPage = () => {
  const queryClient = useQueryClient();
  const {
    isOpenAddUserModal,
    isSelectDeleteUser,
    pagination,
    setPagination,
    setIsOpenAddUserModal,
    setIsSelectDeleteUser,
  } = useUsersDatatable();
  const { data, isFetching } = useGetUsers({
    page: pagination.page,
    perPage: pagination.perPage,
  });
  const { mutate, isPending } = useDeleteUser({
    onSuccess: (data) => {
      setIsSelectDeleteUser(null);
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["users", pagination.page, pagination.perPage],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="p-6">
      <UsersDatatable
        loading={isFetching}
        page={pagination.page}
        perPage={pagination.perPage}
        total={data?.data?.total || 0}
        onPageChange={(page) => {
          setPagination({ ...pagination, page });
        }}
        onPerPageChange={(newPerPage, page) =>
          setPagination({ ...pagination, perPage: newPerPage, page })
        }
        onDeleteUser={(user) => setIsSelectDeleteUser(user)}
        data={data?.data.users || []}
        onAddUser={() => setIsOpenAddUserModal(true)}
      />
      {isOpenAddUserModal && (
        <AddUserModal
          isOpen={isOpenAddUserModal}
          onClose={() => setIsOpenAddUserModal(false)}
        />
      )}
      {!!isSelectDeleteUser && (
        <ConfirmationModal
          isOpen={!!isSelectDeleteUser}
          loading={isPending}
          heading="Delete User"
          description={`Are you sure you want to delete user ${isSelectDeleteUser.email}? This action cannot be undone.`}
          onCancel={() => setIsSelectDeleteUser(null)}
          onConfirm={() => mutate({ userId: isSelectDeleteUser?.id || "" })}
        />
      )}
    </div>
  );
};

export default UsersPage;
