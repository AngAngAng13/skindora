import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
// Điều chỉnh đường dẫn này nếu cần

// --- Import useFetchUsesByID hook của bạn ---
import { useFetchUsesByID } from "@/hooks/Uses/useFetchUsesByID";
// --- Import your Uses interface ---
import { type Uses } from "@/types/Filter/uses";

// Điều chỉnh đường dẫn này nếu cần

const UsesDetail = () => {
  const { id } = useParams<{ id: string }>(); // Lấy ID từ URL
  const navigate = useNavigate(); // Hook để điều hướng

  // Sử dụng hook để fetch dữ liệu Công dụng
  const { data: usesData, fetchUsesByID, loading } = useFetchUsesByID(String(id));

  // Gọi hàm fetch khi component mount hoặc ID thay đổi
  useEffect(() => {
    if (id) {
      fetchUsesByID();
    }
  }, [id, fetchUsesByID]); // Dependencies: ID và hàm fetchUsesByID

  // Log dữ liệu khi nó thay đổi (cho mục đích debug)
  useEffect(() => {
    console.log("Uses Data:", usesData);
  }, [usesData]);

  // Hàm để quay lại trang trước
  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước trong lịch sử
  };

  // Hiển thị trạng thái loading
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

  // Gán data vào biến 'uses' để dễ sử dụng
  const uses: Uses | undefined = usesData;

  // Hiển thị khi không tìm thấy dữ liệu hoặc dữ liệu là null/undefined
  if (!uses) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold">Công dụng không tìm thấy</h2>
        <p className="mt-2 text-gray-500">Công dụng với ID &quot;{id}&quot; không thể tải hoặc không tồn tại.</p>
        <Button onClick={() => navigate("/admin/use")} className="mt-4">
          Quay lại danh sách Công dụng
        </Button>
      </div>
    );
  }

  // Render chi tiết Công dụng
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Chi tiết Công dụng</h1>
        <Button onClick={handleGoBack} variant="outline">
          Quay lại
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{uses.option_name}</CardTitle>
          <CardDescription className="text-lg text-gray-600">Chi tiết Công dụng ID: {uses._id}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* Mục Mô tả */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Mô tả
            </Label>
            <p id="description" className="text-base text-gray-800">
              {uses.description}
            </p>
          </div>

          {/* Mục Danh mục */}
          <div>
            <Label htmlFor="category-info" className="text-sm font-medium text-gray-700">
              Danh mục
            </Label>
            <p id="category-info" className="text-base text-gray-800">
              <span className="font-semibold">{uses.category_name}</span>
              <span className="text-gray-500 italic"> ({uses.category_param})</span>
            </p>
          </div>

          {/* Mục Trạng thái */}
          <div>
            <Label htmlFor="state" className="text-sm font-medium text-gray-700">
              Trạng thái
            </Label>
            <Badge
              id="state"
              className={`mt-1 text-sm font-medium ${
                uses.state === "ACTIVE" // Kiểm tra trạng thái "ACTIVE"
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              {uses.state}
            </Badge>
          </div>

          {/* Mục Ngày tạo và Ngày cập nhật */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="created-at" className="text-sm font-medium text-gray-700">
                Ngày tạo
              </Label>
              <p id="created-at" className="text-base text-gray-800">
                {new Date(uses.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <Label htmlFor="updated-at" className="text-sm font-medium text-gray-700">
                Cập nhật lần cuối
              </Label>
              <p id="updated-at" className="text-base text-gray-800">
                {new Date(uses.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsesDetail;
