import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
// Adjust path if necessary

// --- Import your DacTinh fetch hook ---
import { useFetchFilterDacTinhByID } from "@/hooks/Dactinh/useFetchFilterDacTinhByID";
// --- Import your DacTinh interface ---
import { type DacTinh } from "@/types/Filter/dactinh";

// Adjust path if necessary

const DacTinhDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Use the DacTinh-specific hook
  const { data: dacTinhData, fetchFilterDacTinhByID, loading } = useFetchFilterDacTinhByID(String(id));

  useEffect(() => {
    fetchFilterDacTinhByID();
  }, [fetchFilterDacTinhByID]); // Depend on the function itself

  useEffect(() => {
    console.log("DacTinh Data:", dacTinhData);
  }, [dacTinhData]);

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page in history
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="text-lg">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  // Use dacTinh for clarity, assuming dacTinhData will be a single object
  const dacTinh: DacTinh | undefined = dacTinhData;

  if (!dacTinh) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold">Đặc tính không tìm thấy</h2>
        <p className="mt-2 text-gray-500">Đặc tính với ID &quot;{id}&quot; không thể tải hoặc không tồn tại.</p>
        <Button onClick={() => navigate("/admin/dac-tinh")} className="mt-4">
          Quay lại danh sách Đặc tính
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Chi tiết Đặc tính</h1> {/* Updated title */}
        <Button onClick={handleGoBack} variant="outline">
          Quay lại
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{dacTinh.option_name}</CardTitle> {/* Display DacTinh name */}
          <CardDescription className="text-lg text-gray-600">
            Details for Đặc tính ID: {dacTinh._id}
          </CardDescription>{" "}
          {/* Display DacTinh ID */}
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* Category Information */}
          <div>
            <Label htmlFor="category-info" className="text-sm font-medium text-gray-700">
              Danh mục
            </Label>{" "}
            {/* Updated label */}
            <p id="category-info" className="text-base text-gray-800">
              <span className="font-semibold">{dacTinh.category_name}</span>
              <span className="text-gray-500 italic"> ({dacTinh.category_param})</span>
            </p>
          </div>

          <div>
            <Label htmlFor="state" className="text-sm font-medium text-gray-700">
              Trạng thái
            </Label>{" "}
            {/* Updated label */}
            <Badge
              id="state"
              className={`mt-1 text-sm font-medium ${
                dacTinh.state === "ACTIVE" // Use 'ACTIVE' (uppercase) as per your schema
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              {dacTinh.state}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="created-at" className="text-sm font-medium text-gray-700">
                Ngày tạo
              </Label>{" "}
              {/* Updated label */}
              <p id="created-at" className="text-base text-gray-800">
                {new Date(dacTinh.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <Label htmlFor="updated-at" className="text-sm font-medium text-gray-700">
                Cập nhật lần cuối
              </Label>{" "}
              {/* Updated label */}
              <p id="updated-at" className="text-base text-gray-800">
                {new Date(dacTinh.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DacTinhDetail;
