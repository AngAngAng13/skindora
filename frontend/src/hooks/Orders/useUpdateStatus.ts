import { useCallback, useState } from "react";

import { updateStatusOrder } from "@/api/order";

export const useUpdateStatus = (id: string) => {
  const [loading, setLoading] = useState<boolean>();
  const updateStatus = useCallback(async () => {
    setLoading(true);
    try {
      console.log(id);
      const response = await updateStatusOrder({ orderID: id });
      console.log(response);
      window.alert(response.message);
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    updateStatus,
  };
};
