import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
// Adjust path if necessary

// --- Import your SkinType fetch hook ---
import { useFetchSkinTypeByID } from "@/hooks/SkinType/useFetchSkinTypeByID";
// --- Import your SkinType interface ---
import type { SkinType } from "@/types/Filter/skinType";

// Adjust path if necessary

const SkinTypeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Use the SkinType-specific hook
  const { data: skinTypeData, fetchSkinTypeByID, loading } = useFetchSkinTypeByID(String(id));

  useEffect(() => {
    // Only fetch if ID exists. The hook itself might handle invalid IDs,
    // but this ensures fetch is not triggered unnecessarily.
    if (id) {
      fetchSkinTypeByID();
    }
  }, [id, fetchSkinTypeByID]); // Depend on ID to re-fetch if ID changes

  useEffect(() => {
    console.log("SkinType Data:", skinTypeData);
  }, [skinTypeData]);

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

  // Use 'skinType' for clarity, assuming skinTypeData will be a single object or undefined
  const skinType: SkinType | undefined = skinTypeData;

  if (!skinType) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold">Loại da không tìm thấy</h2>
        <p className="mt-2 text-gray-500">Loại da với ID &quot;{id}&quot; không thể tải hoặc không tồn tại.</p>
        <Button onClick={() => navigate("/admin/skin-type")} className="mt-4">
          Quay lại danh sách Loại da
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Chi tiết Loại da</h1> {/* Updated title */}
        <Button onClick={handleGoBack} variant="outline">
          Quay lại
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{skinType.option_name}</CardTitle> {/* Display SkinType name */}
          <CardDescription className="text-lg text-gray-600">Chi tiết Loại da ID: {skinType._id}</CardDescription>{" "}
          {/* Display SkinType ID */}
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* Option Name (already in title, but can be repeated here if desired) */}
          {/* <div>
            <Label htmlFor="option-name" className="text-sm font-medium text-gray-700">
              Tên Loại da
            </Label>
            <p id="option-name" className="text-base text-gray-800">
              {skinType.option_name}
            </p>
          </div> */}

          {/* Category Information */}
          <div>
            <Label htmlFor="category-info" className="text-sm font-medium text-gray-700">
              Danh mục
            </Label>
            <p id="category-info" className="text-base text-gray-800">
              <span className="font-semibold">{skinType.category_name}</span>
              <span className="text-gray-500 italic"> ({skinType.category_param})</span>
            </p>
          </div>

          <div>
            <Label htmlFor="state" className="text-sm font-medium text-gray-700">
              Trạng thái
            </Label>
            <Badge
              id="state"
              className={`mt-1 text-sm font-medium ${
                skinType.state === "ACTIVE" // Use 'ACTIVE' (uppercase) as per your schema
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              {skinType.state}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="created-at" className="text-sm font-medium text-gray-700">
                Ngày tạo
              </Label>
              <p id="created-at" className="text-base text-gray-800">
                {new Date(skinType.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <Label htmlFor="updated-at" className="text-sm font-medium text-gray-700">
                Cập nhật lần cuối
              </Label>
              <p id="updated-at" className="text-base text-gray-800">
                {new Date(skinType.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkinTypeDetail;
