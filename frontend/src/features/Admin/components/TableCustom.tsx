import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import { Funnel, Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface FilterOptionsProps {
  value: string;
  label:
    | "SHIPPING"
    | "FAILED"
    | "CANCELLED"
    | "RETURNED"
    | "DELIVERED"
    | "PROCESSING"
    | "CONFIRMED"
    | "PENDING"
    | "ALL";
}
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterOptions?: FilterOptionsProps[];
  filterColumnId: string;
  filterPlaceholder: string;
  isHaveFilter?: boolean;
  callBackFunction?: (status?: "SHIPPING" | "FAILED" | "CANCELLED" | "RETURNED" | "DELIVERED" | "PROCESSING") => void;
  status?: string;
}

export function DataTable<TData, TValue>({
  status,
  columns,
  data,
  filterColumnId,
  filterOptions,
  isHaveFilter,
  filterPlaceholder,
  callBackFunction,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full">
      <div className="bg-card text-card-foreground flex items-center gap-2 p-4">
        <div className="flex-grow">
          <div className="relative flex items-center">
            <Search className="text-muted-foreground absolute left-3 h-4 w-4" />
            <Input
              placeholder={filterPlaceholder}
              value={(table.getColumn(filterColumnId)?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn(filterColumnId)?.setFilterValue(event.target.value)}
              className="rounded-lg border border-gray-300 p-6 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="ml-auto p-6">
                <span className="text-sm">
                  <Funnel className="" />
                </span>
                <span className="text-sm">Bộ Lộc</span>
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
      </div>
      {isHaveFilter && (
        <div className="mt-2 flex gap-2">
          {filterOptions?.map((option) => {
            const handleClick = async () => {
              if (callBackFunction) {
                callBackFunction(option.label as any);
              }
            };
            return (
              <div key={option.value}>
                <Button variant={status === option.label ? "default" : "secondary"} onClick={handleClick}>
                  {option.label}
                </Button>
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-3 rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Không có kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
