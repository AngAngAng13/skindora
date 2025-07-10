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
// Import your SkinType fetch hook
import { useFetchSkinTypeByID } from "@/hooks/SkinType/useFetchSkinTypeByID";
import httpClient from "@/lib/axios";
// Import your SkinType schema and type
import { type CreateSkinTypeFormValue, createSkinTypeSchema } from "@/lib/skinTypeSchema";
// Import your SkinType interface (assuming it's in types/Filter)
import { type SkinType } from "@/types/Filter/skinType";

const UpdateSkinType: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch SkinType data using the hook
  const { data: fetchedSkinTypeData, fetchSkinTypeByID, loading } = useFetchSkinTypeByID(String(id));

  const form = useForm<CreateSkinTypeFormValue>({
    resolver: zodResolver(createSkinTypeSchema), // Using the create schema for update validation
    defaultValues: {
      option_name: "",
      category_name: "",
      category_param: "",
      state: "ACTIVE",
    },
  });

  useEffect(() => {
    if (id) {
      fetchSkinTypeByID();
    }
  }, [id, fetchSkinTypeByID]);
  useEffect(() => {
    console.log(fetchedSkinTypeData);
  }, [fetchedSkinTypeData]);

  useEffect(() => {
    if (fetchedSkinTypeData) {
      // Ensure fetchedSkinTypeData is treated as SkinType
      const skinTypeToEdit = fetchedSkinTypeData as SkinType;
      form.reset({
        option_name: skinTypeToEdit.option_name,
        description: skinTypeToEdit.description,
        category_name: skinTypeToEdit.category_name,
        category_param: skinTypeToEdit.category_param,
        state: skinTypeToEdit.state as "ACTIVE" | "INACTIVE",
      });
    }
  }, [fetchedSkinTypeData, form]);

  const onSubmit = async (values: CreateSkinTypeFormValue) => {
    setIsSubmitting(true);
    const payload = {
      ...values,
    };
    console.log("FINAL SKIN TYPE UPDATE PAYLOAD TO SERVER:", payload);

    try {
      // Adjust the API endpoint for updating a skin type
      const response = await httpClient.put(`/admin/manage-filters/update-filter-hsk-skin-type/${id}`, payload); // ASSUMED API ENDPOINT

      console.log(response);
      if (response.status === 200) {
        toast.success("Thành công!", {
          description: "Thông tin Loại da đã được cập nhật.", // Success message for SkinType
        });

        navigate("/admin/skin-type"); // Navigate back to SkinType list
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
      console.error("Error updating skin type:", (error as AxiosError)?.response?.data); // Error log for SkinType
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
              <Skeleton className="h-10 w-full" /> {/* For description field */}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!fetchedSkinTypeData) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold">Loại da không tìm thấy</h2> {/* Not found message for SkinType */}
        <p className="mt-2 text-gray-500">Loại da với ID &quot;{id}&quot; không tồn tại hoặc không thể tải.</p>
        <Button onClick={() => navigate("/admin/skin-type")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách Loại da
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
            navigate("/admin/skin-type"); // Navigate back to SkinType list
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
                <CardTitle>Cập nhật Loại da</CardTitle> {/* Title for SkinType */}
                <Typography>Chỉnh sửa các thông tin chi tiết cho Loại da.</Typography> {/* Description for SkinType */}
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* SkinType Information Section */}
                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-medium">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="option_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên Loại da</FormLabel> {/* Label for SkinType name */}
                          <FormControl>
                            <Input
                              placeholder="Nhập tên Loại da (ví dụ: Da dầu, Da khô)" // Placeholder for SkinType name
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
                              placeholder="Nhập tên danh mục (ví dụ: Loại da)" // Placeholder for category
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
                              placeholder="Nhập tham số danh mục (ví dụ: da-dau, da-kho)" // Placeholder for category param
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* FormField for state */}
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trạng thái</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                            <FormControl>
                              <SelectTrigger disabled>
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
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật Loại da"} {/* Button text for SkinType */}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateSkinType;
