import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { Loader2 } from "lucide-react";
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
// Import your Origin fetch hook
import { useFetchOriginByID } from "@/hooks/Origin/useFetchOriginByID";
import httpClient from "@/lib/axios";
// Import your Origin schema and type
import type { CreateOriginFormValue } from "@/lib/originSchema";
import { createOriginSchema } from "@/lib/originSchema";
// Import your Origin interface
import type { Origin } from "@/types/Filter/origin";

const UpdateOrigin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch Origin data using the hook
  const { data: fetchedOriginData, fetchOriginByID, loading } = useFetchOriginByID(String(id));

  const form = useForm<CreateOriginFormValue>({
    resolver: zodResolver(createOriginSchema), // Using the create schema for update validation
    defaultValues: {
      option_name: "",
      category_name: "",
      category_param: "",
      state: "ACTIVE", // Default to ACTIVE
    },
  });

  useEffect(() => {
    if (id) {
      fetchOriginByID();
    }
  }, [id, fetchOriginByID]);

  useEffect(() => {
    console.log(fetchedOriginData);
  }, [fetchedOriginData]);

  useEffect(() => {
    if (fetchedOriginData) {
      // Ensure fetchedOriginData is treated as Origin
      const originToEdit = fetchedOriginData as Origin;
      form.reset({
        option_name: originToEdit.option_name,
        category_name: originToEdit.category_name,
        category_param: originToEdit.category_param,
        state: originToEdit.state as "ACTIVE" | "INACTIVE",
      });
    }
  }, [fetchedOriginData, form]);

  const onSubmit = async (values: CreateOriginFormValue) => {
    setIsSubmitting(true);
    const payload = {
      ...values,
    };
    console.log("FINAL ORIGIN UPDATE PAYLOAD TO SERVER:", payload);

    try {
      // Adjust the API endpoint for updating an origin
      const response = await httpClient.put(`/admin/manage-filters/update-filter-hsk-origin/${id}`, payload);

      console.log(response);
      if (response.status === 200) {
        toast.success("Thành công!", {
          description: "Thông tin Xuất xứ đã được cập nhật.",
        });

        navigate("/admin/origin");
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
      console.error("Error updating origin:", (error as AxiosError)?.response?.data); // Error log for Origin
      toast.error("Thất bại!", {
        description: errorMessage,
      });
    } finally {
      console.log("Submit finished, isSubmitting set to false."); // <-- Thêm dòng này
      setIsSubmitting(false);
    }
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

  if (!fetchedOriginData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="text-lg">Đang tải dữ liệu...</span>
        </div>
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
            navigate("/admin/origin"); // Navigate back to Origin list
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
                <CardTitle>Cập nhật Xuất xứ</CardTitle> {/* Title for Origin */}
                <Typography>Chỉnh sửa các thông tin chi tiết cho Xuất xứ.</Typography> {/* Description for Origin */}
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Origin Information Section */}
                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-medium">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="option_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên Xuất xứ</FormLabel> {/* Label for Origin name */}
                          <FormControl>
                            <Input
                              placeholder="Nhập tên Xuất xứ (ví dụ: Việt Nam, Hàn Quốc)" // Placeholder for Origin name
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Removed FormField for description as it's not in Origin schema */}
                    <FormField
                      control={form.control}
                      name="category_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên danh mục</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tên danh mục (ví dụ: Quốc gia, Châu lục)" // Placeholder for category
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
                              placeholder="Nhập tham số danh mục (ví dụ: viet-nam, han-quoc)" // Placeholder for category param
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
                          <Select
                            onValueChange={field.onChange}
                            value={field.value} // Shows the fetched value
                            disabled={isSubmitting} // Disable while submitting, not based on state value
                          >
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
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật Xuất xứ"} {/* Button text for Origin */}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateOrigin;
