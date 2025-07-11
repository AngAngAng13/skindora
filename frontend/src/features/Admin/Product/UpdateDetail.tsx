import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
// Thêm useCallback
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetchFilter } from "@/hooks/Filter/useFetchActiveFilter";
import { useFetchProductByID } from "@/hooks/Product/useFetchProductByID";
import httpClient from "@/lib/axios";
import type { ProductFormValues } from "@/lib/productSchema";
import { productSchema } from "@/lib/productSchema";
import type { Brand } from "@/types/Filter/brand";
import type { DacTinh } from "@/types/Filter/dactinh";
import type { Ingredient } from "@/types/Filter/ingredient";
import type { Origin } from "@/types/Filter/origin";
import type { ProductType } from "@/types/Filter/productType";
import type { Size } from "@/types/Filter/size";
import type { SkinType } from "@/types/Filter/skinType";
import type { Uses } from "@/types/Filter/uses";

import TiptapEditor from "../components/TiptapEditor";

const ImageUrlInput = ({ control, name, label, placeholder }: any) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Input {...field} placeholder={placeholder} style={{ flex: 1 }} />
            {field.value && typeof field.value === "string" && (
              <img
                src={field.value}
                alt="Xem trước"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                onLoad={(e) => {
                  e.currentTarget.style.display = "block";
                }}
              />
            )}
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const EditorWithPreview = ({ control, name, label }: any) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2">
            <FormControl>
              <TiptapEditor
                value={field.value?.rawHtml || ""} // Luôn đảm bảo là string, không phải undefined
                onChange={(newContent: { rawHtml: string; plainText: string }) => {
                  field.onChange(newContent);
                }}
              />
            </FormControl>
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

export default function UpdateProductPage() {
  const { id } = useParams();
  // Đổi tên dataID thành product để dễ hiểu hơn
  const { FetchProductByID, dataID: product } = useFetchProductByID(String(id));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Khởi tạo các state cho filter data
  const [uses, setUses] = useState<Uses[]>([]);
  const [productType, setProductType] = useState<ProductType[]>([]);
  const [dactinh, setDactinh] = useState<DacTinh[]>([]);
  const [size, setSize] = useState<Size[]>([]);
  const [ingredient, setIngredient] = useState<Ingredient[]>([]);
  const [skinType, setSkinType] = useState<SkinType[]>([]);
  const [origin, setOrigin] = useState<Origin[]>([]);
  const [brand, setBrand] = useState<Brand[]>([]);

  const { data: filter, fetchFilter, loading } = useFetchFilter();
  const navigate = useNavigate();

  const getInitialFormValues = useCallback((): ProductFormValues => {
    return {
      name_on_list: product?.name_on_list || "",
      engName_on_list: product?.engName_on_list || "",
      price_on_list: String(product?.price_on_list ?? ""),
      quantity: Number(product?.quantity ?? 0),
      image_on_list: product?.image_on_list || "",
      hover_image_on_list: product?.hover_image_on_list || "",
      // product_detail_url: product?.product_detail_url || "",
      productName_detail: product?.productName_detail || "",
      engName_detail: product?.engName_detail || "",
      description_detail: product?.description_detail || { rawHtml: "", plainText: "" },
      ingredients_detail: product?.ingredients_detail || { rawHtml: "", plainText: "" },
      guide_detail: product?.guide_detail || { rawHtml: "", plainText: "" },
      specification_detail: product?.specification_detail || { rawHtml: "", plainText: "" },

      main_images_detail: (product?.main_images_detail || []).map((url: string) => ({ value: url })),
      sub_images_detail: (product?.sub_images_detail || []).map((url: string) => ({ value: url })),

      filter_brand: product?.filter_brand || "",
      filter_hsk_skin_type: product?.filter_hsk_skin_type || "",
      filter_hsk_uses: product?.filter_hsk_uses || "",
      filter_hsk_product_type: product?.filter_hsk_product_type || "",
      filter_origin: product?.filter_origin || "",
      filter_hsk_ingredient: product?.filter_hsk_ingredient || "",
      filter_dac_tinh: product?.filter_dac_tinh || "",
      filter_hsk_size: product?.filter_hsk_size || "",
    };
  }, [product]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),

    defaultValues: getInitialFormValues(),
    mode: "onTouched",
  });

  useEffect(() => {
    fetchFilter();
    if (id) {
      FetchProductByID();
    }
  }, [id, fetchFilter, FetchProductByID]);

  useEffect(() => {
    if (filter) {
      if (filter.filter_brand) setBrand(filter.filter_brand);
      if (filter.filter_hsk_uses) setUses(filter.filter_hsk_uses);
      if (filter.filter_hsk_product_type) setProductType(filter.filter_hsk_product_type);
      if (filter.filter_dac_tinh) setDactinh(filter.filter_dac_tinh);
      if (filter.filter_hsk_size) setSize(filter.filter_hsk_size);
      if (filter.filter_hsk_ingredient) setIngredient(filter.filter_hsk_ingredient);
      if (filter.filter_hsk_skin_type) setSkinType(filter.filter_hsk_skin_type);
      if (filter.filter_origin) setOrigin(filter.filter_origin);
    }
  }, [filter]); // Chỉ phụ thuộc vào 'filter'

  // Effect để reset form khi dữ liệu product được load hoặc thay đổi
  useEffect(() => {
    if (product) {
      form.reset(getInitialFormValues()); // Sử dụng lại hàm để đảm bảo đồng bộ
    }
  }, [product, form.reset, getInitialFormValues]); // Thêm form.reset và getInitialFormValues vào dependency

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
      const response = await httpClient.put(`/admin/manage-products/update/${id}`, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Thành công!", {
          description: "Sản phẩm đã được thêm vào hệ thống.",
        });
        form.reset(getInitialFormValues());
        navigate("/admin/products");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Có lỗi không xác định xảy ra.";
      console.error("API Error:", error.response?.data || error);
      toast.error("Thất bại!", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

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
            {/* Tiêu đề cần khớp với chức năng: "Cập nhật sản phẩm" hoặc "Thêm sản phẩm mới" */}
            <h1 className="mb-6 text-3xl font-bold">{id ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}</h1>

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
                            {/* Chú ý: Input type="number" tự động chuyển giá trị thành string khi onChange.
                                   Nếu schema của bạn mong đợi number, bạn có thể cần chuyển đổi lại
                                   trước khi gửi đi, hoặc sử dụng `value={Number(field.value)}` nếu Zod schema là `z.number()` */}
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
                    {/* Sử dụng ImageUrlInput component con đã tách ra */}
                    <ImageUrlInput
                      control={form.control}
                      name="image_on_list"
                      label="URL Ảnh chính (danh sách)"
                      placeholder="Dán URL ảnh chính..."
                    />
                    <ImageUrlInput
                      control={form.control}
                      name="hover_image_on_list"
                      label="URL Ảnh khi hover (danh sách)"
                      placeholder="Dán URL ảnh khi hover..."
                    />
                  </div>
                </div>

                {/* <div className="md:col-span-2">
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
                </div> */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nội dung chi tiết (HTML)</CardTitle>
                <Typography>Soạn thảo nội dung ở khung bên trái và xem kết quả hiển thị ở khung bên phải.</Typography>
              </CardHeader>
              <CardContent className="space-y-8">
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select a brand" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
                          {brand.map(
                            (
                              brand // Dùng 'brands' thay vì 'data'
                            ) => (
                              <SelectItem
                                key={brand._id}
                                value={brand._id}
                                className="cursor-pointer rounded-md px-3 py-2 transition hover:bg-blue-100"
                              >
                                {brand.option_name}
                              </SelectItem>
                            )
                          )}
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select a skin type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
                          {skinType.map((skin) => (
                            <SelectItem key={skin._id} value={skin._id}>
                              {skin.option_name}
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                              <SelectItem key={useItem._id} value={useItem._id}>
                                {useItem.option_name}
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                              <SelectItem key={productTypeItem._id} value={productTypeItem._id}>
                                {productTypeItem.option_name}
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select origin" />{" "}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
                          {origin.map(
                            (
                              originItem // Renamed 'temp' to 'originItem'
                            ) => (
                              <SelectItem key={originItem._id} value={originItem._id}>
                                {originItem.option_name}
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                              <SelectItem key={sizeItem._id} value={sizeItem._id}>
                                {sizeItem.option_name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Characteristic Filter (Đặc tính) */}
                <FormField
                  control={form.control}
                  name="filter_dac_tinh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-700">Characteristic</FormLabel>{" "}
                      <Select onValueChange={field.onChange} value={field.value}>
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
                              <SelectItem key={dactinhItem._id} value={dactinhItem._id}>
                                {dactinhItem.option_name}
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select ingredient" />{" "}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
                          {ingredient.map(
                            (
                              ingredientItem // Renamed 'temp' to 'ingredientItem'
                            ) => (
                              <SelectItem key={ingredientItem._id} value={ingredientItem._id}>
                                {ingredientItem.option_name}
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
              {isSubmitting ? "Đang xử lý..." : id ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
