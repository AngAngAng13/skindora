import httpClient from "@/lib/axios";
import type { Size } from "@/types/Filter/size";

export interface FetchFilterDacTinhProps {
  limit?: number | string;
  page?: number | string;
}
//get-all-(filter_hsk_dactinh)
export const fetchFilterDacTinh = async (params: FetchFilterDacTinhProps) => {
  return await httpClient
    .get<API.IResponseSearch<Size>>("/admin/manage-filters/get-all-filter-hsk-sizes", {
      limit: params.limit,
      page: params.page,
    })
    .then((response) => response.data);
};
//create-(filter_hsk_dactinh)
export const createFilterDacTinh = async (payload: Size) => {
  return await httpClient
    .post("/admin/manage-filters/create-new-filter-size", payload)
    .then((response) => response.data);
};
//get-all-(filter_hsk_dactinh)
export interface UpdateFilterDacTinhProps {
  id: string;
}
export const fetchFilterDacTinhByID = async (params: UpdateFilterDacTinhProps) => {
  return await httpClient
    .get(`/admin/manage-filters/get-filter-hsk-size-detail/${params.id}`)
    .then((response) => response.data);
};
//update-(filter_hsk_dactinh)
export const updateFilterDactinh = async (params: UpdateFilterDacTinhProps, payload: Size) => {
  return await httpClient
    .put(`/admin/manage-filters/update-filter-hsk-size/${params.id}`, payload)
    .then((response) => response.data);
};
//update-status-(filter_hsk_dactinh)
export const updateStatusFilterDactinh = async (params: UpdateFilterDacTinhProps, payload: { state: string }) => {
  return await httpClient
    .put(`/admin/manage-filters/update-filter-hsk-size-state/${params.id}`, payload)
    .then((response) => response.data);
};
//search-by-name(filter_hsk_dactinh)
export interface SearchProps {
  option_name: string;
}
export const searchByNameFilterDactinh = async (params: SearchProps) => {
  return await httpClient
    .get("/admin/manage-filters/search-filter-hsk-size", {
      option_name: params.option_name,
    })
    .then((response) => response.data);
};
//get-active-(filter_hsk_dactinh)
export const fetchFilterActiveDacTinh = async () => {
  return await httpClient.get("/admin/manage-filters/get-active-filter-hsk-sizes").then((response) => response.data);
};
