// src/features/Admin/Uses/UpdateUses.tsx (hoặc đường dẫn tương tự)
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
// Import hook fetch dữ liệu theo ID
import { useFetchUsesByID } from "@/hooks/Uses/useFetchUsesByID";
import httpClient from "@/lib/axios";
// Import schema và type cho Uses
import { type UpdateUsesFormValue, createUsesSchema } from "@/lib/usesSchema";
// Import interface Uses
import { type Uses } from "@/types/Filter/uses";

// Đảm bảo đường dẫn này đúng

const UpdateUses: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch dữ liệu Công dụng bằng hook
  const { data: fetchedUsesData, fetchUsesByID, loading } = useFetchUsesByID(String(id));

  const form = useForm<UpdateUsesFormValue>({
    resolver: zodResolver(createUsesSchema), // Sử dụng schema tạo để validate cập nhật
    defaultValues: {
      option_name: "",
      description: "",
      category_name: "",
      category_param: "",
      state: "ACTIVE",
    },
  });

  useEffect(() => {
    if (id) {
      fetchUsesByID();
    }
  }, [id, fetchUsesByID]);

  useEffect(() => {
    console.log(fetchedUsesData);
  }, [fetchedUsesData]);

  useEffect(() => {
    if (fetchedUsesData) {
      const usesToEdit = fetchedUsesData as Uses; // Ép kiểu dữ liệu fetched
      form.reset({
        option_name: usesToEdit.option_name,
        description: usesToEdit.description,
        category_name: usesToEdit.category_name,
        category_param: usesToEdit.category_param,
        state: usesToEdit.state as "ACTIVE" | "INACTIVE",
      });
    }
  }, [fetchedUsesData, form]);

  const onSubmit = async (values: UpdateUsesFormValue) => {
    setIsSubmitting(true);
    const payload = {
      ...values,
    };
    console.log("FINAL USES UPDATE PAYLOAD TO SERVER:", payload); // Log cho Uses

    try {
      // Điều chỉnh endpoint API để cập nhật công dụng
      const response = await httpClient.put(`/admin/manage-filters/update-filter-hsk-uses/${id}`, payload); // GIẢ ĐỊNH ENDPOINT

      console.log(response);
      if (response.status === 200) {
        toast.success("Thành công!", {
          description: "Thông tin Công dụng đã được cập nhật.", // Thông báo thành công
        });

        navigate("/admin/use"); // Điều hướng về trang danh sách công dụng
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
      console.error("Error updating uses:", (error as AxiosError)?.response?.data); // Log lỗi cho Uses
      toast.error("Thất bại!", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <Skeleton className="h-10 w-full" /> {/* Skeleton cho description */}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!fetchedUsesData) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold">Công dụng không tìm thấy</h2>
        <p className="mt-2 text-gray-500">Công dụng với ID &quot;{id}&quot; không tồn tại hoặc không thể tải.</p>
        <Button onClick={() => navigate("/admin/use")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách Công dụng
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-3 ml-10">
        <Button
          className="hover:bg-transparent hover:text-green-600"
          variant="ghost"
          onClick={() => {
            navigate("/admin/use"); // Điều hướng về trang danh sách công dụng
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
                <CardTitle>Cập nhật Công dụng</CardTitle>
                <Typography>Chỉnh sửa các thông tin chi tiết cho Công dụng.</Typography>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-medium">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="option_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên Công dụng</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tên Công dụng (ví dụ: Dưỡng ẩm, Chống lão hóa)"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Trường description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập mô tả (ví dụ: Giúp da mềm mịn và đủ ẩm)"
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
                              placeholder="Nhập tên danh mục (ví dụ: Chăm sóc da, Trang điểm)"
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
                              placeholder="Nhập tham số danh mục (ví dụ: duong-am, chong-lao-hoa)"
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
                          <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
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
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật Công dụng"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateUses;
