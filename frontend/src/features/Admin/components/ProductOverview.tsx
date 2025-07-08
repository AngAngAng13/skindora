import { Edit, Eye, Loader2, Package, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetchBrand } from "@/hooks/Brand/useFetchBrand";
import { useFetchProduct } from "@/hooks/Product/useFetchProduct";

import { PaginationDemo } from "./Pagination";

export interface Product {
  _id: string;
  name_on_list: string;
  engName_on_list: string;
  price_on_list: string;
  image_on_list: string;
  hover_image_on_list: string;
  product_detail_url: string;
  productName_detail: string;
  engName_detail: string;
  description_detail: {
    rawHtml: string;
    plainText: string;
  };
  ingredients_detail: {
    rawHtml: string;
    plainText: string;
  };
  guide_detail: {
    rawHtml: string;
    plainText: string;
  };
  specification_detail: {
    rawHtml: string;
    plainText: string;
  };
  main_images_detail: string[];
  sub_images_detail: string[];
  filter_hsk_ingredient: string;
  filter_hsk_skin_type: string;
  filter_hsk_uses: string;
  filter_hsk_product_type: string;
  filter_origin: string;
}

export function ProductOverview() {
  const navigate = useNavigate();
  const { fetchListProduct, data, params, changePage, loading, changeBrand } = useFetchProduct();
  const { data: brand, fetchListBrand } = useFetchBrand();
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const formatPrice = (price: string) => {
    const priceValue = parseInt(price, 10);
    if (isNaN(priceValue)) {
      return "N/A";
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(priceValue);
  };
  useEffect(() => {
    fetchListBrand();
  }, []);
  useEffect(() => {
    fetchListProduct();
  }, [
    params.limit,
    params.page,
    params.filter_brand,
    params.filter_dactinh,
    params.filter_hsk_ingredient,
    params.filter_hsk_product_type,
    params.filter_hsk_size,
    params.filter_hsk_skin_type,
    params.filter_hsk_uses,
    params.filter_origin,
  ]);
  useEffect(() => {
    changeBrand(selectedBrand);
  }, [selectedBrand]);
  return (
    <div>
      {loading ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-muted-foreground flex items-center gap-2">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <span className="text-lg">Đang tải dữ liệu...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Tổng sản phẩm</p>
                    <p className="text-3xl font-bold">{params.totalRecords}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Đang bán</p>
                    <p className="text-3xl font-bold">{params.totalRecords}</p>
                  </div>
                  <Star className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100">Sắp hết hàng</p>
                    <p className="text-3xl font-bold">23</p>
                  </div>
                  <Package className="h-8 w-8 text-yellow-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100">Hết hàng</p>
                    <p className="text-3xl font-bold">68</p>
                  </div>
                  <Package className="h-8 w-8 text-red-200" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Select onValueChange={(value) => setSelectedBrand(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>

              <SelectContent>
                {brand.map((brand) => (
                  <SelectItem key={brand._id} value={brand._id}>
                    {brand.option_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Sản phẩm mới nhất</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data && data.length > 0 ? (
                  data.map((product: Product) => (
                    <div
                      key={product._id}
                      className="flex items-center space-x-4 rounded-lg border p-4 transition-shadow hover:shadow-md"
                    >
                      <img
                        src={product.image_on_list}
                        alt={product.name_on_list}
                        className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="line-clamp-2 font-medium text-gray-900">{product.name_on_list}</h3>
                        <p className="text-sm text-gray-600">{product.engName_on_list}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">{product.filter_origin}</Badge>
                          <span className="text-lg font-semibold text-green-600">
                            {formatPrice(product.price_on_list)}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            console.log("Navigating to:", `/admin/${product._id}/detail`);
                            navigate(`/admin/${product._id}/detail`);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/admin/${product._id}/update-product`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  // Hiển thị khi không có dữ liệu
                  <p className="text-center text-gray-500">Không có sản phẩm nào để hiển thị.</p>
                )}
              </div>
            </CardContent>
          </Card>
          <div className="mt-4">
            <PaginationDemo
              // eslint-disable-next-line no-constant-binary-expression
              totalPages={Number(params.totalPages) ?? 1}
              // eslint-disable-next-line no-constant-binary-expression
              currentPage={Number(params.page) ?? 1}
              onPageChange={changePage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
