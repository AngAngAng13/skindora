// src/features/Admin/ProductType/ManageProductType.tsx (hoặc đường dẫn tương tự)
import { Loader2, Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHeader } from "@/contexts/header.context";
import { useFetchFilterProductType } from "@/hooks/ProductType/useFetchProductType";

import { productTypeColumn } from "../columns/productTypeColumns";
import { PaginationDemo } from "../components/Pagination";
import { DataTable } from "../components/TableCustom";

const ManageProductType: React.FC = () => {
  const navigate = useNavigate();
  const { setHeaderName, headerName } = useHeader();

  const { loading, data, fetchListFilterProductType, params, setParams } = useFetchFilterProductType();

  useEffect(() => {
    fetchListFilterProductType();
  }, [params.page, params.limit, fetchListFilterProductType]);

  useEffect(() => {
    console.log("ProductType Data:", data);
  }, [data]);

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      page: page,
    }));
  };

  // Cập nhật tên tiêu đề khi component mount
  useEffect(() => {
    setHeaderName("Quản Lý Loại Sản phẩm");
  }, [setHeaderName]);

  return (
    <div className="">
      {loading ? (
        // Hiển thị loading spinner khi dữ liệu đang tải
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-muted-foreground flex items-center gap-2">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <span className="text-lg">Đang tải dữ liệu...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1">
            <div className="mx-auto bg-white px-8 py-15 pt-4">
              <div className="mt-3 mb-6 flex justify-between">
                <Typography className="text-2xl font-bold">{headerName}</Typography>
                <div className="bg-primary hover:bg-primary/90 rounded-lg text-white">
                  {/* Nút tạo Loại sản phẩm mới */}
                  <Button className="cursor-pointer p-5" onClick={() => navigate("/admin/create-product-type")}>
                    <div className="flex items-center gap-4">
                      <div>
                        <Plus />
                      </div>
                      <div>
                        <span className="text-sm font-semibold">Tạo Loại sản phẩm mới</span>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>

              <div className="mb-8 gap-2">
                <div className="mt-6 w-5/5">
                  <Card className="w-full">
                    <div className="p-3">
                      {/* Bảng dữ liệu */}
                      <DataTable
                        columns={productTypeColumn} // Sử dụng cột đã định nghĩa
                        data={data}
                        filterColumnId="option_name" // ID cột để lọc
                        filterPlaceholder="Tìm Loại sản phẩm" // Placeholder cho ô tìm kiếm
                      />
                      <div className="mt-4">
                        {/* Component phân trang */}
                        <PaginationDemo
                          totalPages={params.totalPages ?? 1}
                          currentPage={params.page ?? 1}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageProductType;
