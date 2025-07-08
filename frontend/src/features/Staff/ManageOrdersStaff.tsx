import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";

import { useHeader } from "@/contexts/header.context";
import { useFetchOrder } from "@/hooks/Orders/useFetchOrders";

import { orderColumn } from "../Admin/columns/ordersColumns";
import { PaginationDemo } from "../Admin/components/Pagination";
import type { FilterOptionsProps } from "../Admin/components/TableCustom";
import { DataTable } from "../Admin/components/TableCustom";

const ManageOrdersStaff: React.FC = () => {
  const { setHeaderName } = useHeader();
  useEffect(() => {
    setHeaderName("Quản Lý Khách Hàng");
  }, []);
  const { fetchOrder, data, params, changePage, changeStatus, loading } = useFetchOrder();
  useEffect(() => {
    fetchOrder();
    console.log(data);
    console.log(params.page);
    console.log(params.limit);
    console.log(params.status);
  }, [params.page, params.status]);
  const handlePageChange = (page: number) => {
    changePage(page);
  };

  const filterOptions: FilterOptionsProps[] = [
    { value: "", label: "ALL" as const },
    { value: "failed", label: "FAILED" as const },
    { value: "shipping", label: "SHIPPING" as const },
    { value: "delivered", label: "DELIVERED" as const },
    { value: "cancelled", label: "CANCELLED" as const },
    { value: "returned", label: "RETURNED" as const },
    { value: "confirmed", label: "CONFIRMED" as const },
    { value: "pending", label: "PENDING" as const },
  ];

  return (
    <div>
      {loading ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-muted-foreground flex items-center gap-2">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <span className="text-lg">Đang tải dữ liệu...</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="">
            <div className="flex-1">
              <div className="mx-auto rounded-sm bg-white px-8 py-15 pt-3 shadow-md">
                <div>
                  <DataTable
                    columns={orderColumn}
                    data={data}
                    status={params.status}
                    filterColumnId="_id"
                    filterPlaceholder="Tìm khách hàng"
                    isHaveFilter={true}
                    filterOptions={filterOptions}
                    callBackFunction={changeStatus}
                  />
                </div>
                <div className="mt-4">
                  <PaginationDemo
                    // eslint-disable-next-line no-constant-binary-expression
                    totalPages={Number(params.totalPages) ?? 1}
                    // eslint-disable-next-line no-constant-binary-expression
                    currentPage={Number(params.page) ?? 1}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrdersStaff;
