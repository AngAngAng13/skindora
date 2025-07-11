import { useCallback, useState } from "react";

import { fetchFilterDacTinh as fetchFilterDacTinh_api } from "@/api/dactinh";
import type { DacTinh } from "@/types/Filter/dactinh";

export const useFetchFilterDacTinh = () => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
  });
  const [data, setData] = useState<DacTinh[]>([]);

  const fetchFilterDacTinh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchFilterDacTinh_api({ limit: params.limit, page: params.page });
      setData(response.data);
      setParams((prev) => ({
        ...prev,
        totalPages: response.pagination.totalPages,
        totalRecords: response.pagination.totalRecords,
      }));
    } catch (error) {
      console.error("Failed to fetch all users:", error);
    } finally {
      setLoading(false);
    }
  }, [params.page, params.limit]);

  return {
    loading,
    data,
    params,
    setParams,
    fetchFilterDacTinh,
  };
};
