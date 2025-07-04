import { TrendingDown, TrendingUp } from "lucide-react";
import React, { useEffect } from "react";

import { Card } from "@/components/ui/card";
import { useHeader } from "@/contexts/header.context";
import { useFetchVoucher } from "@/hooks/useFetchVoucher";

import { vouchersColumns } from "./columns/vouchersColumn";
import { CardDemo } from "./components/Card";
import { Loader } from "./components/Loader";
import { PaginationDemo } from "./components/Pagination";
import { ChartRadialText } from "./components/RadialChart";
// Component đã được cập nhật
import { DataTable } from "./components/TableCustom";

const ManageVoucher: React.FC = () => {
  const { setHeaderName } = useHeader();
  // Giả sử `useFetchUser` có kiểu dữ liệu cho `data` là User[]
  const { loading, data, params, setParams, voucher, fetchAllVoucher } = useFetchVoucher();

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
              {/* <div>
                <Typography className="text-2xl font-bold">Danh sách khách hàng</Typography>
              </div> */}
              <div className="mt-2 mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <CardDemo
                  title="Tổng số voucher"
                  amount={`${params.totalRecords ?? 0}`} // Sử dụng `totalRecords` từ params
                  change="+20.1% so với tháng trước"
                />
                {/* <ChartRadialText /> */}
                <CardDemo
                  title="Tổng số voucher hết hạn"
                  amount={`${params.totalRecords ?? 0}`} // Sử dụng `totalRecords` từ params
                  change="+20.1% so với tháng trước"
                />
                <CardDemo
                  title="Tổng số voucher hoạt động"
                  amount={`${params.totalRecords ?? 0}`} // Sử dụng `totalRecords` từ params
                  change="+20.1% so với tháng trước"
                />

                {/* Các CardDemo khác */}
              </div>
              {/* <div className="mt-5 mb-4 flex gap-2">
                <div className="w-3/5">
                  <ChartRadialText
                    title="Khách hàng có đơn"
                    description="Trong tháng 6, 2025"
                    value={152}
                    label="Khách hàng"
                    footerContent={
                      <>
                        Tăng 5.2% so với tháng trước <TrendingUp className="h-4 w-4 text-green-500" />
                      </>
                    }
                    footerDescription="Dữ liệu cập nhật hàng ngày"
                  />
                </div>
                <div className="w-5/5">
                  <ChartRadialText
                    title="Tài khoản mới"
                    description="Trong tháng 6, 2025"
                    value={89}
                    label="Tài khoản"
                    footerContent={
                      <>
                        Giảm 2.1% so với tháng trước <TrendingDown className="h-4 w-4 text-red-500" />
                      </>
                    }
                    footerDescription="Tổng số tài khoản đăng ký mới"
                  />
                </div>
              </div> */}
              <div className="mb-8 gap-2">
                <div className="mt-3 w-5/5">
                  <Card className="w-5/5">
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

              {/* <div className="mt-8">
            {loading ? (
              <div className="flex h-[300px] w-full items-center justify-center">
                <Loader size="lg" />
              </div>
            ) : (
              <>
                <DataTable
                  columns={userColumn}
                  data={data}
                  filterColumnId="username"
                  filterPlaceholder="Tìm khách hàng"
                />
                <div className="mt-4">
                  <PaginationDemo
                    totalPages={params.totalPages ?? 1}
                    currentPage={params.page ?? 1}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageVoucher;
