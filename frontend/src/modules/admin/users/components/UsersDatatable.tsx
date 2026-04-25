"use client";

import CommonTable from "@/common/components/DataTable";
import { useRouter } from "next/navigation";
import { TableColumn } from "react-data-table-component";
import { User } from "../users.type";

const columns: TableColumn<User>[] = [
  {
    name: "Name",
    selector: (row) => row.name,
  },
  {
    name: "Email",
    selector: (row) => row.email,
  },
  {
    name: "Profile",
    selector: (row) => row.profile,
  },
  {
    name: "Passed Sessions",
    selector: (row) => row.totalPassSession,
  },
  {
    name: "In-progress Sessions",
    selector: (row) => row.totalInProgressSession,
  },
  {
    name: "Failed Sessions",
    selector: (row) => row.totalFailedSession,
  },
  {
    name: "Progress",
    cell: (row) => {
      const completed = row.totalPassSession + row.totalFailedSession;
      const total = row.totalSessions || 1;
      const percentage = (completed / total) * 100;

      return (
        <div className="flex items-center gap-3 w-full">
          {/* Progress Bar */}
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Text */}
          <span className="text-sm text-gray-600 min-w-[40px] text-right">
            {completed}/{total}
          </span>
        </div>
      );
    },
  },
];

export default function UsersDatatable({
  onAddUser,
  onDeleteUser,
  data,
  page,
  total,
  perPage,
  onPageChange,
  onPerPageChange, 
  loading,
}: {
  onAddUser: () => void;
  onDeleteUser: (user: User) => void;
  data: User[];
  page: number;
  total: number;
  perPage: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPerPageChange: (newPerPage: number, page: number) => void;
}) {
  const router = useRouter();

  const handleRowClick = (row: User) => {
    router.push(`/admin/dashboard/users/${row.id}`);
  };

  return (
    <CommonTable<User>
      title="Admin User Management"
      className="cursor-pointer"
      columns={columns}
      data={data}
      loading={loading}
      actionButton={{
        label: "Add User",
        onClick: onAddUser,
      }}
      onRowClicked={handleRowClick}
      rowActions={[
        {
          label: "View",
          onClick: (row) => router.push(`/admin/dashboard/users/${row.id}`),
        },
        {
          label: "Delete",
          onClick: (row) => onDeleteUser(row),
        },
      ]}
      paginationOptions={{
        page,
        perPage,
        totalRows: total,
        onPageChange,
        onPerPageChange,
      }}
    />
  );
}
