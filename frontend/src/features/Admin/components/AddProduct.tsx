import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Link2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetchBrand } from "@/hooks/Brand/useFetchBrand";
import {
  type filter_dac_tinh_type_props,
  type filter_hsk_ingredient_props,
  type filter_hsk_product_type_props,
  type filter_hsk_size_props,
  type filter_hsk_skin_type_props,
  type filter_hsk_uses_props,
  type filter_origin_props,
  useFetchFilter,
} from "@/hooks/Filter/useFetchFilter";
import httpClient from "@/lib/axios";
import type { ProductFormValues } from "@/lib/productSchema";
import { productSchema } from "@/lib/productSchema";

import TiptapEditor from "./TiptapEditor";

export default function AddProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uses, setUses] = useState<filter_hsk_uses_props[]>([]);
  const [productType, setProductType] = useState<filter_hsk_product_type_props[]>([]);
  const [dactinh, setDactinh] = useState<filter_dac_tinh_type_props[]>([]);
  const [size, setSize] = useState<filter_hsk_size_props[]>([]);
  const [ingredient, setIngredient] = useState<filter_hsk_ingredient_props[]>([]);
  const [skinType, setSkinType] = useState<filter_hsk_skin_type_props[]>([]);
  const [origin, setOrigin] = useState<filter_origin_props[]>([]);
  const { data: filter, fetchFilter } = useFetchFilter();
  const { fetchListBrand, data } = useFetchBrand();
  useEffect(() => {
    fetchListBrand();
    fetchFilter();
  }, [fetchListBrand, fetchFilter]);
  useEffect(() => {
    console.log(filter);
    if (filter?.filter_hsk_uses) {
      setUses(filter.filter_hsk_uses);
    }
    if (filter?.filter_hsk_product_type) {
      setProductType(filter.filter_hsk_product_type);
    }
    if (filter?.filter_dac_tinh) {
      setDactinh(filter.filter_dac_tinh);
    }
    if (filter?.filter_hsk_size) {
      setSize(filter.filter_hsk_size);
    }
    if (filter?.filter_hsk_ingredient) {
      setIngredient(filter.filter_hsk_ingredient);
    }
    if (filter?.filter_hsk_skin_type) {
      setSkinType(filter.filter_hsk_skin_type);
    }
    if (filter?.filter_origin) {
      setOrigin(filter.filter_origin);
    }
  }, [filter, uses, productType]);
  const navigate = useNavigate();
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
      filter_hsk_ingredient: "",
      filter_dac_tinh: "",
      filter_hsk_size: "",
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
      const response = await httpClient.post("/admin/manage-products/create-new-product", payload);
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

  // const ImageUrlInput = ({ control, name, label, placeholder }: any) => (
  //   <FormField
  //     control={control}
  //     name={name}
  //     render={({ field }) => (
  //       <FormItem>
  //         <FormLabel>{label}</FormLabel>
  //         <FormControl>
  //           <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
  //             <Input {...field} placeholder={placeholder} style={{ flex: 1 }} />
  //             {field.value && typeof field.value === "string" && (
  //               <img
  //                 src={field.value}
  //                 alt="Xem trước"
  //                 style={{
  //                   width: "80px", // Giảm kích thước một chút cho gọn
  //                   height: "80px",
  //                   objectFit: "cover",
  //                   borderRadius: "8px",
  //                   border: "1px solid #e2e8f0",
  //                 }}
  //                 // Ẩn ảnh nếu URL không hợp lệ
  //                 onError={(e) => {
  //                   e.currentTarget.style.display = "none";
  //                 }}
  //                 // Hiện lại nếu URL được sửa đúng
  //                 onLoad={(e) => {
  //                   e.currentTarget.style.display = "block";
  //                 }}
  //               />
  //             )}
  //           </div>
  //         </FormControl>
  //         <FormMessage />
  //       </FormItem>
  //     )}
  //   />
  // );
  const EditorWithPreview = ({ control, name, label }: any) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2">
              {/* Cột 1: Trình soạn thảo */}
              {/* ✅ SỬA DÒNG NÀY */}
              <TiptapEditor
                // Chỉ truyền chuỗi HTML, không truyền cả object
                value={field.value?.rawHtml || ""}
                onChange={field.onChange}
              />

              {/* Cột 2: Khung xem trước (Giữ nguyên) */}
              <div className="prose bg-muted max-w-none rounded-md border p-3">
                <h4 className="text-muted-foreground mb-2 text-sm font-semibold italic">Xem trước trực tiếp</h4>
                {field.value && field.value.rawHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: field.value.rawHtml }} />
                ) : (
                  <p className="text-muted-foreground text-sm">Nội dung xem trước sẽ hiện ở đây...</p>
                )}
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };
  return (
    <div>
      <div className="mt-3 ml-10">
        <Button
          variant="ghost"
          className="hover:bg-transparent hover:text-green-600"
          onClick={() => {
            navigate("/admin/products");
          }}
        >
          <ArrowLeft />
          Quay lại
        </Button>
      </div>
      <div className="container mx-auto p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <h1 className="mb-6 text-3xl font-bold">Thêm sản phẩm mới</h1>
            <Card>
              <CardHeader>
                <CardTitle>Thông tin sản phẩm</CardTitle>
                <Typography>Cung cấp các thông tin chi tiết cho sản phẩm của bạn.</Typography>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-medium">Tên sản phẩm</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name_on_list"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên (hiển thị danh sách)</FormLabel>
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
                          <FormLabel>Tên (hiển thị chi tiết)</FormLabel>
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
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-medium">Thông tin kinh doanh</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="price_on_list"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giá bán</FormLabel>
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
                          <FormLabel>Số lượng tồn kho</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-medium">Hình ảnh</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* <ImageUrlInput
                      control={form.control}
                      name="image_on_list"
                      label="URL Ảnh chính (danh sách)"
                      placeholder="Dán URL ảnh chính..."
                    /> */}
                    <FormField
                      control={form.control}
                      name="image_on_list"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Ảnh chính (danh sách)</FormLabel>
                          <FormControl>
                            {/* The Input component remains the same */}
                            <Input type="url" {...field} />
                          </FormControl>
                          <FormMessage />

                          {/* Conditionally render the image preview below the input and message */}
                          {field.value && typeof field.value === "string" && (
                            <img
                              src={field.value}
                              alt="Image Preview"
                              className="mt-4 rounded-md border"
                              style={{ maxWidth: "200px", maxHeight: "200px" }} // Optional styling
                            />
                          )}
                        </FormItem>
                      )}
                    />
                    {/* <ImageUrlInput
                      control={form.control}
                      name="hover_image_on_list"
                      label="URL Ảnh khi hover (danh sách)"
                      placeholder="Dán URL ảnh khi hover..."
                    /> */}
                    <FormField
                      control={form.control}
                      name="hover_image_on_list"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Ảnh khi hover (danh sách)</FormLabel>
                          <FormControl>
                            {/* The Input component remains the same */}
                            <Input type="url" {...field} />
                          </FormControl>
                          <FormMessage />

                          {/* Conditionally render the image preview below the input and message */}
                          {field.value && typeof field.value === "string" && (
                            <img
                              src={field.value}
                              alt="Image Preview"
                              className="mt-4 rounded-md border"
                              style={{ maxWidth: "200px", maxHeight: "200px" }} // Optional styling
                            />
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="product_detail_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL trang chi tiết sản phẩm</FormLabel>
                        <FormControl>
                          <div className="flex w-full items-center gap-2">
                            <div className="relative flex-grow">
                              <Link2 className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                              <Input
                                {...field}
                                placeholder="https://your-shop.com/products/my-product"
                                className="pl-10"
                              />
                            </div>

                            <Button
                              type="button"
                              variant="outline"
                              disabled={!field.value}
                              onClick={() => window.open(field.value, "_blank")}
                            >
                              Kiểm tra
                            </Button>
                          </div>
                        </FormControl>
                        <Typography>Đây là đường dẫn đầy đủ mà khách hàng sẽ truy cập để xem sản phẩm.</Typography>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nội dung chi tiết (HTML)</CardTitle>
                <Typography>Soạn thảo nội dung ở khung bên trái và xem kết quả hiển thị ở khung bên phải.</Typography>
              </CardHeader>
              <CardContent className="space-y-8">
                {" "}
                {/* Tăng khoảng cách để thoáng hơn */}
                <EditorWithPreview control={form.control} name="description_detail" label="Mô tả chi tiết" />
                <EditorWithPreview control={form.control} name="ingredients_detail" label="Thành phần" />
                <EditorWithPreview control={form.control} name="guide_detail" label="Hướng dẫn sử dụng" />
                <EditorWithPreview control={form.control} name="specification_detail" label="Thông số sản phẩm" />
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
                <CardTitle>Filter Information (Filter IDs)</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Brand Filter */}
                <FormField
                  control={form.control}
                  name="filter_brand"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-lg font-semibold text-blue-700">Brand</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select a brand" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
                          {data.map((brand) => (
                            <SelectItem
                              key={brand._id}
                              value={brand._id}
                              className="cursor-pointer rounded-md px-3 py-2 transition hover:bg-blue-100"
                            >
                              {brand.option_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Skin Type Filter */}
                <FormField
                  control={form.control}
                  name="filter_hsk_skin_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-700">Skin Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select a skin type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
                          {skinType.map((skin) => (
                            <SelectItem key={skin.filter_ID} value={skin.filter_ID}>
                              {skin.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Uses Filter */}
                <FormField
                  control={form.control}
                  name="filter_hsk_uses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-700">Uses</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select a uses" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
                          {uses.map(
                            (
                              useItem // Renamed 'uses' to 'useItem' for clarity
                            ) => (
                              <SelectItem key={useItem.filter_ID} value={useItem.filter_ID}>
                                {useItem.name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Product Type Filter */}
                <FormField
                  control={form.control}
                  name="filter_hsk_product_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-700">Product Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select a product type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
                          {productType.map(
                            (
                              productTypeItem // Renamed 'productType' to 'productTypeItem'
                            ) => (
                              <SelectItem key={productTypeItem.filter_ID} value={productTypeItem.filter_ID}>
                                {productTypeItem.name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Origin Filter */}
                <FormField
                  control={form.control}
                  name="filter_origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-700">Origin</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select origin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
                          {origin.map(
                            (
                              originItem // Renamed 'temp' to 'originItem'
                            ) => (
                              <SelectItem key={originItem.filter_ID} value={originItem.filter_ID}>
                                {originItem.name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Size Filter */}
                <FormField
                  control={form.control}
                  name="filter_hsk_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-700">Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
                          {size.map(
                            (
                              sizeItem // Renamed 'temp' to 'sizeItem'
                            ) => (
                              <SelectItem key={sizeItem.filter_ID} value={sizeItem.filter_ID}>
                                {sizeItem.name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Đặc tính Filter (Characteristic) */}
                <FormField
                  control={form.control}
                  name="filter_dac_tinh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-700">Characteristic</FormLabel>{" "}
                      {/* Changed "Đặc tính" to "Characteristic" for broader understanding */}
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select characteristic" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
                          {dactinh.map(
                            (
                              dactinhItem // Renamed 'temp' to 'dactinhItem'
                            ) => (
                              <SelectItem key={dactinhItem.filter_ID} value={dactinhItem.filter_ID}>
                                {dactinhItem.name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Ingredient Filter */}
                <FormField
                  control={form.control}
                  name="filter_hsk_ingredient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-700">Ingredient</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select ingredient" /> {/* Changed placeholder for clarity */}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
                          {ingredient.map(
                            (
                              ingredientItem // Renamed 'temp' to 'ingredientItem'
                            ) => (
                              <SelectItem key={ingredientItem.filter_ID} value={ingredientItem.filter_ID}>
                                {ingredientItem.name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
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
    </div>
  );
}
