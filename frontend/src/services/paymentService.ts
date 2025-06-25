import { apiClient } from "@/lib/apiClient";
import type { Result } from "neverthrow";
import type {  ApiResponse } from "@/utils/axios/types";
import { ApiError } from "@/utils";
export interface ZaloPayOrderItem {
  _id: string;
  ProductID: string;
  Quantity: number;
  Discount: number;
}

export interface ZaloPayPayload {
  orderDetails: ZaloPayOrderItem[];
  total: number;
}

export interface ZaloPayResponse {
  returncode: number;
  returnmessage: string;
  orderurl: string;
  zptranstoken: string;
}

export interface VNPayPayload {
  amount: number;
  bankCode?: string;
  language?: "vn" | "en";
  orderDescription?: string;
  orderType?: string;
}

export interface VNPayResponse {
  message: string;
  data: {
    paymentUrl: string;
  };
}


export const paymentService = {
   
  createZaloPayOrder: (
    payload: ZaloPayPayload
  ): Promise<Result<ApiResponse<ZaloPayResponse>, ApiError>> => {
    return apiClient.post<ZaloPayResponse, ZaloPayPayload>("/payment/zalopay", payload);
  },

 
  createVNPayUrl: (
    payload: VNPayPayload
  ): Promise<Result<ApiResponse<VNPayResponse>, ApiError>> => {
    return apiClient.post<VNPayResponse, VNPayPayload>("/payment/vnpay", payload);
  },
};