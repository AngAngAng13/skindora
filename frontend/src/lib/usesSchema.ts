// src/lib/usesSchema.ts
import { z } from "zod";

// Đảm bảo interface Uses của bạn khớp với schema này
export const createUsesSchema = z.object({
  option_name: z.string().min(1, "Tên Công dụng không được để trống."),
  description: z.string().min(1, "Mô tả không được để trống."), // Trường description
  category_name: z.string().min(1, "Tên danh mục không được để trống."),
  category_param: z.string().min(1, "Tham số danh mục không được để trống."),
  state: z.enum(["ACTIVE", "INACTIVE"], {
    errorMap: () => ({ message: "Trạng thái không hợp lệ." }),
  }),
});

export type CreateUsesFormValue = z.infer<typeof createUsesSchema>;
// Thường thì schema cho tạo và cập nhật có thể dùng chung nếu các trường giống nhau
export type UpdateUsesFormValue = z.infer<typeof createUsesSchema>;
