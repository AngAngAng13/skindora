// src/app/admin/add-product/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

// Import components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// Sử dụng TiptapEditor mới
import httpClient from "@/lib/axios";
import type { ProductFormValues } from "@/lib/productSchema";
import { productSchema } from "@/lib/productSchema";

// Import logic và component tùy chỉnh
import TiptapEditor from "./TiptapEditor";

// src/app/admin/add-product/page.tsx

// src/app/admin/add-product/page.tsx

// src/app/admin/add-product/page.tsx

// src/app/admin/add-product/page.tsx

// src/app/admin/add-product/page.tsx

// src/app/admin/add-product/page.tsx

// src/app/admin/add-product/page.tsx

// src/app/admin/add-product/page.tsx

// src/app/admin/add-product/page.tsx

export default function AddProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name_on_list: "",
      engName_on_list: "",
      price_on_list: "",
      quantity: 0,
      image_on_list: "",
      hover_image_on_list: "",
      product_detail_url: "",
      productName_detail: "",
      engName_detail: "",
      description_detail: { rawHtml: "", plainText: "" },
      ingredients_detail: { rawHtml: "", plainText: "" },
      guide_detail: { rawHtml: "", plainText: "" },
      specification_detail: { rawHtml: "", plainText: "" },
      main_images_detail: [],
      sub_images_detail: [],
      filter_brand: "",
      filter_hsk_skin_type: "",
      filter_hsk_uses: "",
      filter_hsk_product_type: "",
      filter_origin: "",
    },
  });

  const {
    fields: mainImageFields,
    append: appendMainImage,
    remove: removeMainImage,
  } = useFieldArray({
    control: form.control,
    name: "main_images_detail",
  });
  const {
    fields: subImageFields,
    append: appendSubImage,
    remove: removeSubImage,
  } = useFieldArray({
    control: form.control,
    name: "sub_images_detail",
  });

  async function onSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    const payload = {
      ...values,
      main_images_detail: values.main_images_detail.map((img) => img.value),
      sub_images_detail: values.sub_images_detail.map((img) => img.value),
    };

    console.log("FINAL PAYLOAD TO SERVER:", payload);

    try {
      const response = await httpClient.post(`/admin/manage-products/create-new-product`, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Thành công!", {
          description: "Sản phẩm đã được thêm vào hệ thống.",
        });
        form.reset();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Có lỗi không xác định xảy ra.";
      console.log(error.response.data);
      toast.error("Thất bại!", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <h1 className="mb-6 text-3xl font-bold">Thêm sản phẩm mới</h1>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin chung</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name_on_list"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên sản phẩm (danh sách)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="engName_on_list"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên tiếng Anh (danh sách)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productName_detail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên sản phẩm (chi tiết)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="engName_detail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên tiếng Anh (chi tiết)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price_on_list"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image_on_list"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Ảnh chính (danh sách)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hover_image_on_list"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Ảnh khi hover (danh sách)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="product_detail_url"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>URL trang chi tiết sản phẩm</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nội dung chi tiết (HTML)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="description_detail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả chi tiết</FormLabel>
                    <FormControl>
                      <TiptapEditor value={field.value.rawHtml} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ingredients_detail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thành phần</FormLabel>
                    <FormControl>
                      <TiptapEditor value={field.value.rawHtml} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guide_detail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hướng dẫn sử dụng</FormLabel>
                    <FormControl>
                      <TiptapEditor value={field.value.rawHtml} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specification_detail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thông số sản phẩm</FormLabel>
                    <FormControl>
                      <TiptapEditor value={field.value.rawHtml} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danh sách hình ảnh chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Hình ảnh chính (Main Images)</h3>
                {mainImageFields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`main_images_detail.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="mb-2 flex items-center gap-4">
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/image.jpg" />
                        </FormControl>
                        <Button type="button" variant="destructive" onClick={() => removeMainImage(index)}>
                          Xóa
                        </Button>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendMainImage({ value: "" })}>
                  Thêm ảnh chính
                </Button>
              </div>
              <div>
                <h3 className="mt-4 mb-2 font-semibold">Hình ảnh phụ (Sub Images)</h3>
                {subImageFields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`sub_images_detail.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="mb-2 flex items-center gap-4">
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/image.jpg" />
                        </FormControl>
                        <Button type="button" variant="destructive" onClick={() => removeSubImage(index)}>
                          Xóa
                        </Button>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendSubImage({ value: "" })}>
                  Thêm ảnh phụ
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin phân loại (Filter IDs)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="filter_brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand ID</FormLabel>
                    <FormControl>
                      <Input {...field} type="string" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="filter_hsk_skin_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skin Type ID</FormLabel>
                    <FormControl>
                      <Input {...field} type="string" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="filter_hsk_uses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uses ID</FormLabel>
                    <FormControl>
                      <Input {...field} type="string" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="filter_hsk_product_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Type ID</FormLabel>
                    <FormControl>
                      <Input {...field} type="string" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="filter_origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xuất xứ</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
            {isSubmitting ? "Đang xử lý..." : "Thêm sản phẩm"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
