import httpClient from "@/lib/axios";
import type { CancelRequest } from "@/types/cancelRequest";

export interface FetchAllCancelProps {
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
}
//get-all-cancel-request
export const fetchCancelRequest = async (params: FetchAllCancelProps) => {
  return httpClient
    .get<API.IResponseSearch<CancelRequest>>("/orders/cancel", {
      limit: params.limit,
      page: params.page,
    })
    .then((response) => response.data);
};
