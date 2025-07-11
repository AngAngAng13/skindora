import { Loader2, Package, Star } from "lucide-react";
import React, { useEffect } from "react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useHeader } from "@/contexts/header.context";
import { useFetchOrder } from "@/hooks/Orders/useFetchOrders";

import { orderColumn } from "../Admin/columns/ordersColumns";
import { PaginationDemo } from "../Admin/components/Pagination";
import type { FilterOptionsProps } from "../Admin/components/TableCustom";
import { DataTable } from "../Admin/components/TableCustom";

const ManageOrdersStaff: React.FC = () => {
  const { setHeaderName } = useHeader();
  const { fetchOrder, data, params, changePage, changeStatus, loading } = useFetchOrder();

  useEffect(() => {
    // Đổi tên header để phù hợp hơn với nội dung trang
    setHeaderName("Quản Lý Đơn Hàng");
  }, [setHeaderName]);

  useEffect(() => {
    fetchOrder();
  }, [params.page, params.status, fetchOrder]);

  const handlePageChange = (page: number) => {
    changePage(page);
  };

  const filterOptions: FilterOptionsProps[] = [
    { value: "", status: "ALL" as const },
    { value: "pending", status: "PENDING" as const },
    { value: "confirmed", status: "CONFIRMED" as const },
    { value: "shipping", status: "SHIPPING" as const },
    { value: "delivered", status: "DELIVERED" as const },
    { value: "cancelled", status: "CANCELLED" as const },
    { value: "returned", status: "RETURNED" as const },
    { value: "failed", status: "FAILED" as const },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-3">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="text-xl font-semibold">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Phần Card thống kê */}
      <div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">Tổng đơn hàng</p>
                  <p className="text-3xl font-bold">{params.totalRecords}</p>
                </div>
                <Package className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-100">Đã giao</p>
                  {/* Cần thêm logic để lấy số liệu này */}
                  <p className="text-3xl font-bold">N/A</p>
                </div>
                <Star className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-100">Đang xử lý</p>
                  {/* Cần thêm logic để lấy số liệu này */}
                  <p className="text-3xl font-bold">N/A</p>
                </div>
                <Package className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-100">Đã hủy</p>
                  {/* Cần thêm logic để lấy số liệu này */}
                  <p className="text-3xl font-bold">N/A</p>
                </div>
                <Package className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Phần Bảng dữ liệu */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Danh sách Đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={orderColumn}
            data={data}
            status={params.status}
            isHaveFilter={true}
            filterOptions={filterOptions}
            callBackFunction={changeStatus}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <PaginationDemo
            totalPages={Number(params.totalPages) || 1}
            currentPage={Number(params.page) || 1}
            onPageChange={handlePageChange}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ManageOrdersStaff;
