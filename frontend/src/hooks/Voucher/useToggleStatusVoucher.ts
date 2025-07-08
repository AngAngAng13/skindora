import { useCallback, useState } from "react";

import { toggleStatus } from "@/api/voucher";

export const useToggleStatusVoucher = (id: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const updateStatusVoucher = useCallback(async () => {
    try {
      console.log(id);
      const response = await toggleStatus({ id: id });
      console.log(response);
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    updateStatusVoucher,
    setLoading,
  };
};
