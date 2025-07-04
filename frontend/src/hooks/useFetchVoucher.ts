import { useCallback, useState } from "react";

import { fetchListVoucher } from "@/api/voucher";
import type { Voucher } from "@/types/voucher";
import { logger } from "@/utils";

export const useFetchVoucher = () => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
  });
  const [data] = useState<Voucher[]>([]);
  const [voucher, setAllVoucher] = useState<Voucher[]>([]);
  const fetchAllVoucher = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchListVoucher({ limit: 10, page: params.page });
      logger.debug(response);
      logger.debug(response.pagination);
      setParams({
        ...response.pagination,
        page: response.pagination.currentPage,
      });
      setAllVoucher(response.data);
    } catch (error) {
      console.error("Failed to fetch all users:", error);
      setAllVoucher([]);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  return {
    loading,
    data,
    params,
    setParams,
    voucher,
    fetchAllVoucher,
  };
};
