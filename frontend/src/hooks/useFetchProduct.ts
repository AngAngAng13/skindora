import React, { useCallback } from "react";

import type { FetchProductProps } from "@/api/product";
import { fetchProduct } from "@/api/product";
import type { Product } from "@/types";

export const useFetchProduct = () => {
  const [loading, setLoading] = React.useState(false);
  const [params, setParams] = React.useState<FetchProductProps>({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
  });
  const [data, setData] = React.useState<Product[]>([]);
  const changePage = React.useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);
  const changeLimit = React.useCallback((limit: number) => {
    setParams((prev) => ({ ...prev, limit }));
  }, []);
  const fetchListProduct = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchProduct({
        limit: params.limit,
        page: params.page,
      });
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
  };
};
