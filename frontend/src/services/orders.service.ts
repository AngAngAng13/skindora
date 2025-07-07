import type { Result } from "neverthrow";

import { apiClient } from "@/lib/apiClient";
import type { ApiError } from "@/utils";
import type { ApiResponse } from "@/utils/axios/types";
export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPING" | "DELIVERED" | "CANCELLED" | "RETURNED" | "FAILED";
export interface CheckoutPayload {
  ShipAddress: string;
  Description?: string;
  RequireDate: string;
  PaymentMethod: "COD" | "ZALOPAY" | "VNPAY";
  PaymentStatus: "UNPAID" | "PAID";
  Discount?: string;
  type: "cart" | "buy-now";
}
export interface MyOrderDetailProduct {
  productId: string;
  name: string;
  image: string;
  price: string;
}

export interface MyOrderDetail {
  _id: string;
  Quantity: string;
  OrderDate: string;
  UnitPrice: string;
  Products: MyOrderDetailProduct;
}

export interface MyOrder {
  orderId: string;
  orderDetail: MyOrderDetail[];
  orderStatus: OrderStatus; 
}
export interface OrderByIdResponse {
  message: string;
  result: {
    _id: string;
    UserID: string;
    ShipAddress: string;
    Description: string;
    RequireDate: string; 
    Discount: string;
    TotalPrice: string;
    PaymentMethod: string;
    PaymentStatus: string;
    Status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPING" | "DELIVERED" | "CANCELLED" | "RETURNED" | "FAILED";
    orderDetail: MyOrderDetail[];
  };
}
export interface MyOrdersApiResponse {
  message: string;
  result: MyOrder[];
  
}
export interface ProductInOrder {
  ProductID: string;
  Quantity: number;
  PricePerUnit: number;
  TotalPrice: number;
  name: string;
  image: string; 
}

export interface PreparedOrder {
  UserID: string;
  Products: ProductInOrder[];
  TotalPrice: number;
  CreatedAt: string;
  VoucherCode?: string;
  DiscountAmount?: number;
  FinalPrice?: number;
}

export interface PreparedOrderResponse {
  message: string;
  result: PreparedOrder;
}

export interface CreatedOrderResponse {
  message: string;
  result: {
    UserID: string;
    ShipAddress: string;
    Description: string;
    RequireDate: string;
    Discount: string;
    TotalPrice: string;
    PaymentMethod: "COD" | "ZALOPAY" | "VNPAY";
    PaymentStatus: "UNPAID" | "PAID";
    Status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    orderDetails: Array<{
      ProductID: string;
      OrderID: string;
      Quantity: string;
      OrderDate: string; 
      UnitPrice: string;
    }>;
  };
}

export const ordersService = {
  
  getPreparedOrder: (): Promise<Result<ApiResponse<PreparedOrderResponse>, ApiError>> => {
    return apiClient.get<PreparedOrderResponse>("/orders/current");
  },

  prepareOrderFromCart: (
    selectedProductIDs: string[]
  ): Promise<Result<ApiResponse<PreparedOrderResponse>, ApiError>> => {
    return apiClient.post<PreparedOrderResponse, { selectedProductIDs: string[] }>("/orders/cart", {
      selectedProductIDs,
    });
  },
  getMyOrders: (): Promise<Result<ApiResponse<MyOrdersApiResponse>, ApiError>> => {
    return apiClient.get<MyOrdersApiResponse>("/orders/me");
  },
 
  createOrder: (payload: CheckoutPayload): Promise<Result<ApiResponse<CreatedOrderResponse>, ApiError>> => {
    return apiClient.post<CreatedOrderResponse, CheckoutPayload>("/orders/checkout", payload);
  },
  getOrderById: (orderId: string): Promise<Result<ApiResponse<OrderByIdResponse>, ApiError>> => {
    return apiClient.get<OrderByIdResponse>(`/orders/${orderId}`);
  },
};
