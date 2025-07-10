import httpClient from "@/lib/axios";
import type { ProductFE } from "@/types/product";

export interface FetchProductProps {
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
  filter_brand?: string;
  filter_dactinh?: string;
  filter_hsk_ingredient?: string;
  filter_hsk_product_type?: string;
  filter_hsk_size?: string;
  filter_hsk_skin_type?: string;
  filter_hsk_uses?: string;
  filter_origin?: string;
}
export interface FetchProductByIDProps {
  id: string;
}
//get-all-product
export const fetchProduct = async (params: FetchProductProps) => {
  return await httpClient
    .get<API.IResponseSearch<ProductFE>>("/products/get-all", {
      limit: params.limit,
      page: params.page,
      filter_brand: params.filter_brand,
      filter_dactinh: params.filter_dactinh,
      filter_hsk_ingredient: params.filter_hsk_ingredient,
      filter_hsk_product_type: params.filter_hsk_product_type,
      filter_hsk_size: params.filter_hsk_size,
      filter_hsk_skin_type: params.filter_hsk_skin_type,
      filter_hsk_uses: params.filter_hsk_uses,
      filter_origin: params.filter_origin,
    })
    .then((response) => response.data);
};
//get-product-by-id
export const fetchProductByID = async (params: FetchProductByIDProps) => {
  return await httpClient
    .get<API.IResponse<ProductFE>>(`/admin/manage-products/${params.id}`)
    .then((response) => response.data);
};
//get-product-by-staff
export const fetchProductByStaff = async (params: FetchProductProps) => {
  return await httpClient
    .get<API.IResponseSearch<ProductFE>>("/staffs/manage-products/get-all", {
      limit: params.limit,
      page: params.page,
    })
    .then((response) => response.data);
};
