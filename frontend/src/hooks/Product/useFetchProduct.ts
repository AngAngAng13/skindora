import React, { useCallback } from "react";

import type { FetchProductProps } from "@/api/product";
import { fetchProduct } from "@/api/product";
import { fetchProductByStaff } from "@/api/product";
import type { ProductFE } from "@/types/product";

export const useFetchProduct = () => {
  const [loading, setLoading] = React.useState(false);
  const [params, setParams] = React.useState<FetchProductProps>({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
    filter_brand: "",
    filter_dactinh: "",
    filter_hsk_ingredient: "",
    filter_hsk_product_type: "",
    filter_hsk_size: "",
    filter_hsk_skin_type: "",
    filter_hsk_uses: "",
    filter_origin: "",
  });
  const [data, setData] = React.useState<ProductFE[]>([]);
  const changePage = React.useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);
  const changeLimit = React.useCallback((limit: number) => {
    setParams((prev) => ({ ...prev, limit }));
  }, []);
  const changeBrand = React.useCallback((filter_brand: string) => {
    setParams((prev) => ({ ...prev, filter_brand }));
  }, []);
  const changeDactinh = React.useCallback((filter_dactinh: string) => {
    setParams((prev) => ({ ...prev, filter_dactinh }));
  }, []);
  const changeIngredient = React.useCallback((filter_hsk_ingredient: string) => {
    setParams((prev) => ({ ...prev, filter_hsk_ingredient }));
  }, []);
  const changeProductType = React.useCallback((filter_hsk_product_type: string) => {
    setParams((prev) => ({ ...prev, filter_hsk_product_type }));
  }, []);
  const changeSize = React.useCallback((filter_hsk_size: string) => {
    setParams((prev) => ({ ...prev, filter_hsk_size }));
  }, []);
  const changeSkinType = React.useCallback((filter_hsk_skin_type: string) => {
    setParams((prev) => ({ ...prev, filter_hsk_skin_type }));
  }, []);
  const changeUses = React.useCallback((filter_hsk_uses: string) => {
    setParams((prev) => ({ ...prev, filter_hsk_uses }));
  }, []);
  const changeOrigin = React.useCallback((filter_origin: string) => {
    setParams((prev) => ({ ...prev, filter_origin }));
  }, []);
  const fetchListProduct = useCallback(async () => {
    setLoading(true);
    console.log(params);
    try {
      const response = await fetchProduct({
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
      });
      console.log(response.data);
      setData(response.data);
      setParams((prev) => ({
        ...prev,
        totalPages: response.pagination.totalPages,
        totalRecords: response.pagination.totalRecords,
      }));
    } catch (error) {
      console.error("Failed to fetch paginated users:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [
    params.limit,
    params.page,
    params.filter_brand,
    params.filter_dactinh,
    params.filter_hsk_ingredient,
    params.filter_hsk_product_type,
    params.filter_hsk_size,
    params.filter_hsk_uses,
    params.filter_origin,
    params.filter_hsk_skin_type,
  ]);

  const fetchListProductByStaff = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchProductByStaff({
        limit: params.limit,
        page: params.page,
      });
      console.log(response);
      setData(response.data);
      setParams((prev) => ({
        ...prev,
        totalPages: response.pagination.totalPages,
        totalRecords: response.pagination.totalRecords,
      }));
    } catch (error) {
      console.error("Failed to fetch paginated users:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [params.limit, params.page]);
  return {
    loading,
    fetchListProduct,
    data,
    params,
    setParams,
    changeLimit,
    changePage,
    fetchListProductByStaff,
    changeBrand,
    changeDactinh,
    changeIngredient,
    changeOrigin,
    changeProductType,
    changeSize,
    changeUses,
    changeSkinType,
  };
};
