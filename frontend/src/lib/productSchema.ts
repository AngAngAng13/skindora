import { z } from "zod";

const detailObjectSchema = z.object({
  rawHtml: z.string().min(1, "Nội dung HTML không được trống"),
  plainText: z.string(),
});

export const productSchema = z.object({
  name_on_list: z.string().min(1, "Tên sản phẩm bằng tiếng việt không được để trống"),
  engName_on_list: z.string().min(1, "Tên sản phẩm bằng tiếng anh không được để trống"),
  price_on_list: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Giá phải là 1 con số",
  }),
  quantity: z.coerce.number().min(0, "Số lượng không thể âm"),
  image_on_list: z.string().url({ message: "Vui lòng nhập URL hình ảnh hơp lệ" }),
  hover_image_on_list: z.string().url({ message: "Vui lòng nhập URL hợp lệ" }),
  product_detail_url: z.string().url({ message: "Vui lòng nhập URL hợp lệ" }),
  productName_detail: z.string().min(1, "Tên chi tiết không được để trống"),
  engName_detail: z.string().min(1, "Tên sản phẩm bằng tiếng anh không được để trống"),
  description_detail: detailObjectSchema,
  ingredients_detail: detailObjectSchema,
  guide_detail: detailObjectSchema,
  specification_detail: detailObjectSchema,
  main_images_detail: z.array(z.object({ value: z.string().url({ message: "Vui lòng nhập URL hợp lệ." }) })),
  sub_images_detail: z.array(z.object({ value: z.string().url({ message: "Vui lòng nhập URL hợp lệ." }) })),

  // Các trường Filter
  filter_brand: z.string().min(1, "ID Thương hiệu không được để trống."),
  filter_hsk_skin_type: z.string().min(1, "ID Loại da không được để trống."),
  filter_hsk_uses: z.string().min(1, "ID Công dụng không được để trống."),
  filter_hsk_product_type: z.string().min(1, "ID Loại sản phẩm không được để trống."),
  filter_origin: z.string().min(1, "Xuất xứ không được để trống."),
  filter_hsk_ingredient: z.string().min(1, "Thành phần không được đẻ trống"),
  filter_dac_tinh: z.string().min(1, "Đặc tính không được để trống"),
  filter_size: z.string().min(1, "Size không được trống"),
});
export type ProductFormValues = z.infer<typeof productSchema>;
