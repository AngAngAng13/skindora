import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Import useNavigate

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// Shadcn UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
// Import Button component
import { useFetchBrandByID } from "@/hooks/Brand/useFetchBrandByID";

const BrandDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { data: brandData, fetchBrandByID, loading } = useFetchBrandByID(String(id));

  useEffect(() => {
    fetchBrandByID();
  }, [fetchBrandByID]);

  useEffect(() => {
    console.log(brandData);
  }, [brandData]);

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

  const brand = brandData;

  if (!brand) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold">Brand Not Found</h2>
        <p className="mt-2 text-gray-500">The brand with ID "{id}" could not be loaded or does not exist.</p>
        <Button onClick={handleGoBack} className="mt-4">
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Brand Details</h1>
        <Button onClick={handleGoBack} variant="outline">
          {" "}
          {/* Using 'outline' variant for a subtle look */}
          Quay lại
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{brand.option_name}</CardTitle>
          <CardDescription className="text-lg text-gray-600">Details for Brand ID: {brand._id}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* Combined and styled Category Information */}
          <div>
            <Label htmlFor="category-info" className="text-sm font-medium text-gray-700">
              Category
            </Label>
            <p id="category-info" className="text-base text-gray-800">
              <span className="font-semibold">{brand.category_name}</span>{" "}
              <span className="text-gray-500 italic">({brand.category_param})</span>
            </p>
          </div>

          <div>
            <Label htmlFor="state" className="text-sm font-medium text-gray-700">
              State
            </Label>
            <Badge
              id="state"
              className={`mt-1 text-sm font-medium ${
                brand.state === "active"
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              {brand.state}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="created-at" className="text-sm font-medium text-gray-700">
                Created At
              </Label>
              <p id="created-at" className="text-base text-gray-800">
                {new Date(brand.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <Label htmlFor="updated-at" className="text-sm font-medium text-gray-700">
                Last Updated
              </Label>
              <p id="updated-at" className="text-base text-gray-800">
                {new Date(brand.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandDetail;
