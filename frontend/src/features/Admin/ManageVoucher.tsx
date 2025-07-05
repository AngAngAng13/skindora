import { Plus, PlusIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHeader } from "@/contexts/header.context";
import { useFetchVoucher } from "@/hooks/useFetchVoucher";

import { vouchersColumns } from "./columns/vouchersColumn";
import { CardDemo } from "./components/Card";
import { Loader } from "./components/Loader";
import { PaginationDemo } from "./components/Pagination";
// Component đã được cập nhật
import { DataTable } from "./components/TableCustom";

const ManageVoucher: React.FC = () => {
  const { setHeaderName, headerName } = useHeader();
  // Giả sử `useFetchUser` có kiểu dữ liệu cho `data` là User[]
  const { loading, params, setParams, voucher, fetchAllVoucher } = useFetchVoucher();
  const navigate = useNavigate();
  useEffect(() => {
    setHeaderName("Quản Lý Voucher");
  }, [setHeaderName]); // Chỉ gọi lại khi setHeaderName thay đổi

  // useEffect này sẽ gọi API khi trang thay đổi
  useEffect(() => {
    fetchAllVoucher();
  }, [params.page]);
  useEffect(() => {
    console.log(voucher);
  }, [voucher]);
  useEffect(() => {
    console.log(params);
  }, [voucher]);
  const handlePageChange = (page: number) => {
    // Cập nhật lại state `params` để trigger useEffect ở trên
    setParams((prevParams) => ({
      ...prevParams,
      page: page,
    }));
  };
  return (
    <div className="flex min-h-screen bg-white">
      {loading || !voucher ? (
        <div className="flex h-[300px] w-full items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <>
          <div className="flex-1">
            <div className="mx-auto bg-white px-8 py-15 pt-4">
              <div className="mt-3 mb-6 flex justify-between">
                <Typography className="text-2xl font-bold">{headerName}</Typography>
                <div className="bg-primary hover:bg-primary/90 r rounded-lg text-white">
                  <Button className="cursor-pointer p-5" onClick={() => navigate("/admin/createVoucher")}>
                    <div className="flex items-center gap-4">
                      <div>
                        <Plus />
                      </div>
                      <div>
                        <span className="text-sm font-semibold">Tạo voucher mới</span>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
              <div className="mt-2 mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <CardDemo
                  title="Tổng số voucher"
                  amount={`${params.totalRecords ?? 0}`}
                  change="+20.1% so với tháng trước"
                />
                <CardDemo
                  title="Tổng số voucher hết hạn"
                  amount={`${params.totalRecords ?? 0}`}
                  change="+20.1% so với tháng trước"
                />
                <CardDemo
                  title="Tổng số voucher hoạt động"
                  amount={`${params.totalRecords ?? 0}`}
                  change="+20.1% so với tháng trước"
                />
              </div>
              <div className="mb-8 gap-2">
                <div className="mt-6 w-5/5">
                  <Card className="w-full">
                    <div className="p-3">
                      <DataTable
                        columns={vouchersColumns}
                        data={voucher}
                        filterColumnId="code"
                        filterPlaceholder="Tìm voucher"
                      />
                      <div className="mt-4">
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

export default ManageVoucher;
