import httpClient from "@/lib/axios";
import type { Voucher } from "@/types/voucher";

export interface FetchVoucherList {
  limit?: number | string;
  page?: number | string;
}
export const fetchListVoucher = async (params: FetchVoucherList) => {
  return await httpClient
    .get<API.IResponseSearch<Voucher>>("/admin/manage-vouchers/get-all", {
      limit: params.limit,
      page: params.page,
    })
    .then((res) => res.data);
};
