import httpClient from "@/lib/axios";
import type { Product } from "@/types";

export interface FetchProductProps {
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
}
export const fetchProduct = async (params: FetchProductProps) => {
  return await httpClient
    .get<API.IResponseSearch<Product>>(`/admin/manage-products/get-all`, {
      limit: params.limit,
      page: params.page,
    })
    .then((response) => response.data);
};
