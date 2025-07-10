import { Loader2, Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHeader } from "@/contexts/header.context";
import { useFetchUses } from "@/hooks/Uses/useFetchUses";

import { usesColumn } from "../columns/usesColumns";
import { PaginationDemo } from "../components/Pagination";
import { DataTable } from "../components/TableCustom";

const ManageUses: React.FC = () => {
  const navigate = useNavigate();
  const { setHeaderName, headerName } = useHeader();

  // Use the new useFetchUses hook
  const { loading, data, fetchListUses, params, setParams } = useFetchUses();

  useEffect(() => {
    fetchListUses();
  }, [params.page, params.limit, fetchListUses]);

  useEffect(() => {
    console.log("Uses Data:", data);
  }, [data]);

  const handlePageChange = (page: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      page: page,
    }));
  };

  // If useFetchUses also provides changeLimit, you can use it here
  // const handleLimitChange = (limit: number) => {
  //   setParams((prevParams) => ({
  //     ...prevParams,
  //     limit: limit,
  //     page: 1, // Reset to first page when limit changes
  //   }));
  // };

  useEffect(() => {
    setHeaderName("Quản Lý Công dụng"); // Set header name for Uses
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
                  <Button className="cursor-pointer p-5" onClick={() => navigate("/admin/create-uses")}>
                    <div className="flex items-center gap-4">
                      <div>
                        <Plus />
                      </div>
                      <div>
                        <span className="text-sm font-semibold">Tạo Công dụng mới</span> {/* Button text for Uses */}
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
                        columns={usesColumn} // Use the new usesColumn
                        data={data}
                        filterColumnId="option_name" // Filter by option_name for Uses
                        filterPlaceholder="Tìm Công dụng" // Updated placeholder
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

export default ManageUses;
