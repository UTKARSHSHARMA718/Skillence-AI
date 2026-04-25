"use client";

import DataTable, { TableColumn } from "react-data-table-component";
import { useState } from "react";
import clsx from "clsx";
import Loader from "./Loader";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import { createPortal } from "react-dom";

type RowAction<T> = {
  label: string;
  onClick: (row: T) => void;
};

type PaginationProps = {
  page?: number;
  perPage?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (newPerPage: number, page: number) => void;
};

type CommonTableProps<T> = {
  className?: string;
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;

  title?: string;

  actionButton?: {
    label: string;
    onClick: () => void;
  };

  onRowClicked?: (row: T) => void;

  rowActions?: RowAction<T>[];

  pagination?: boolean;
  paginationOptions?: PaginationProps;
};

const customStyles = {
  table: {
    style: {
      borderRadius: "12px",
      overflow: "hidden",
    },
  },
  headRow: {
    style: {
      backgroundColor: "#F9FAFB",
      borderBottom: "1px solid #E5E7EB",
      minHeight: "48px",
    },
  },
  headCells: {
    style: {
      fontSize: "13px",
      fontWeight: 600,
      color: "#6B7280",
      textTransform: "uppercase" as const,
    },
  },
  rows: {
    style: {
      minHeight: "60px",
      borderBottom: "1px solid #F1F5F9",
      "&:hover": {
        backgroundColor: "#F9FAFB",
        cursor: "pointer",
      },
    },
  },
  cells: {
    style: {
      fontSize: "14px",
      color: "#111827",
    },
  },
  pagination: {
    style: {
      borderTop: "1px solid #E5E7EB",
      padding: "12px",
    },
  },
};

export default function CommonTable<T>({
  columns,
  data,
  title,
  actionButton,
  rowActions,
  pagination = true,
  paginationOptions,
  className,
  onRowClicked,
  loading,
}: CommonTableProps<T>) {
  const [openRowId, setOpenRowId] = useState<number | null>(null);

  const actionColumn: TableColumn<T> | null = rowActions
    ? {
        name: "",
        width: "80px",
        cell: (row: any, index: number) => (
          <ActionCell
            row={row}
            index={index}
            openRowId={openRowId}
            setOpenRowId={setOpenRowId}
            rowActions={rowActions}
          />
        ),
      }
    : null;

  const finalColumns = actionColumn ? [...columns, actionColumn] : columns;

  return (
    <div className={clsx("w-full", className)}>
      {/* Header */}
      {title && actionButton && (
        <div className="flex justify-between items-center mb-4 px-2">
          {title && (
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          )}

          {actionButton && (
            <button
              onClick={actionButton.onClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              {actionButton.label}
            </button>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <DataTable
          columns={finalColumns}
          data={data}
          onRowClicked={onRowClicked}
          pagination={pagination}
          paginationServer={pagination}
          paginationTotalRows={paginationOptions?.totalRows}
          paginationDefaultPage={paginationOptions?.page}
          paginationPerPage={paginationOptions?.perPage}
          onChangePage={paginationOptions?.onPageChange}
          onChangeRowsPerPage={paginationOptions?.onPerPageChange}
          highlightOnHover
          responsive
          progressPending={loading}
          customStyles={customStyles}
          progressComponent={
            <div className="flex justify-center items-center p-6 min-h-100">
              <Loader size={40} />
            </div>
          }
        />
      </div>
    </div>
  );
}

const ActionCell = ({
  row,
  index,
  openRowId,
  setOpenRowId,
  rowActions,
}: {
  row: any;
  index: number;
  openRowId: number | null;
  setOpenRowId: (id: number | null) => void;
  rowActions: RowAction<any>[];
}) => {
  const open = openRowId === index;

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-end",
    strategy: "fixed",
    middleware: [offset(6), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  return (
    <>
      <div ref={refs.setReference}>
        <button
          onClick={() => setOpenRowId(open ? null : index)}
          className="text-lg w-10 h-10 cursor-pointer bg-gray-100/60 rounded-xl"
        >
          ⋮
        </button>
      </div>

      {open &&
        createPortal(
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              position: "fixed", // ✅ must match strategy
            }}
            className="z-50 w-32 bg-white border rounded shadow"
          >
            {rowActions.map((action, i) => (
              <button
                key={i}
                onClick={() => {
                  action.onClick(row);
                  setOpenRowId(null);
                }}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100"
              >
                {action.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
};
