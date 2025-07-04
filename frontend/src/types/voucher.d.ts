export interface Voucher {
  _id: string;
  code: string;
  description: string;
  discountValue: string;
  maxDiscountAmount: string;
  minOrderValue: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  userUsageLimit: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
