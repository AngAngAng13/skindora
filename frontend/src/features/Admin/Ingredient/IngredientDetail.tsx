import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useFetchIngredientByID } from "@/hooks/Ingredient/useFetchFilterIngredientByID";
import type { Ingredient } from "@/types/Filter/ingredient";

const IngredientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: ingredientData, fetchIngredientByID, loading } = useFetchIngredientByID(String(id));

  useEffect(() => {
    fetchIngredientByID();
  }, [fetchIngredientByID]);

  useEffect(() => {
    console.log("Ingredient Data:", ingredientData);
  }, [ingredientData]);

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

  const ingredient: Ingredient | undefined = ingredientData;

  if (!ingredient) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold">Ingredient không tìm thấy</h2>
        <p className="mt-2 text-gray-500">Ingredient với ID &quot;{id}&quot; không thể tải hoặc không tồn tại.</p>
        <Button onClick={() => navigate("/admin/ingredient")} className="mt-4">
          Quay lại danh sách Ingredient
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Chi tiết Ingredient</h1>
        <Button onClick={handleGoBack} variant="outline">
          Quay lại
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{ingredient.option_name}</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Details for Ingredient ID: {ingredient._id}
          </CardDescription>{" "}
        </CardHeader>
        <CardContent className="grid gap-6">
          <div>
            <Label htmlFor="category-info" className="text-sm font-medium text-gray-700">
              Danh mục
            </Label>
            <p id="category-info" className="text-base text-gray-800">
              <span className="font-semibold">{ingredient.category_name}</span>
              <span className="text-gray-500 italic"> ({ingredient.category_param})</span>
            </p>
          </div>

          <div>
            <Label htmlFor="state" className="text-sm font-medium text-gray-700">
              Trạng thái
            </Label>
            <Badge
              id="state"
              className={`mt-1 text-sm font-medium ${
                ingredient.state === "ACTIVE"
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              {ingredient.state}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="created-at" className="text-sm font-medium text-gray-700">
                Ngày tạo
              </Label>
              <p id="created-at" className="text-base text-gray-800">
                {new Date(ingredient.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <Label htmlFor="updated-at" className="text-sm font-medium text-gray-700">
                Cập nhật lần cuối
              </Label>
              <p id="updated-at" className="text-base text-gray-800">
                {new Date(ingredient.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IngredientDetail;
