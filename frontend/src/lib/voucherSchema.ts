import z from "zod";

export const voucherSchema = z.object({
  code: z.string().min(1, "Code sản phẩm không được để trống"),
  description: z.string().min(1, "Description sản phẩm không được để trống"),
  discountType: z.string().min(1, "DiscountType sản phẩm không được để trống"),
  discountValue: z.number().min(0, "DiscountValue sản phẩm không được để trống"),
  maxDiscountAmount: z.number().min(0, "MaxDiscountAmount sản phẩm không được để trống"),
  minOrderValue: z.number().min(0, "MinOrderValue sản phẩm không được để trống"),
  startDate: z.string().min(1, "StartDate sản phẩm không được để trống"),
  endDate: z.string().min(1, "EndDate sản phẩm không được để trống"),
  usageLimit: z.number().min(0, "UsageLimit sản phẩm không được để trống"),
  userUsageLimit: z.number().min(0, "UserUsageLimit sản phẩm không được để trống"),
});
export type VoucherFormValue = z.infer<typeof voucherSchema>;
