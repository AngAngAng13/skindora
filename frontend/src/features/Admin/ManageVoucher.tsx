import { Loader2, Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHeader } from "@/contexts/header.context";
import { useFetchVoucher } from "@/hooks/Voucher/useFetchVoucher";

import { vouchersColumns } from "./columns/vouchersColumn";
import { CardDemo } from "./components/Card";
import { PaginationDemo } from "./components/Pagination";
// Component đã được cập nhật
import { DataTable } from "./components/TableCustom";

const ManageVoucher: React.FC = () => {
  const { setHeaderName, headerName } = useHeader();

  const { loading, params, setParams, voucher, fetchAllVoucher } = useFetchVoucher();
  const navigate = useNavigate();
  useEffect(() => {
    setHeaderName("Quản Lý Voucher");
  }, [setHeaderName]);
  useEffect(() => {
    fetchAllVoucher();
  }, [params.page, fetchAllVoucher]);
  const handlePageChange = (page: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      page: page,
    }));
  };
  return (
    <div className="">
      {loading ? (
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
