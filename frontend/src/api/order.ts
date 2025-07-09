import httpClient from "@/lib/axios";
import type { Order } from "@/types/order";

export interface FetchListOrderProps {
  limit?: string | number;
  page?: string | number;
  status?: "SHIPPING" | "FAILED" | "CANCELLED" | "RETURNED" | "DELIVERED" | "PROCESSING" | "ALL";
  totalPages?: string | number;
  totalRecords?: number;
}
export interface UpdateStatusOrderProps {
  orderID: string;
}
export interface FetchOrderByIdProps {
  orderId: string;
}
export interface ApproveCancelRequestProps {
  id: string;
  payload: {
    staffNote?: string;
  };
}
//get-all-order
export const fetchListOrder = async (params: FetchListOrderProps) => {
  return await httpClient
    .get<API.IResponseSearch<Order>>("/orders", {
      limit: params.limit,
      page: params.page,
      status: params.status,
    })
    .then((response) => response.data);
};
//update-next-status-order
export const updateStatusOrder = async (params: UpdateStatusOrderProps) => {
  return await httpClient
    .patch<API.IUpdateStatusOrder>(`/orders/${params.orderID}/next-status`)
    .then((response) => response.data);
};
//get-order-by-id
export const fetchOrderById = async (params: FetchOrderByIdProps) => {
  return await httpClient.get<API.IResponseAPI<Order>>(`/orders/${params.orderId}`).then((response) => response.data);
};
//(staff/admin) approver-order-request-cancel
export const approveCancelRequest = async (params: ApproveCancelRequestProps) => {
  return await httpClient
    .patch(`/orders/${params.id}/cancel-request/approve`, params.payload)
    .then((response) => response.data);
};
//(staff/admin) reject-order-request-cancel
export const rejectCancelRequest = async (params: ApproveCancelRequestProps) => {
  return await httpClient
    .patch(`/orders/${params.id}/cancel-request/reject`, params.payload)
    .then((response) => response.data);
};
