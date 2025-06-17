import httpClient from "@/lib/axios";
import type { ProductFE } from "@/types/product";

export interface FetchProductProps {
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
}
export const fetchProduct = async (params: FetchProductProps) => {
  return await httpClient
    .get<API.IResponseSearch<ProductFE>>(`/admin/manage-products/get-all`, {
      limit: params.limit,
      page: params.page,
    })
    .then((response) => response.data);
};
