import { Loader2, Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHeader } from "@/contexts/header.context";
import { useFetchFilterDacTinh } from "@/hooks/Dactinh/useFetchFilterDacTinh";

// Import the DacTinh fetch hook

import { dacTinhColumn } from "../columns/dactinhsColumn";
// Import the dacTinhColumn
import { PaginationDemo } from "../components/Pagination";
import { DataTable } from "../components/TableCustom";

const ManageDacTinh: React.FC = () => {
  const navigate = useNavigate();
  const { setHeaderName, headerName } = useHeader();

  const { loading, data, fetchFilterDacTinh, params, setParams } = useFetchFilterDacTinh();

  useEffect(() => {
    fetchFilterDacTinh();
  }, [params.page, fetchFilterDacTinh]);

  useEffect(() => {
    console.log("DacTinh Data:", data);
  }, [data]);

  const handlePageChange = (page: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      page: page,
    }));
  };

  useEffect(() => {
    setHeaderName("Quản Lý Đặc Tính");
  }, [setHeaderName]);

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
                <div className="bg-primary hover:bg-primary/90 rounded-lg text-white">
                  <Button className="cursor-pointer p-5" onClick={() => navigate("/admin/create-dactinh")}>
                    <div className="flex items-center gap-4">
                      <div>
                        <Plus />
                      </div>
                      <div>
                        <span className="text-sm font-semibold">Tạo đặc tính mới</span>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>

              <div className="mb-8 gap-2">
                <div className="mt-6 w-5/5">
                  <Card className="w-full">
                    <div className="p-3">
                      <DataTable
                        columns={dacTinhColumn}
                        data={data}
                        filterColumnId="option_name"
                        filterPlaceholder="Tìm đặc tính"
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

export default ManageDacTinh;
