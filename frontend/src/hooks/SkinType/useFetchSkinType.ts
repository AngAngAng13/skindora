import React, { useCallback, useState } from "react";

import { fetchFilterSkin as fetchFilterSkinAPI } from "@/api/skinType";
import type { SkinType } from "@/types/Filter/skinType";

export const useFetchSkinType = () => {
  const [loading, setLoading] = useState<boolean>();
  const [data, setData] = useState<SkinType[]>([]);
  const [params, setParams] = React.useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
  });
  const changePage = React.useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);
  const changeLimit = React.useCallback((limit: number) => {
    setParams((prev) => ({ ...prev, limit }));
  }, []);
  const fetchListSkin = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchFilterSkinAPI({
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
    changePage,
    params,
    changeLimit,
    data,
    setParams,
    fetchListSkin,
  };
};
