import httpClient from "@/lib/axios";
import type { Voucher } from "@/types/voucher";

export interface FetchVoucherListProps {
  limit?: number | string;
  page?: number | string;
}
export interface ToggleStatusProps {
  id: string;
}
export const fetchListVoucher = async (params: FetchVoucherListProps) => {
  return await httpClient
    .get<API.IResponseSearch<Voucher>>("/admin/manage-vouchers/get-all", {
      limit: params.limit,
      page: params.page,
    })
    .then((res) => res.data);
};
export const toggleStatus = async (params: ToggleStatusProps) => {
  return await httpClient.put(`/admin/manage-vouchers/${params.id}/status`).then((response) => response.data);
};
export const UpdateVoucher = async (params: FetchVoucherListProps) => {
  return await httpClient
    .get<API.IResponseSearch<Voucher>>("/admin/manage-vouchers/get-all", {
      limit: params.limit,
      page: params.page,
    })
    .then((res) => res.data);
};
