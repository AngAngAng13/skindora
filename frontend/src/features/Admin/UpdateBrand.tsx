import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
// Import Skeleton for loading state
import { useFetchBrandByID } from "@/hooks/Brand/useFetchBrandByID";
import httpClient from "@/lib/axios";
import { type CreateBrandFormValue, createBrandSchema } from "@/lib/brandSchema";

// Assuming CreateBrandFormValue is compatible with update

const UpdateBrand: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get ID from URL
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch brand data using the hook
  const { data: fetchedBrandData, fetchBrandByID, loading } = useFetchBrandByID(String(id));

  const form = useForm<CreateBrandFormValue>({
    resolver: zodResolver(createBrandSchema),
    defaultValues: {
      option_name: "",
      category_name: "",
      category_param: "",
      state: "ACTIVE", // Default value for the select if no data is loaded yet
    },
  });

  // Effect to fetch brand data when component mounts or ID changes
  useEffect(() => {
    if (id) {
      fetchBrandByID();
    }
    console.log(fetchedBrandData);
  }, [id, fetchBrandByID]);

  // Effect to populate form fields once brand data is fetched
  useEffect(() => {
    if (fetchedBrandData) {
      const brandToEdit = fetchedBrandData;
      form.reset({
        option_name: brandToEdit.option_name,
        category_name: brandToEdit.category_name,
        category_param: brandToEdit.category_param,
        state: brandToEdit.state as "ACTIVE" | "INACTIVE", // Cast to ensure type compatibility with Zod enum
      });
    }
  }, [fetchedBrandData, form]); // Dependency on fetchedBrandData and form instance

  const onSubmit = async (values: CreateBrandFormValue) => {
    setIsSubmitting(true);
    const payload = {
      ...values,
      // The 'state' field is already part of 'values' from the form
    };
    console.log("FINAL BRAND UPDATE PAYLOAD TO SERVER:", payload);

    try {
      // *** IMPORTANT: Verify this PUT endpoint with your backend API ***
      const response = await httpClient.put(`/admin/manage-filters/update-filter-brand/${id}`, payload);
      console.log(response);
      if (response.status === 200) {
        // Typically 200 OK for successful updates
        toast.success("Thành công!", {
          description: "Thông tin thương hiệu đã được cập nhật.",
        });
        // No need to reset form if staying on the page, but can navigate back
        // navigate("/admin/brand"); // Navigate back to brand list after update
      }
    } catch (error: unknown) {
      let errorMessage = "Có lỗi không xác định xảy ra.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as AxiosError;
        const responseData = axiosError.response?.data as {
          message?: string;
          errors?: Record<string, { msg: string }>;
        };
        if (responseData?.errors) {
          const validationErrors = Object.values(responseData.errors)
            .map((err) => err.msg)
            .join(", ");
          errorMessage = `Lỗi xác thực: ${validationErrors}`;
        } else {
          errorMessage = responseData?.message || errorMessage;
        }
      }
      console.error("Error updating brand:", (error as AxiosError)?.response?.data);
      toast.error("Thất bại!", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <Skeleton className="mb-2 h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle brand not found
  if (!fetchedBrandData || fetchedBrandData.length === 0) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold">Thương hiệu không tìm thấy</h2>
        <p className="mt-2 text-gray-500">Thương hiệu với ID "{id}" không tồn tại hoặc không thể tải.</p>
        <Button onClick={() => navigate("/admin/brands")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách thương hiệu
        </Button>
      </div>
    );
  }

  // Render the form once data is loaded and available
  return (
    <div>
      <div className="mt-3 ml-10">
        <Button
          className="hover:bg-transparent hover:text-green-600"
          variant="ghost"
          onClick={() => {
            navigate("/admin/brands"); // Navigate back to brand list
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
      <div className="container mx-auto p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Cập nhật thương hiệu</CardTitle>
                <Typography>Chỉnh sửa các thông tin chi tiết cho thương hiệu.</Typography>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Brand Information Section */}
                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-medium">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="option_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên thương hiệu</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tên thương hiệu (ví dụ: Nike, Adidas)"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên danh mục</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tên danh mục (ví dụ: Giày, Quần áo)"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category_param"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tham số danh mục</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tham số danh mục (ví dụ: giay, quan-ao)"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trạng thái</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                              <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật thương hiệu"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateBrand;
