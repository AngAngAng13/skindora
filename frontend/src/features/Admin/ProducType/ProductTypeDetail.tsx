import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useFetchFilterProductTypeByID } from "@/hooks/ProductType/useFetchProductTypeByID";
import { type ProductType } from "@/types/Filter/productType";

const ProductTypeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: productTypeData, fetchProductTypeByID, loading } = useFetchFilterProductTypeByID(String(id));

  useEffect(() => {
    if (id) {
      fetchProductTypeByID();
    }
  }, [id, fetchProductTypeByID]);

  useEffect(() => {
    console.log("ProductType Data:", productTypeData);
  }, [productTypeData]);

  const handleGoBack = () => {
    navigate(-1);
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

  const productType: ProductType | undefined = productTypeData;

  if (!productType) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold">Loại sản phẩm không tìm thấy</h2>
        <p className="mt-2 text-gray-500">Loại sản phẩm với ID &quot;{id}&quot; không thể tải hoặc không tồn tại.</p>
        <Button onClick={() => navigate("/admin/product-type")} className="mt-4">
          Quay lại danh sách Loại sản phẩm
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Chi tiết Loại sản phẩm</h1>
        <Button onClick={handleGoBack} variant="outline">
          Quay lại
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{productType.option_name}</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Chi tiết Loại sản phẩm ID: {productType._id}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Mô tả
            </Label>
            <p id="description" className="text-base text-gray-800">
              {productType.description}
            </p>
          </div>

          <div>
            <Label htmlFor="category-info" className="text-sm font-medium text-gray-700">
              Danh mục
            </Label>
            <p id="category-info" className="text-base text-gray-800">
              <span className="font-semibold">{productType.category_name}</span>
              <span className="text-gray-500 italic"> ({productType.category_param})</span>
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
                productType.state === "ACTIVE" // Kiểm tra trạng thái "ACTIVE"
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              {productType.state}
            </Badge>
          </div>

          {/* Mục Ngày tạo và Ngày cập nhật */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="created-at" className="text-sm font-medium text-gray-700">
                Ngày tạo
              </Label>
              <p id="created-at" className="text-base text-gray-800">
                {new Date(productType.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <Label htmlFor="updated-at" className="text-sm font-medium text-gray-700">
                Cập nhật lần cuối
              </Label>
              <p id="updated-at" className="text-base text-gray-800">
                {new Date(productType.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductTypeDetail;
