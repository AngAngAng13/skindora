"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// 1. Import định nghĩa type Voucher
import type { Voucher } from "@/types/voucher";

// Hàm trợ giúp định dạng tiền tệ (Giả sử bạn có hàm này)
const formatCurrency = (amount: number | string) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(amount));
};

// Hàm trợ giúp định dạng ngày
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

// 2. Định nghĩa các cột cho bảng Voucher
export const vouchersColumns: ColumnDef<Voucher>[] = [
  // Cột Checkbox
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "code",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Mã Voucher <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div className="pl-2 font-medium text-blue-600">{row.getValue("code")}</div>;
    },
  },

  // Cột Mô tả
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      // Cắt ngắn mô tả nếu quá dài để hiển thị trong bảng
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[250px] truncate" title={description}>
          {description}
        </div>
      );
    },
  },

  // Cột Mức giảm giá
  {
    id: "discount",
    header: "Mức giảm giá",
    cell: ({ row }) => {
      const { discountValue, maxDiscountAmount, discountType } = row.original;
      if (discountType === "PERCENTAGE") {
        let discountText = discountValue; // Hoặc discountValue + "%" nếu là phần trăm
        if (Number(maxDiscountAmount) > 0) {
          discountText += `% (tối đa ${formatCurrency(maxDiscountAmount)})`;
        }
        return <div>{discountText}</div>;
      }
      if (discountType === "FIXED") {
        return <div> Giảm tối đa {formatCurrency(discountValue)}</div>;
      }
    },
  },

  // Cột Đơn hàng tối thiểu
  {
    accessorKey: "minOrderValue",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Đơn tối thiểu <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div className="pl-3 font-semibold text-green-500">{formatCurrency(row.getValue("minOrderValue"))}</div>;
    },
  },

  // Cột Lượt sử dụng
  {
    id: "usage",
    header: "Sử dụng",
    cell: ({ row }) => {
      const { usedCount, usageLimit } = row.original;
      return (
        <div>
          {usedCount} / {usageLimit}
        </div>
      );
    },
  },

  // Cột Trạng thái
  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      const { startDate, endDate } = row.original;
      const now = new Date();
      const isExpired = new Date(endDate) < now;
      const isNotStarted = new Date(startDate) > now;

      if (isExpired) {
        return <Badge variant="destructive">Hết hạn</Badge>;
      }
      if (isNotStarted) {
        return <Badge variant="secondary">Chưa bắt đầu</Badge>;
      }
      if (isActive) {
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Đang hoạt động</Badge>;
      }
      return <Badge variant="secondary">Không hoạt động</Badge>;
    },
  },

  // Cột Ngày hiệu lực
  {
    accessorKey: "startDate",
    header: "Thời gian hiệu lực",
    cell: ({ row }) => {
      const { startDate, endDate } = row.original;
      return <div>{`${formatDate(startDate)} - ${formatDate(endDate)}`}</div>;
    },
  },

  // Cột Actions
  {
    id: "actions",
    cell: ({ row }) => {
      const voucher = row.original;
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(voucher.code)}>
                Copy mã voucher
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
              <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 focus:text-red-500">Xóa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
