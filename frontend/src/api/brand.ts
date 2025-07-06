import httpClient from "@/lib/axios";
import type { Brand } from "@/types/brand";

export interface FetchAllBrandProps {
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
}
export const fetchAllBrand = async (params: FetchAllBrandProps) => {
  return await httpClient
    .get<API.IResponseSearch<Brand>>("/admin/manage-filters/get-all-filter-brands", {
      limit: params.limit,
      page: params.page,
    })
    .then((response) => response.data);
};

export interface UpdateStateProps {
  id: string;
}
export const updateStatusBrand = async (params: UpdateStateProps, payload: { state: string }) => {
  return await httpClient
    .put(`/admin/manage-filters/update-filter-brand-state/${params.id}`, payload)
    .then((response) => response.data);
};
