"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  // VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import React from "react";
import { Input } from "../ui/input";

interface DataTableProps<
  TData extends { name: string; email: string },
  TValue,
> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<
  TData extends { name: string; email: string },
  TValue,
>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [globalFilter, setGlobalFilter] = React.useState("");

  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "active" | "inactive"
  >("all");
  const filteredData = React.useMemo(() => {
    if (statusFilter === "active") {
      return data.filter(
        (row) => (row as TData & { isBlocked: boolean }).isBlocked === false,
      );
    }
    if (statusFilter === "inactive") {
      return data.filter(
        (row) => (row as TData & { isBlocked: boolean }).isBlocked === true,
      );
    }
    return data;
  }, [data, statusFilter]);

  const table = useReactTable({
    data: filteredData,

    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    onGlobalFilterChange: setGlobalFilter,

    state: {
      sorting,
      globalFilter,
    },

    globalFilterFn: (row, _columnId, filterValue) => {
      const name = (row.original.name ?? "").toString().toLowerCase();
      const email = (row.original.email ?? "").toString().toLowerCase();

      const value = filterValue.toLowerCase();

      return name.includes(value) || email.includes(value);
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <h2 className="text-lg font-semibold">Users</h2>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search by name or email..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-60"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "active" | "inactive")
            }
            className="ml-4 rounded border px-2 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
        {/* Left side: showing range text */}
        <div className="text-muted-foreground text-sm">
          {(() => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const totalRows = table.getFilteredRowModel().rows.length;

            const start = pageIndex * pageSize + 1;
            const end = Math.min((pageIndex + 1) * pageSize, totalRows);

            return `Showing ${start} to ${end} of ${totalRows} users.`;
          })()}
        </div>

        {/* Right side: pagination controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          {Array.from({ length: table.getPageCount() }, (_, i) => (
            <Button
              key={i}
              variant={
                table.getState().pagination.pageIndex === i
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() => table.setPageIndex(i)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
        </div>
      </div>
    </div>
  );
}
