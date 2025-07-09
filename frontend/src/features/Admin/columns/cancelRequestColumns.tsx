import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
// Giả sử bạn có hook này để cập nhật trạng thái yêu cầu
// import { useUpdateCancelRequestStatus } from "@/hooks/CancelRequest/useUpdateCancelRequestStatus";
import type { CancelRequest } from "@/types/cancelRequest";

// Hàm định dạng tiền tệ
const formatCurrency = (amount: number | string) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(amount));
};

// Hàm định dạng ngày
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

// Component chứa các hành động cho mỗi hàng
export const ActionsCell = ({ row }: { row: { original: CancelRequest } }) => {
  const { _id, UserID, CancelRequest: requestDetails } = row.original;
  const navigate = useNavigate();

  // --- PHẦN GIẢ ĐỊNH ---
  // Giả sử bạn có một hook để xử lý việc gọi API cập nhật trạng thái
  // const { updateStatus, loading } = useUpdateCancelRequestStatus();
  const loading = false; // Xóa dòng này khi có hook thật

  const handleApprove = () => {
    console.log("Approving request:", _id);
    // updateStatus({ requestId: _id, status: "APPROVED" });
    // window.location.reload(); // Hoặc cập nhật state để re-render
  };

  const handleReject = () => {
    console.log("Rejecting request:", _id);
    // updateStatus({ requestId: _id, status: "REJECTED" });
    // window.location.reload(); // Hoặc cập nhật state để re-render
  };
  // --- KẾT THÚC PHẦN GIẢ ĐỊNH ---

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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(UserID)}>Copy Mã người dùng</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate(`/admin/cancel-request/${_id}`)}>Xem chi tiết</DropdownMenuItem>
          {requestDetails.status === "PENDING" && (
            <>
              <DropdownMenuItem
                disabled={loading}
                onClick={handleApprove}
                className="font-semibold text-green-600 focus:bg-green-100 focus:text-green-700"
              >
                {loading ? "Đang xử lý..." : "Chấp thuận"}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={loading}
                onClick={handleReject}
                className="font-semibold text-red-600 focus:bg-red-100 focus:text-red-700"
              >
                {loading ? "Đang xử lý..." : "Từ chối"}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const cancelRequestColumns: ColumnDef<CancelRequest>[] = [
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
    accessorKey: "_id",
    header: "Mã Yêu Cầu",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("_id")}</div>;
    },
  },
  {
    accessorKey: "UserID",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Mã Người Dùng <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div className="pl-4">{row.getValue("UserID")}</div>;
    },
  },
  {
    accessorKey: "TotalPrice",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Tổng Tiền <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("TotalPrice"));
      return <div className="pr-4 text-right font-medium">{formatCurrency(amount)}</div>;
    },
  },
  {
    // Truy cập vào thuộc tính lồng nhau
    accessorFn: (row) => row.CancelRequest.requestedAt,
    id: "requestedAt",
    header: "Ngày Yêu Cầu",
    cell: ({ row }) => {
      return <div>{formatDate(row.original.CancelRequest.requestedAt)}</div>;
    },
  },
  {
    // Truy cập vào thuộc tính lồng nhau
    accessorFn: (row) => row.CancelRequest.status,
    id: "requestStatus",
    header: "Trạng thái Yêu cầu",
    cell: ({ row }) => {
      const status = row.original.CancelRequest.status;
      if (status === "APPROVED") {
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Đã chấp thuận</Badge>;
      }
      if (status === "REJECTED") {
        return <Badge variant="destructive">Đã từ chối</Badge>;
      }
      return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Đang chờ</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
