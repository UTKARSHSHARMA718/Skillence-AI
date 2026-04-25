"use client";
import { useState } from "react";
import { User } from "../users.type";

const useUsersDatatable = () => {
  const [isSelectDeleteUser, setIsSelectDeleteUser] = useState<User | null>(
    null,
  );
  const [isOpenAddUserModal, setIsOpenAddUserModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });

  return {
    pagination,
    setPagination,
    isSelectDeleteUser,
    setIsSelectDeleteUser,
    isOpenAddUserModal,
    setIsOpenAddUserModal,
  };
};

export default useUsersDatatable;
