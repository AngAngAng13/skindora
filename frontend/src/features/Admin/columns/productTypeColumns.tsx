// src/features/Admin/columns/productTypeColumn.tsx
import { Checkbox } from "@radix-ui/react-checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button as ShadcnButton } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateStatusProductType } from "@/hooks/ProductType/useUpdateStatusProductType";
import { type ProductType } from "@/types/Filter/productType";


export const ActionsCell = ({ row, refetchData }: { row: { original: ProductType }; refetchData: () => void }) => {
  const { _id, option_name, state } = row.original;

  const navigate = useNavigate();

  const payload = {
    state: state === "ACTIVE" ? "INACTIVE" : "ACTIVE",
  };
  const { updateStateProductType, loading } = useUpdateStatusProductType({
    id: String(_id),
    payload,
  });

  const handleUpdateStatus = async () => {
    await updateStateProductType();
    refetchData();
  };

  return (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ShadcnButton variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </ShadcnButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(option_name)}>Copy tên hãng</DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => navigate(`/admin/${_id}/product-type-detail`)}>
            Xem chi tiết
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(`/admin/${_id}/update-product-type`)}>Chỉnh sửa</DropdownMenuItem>
          {state === "ACTIVE" ? (
            <DropdownMenuItem
              disabled={loading}
              onClick={handleUpdateStatus}
              className="font-bold text-red-600 focus:text-red-600"
            >
              {loading ? "Đang xử lý..." : "Vô hiệu hóa"}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              disabled={loading}
              onClick={handleUpdateStatus}
              className="font-bold text-green-600 focus:text-green-600"
            >
              {loading ? "Đang xử lý..." : "Kích hoạt"}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};


export const productTypeColumn = (refetchData: () => void): ColumnDef<ProductType>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <>
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </>
    ),
    cell: ({ row }) => (
      <>
        <Checkbox
          className="ml-0"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "_id",
    header: ({ column }) => (
      <ShadcnButton variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </ShadcnButton>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("_id")}</div>,
  },
  {
    accessorKey: "option_name",
    header: ({ column }) => (
      <ShadcnButton variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Tên Loại sản phẩm
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </ShadcnButton>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("option_name")}</div>,
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "category_name",
    header: "Tên Danh mục",
    cell: ({ row }) => <div className="capitalize">{row.getValue("category_name")}</div>,
  },
  {
    accessorKey: "category_param",
    header: "Tham số Danh mục",
    cell: ({ row }) => <div className="lowercase">{row.getValue("category_param")}</div>,
  },
  {
    accessorKey: "state",
    header: "Trạng thái",
    cell: ({ row }) => {
      const state = row.getValue("state") as string;
      return <Badge variant={state === "ACTIVE" ? "default" : "destructive"}>{state}</Badge>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <ActionsCell row={row} refetchData={refetchData} />; // Pass refetchData here
    },
  },
];
